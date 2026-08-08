"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Check, X } from "lucide-react";

type CookieCategory = {
  id: string;
  title: string;
  description: string;
  required: boolean;
  enabled: boolean;
};

export default function CookiePreferencesPage() {
  const [categories, setCategories] = useState<CookieCategory[]>([
    {
      id: "necessary",
      title: "Strictly Necessary Cookies",
      description:
        "These cookies are essential for the platform to function properly. They enable authentication, security, session management, and basic operation. They cannot be disabled.",
      required: true,
      enabled: true,
    },
    {
      id: "performance",
      title: "Performance & Analytics Cookies",
      description:
        "These cookies help us understand how you interact with Haapu TV – which pages you visit, how long you stay, and any errors you encounter. This helps us improve the service. (Currently not used, but ready for future implementation.)",
      required: false,
      enabled: false,
    },
    {
      id: "functional",
      title: "Functional & Preferences Cookies",
      description:
        "These cookies remember your choices, such as your preferred language, video quality, and customised settings, to provide a more personalised experience. (Currently not used, but ready for future implementation.)",
      required: false,
      enabled: false,
    },
    {
      id: "advertising",
      title: "Advertising & Targeting Cookies",
      description:
        "Haapu TV does not currently use advertising or tracking cookies. This category is reserved for potential future use, but we are committed to preserving your privacy and will only add such cookies with your explicit consent.",
      required: false,
      enabled: false,
    },
  ]);

  const [showSaved, setShowSaved] = useState(false);

  // Load stored preferences from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cookiePreferences");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCategories((prev) =>
          prev.map((cat) => {
            const storedCat = parsed.find((p: any) => p.id === cat.id);
            return storedCat ? { ...cat, enabled: storedCat.enabled } : cat;
          })
        );
      } catch (_) {}
    }
  }, []);

  const toggleCategory = (id: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id && !cat.required ? { ...cat, enabled: !cat.enabled } : cat
      )
    );
  };

  const savePreferences = () => {
    const toStore = categories.map(({ id, enabled }) => ({ id, enabled }));
    localStorage.setItem("cookiePreferences", JSON.stringify(toStore));
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const acceptAll = () => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.required ? cat : { ...cat, enabled: true }
      )
    );
  };

  const rejectOptional = () => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.required ? cat : { ...cat, enabled: false }
      )
    );
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pt-28 pb-20">
      {/* Back link */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-matte-500 transition-colors hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      {/* Header */}
      <div className="mb-10">
        <span className="mb-3 inline-block text-xs font-medium uppercase tracking-widest text-gold">
          Legal
        </span>
        <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
          Cookie Preferences
        </h1>
        <p className="mt-2 max-w-2xl text-base text-matte-400">
          We use cookies to enhance your experience. You can choose which
          categories of cookies you allow. Some are strictly necessary for the
          service to function and cannot be disabled.
        </p>
      </div>

      {/* Cookie categories */}
      <div className="space-y-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="rounded-xl border border-matte-800 bg-matte-900 p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-semibold text-white">
                  {category.title}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-matte-400">
                  {category.description}
                </p>
              </div>
              <div className="flex-shrink-0">
                {category.required ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1 text-xs font-medium text-gold">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    Always Active
                  </span>
                ) : (
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
                      category.enabled ? "bg-gold" : "bg-matte-700"
                    }`}
                    aria-label={`Toggle ${category.title}`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ${
                        category.enabled ? "translate-x-6" : "translate-x-1"
                      } mt-1`}
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <button
          onClick={savePreferences}
          className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-2.5 text-sm font-semibold text-matte-black transition-colors hover:bg-gold/80"
        >
          Save Preferences
        </button>
        <button
          onClick={acceptAll}
          className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          Accept All
        </button>
        <button
          onClick={rejectOptional}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-6 py-2.5 text-sm font-medium text-matte-400 transition-colors hover:border-white/30 hover:text-white"
        >
          Reject Optional
        </button>
      </div>

      {/* Saved confirmation */}
      {showSaved && (
        <div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          Your preferences have been saved.
        </div>
      )}
    </div>
  );
}