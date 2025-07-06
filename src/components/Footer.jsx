// src/components/Footer.js
const Footer = () => {
  return (
    <footer className="py-8 px-6 bg-white border-t text-center text-sm text-gray-500">
      &copy; {new Date().getFullYear()} FractionaX. All rights reserved.
    </footer>
  );
};
export default Footer;
