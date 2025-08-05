import {
  ShieldCheck,
  AlertTriangle,
  TrafficCone,
  Building2,
  School,
  TrendingUp,
  FileText,
  ShoppingCart
} from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

export default function StepThreeAiAnalysis() {
  const controls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      await controls.start({ y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } });
      await controls.start({ x: 0 });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await controls.start({ x: -20, transition: { duration: 0.8, ease: "easeInOut" } });
      await controls.start({ x: 0, transition: { duration: 0.6, ease: "easeInOut" } });
    };

    sequence();
  }, [controls]);

  return (
    <section className="py-2 px-1 sm:px-2 lg:px-4 text-gray-800">
      <motion.div
        className="max-w-sm mx-auto border border-gray-300 rounded-[20px] overflow-hidden shadow-xl p-2 bg-white"
        initial={{ y: 50, opacity: 0 }}
        animate={controls}
      >
        {/* Header */}
        <h2 className="text-base font-bold text-center text-blue-800 mb-2">AI Property Analysis</h2>

        {/* Image and Basic Info */}
        <div className="flex flex-col items-center mb-2">
          <img src="/assets/properties/duplex-houston.jpg" alt="Property" className="w-full h-28 object-cover rounded-lg mb-1" />
          <p className="font-semibold text-xs">1234 Maple Ave</p>
          <p className="text-[9px] text-gray-500 mb-1">Anytown, CA 90210</p>
          <p className="text-sm font-bold text-green-600">$534,000</p>
          <p className="text-[9px] text-gray-400">Last sold price: Sep 2019</p>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 gap-1">
          {/* Ownership */}
          <div className="bg-blue-50 rounded-md p-2">
            <h4 className="text-[9px] font-semibold text-blue-900 mb-1">Ownership History</h4>
            <p className="text-[9px] mb-1">Smmh Family<br />Since 2019</p>
            <h4 className="text-[9px] font-semibold text-blue-900 mb-1">Sale History</h4>
            <p className="text-[9px]">Sep 2019 &mdash; $472,000</p>
            <p className="text-[9px]">May 2007 &mdash; $369,000</p>
          </div>

          {/* Nearby Places */}
          <div className="bg-green-50 rounded-md p-2">
            <h4 className="text-[9px] font-semibold text-green-900 mb-1">Nearby Places</h4>
            <ul className="space-y-1 text-[9px]">
              <li className="flex gap-1 items-center"><ShieldCheck className="w-3 h-3 text-green-600" /> A &mdash; Low flood/fire risk</li>
              <li className="flex gap-1 items-center"><AlertTriangle className="w-3 h-3 text-yellow-600" /> B+ &mdash; Slightly below national avg</li>
              <li className="flex gap-1 items-center"><TrafficCone className="w-3 h-3 text-orange-500" /> B &mdash; Some congestion near roads</li>
              <li className="flex gap-1 items-center"><School className="w-3 h-3 text-blue-500" /> A &mdash; Highly-rated elementary zone</li>
              <li className="flex gap-1 items-center"><Building2 className="w-3 h-3 text-cyan-600" /> A- &mdash; Walkable, high demand</li>
            </ul>
          </div>

          {/* Ratings */}
          <div className="bg-yellow-50 rounded-md p-2">
            <h4 className="text-[9px] font-semibold text-yellow-800 mb-1">Ratings</h4>
            <p className="text-[9px]">Insurance Rating: <span className="font-bold text-green-700">A</span></p>
            <p className="text-[9px]">Crime Rating: <span className="font-bold text-yellow-700">B+</span></p>
            <p className="text-[9px]">Traffic Rating: <span className="font-bold text-orange-600">B</span></p>
          </div>

          {/* AI Summary */}
          <div className="bg-indigo-50 rounded-md p-2">
            <h4 className="text-[9px] font-semibold text-indigo-800 mb-1">AI Investment Summary</h4>
            <p className="text-[9px]">Estimated ROI: <span className="font-bold text-green-700">9.1%</span></p>
            <p className="text-[9px]">Monthly Rent: <span className="font-bold">$2,300</span></p>
            <p className="text-[9px]">Projected Appreciation: <span className="font-bold text-blue-600">+28.5%</span></p>
            <p className="text-[9px]">Area Vacancy: <span className="font-bold text-red-500">4.1%</span></p>
            <p className="text-[9px]">Property Condition: <span className="font-bold">Recently renovated (2022)</span></p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-1 mt-2">
          <button className="flex items-center justify-center gap-1 w-full sm:w-1/2 bg-blue-700 text-white text-[9px] py-1 px-2 rounded-md hover:bg-blue-800 transition">
            <FileText className="w-3 h-3" /> Report
          </button>
          <button className="flex items-center justify-center gap-1 w-full sm:w-1/2 bg-blue-600 text-white text-[9px] py-1 px-2 rounded-md hover:bg-blue-700 transition">
            <ShoppingCart className="w-3 h-3" /> Add
          </button>
        </div>
      </motion.div>
    </section>
  );
}
