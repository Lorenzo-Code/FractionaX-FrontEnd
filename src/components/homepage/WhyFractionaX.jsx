export default function WhyFractionaX() {
  const benefits = [
    {
      title: "AI-Powered Search",
      description: "No more endless browsing — let our AI find profitable real estate investments for you in seconds.",
      icon: "🤖",
    },
    {
      title: "Data You Can Trust",
      description: "We pull from Zillow, Attom, GreatSchools, and more — so you're making decisions based on real numbers.",
      icon: "📡",
    },
    {
      title: "Token Utility Built In",
      description: "Use FCT to access premium features, earn rewards, and unlock deeper insights across the platform.",
      icon: "🪙",
    },
    {
      title: "Investor-First Design",
      description: "We built this for investors who want smarter tools, faster insights, and zero fluff.",
      icon: "🎯",
    },
  ];

  return (
    <section className="bg-gray-100 py-20 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Why FractionaX?</h2>
        <p className="text-lg text-gray-600 mb-12">
          Trusted by investors who want clarity, speed, and results — powered by real data and real AI.
        </p>

        <div className="grid md:grid-cols-2 gap-10 text-left">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition flex items-start space-x-4"
            >
              <div className="text-4xl">{item.icon}</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
