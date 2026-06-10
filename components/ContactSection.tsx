"use client";

import { useState, FormEvent } from "react";

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("https://formspree.io/f/mankbdyw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          _subject: `New hudwahab.com inquiry from ${formData.name}`,
          source: "hudwahab.com",
        }),
      });
      if (res.ok) {
        setStatus("sent");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputCls =
    "w-full rounded-xl border border-n-200 bg-n-50 px-4 py-3 text-n-900 placeholder-n-400 focus:border-accent focus:outline-none transition-colors";

  return (
    <section id="contact" className="py-16">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="bg-white rounded-3xl shadow-card p-10 md:p-16 flex flex-col md:flex-row gap-12">
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-xs font-semibold tracking-widest text-n-400 uppercase mb-6">
              WORK TOGETHER?
            </p>
            <p className="text-3xl font-semibold text-n-900 leading-snug max-w-md">
              I&apos;d love to hear from you. Send me a message &amp; I&apos;ll be
              in touch as soon as I can.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="md:w-[48%] flex flex-col gap-4 flex-shrink-0"
          >
            <input
              type="text"
              required
              aria-label="Your name"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={inputCls}
            />
            <input
              type="email"
              required
              aria-label="Your email"
              placeholder="you@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={inputCls}
            />
            <textarea
              required
              rows={4}
              aria-label="Your message"
              placeholder="What are you working on?"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className={`${inputCls} resize-none`}
            />
            <button
              type="submit"
              disabled={status === "sending" || status === "sent"}
              className="self-start rounded-full bg-n-900 px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {status === "sending"
                ? "Sending…"
                : status === "sent"
                ? "Sent ✓"
                : "Send message"}
            </button>

            {status === "sent" && (
              <p className="text-sm text-accent">
                Thanks — I&apos;ll be in touch within 24 hours.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-600">
                Something went wrong. Please try again in a moment.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
