import Link from "next/link";

export default function MoreAboutMe() {
  return (
    <div className="flex justify-center py-4">
      <Link
        href="/about-me"
        className="inline-flex items-center rounded-full border border-n-200 px-7 py-3 text-base font-medium text-n-600 hover:text-n-900 hover:border-n-300 transition-colors"
      >
        More about me
      </Link>
    </div>
  );
}
