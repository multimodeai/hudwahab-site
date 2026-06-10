import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-n-200 py-12">
      <div className="max-w-[1400px] mx-auto px-8">
        <Link href="/" className="block font-script text-5xl text-n-900 text-center">
          Hud Wahab
        </Link>
        <div className="flex justify-center gap-24 mt-8 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest text-n-400 uppercase mb-4">
              PAGES
            </p>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/" className="text-n-600 hover:text-n-900 text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about-me"
                  className="text-n-600 hover:text-n-900 text-sm transition-colors"
                >
                  About me
                </Link>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-n-600 hover:text-n-900 text-sm transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest text-n-400 uppercase mb-4">
              LINKS
            </p>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-3">
                <a
                  href="https://github.com/hududed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-n-600 hover:text-n-900 transition-colors"
                  aria-label="GitHub"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/in/hudwahab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-n-600 hover:text-n-900 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a
                  href="https://multimodeai.substack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-n-600 hover:text-n-900 transition-colors"
                  aria-label="Substack"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="text-center text-n-400 text-xs mt-12">
          © 2026 Hud Wahab ·{" "}
          <a
            href="https://multimodeai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-n-600 transition-colors"
          >
            Multimode AI LLC
          </a>
        </p>
      </div>
    </footer>
  );
}
