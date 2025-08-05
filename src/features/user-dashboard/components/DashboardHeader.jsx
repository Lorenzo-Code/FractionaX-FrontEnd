import React, { useState, useEffect } from 'react';

export default function DashboardHeader({ user }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">{`${getGreeting()}, ${user}`}</h1>
      <div className="text-lg font-semibold">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}
