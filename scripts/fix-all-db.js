const fs = require("fs");
const env = fs.readFileSync(".env.local", "utf8");
env.split("\n").forEach((l) => {
  const [k, ...v] = l.split("=");
  if (k?.trim()) process.env[k.trim()] = v.join("=").trim().replace(/^"|"$/g, "");
});
const { neon } = require("@neondatabase/serverless");
const sql = neon(process.env.DATABASE_URL);

async function main() {
  console.log("🔧 Fixing all DB structures...\n");

  // is_new column
  await sql`ALTER TABLE movies ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT FALSE`;
  console.log("✅ is_new column on movies");

  // site_settings table
  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      key        TEXT PRIMARY KEY,
      value      JSONB,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  console.log("✅ site_settings table");

  // updated_at trigger
  await sql`
    CREATE OR REPLACE FUNCTION update_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
    $$ LANGUAGE plpgsql
  `;
  await sql`DROP TRIGGER IF EXISTS site_settings_updated_at ON site_settings`;
  await sql`
    CREATE TRIGGER site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at()
  `;
  console.log("✅ updated_at trigger");

  // Seed default sections if missing
  const existing = await sql`SELECT 1 FROM site_settings WHERE key = 'homepage_sections'`;
  if (existing.length === 0) {
    await sql`
      INSERT INTO site_settings (key, value) VALUES (
        'homepage_sections',
        ${JSON.stringify([
          { id: "trending",     title: "Trending Now",        source: "is_trending",    enabled: true,  order: 1 },
          { id: "new_to_haapu", title: "New to Haapu",        source: "is_new",         enabled: true,  order: 2 },
          { id: "recommended",  title: "Recommended for You", source: "is_recommended", enabled: false, order: 3 },
        ])}
      )
    `;
    console.log("✅ Default homepage sections seeded");
  } else {
    console.log("✅ Homepage sections already exist");
  }

  // Verification
  const cols = await sql`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'movies' AND column_name IN ('is_new','is_trending','is_recommended','is_featured')
    ORDER BY column_name
  `;
  console.log("✅ Movie flag columns:", cols.map((c) => c.column_name).join(", "));

  const newCount = await sql`SELECT COUNT(*) FROM movies WHERE is_new = true`;
  console.log(`✅ Movies flagged is_new=true: ${newCount[0].count}`);

  console.log("\n🎉 All done.");
  process.exit(0);
}

main().catch((e) => { console.error("❌", e.message); process.exit(1); });