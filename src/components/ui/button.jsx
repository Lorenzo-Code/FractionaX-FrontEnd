export const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`bg-black text-white text-lg px-6 py-3 rounded-2xl shadow-md hover:scale-105 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
