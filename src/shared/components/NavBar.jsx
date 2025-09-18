import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import useAuth from "../hooks/useAuth";


const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const handleCloseMenu = () => setIsMenuOpen(false);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const scrollableElement = document.querySelector('.flex-1.overflow-y-auto');
    if (!scrollableElement) return;

    const handleScroll = () => {
      const currentScrollY = scrollableElement.scrollTop;
      
      // Show navbar when at top or scrolling up
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    scrollableElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollableElement.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Hide navbar only when user is logged in AND in admin/dashboard areas
  if (user && (location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard'))) {
    return null;
  }

  const dashboardPath = user
    ? user.role === "admin"
      ? "/admin"
      : "/dashboard"
    : null;


  return (
    <div 
      className="w-full"
      style={{
        pointerEvents: 'auto'
      }}
    >
      <div className="w-full bg-transparent flex justify-center pt-2">
        <div className="bg-[#0B0B0B] border border-gray-800 rounded-md px-4 py-1.5 text-white text-sm flex justify-center items-center gap-2 max-w-screen-md w-full mx-4 text-center shadow-sm">
          <span className="opacity-60">🚧 FractionaX is still in development.</span>
          <span className="opacity-70 hidden sm:inline">Follow</span>
          <a
            href="https://twitter.com/FractionaX"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-500 font-medium"
          >
            @FractionaX
          </a>
          <span className="opacity-50 hidden sm:inline">for updates</span>
        </div>
      </div>

      <header className="bg-white border-b shadow-sm px-6 py-4">

        <div className="flex justify-between items-center max-w-7xl mx-auto relative">

          {/* Logo */}
          <div className="flex items-center flex-1">
            <Link to="/home" aria-label="FractionaX Logo">
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
            <Link 
              to="/marketplace" 
              className="nav-link hover:text-blue-500 font-semibold" 
              style={{ pointerEvents: 'auto', cursor: 'pointer', zIndex: 10000 }}
            >
              Marketplace
            </Link>
            <Link 
              to="/how-it-works" 
              className="nav-link hover:text-blue-500" 
              style={{ pointerEvents: 'auto', cursor: 'pointer', zIndex: 10000 }}
            >
              How It Works
            </Link>
            <Link 
              to="/ecosystem" 
              className="nav-link hover:text-blue-500" 
              style={{ pointerEvents: 'auto', cursor: 'pointer', zIndex: 10000 }}
            >
              About Us
            </Link>
            <Link 
              to="/pricing" 
              className="nav-link hover:text-blue-500" 
              style={{ pointerEvents: 'auto', cursor: 'pointer', zIndex: 10000 }}
            >
              Membership
            </Link>
          </nav>


          {/* Desktop Button */}
          <div className="hidden md:flex items-center justify-end flex-1 gap-3">
            {user ? (
              <Link to={dashboardPath} className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-full hover:bg-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg">
                <span>Account</span>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium px-3 py-2 transition-colors">
                  Login
                </Link>
                <Link to="/signup?plan=investor" className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2.5 rounded-full transition-all duration-200 font-semibold shadow-lg hover:shadow-xl">
                  <span>Start Investing</span>
                </Link>
              </>
            )}
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
            <Link to="/marketplace" onClick={handleCloseMenu} className="nav-link font-semibold">Marketplace</Link>
            <Link to="/how-it-works" onClick={handleCloseMenu} className="nav-link">How It Works</Link>
            <Link to="/ecosystem" onClick={handleCloseMenu} className="nav-link">About Us</Link>
            <Link to="/pricing" onClick={handleCloseMenu} className="nav-link">Membership</Link>
            {user ? (
              <Link to={dashboardPath} onClick={handleCloseMenu} className="inline-flex justify-center items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-full hover:bg-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg w-full">
                <span>Account</span>
              </Link>
            ) : (
              <div className="space-y-3 w-full">
                <Link to="/login" onClick={handleCloseMenu} className="text-center block text-gray-600 hover:text-gray-900 font-medium py-2 transition-colors">
                  Login
                </Link>
                <Link to="/signup?plan=investor" onClick={handleCloseMenu} className="inline-flex justify-center items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-5 py-3 rounded-full transition-all duration-200 font-semibold shadow-lg hover:shadow-xl w-full">
                  <span>Start Investing</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
};

export default NavBar;
