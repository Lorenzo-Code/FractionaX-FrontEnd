import { useState } from "react";
import { Bot, Search, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StepOneTypingExperience from "./StepOneTypingExperience";
import StepTwoMapPreview from "./StepTwoMapPreview";
import StepThreeAiAnalysis from "./StepThreeAiAnalysis"

const steps = [
  {
    id: 1,
    title: "Tell Us What You Want",
    description:
      "Use natural language to describe your ideal deal. No filters or jargon — just say it like you mean it.",
    icon: <Bot className="w-6 h-6 text-blue-600" />,
    component: <StepOneTypingExperience />,
  },
  {
    id: 2,
    title: "AI Finds the Deals",
    description:
      "Our FCT-powered AI scans nationwide listings and data sources to uncover top-matching opportunities.",
    icon: <Search className="w-6 h-6 text-blue-600" />,
    component: <StepTwoMapPreview />
  },
  {
    id: 3,
    title: "Analyze, Decide, Invest",
    description:
      "Get smart property reports, review the numbers, and move confidently toward the right investment.",
    icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
    component: <StepThreeAiAnalysis />
  },
];

export default function InteractiveHowItWorks() {
  const [active, setActive] = useState(1);
  const step = steps.find((s) => s.id === active);

  return (
    <section className="bg-gray-200 py-20 px-6 sm:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            FractionaX simplifies real estate investing — from search to decision.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center space-x-4 mb-10 flex-wrap">
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full border text-sm font-medium transition-all
                ${
                  active === s.id
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }
              `}
            >
              {s.icon}
              {s.title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-1 items-center">
          {/* Text Content */}
          <div>
            <motion.h3
              key={step.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-2xl font-semibold text-gray-900 mb-3"
            >
              {step.title}
            </motion.h3>

            <motion.p
              key={step.description}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-gray-600 text-base leading-relaxed"
            >
              {step.description}
            </motion.p>
          </div>

          {/* Right Side Component or Image */}
          <div className="relative w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm min-h-[300px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {step.component ? (
                <motion.div
                  key={step.id + "-component"}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full p-4"
                >
                  {step.component}
                </motion.div>
              ) : (
                <motion.img
                  key={step.image}
                  src={step.image}
                  alt={step.title}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5 }}
                  className="w-full object-cover"
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
