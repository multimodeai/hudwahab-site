import Image from "next/image";

interface HeroSectionProps {
  label?: string;
  greeting?: string;
  heading?: string;
  meta?: string;
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: string;
}

export default function HeroSection({
  label = "INTRODUCTION",
  greeting = "Hello,",
  heading = "My name is Hud Wahab and I'm an ML engineer building AI for defense systems and autonomous AI — based in Colorado.",
  meta = "CO · Multimode AI LLC",
  imageSrc = "https://res.cloudinary.com/nmcore/image/upload/hud_rerofh",
  imageAlt = "Hud Wahab",
  imagePosition = "object-[30%_15%]",
}: HeroSectionProps) {
  return (
    <section className="py-20">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="bg-white rounded-3xl shadow-card overflow-hidden">
          <div className="flex flex-col md:flex-row md:min-h-[480px]">
            <div className="md:w-[46%] flex-shrink-0 p-10 md:p-16 flex flex-col justify-center">
              <p className="text-sm font-semibold tracking-widest text-accent uppercase mb-5">
                {label}
              </p>
              {greeting && (
                <h1 className="text-6xl font-bold text-accent mb-5">{greeting}</h1>
              )}
              <h2 className="text-[2rem] font-medium text-n-900 leading-[1.4] mb-8 max-w-[28rem]">
                {heading}
              </h2>
              <p className="text-n-500 text-base mb-8">{meta}</p>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/hududed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-n-600 hover:text-n-900 transition-colors"
                >
                  <svg
                    width="22"
                    height="22"
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
                >
                  <svg
                    width="22"
                    height="22"
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
              </div>
            </div>
            <div className="relative w-full md:w-[55%] min-h-80 md:min-h-0">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className={`object-cover ${imagePosition}`}
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
