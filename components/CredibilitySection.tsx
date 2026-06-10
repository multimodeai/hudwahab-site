export default function CredibilitySection() {
  return (
    <section className="py-16">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 pb-8 md:pb-0 md:pr-8 border-b md:border-b-0 md:border-r border-n-200">
            <p className="text-3xl font-bold text-n-900">$3M+</p>
            <p className="text-sm text-n-500 mt-1">federal grants secured</p>
            <p className="text-xs text-n-400 mt-1">
              DOD · DTRA · SpaceWERX — Phase I ($250K) → Phase II ($2M)
            </p>
          </div>
          <div className="flex-1 py-8 md:py-0 md:px-8 border-b md:border-b-0 md:border-r border-n-200">
            <p className="text-3xl font-bold text-n-900">20+</p>
            <p className="text-sm text-n-500 mt-1">peer-reviewed publications</p>
            <p className="text-xs text-n-400 mt-1">
              200+ citations — Carbon, Physical Review B, IJCAI
            </p>
          </div>
          <div className="flex-1 pt-8 md:pt-0 md:pl-8">
            <p className="text-3xl font-bold text-n-900">10+</p>
            <p className="text-sm text-n-500 mt-1">years from research lab to production</p>
          </div>
        </div>
      </div>
    </section>
  );
}
