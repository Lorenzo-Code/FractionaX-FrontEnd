// src/components/NavBar.js
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <header className="bg-white border-b shadow-sm px-6 py-4 sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center">
          <img
            src="/assets/images/TopLogo.png"
            alt="FractionaX"
            className="h-10 md:h-12 w-auto"
          />
        </div>

        <nav className="space-x-6 hidden md:flex">
          <Link to="#" className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="#" className="text-gray-700 hover:text-blue-600">Marketplace</Link>
          <Link to="#" className="text-gray-700 hover:text-blue-600">Stake</Link>
          <Link to="#" className="text-gray-700 hover:text-blue-600">Docs</Link>
        </nav>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition text-sm">
          Connect Wallet
        </button>
      </div>
    </header>
  );
};

export default NavBar;
