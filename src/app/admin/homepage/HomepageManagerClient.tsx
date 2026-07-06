"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Save, Loader2, Eye, EyeOff, Pencil, Check, X } from "lucide-react";

type Section = {
  id: string;
  title: string;
  source: string;
  enabled: boolean;
  order: number;
};

const SOURCE_LABELS: Record<string, string> = {
  is_trending:    "Movies flagged as Trending",
  is_new:         "Movies flagged as New to Haapu",
  is_recommended: "Movies flagged as Recommended",
};

export default function HomepageManagerClient({
  initialSections,
  counts,
}: {
  initialSections: Section[];
  counts: Record<string, number>;
}) {
  const [sections, setSections] = useState<Section[]>(
    [...initialSections].sort((a, b) => a.order - b.order)
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const move = (index: number, direction: "up" | "down") => {
    const newSections = [...sections];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newSections.length) return;
    [newSections[index], newSections[swapIndex]] = [newSections[swapIndex], newSections[index]];
    setSections(newSections.map((s, i) => ({ ...s, order: i + 1 })));
  };

  const toggle = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const startEdit = (section: Section) => {
    setEditingId(section.id);
    setEditTitle(section.title);
  };

  const confirmEdit = (id: string) => {
    if (editTitle.trim()) {
      setSections((prev) =>
        prev.map((s) => (s.id === id ? { ...s, title: editTitle.trim() } : s))
      );
    }
    setEditingId(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "homepage_sections", value: sections }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {}
    setSaving(false);
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Homepage Sections
          </h1>
          <p className="mt-1 text-sm text-matte-400">
            Control which rows appear on the homepage, their names, and order.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-crimson-DEFAULT px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-crimson-dark disabled:opacity-60"
        >
          {saving ? (
            <Loader2 size={15} className="animate-spin" />
          ) : saved ? (
            <Check size={15} />
          ) : (
            <Save size={15} />
          )}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Sections list */}
      <div className="space-y-3">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className={`rounded-xl border bg-matte-900 p-5 transition-opacity ${
              section.enabled ? "border-matte-800" : "border-matte-800 opacity-60"
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Enabled toggle */}
              <button
                onClick={() => toggle(section.id)}
                className={`flex-shrink-0 rounded-lg p-2 transition-colors ${
                  section.enabled
                    ? "text-green-400 hover:bg-green-400/10"
                    : "text-matte-600 hover:bg-matte-800"
                }`}
                title={section.enabled ? "Click to hide" : "Click to show"}
              >
                {section.enabled ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>

              {/* Title — editable */}
              <div className="flex-1 min-w-0">
                {editingId === section.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") confirmEdit(section.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      className="flex-1 rounded-lg border border-crimson-DEFAULT bg-matte-800 px-3 py-1.5 text-sm text-white focus:outline-none"
                    />
                    <button
                      onClick={() => confirmEdit(section.id)}
                      className="rounded p-1 text-green-400 hover:bg-green-400/10"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded p-1 text-matte-500 hover:bg-matte-800"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{section.title}</span>
                    <button
                      onClick={() => startEdit(section)}
                      className="rounded p-1 text-matte-600 hover:text-matte-400"
                    >
                      <Pencil size={13} />
                    </button>
                  </div>
                )}
                <p className="mt-0.5 text-xs text-matte-500">
                  {SOURCE_LABELS[section.source]} •{" "}
                  <span className={`font-medium ${counts[section.source] > 0 ? "text-matte-300" : "text-yellow-500"}`}>
                    {counts[section.source] || 0} movie{counts[section.source] !== 1 ? "s" : ""}
                    {counts[section.source] === 0 && " — row will be hidden on site"}
                  </span>
                </p>
              </div>

              {/* Up / Down */}
              <div className="flex flex-shrink-0 flex-col gap-0.5">
                <button
                  onClick={() => move(index, "up")}
                  disabled={index === 0}
                  className="rounded p-1 text-matte-600 transition-colors hover:bg-matte-800 hover:text-white disabled:opacity-20"
                >
                  <ChevronUp size={16} />
                </button>
                <button
                  onClick={() => move(index, "down")}
                  disabled={index === sections.length - 1}
                  className="rounded p-1 text-matte-600 transition-colors hover:bg-matte-800 hover:text-white disabled:opacity-20"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-matte-600">
        Tip: To add movies to a row, go to the Movies page and toggle the matching flag (Trending, New to Haapu, or Recommended) on each movie. Empty rows are automatically hidden from visitors.
      </p>
    </div>
  );
}