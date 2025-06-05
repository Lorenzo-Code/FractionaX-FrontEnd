import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleCloseMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white border-b shadow-sm px-6 py-4 sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto relative">

        {/* Left: Logo */}
        <div className="flex items-center flex-1">
          <Link to="/home">
            <img
              src="/assets/images/TopLogo.png"
              alt="FractionaX"
              className="h-10 md:h-12 w-auto cursor-pointer"
            />
          </Link>
        </div>

        {/* Center: Nav Buttons */}
        <nav className="hidden md:flex justify-center flex-1 space-x-6 absolute left-1/2 transform -translate-x-1/2">
          <Link to="/home" className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/marketplace" className="text-gray-700 hover:text-blue-600">Marketplace</Link>
          <Link to="/fct" className="text-gray-700 hover:text-blue-600">FC-Token</Link>
          <Link to="#" className="text-gray-700 hover:text-blue-600">Stake</Link>
          <Link to="/docs" className="text-gray-700 hover:text-blue-600">Docs</Link>
        </nav>

        {/* Right: Connect Wallet */}
        <div className="flex items-center justify-end flex-1 md:flex hidden">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition text-sm">
            Connect Wallet
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <FaTimes className="text-2xl text-gray-700" />
            ) : (
              <FaBars className="text-2xl text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden px-6 pb-4 bg-white shadow-inner flex flex-col items-center space-y-4 pt-4">
          <Link to="/home" onClick={handleCloseMenu} className="text-gray-700 hover:text-blue-600">Home</Link>
          <Link to="/marketplace" onClick={handleCloseMenu} className="text-gray-700 hover:text-blue-600">Marketplace</Link>
          <Link to="/fct" onClick={handleCloseMenu} className="text-gray-700 hover:text-blue-600">FCToken</Link>
          <Link to="#" onClick={handleCloseMenu} className="text-gray-700 hover:text-blue-600">Stake</Link>
          <Link to="/docs" onClick={handleCloseMenu} className="text-gray-700 hover:text-blue-600">Docs</Link>
          <button
            onClick={handleCloseMenu}
            className="w-full bg-blue-600 text-white py-2 rounded-xl shadow hover:bg-blue-700 transition text-sm"
          >
            Connect Wallet
          </button>
        </div>
      )}
    </header>
  );
};

export default NavBar;
