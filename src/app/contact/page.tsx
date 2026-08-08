"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: "YOUR_WEB3FORMS_ACCESS_KEY",
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-28 pb-20">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-caption text-matte-500 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="mb-12">
          <span
            className="mb-3 inline-block rounded-full border px-3 py-1 text-small font-medium uppercase tracking-widest"
            style={{
              borderColor: "rgba(212,175,55,0.3)",
              backgroundColor: "rgba(212,175,55,0.08)",
              color: "#D4AF37",
            }}
          >
            Get in Touch
          </span>
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 text-body text-matte-400">
            We'd love to hear from you. Reach out and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Contact Details */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          <div className="rounded-xl border border-matte-800 bg-matte-900 p-5 text-center">
            <Mail size={24} className="mx-auto mb-3" style={{ color: "#D4AF37" }} />
            <h4 className="text-sm font-semibold text-white">Email</h4>
            <p className="mt-1 text-sm text-matte-400">hello@haapu.tv</p>
          </div>
          <div className="rounded-xl border border-matte-800 bg-matte-900 p-5 text-center">
            <Phone size={24} className="mx-auto mb-3" style={{ color: "#D4AF37" }} />
            <h4 className="text-sm font-semibold text-white">Phone</h4>
            <p className="mt-1 text-sm text-matte-400">+44 000 000 0000</p>
          </div>
          <div className="rounded-xl border border-matte-800 bg-matte-900 p-5 text-center">
            <MapPin size={24} className="mx-auto mb-3" style={{ color: "#D4AF37" }} />
            <h4 className="text-sm font-semibold text-white">Location</h4>
            <p className="mt-1 text-sm text-matte-400">London, UK</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="rounded-xl border border-matte-800 bg-matte-900 p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold text-white mb-2">
            Send us a message
          </h2>
          <p className="text-sm text-matte-400 mb-6">
            We'll get back to you within 24 hours.
          </p>

          {isSuccess && (
            <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
              ✅ Message sent successfully! We'll get back to you soon.
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-matte-300">Your Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-matte-700 bg-matte-800 px-4 py-2.5 text-sm text-white placeholder:text-matte-500 focus:border-crimson focus:outline-none"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-matte-300">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-matte-700 bg-matte-800 px-4 py-2.5 text-sm text-white placeholder:text-matte-500 focus:border-crimson focus:outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-matte-300">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full rounded-lg border border-matte-700 bg-matte-800 px-4 py-2.5 text-sm text-white placeholder:text-matte-500 focus:border-crimson focus:outline-none"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-matte-300">Message *</label>
              <textarea
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full rounded-lg border border-matte-700 bg-matte-800 px-4 py-2.5 text-sm text-white placeholder:text-matte-500 focus:border-crimson focus:outline-none"
                placeholder="Tell us what's on your mind..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: "#E50914" }}
            >
              <Send size={16} />
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}