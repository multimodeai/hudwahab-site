import Link from "next/link";

interface SiteNavProps {
  active?: "home" | "about";
}

export default function SiteNav({ active = "home" }: SiteNavProps) {
  const linkBase = "text-base font-medium transition-colors";
  const activeCls = "text-accent";
  const idleCls = "text-n-600 hover:text-n-900";

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-n-200">
      <div className="max-w-[1400px] mx-auto px-8 h-20 flex items-center justify-between">
        <Link href="/" className="font-script text-4xl text-n-900">
          Hud Wahab
        </Link>
        <ul className="hidden md:flex items-center gap-8">
          <li>
            <Link
              href="/"
              className={`${linkBase} ${active === "home" ? activeCls : idleCls}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/about-me"
              className={`${linkBase} ${active === "about" ? activeCls : idleCls}`}
            >
              About me
            </Link>
          </li>
        </ul>
        <a
          href="#contact"
          className="flex items-center gap-2 bg-n-900 text-white text-sm font-medium rounded-full px-5 py-2.5 hover:opacity-90 transition-opacity"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3l2 2 2-2h5a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
          </svg>
          Let&apos;s Chat
        </a>
      </div>
    </nav>
  );
}
