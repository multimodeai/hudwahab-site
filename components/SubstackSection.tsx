export default function SubstackSection() {
  return (
    <section className="py-16">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="bg-white rounded-3xl shadow-card hover:shadow-card-hover transition-shadow p-14 md:p-20 flex flex-col md:flex-row items-start md:items-stretch justify-between gap-12">
          <div className="flex-1 flex flex-col justify-center">
            <p className="text-xs font-semibold tracking-widest text-n-400 uppercase mb-6">
              NEWSLETTER
            </p>
            <p className="text-3xl font-semibold text-n-900 leading-snug max-w-xl">
              Prompt kits and field notes from a builder shipping with AI. No fluff.
            </p>
          </div>
          <a
            href="https://multimodeai.substack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-n-500 border border-n-200 rounded-2xl p-10 flex flex-col justify-between md:w-[36%] min-h-[200px] hover:bg-n-600 hover:border-n-600 hover:text-white transition-all group flex-shrink-0"
          >
            <span className="text-xl font-semibold">Subscribe</span>
            <svg
              width="32"
              height="32"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="self-end group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
            >
              <path d="M4 16L16 4M8 4H16V12" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
