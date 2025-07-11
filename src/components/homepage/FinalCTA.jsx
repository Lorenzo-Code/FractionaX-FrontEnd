export default function FinalCTA() {
  return (
    <section className="bg-slate-800 py-20 px-4 sm:px-8 lg:px-16">
      <div className="max-w-3xl mx-auto text-center text-white">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Be the First to Access AI-Vetted Real Estate Deals
        </h2>
        <p className="text-lg mb-8">
          Join our early access list to get exclusive insights, priority features, and the smartest property reports—free.
        </p>

        <form className="flex flex-col sm:flex-row justify-center gap-4">
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition"
          >
            Get Early Access
          </button>
        </form>

        <p className="text-sm mt-6 text-indigo-200">
          No spam. No noise. Just smart deals you can act on.
        </p>
      </div>
    </section>
  );
}
