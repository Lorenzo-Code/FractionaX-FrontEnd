import { motion } from "framer-motion";
import AIPropertyAnalysisView from "./AIPropertyAnalysisView";

const properties = [
  {
    image: "/assets/properties/duplex-houston.jpg",
    address: "1234 Maple Ave",
    cityState: "Houston, TX 77002",
    price: "$534,000",
    lastSold: "Sep 2019",
    roi: "9.1%",
    rent: "$2,300",
    appreciation: "+28.5%",
    vacancy: "4.1%",
    condition: "Recently renovated (2022)",
    ratings: { insurance: "A", crime: "B+", traffic: "B" },
  },
  {
    image: "/assets/properties/condo-atl.jpg",
    address: "987 Peachtree St",
    cityState: "Atlanta, GA 30309",
    price: "$452,000",
    lastSold: "Aug 2021",
    roi: "8.3%",
    rent: "$2,150",
    appreciation: "+21.2%",
    vacancy: "3.7%",
    condition: "Good condition",
    ratings: { insurance: "A-", crime: "A", traffic: "B+" },
  },
  {
    image: "/assets/properties/austin-rental.jpg",
    address: "301 West 6th St",
    cityState: "Austin, TX 78701",
    price: "$612,000",
    lastSold: "Jan 2022",
    roi: "7.9%",
    rent: "$2,600",
    appreciation: "+18.9%",
    vacancy: "3.2%",
    condition: "Upgraded HVAC (2023)",
    ratings: { insurance: "B+", crime: "A", traffic: "B" },
  }
];

export default function AIPropertyListScroll() {
  return (
    <section className="bg-white py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {properties.map((property, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.3 }}
            viewport={{ once: true }}
          >
            <AIPropertyAnalysisView {...property} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
