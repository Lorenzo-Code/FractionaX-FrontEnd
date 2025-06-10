// components/dashboard/InvestmentTimeline.jsx
import React from 'react';

const STAGES = [
  "Pre-Funding",
  "Funded",
  "Acquired",
  "Income Generating",
  "For Sale",
  "Sold"
];

export default function InvestmentTimeline({ currentStage = 1 }) {
  return (
    <div className="w-full mt-4">
      <h4 className="text-sm font-semibold mb-2 text-gray-600">📈 Investment Timeline</h4>
      <div className="flex justify-between items-center text-xs text-gray-500">
        {STAGES.map((label, index) => {
          const isActive = index + 1 <= currentStage;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className={`w-3 h-3 rounded-full mb-1 ${
                  isActive ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
              <span className={`text-center ${isActive ? 'text-blue-600 font-medium' : ''}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
