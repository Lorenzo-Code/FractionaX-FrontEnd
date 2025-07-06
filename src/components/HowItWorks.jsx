// src/components/HowItWorks.js
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const steps = [
  {
    title: "Buy FCT",
    description: "Purchase FractionaX Credit Tokens (FCT) using crypto or fiat to get started.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Stake or Invest",
    description: "Use FCT to stake or invest in tokenized real estate assets powered by AI insights.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Earn Rewards",
    description: "Receive fractional profits, staking bonuses, and loyalty incentives in crypto.",
    color: "bg-green-100 text-green-600",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-10 bg-gradient-to-br from-white via-[#F5F9FF] to-[#E0ECFF] text-center">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#1B2A41] mb-16">
          How FractionaX Works
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`rounded-3xl p-8 shadow-xl ${step.color} bg-opacity-30 backdrop-blur-md hover:scale-105 transition-transform duration-300`}
            >
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-800 text-sm md:text-base font-medium leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
