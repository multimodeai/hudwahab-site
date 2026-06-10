const skills = [
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="8" width="16" height="12" rx="2" />
        <path d="M8 8V6M16 8V6M12 6V3M9 3h6M7 14h2M15 14h2M9 18h6" />
      </svg>
    ),
    title: "AI Agent Engineering",
    body: "Building production-grade autonomous agents: RAG pipelines, tool use, memory systems, multi-agent coordination. Deployed for real business operations, not demos.",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 3h6M9 3v6L5 17a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 17l-4-8V3" />
        <path d="M6.5 16h11" />
      </svg>
    ),
    title: "Research & Applied ML",
    body: "10+ years from academic research to production: Bayesian optimization, NLP, experiment design. Federally funded work (DOD, ONR, NIST, NASA).",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="6" rx="1" />
        <rect x="2" y="10" width="20" height="6" rx="1" />
        <rect x="2" y="18" width="20" height="4" rx="1" />
      </svg>
    ),
    title: "Systems Architecture",
    body: "End-to-end design — private data pipelines, API integrations, cloud and edge deployment. Built for accountability and operator control.",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88" />
      </svg>
    ),
    title: "Strategic AI Advisory",
    body: "Roadmapping AI adoption for founders and operators. Cutting through hype to identify what actually moves the needle in your specific context.",
  },
];

export default function SkillsSection() {
  return (
    <section className="py-16">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill) => (
            <div
              key={skill.title}
              className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-shadow p-8"
            >
              <p className="text-xs font-semibold tracking-widest text-n-400 uppercase mb-4">
                SKILL
              </p>
              <div className="text-n-900 mb-4">{skill.icon}</div>
              <h3 className="text-xl font-bold text-n-900 mb-3">{skill.title}</h3>
              <p className="text-n-600 text-base leading-relaxed">{skill.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
