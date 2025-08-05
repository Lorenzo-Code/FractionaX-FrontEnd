import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Jan', income: 4000 },
  { name: 'Feb', income: 3000 },
  { name: 'Mar', income: 5000 },
  { name: 'Apr', income: 4500 },
  { name: 'May', income: 6000 },
  { name: 'Jun', income: 5500 },
  { name: 'Jul', income: 7000 },
  { name: 'Aug', income: 6800 },
];

export default function PassiveIncomeGraph() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">📈 Passive Income Tracker</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="income" stroke="#8884d8" fillOpacity={1} fill="url(#colorIncome)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
