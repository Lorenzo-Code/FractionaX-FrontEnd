import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MapPin, Filter, ShieldCheck, Search } from "lucide-react";

export default function StepTwoMapPreview() {
  const pinData = [
    { top: "18%", left: "22%", price: "$325K", insight: "6.9% projected yield" },
    { top: "12%", left: "58%", price: "$479K", insight: "Low-risk area" },
    { top: "38%", left: "28%", price: "$310K", insight: "Duplex near university" },
    { top: "52%", left: "62%", price: "$445K", insight: "8.1% projected ROI" },
    { top: "63%", left: "37%", price: "$395K", insight: "New construction zone" },
    { top: "71%", left: "68%", price: "$459K", insight: "Rental demand trending up" },
    { top: "66%", left: "21%", price: "$425K", insight: "High appreciation potential" },
    { top: "25%", left: "75%", price: "$349K", insight: "Close to tech hub" },
    { top: "45%", left: "48%", price: "$385K", insight: "Low vacancy rate" },
    { top: "33%", left: "61%", price: "$499K", insight: "Hot investor zip code" },
    { top: "58%", left: "55%", price: "$470K", insight: "Strong school district" },
    { top: "40%", left: "73%", price: "$515K", insight: "9.2% projected cash flow" },
  ];

  const [activePin, setActivePin] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePin((prev) => (prev + 1) % pinData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [pinData.length]);

  return (
    <section className="py-20 px-4 sm:px-8 lg:px-16 text-white">
      <div className="bg-white rounded-2xl overflow-hidden shadow-xl max-w-6x1 mx-auto border border-gray-200">
        <div className="px-4 py-3 border-b bg-white">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 shrink-0">
                <img src="/assets/images/TopLogo.png" alt="FractionaX Logo" className="h-8 w-auto" />
              </div>
              <div className="flex-1 relative">
                <Search className="absolute top-2.5 left-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value="High-yield rentals in Houston, TX"
                  readOnly
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 text-sm text-gray-800"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-full text-xs text-gray-600 hover:bg-gray-100">
                <ShieldCheck className="w-4 h-4" />
                Low Risk
              </button>
              <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-full text-xs text-gray-600 hover:bg-gray-100">
                📍 Popular
              </button>
              <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-full text-xs text-gray-600 hover:bg-gray-100">
                📈 9%+ Yield
              </button>
            </div>
          </div>
        </div>

        <div className="relative h-[400px] sm:h-[460px] md:h-[500px] overflow-hidden">
          <img
            src="/assets/images/GoogleMapCover.png"
            alt="Map Preview"
            className="absolute inset-0 w-full h-full object-cover brightness-95"
          />

          {pinData.map((pin, idx) => (
            <div
              key={idx}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 text-white text-xs bg-blue-600 px-2 py-1 rounded-full shadow cursor-pointer group transition-opacity duration-500 ${activePin === idx ? 'opacity-100 z-10' : 'opacity-70'}`}
              style={{ top: pin.top, left: pin.left }}
            >
              {pin.price}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white text-gray-800 text-[10px] px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition">
                {pin.insight}
              </div>
            </div>
          ))}

          {/* Animated Floating Property Card */}
          {pinData[activePin] && (
            <motion.div
              key={activePin}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="absolute bottom-6 right-6 bg-white rounded-xl shadow-lg border p-4 w-[260px]"
            >
              <img
                src="/assets/properties/duplex-houston.jpg"
                alt="Selected Property"
                className="w-full h-32 object-cover rounded-md mb-3"
              />
              <h4 className="font-semibold text-gray-900 mb-1 text-sm">{pinData[activePin].insight}</h4>
              <p className="text-blue-600 font-bold text-sm">{pinData[activePin].price}</p>
              <button className="text-xs text-blue-500 mt-2 hover:underline">View Details</button>
            </motion.div>
          )}

          <div className="absolute right-5 right-1/6 -translate-y-1/1 space-y-0">
            <button className="p-2 bg-white rounded-full shadow border hover:bg-gray-100">
              <Filter className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 bg-white rounded-full shadow border hover:bg-gray-100">
              <MapPin className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
