import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Delay to ensure the DOM has updated
    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100); // 100ms is usually enough

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
