import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function StepOneTypingExperience() {
  const phrases = [
    "2-unit building in Houston, TX",
    "Vacation rental with 8%+ return",
    "Affordable duplex near a university",
  ];

  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      if (charIndex < phrases[index].length) {
        setQuery((prev) => prev + phrases[index][charIndex]);
        setCharIndex((prev) => prev + 1);
      } else {
        setTimeout(() => {
          setQuery("");
          setCharIndex(0);
          setIndex((prev) => (prev + 1) % phrases.length);
        }, 1800);
      }
    }, 80);
    return () => clearTimeout(typingTimeout);
  }, [charIndex, index, phrases]);

  const handleSearch = () => {
    alert(`Searching for: ${query}`);
  };

  return (
    <section className="bg-gray-350 px-4 sm:px-8 py-10">
      <div className="max-w-4xl mx-auto rounded-2xl border border-gray-200 shadow-md p-8 bg-slate-800 ">
        {/* Logo */}
        <div className="flex justify-start mb-6">
          <img
            src="/assets/images/MainLogo1.webp"
            alt="FractionaX"
            className="w-36 sm:w-40"
          />
        </div>

        {/* Typing Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 border rounded-lg overflow-hidden shadow-sm mb-8 w-full max-w-3xl mx-auto"
        >
          <input
            type="text"
            className="flex-1 px-4 py-3 text-sm sm:text-base outline-none"
            value={query}
            readOnly
            style={{ fontFamily: "monospace" }}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-5 py-3 text-sm font-medium hover:bg-blue-700 transition"
          >
            Search with AI
          </button>
        </motion.div>

        {/* Text Content */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 text-center">
          Tell Us What You Want
        </h2>
        <p className="text-white text-base sm:text-lg max-w-xl mx-auto text-center">
          Use natural language to describe your ideal deal. No filters or jargon — just say it like you mean it.
        </p>
      </div>
    </section>
  );
}
