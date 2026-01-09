import Link from "next/link";

export default function HomePage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <div className="mx-auto max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold">
          Build your SaaS faster 🚀
        </h1>

        <p className="text-gray-600">
          Authentication, profiles, emails, dashboard and more —
          all ready to scale.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/register"
            className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-900"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="rounded-lg border px-6 py-3 hover:bg-gray-100"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}
