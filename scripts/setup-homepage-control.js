const { neon } = require('@neondatabase/serverless');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
envFile.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k?.trim()) process.env[k.trim()] = v.join('=').trim().replace(/^"|"$/g, '');
});

const sql = neon(process.env.DATABASE_URL);

async function main() {
  console.log('🔧 Setting up homepage control...\n');

  // 1. site_settings table
  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value JSONB,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  console.log('✅ site_settings table ready');

  // 2. Auto-update trigger for updated_at
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
  console.log('✅ updated_at trigger ready');

  // 3. Add is_new column to movies
  const colExists = await sql`
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'movies' AND column_name = 'is_new'
  `;
  if (colExists.length === 0) {
    await sql`ALTER TABLE movies ADD COLUMN is_new BOOLEAN DEFAULT FALSE`;
    console.log('✅ is_new column added to movies');
  } else {
    console.log('✅ is_new column already exists');
  }

  // 4. Seed default homepage sections config
  const existing = await sql`SELECT 1 FROM site_settings WHERE key = 'homepage_sections'`;
  if (existing.length === 0) {
    await sql`
      INSERT INTO site_settings (key, value) VALUES (
        'homepage_sections',
        ${JSON.stringify([
          { id: 'trending',     title: 'Trending Now',         source: 'is_trending',    enabled: true,  order: 1 },
          { id: 'new_to_haapu', title: 'New to Haapu',         source: 'is_new',         enabled: true,  order: 2 },
          { id: 'recommended',  title: 'Recommended for You',  source: 'is_recommended', enabled: false, order: 3 },
        ])}
      )
    `;
    console.log('✅ Default homepage sections seeded');
  } else {
    console.log('✅ Homepage sections config already exists — skipped seed');
  }

  console.log('\n🎉 Done. Run: git add -A && git commit -m "Add homepage control tables"');
  process.exit(0);
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });