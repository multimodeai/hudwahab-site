const paragraphs = [
  "I started in materials science research labs — 20+ peer-reviewed publications, 200+ citations, and federally funded work across DOD, ONR, NIST, and NASA. That decade taught me how to turn messy, high-stakes problems into systems that actually hold up.",
  "Today I build production AI: autonomous agents, RAG pipelines, and ML systems running in the real world — including active federal contracts with DTRA and SpaceWERX. Not demos, not slideware. Systems operators depend on.",
  "Through Multimode AI LLC, I help founders and operators ship AI that works — cutting through the hype to build the few things that actually move the needle in their specific context.",
  "Based in Colorado. Happiest shipping, reviewing, and staying a step ahead of where the field is going — usually with a trail nearby.",
];

export default function BackgroundSection() {
  return (
    <section className="py-16">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="bg-white rounded-3xl shadow-card p-14 md:p-20">
          <p className="text-xs font-semibold tracking-widest text-n-400 uppercase mb-8">
            MY BACKGROUND
          </p>
          <div className="flex flex-col gap-6 max-w-4xl">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-lg text-n-600 leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
