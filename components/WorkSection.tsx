const works = [
  {
    title: "ProWasl",
    description:
      "Agentic ops platform for SMBs — WhatsApp agents, bookings, halal-vendor verification, and run-level auditing for trustworthy AI-mediated transactions.",
    href: "https://prowasl.com",
    external: true,
  },
  {
    title: "Bayanlab",
    description:
      "Community data backbone for Muslim events, halal businesses, and halal eateries — aggregating 6+ sources into a canonical, deduplicated API. Starting in CO, expanding nationwide.",
    href: "https://bayanlab.com",
    external: true,
  },
  {
    title: "mm-cli",
    description:
      "Open-source, provider-agnostic CLI harness and prompt-kit platform — runs on Claude, GPT, or local Ollama. The tooling behind how I ship this fast, in the open.",
    href: "https://github.com/multimodeai/mm-cli/tree/main",
    external: true,
  },
  {
    title: "Token Burn Dashboard",
    description:
      "A GitHub-style view of my daily AI token usage — Claude Code and Codex, counted exactly from my own local logs. I instrument what I ship.",
    href: "/token-burn",
    external: true,
  },
];

export default function WorkSection() {
  return (
    <section id="work" className="py-16">
      <div className="max-w-[1400px] mx-auto px-8">
        <p className="text-xs font-semibold tracking-widest text-n-400 uppercase mb-8">SELECTED WORK</p>
        <ul className="flex flex-col divide-y divide-n-200">
          {works.map((work) => (
            <li key={work.title}>
              <a
                href={work.href}
                target={work.external ? "_blank" : undefined}
                rel={work.external ? "noopener noreferrer" : undefined}
                className="flex items-start justify-between py-6 group hover:opacity-70 transition-opacity"
              >
                <div>
                  <h3 className="text-lg font-semibold text-n-900">{work.title}</h3>
                  <p className="text-n-600 text-base mt-2 max-w-lg">{work.description}</p>
                </div>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-n-400 group-hover:text-n-900 transition-colors flex-shrink-0 mt-1 ml-4"
                >
                  <path d="M4 16L16 4M8 4H16V12" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
