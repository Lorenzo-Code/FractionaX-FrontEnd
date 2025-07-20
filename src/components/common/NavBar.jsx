import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import useAuth from "@/hooks/useAuth";


const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleCloseMenu = () => setIsMenuOpen(false);
  const { user } = useAuth();

  const homePath = user
    ? user.role === "admin"
      ? "/admin"
      : "/dashboard"
    : "/home";


  return (
    <header className="bg-white border-b shadow-sm px-6 py-4 sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto relative">

        {/* Logo */}
        <div className="flex items-center flex-1">
          <Link to={homePath} aria-label="FractionaX Logo">
            <img
              src="/assets/images/TopLogo.webp"
              alt="FractionaX"
              loading="lazy"
              width={120}
              height={48}
              className="h-10 md:h-12 w-auto cursor-pointer"
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex justify-center flex-1 space-x-6 absolute left-1/2 transform -translate-x-1/2">
          <Link to={homePath} className="text-lg font-semibold hover:text-blue-500">
            Home
          </Link>

          <Link to="/marketplace" className="nav-link">Marketplace</Link>
          <Link to="/pre-sale" className="nav-link">Pre-Sale</Link>
          <Link to="/contact" className="nav-link">Contact Us</Link>
        </nav>

        {/* Desktop Button */}
        <div className="hidden md:flex items-center justify-end flex-1">
          <Link to="/login" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-full hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg">
            <span>Login / Sign Up</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
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
        <div className="md:hidden px-5 pb-4 bg-white shadow-inner flex flex-col items-center space-y-4 pt-4 w-full">
          <Link to={homePath} onClick={handleCloseMenu} className="nav-link">Home</Link>
          <Link to="/marketplace" onClick={handleCloseMenu} className="nav-link">Marketplace</Link>
          <Link to="/pre-sale" onClick={handleCloseMenu} className="nav-link">Pre-Sale</Link>
          <Link to="/contact" onClick={handleCloseMenu} className="nav-link">Contact Us</Link>
          <Link to="/login" onClick={handleCloseMenu} className="inline-flex justify-center items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg w-full">
            <span>Login / Sign Up</span>
          </Link>
        </div>
      )}
    </header>
  );
};

export default NavBar;
