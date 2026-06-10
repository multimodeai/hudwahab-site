// Stripe Payment Links — create these in your Stripe dashboard
// (Payment Links → Create link), then paste the buy.stripe.com/... URLs here.
//   strategySession : one-time, full price (e.g. $750)
//   sprintDeposit   : one-time, refundable deposit (e.g. $500)
//   retainerDeposit : one-time, refundable deposit (e.g. $500)
// LIVE Stripe Payment Links (Multimode AI LLC). Real charges.
const STRIPE = {
  strategySession: "https://buy.stripe.com/00w28r7Mm77DbQHgMt0Fi00", // one-time $750
  sprintDeposit: "https://buy.stripe.com/6oU3cvfeO77DaMD67P0Fi01", // one-time $500 deposit
  retainerDeposit: "https://buy.stripe.com/dRm6oH8Qq0Jfg6X3ZH0Fi02", // one-time $500 deposit
};

const services = [
  {
    label: "AI AGENT SPRINT",
    description:
      "You have a workflow that needs to run itself. I scope, build, and deploy a custom agent in two weeks.",
    price: "From $12,000",
    priceNote: "$500 deposit to start — refundable, applied to your build",
    cta: "Start with a deposit",
    href: STRIPE.sprintDeposit,
  },
  {
    label: "STRATEGY SESSION",
    description:
      "90 minutes. I audit your AI setup and hand you a prioritized roadmap you can act on immediately.",
    price: "$750",
    priceNote: "90 minutes + a documented roadmap",
    cta: "Book a session",
    href: STRIPE.strategySession,
  },
  {
    label: "RETAINER",
    description:
      "Ongoing AI engineering and strategy, monthly. I'm on your team — shipping, reviewing, staying ahead.",
    price: "$6,000/mo",
    priceNote: "$500 deposit to start — refundable, applied to month one",
    cta: "Apply",
    href: STRIPE.retainerDeposit,
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-16">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex flex-col gap-6">
          {services.map((service) => (
            <div
              key={service.label}
              className="bg-white rounded-3xl shadow-card hover:shadow-card-hover transition-shadow p-14 md:p-20 flex flex-col md:flex-row items-start md:items-stretch justify-between gap-12"
            >
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-xs font-semibold tracking-widest text-n-400 uppercase mb-6">
                  {service.label}
                </p>
                <p className="text-3xl font-semibold text-n-900 leading-snug max-w-xl">
                  {service.description}
                </p>
                <div className="mt-7">
                  <span className="text-2xl font-bold text-n-900">
                    {service.price}
                  </span>
                  <p className="text-sm text-n-500 mt-1">{service.priceNote}</p>
                </div>
              </div>
              <a
                href={service.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-n-500 border border-n-200 rounded-2xl p-10 flex flex-col justify-between md:w-[36%] min-h-[200px] hover:bg-n-600 hover:border-n-600 hover:text-white transition-all group flex-shrink-0"
              >
                <span className="text-xl font-semibold">{service.cta}</span>
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
          ))}
        </div>
      </div>
    </section>
  );
}
