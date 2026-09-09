const Button = ({
  children,
  type = "button",
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      {...props}
      className={`w-full rounded-xl px-4 py-3 font-semibold text-white transition-all duration-300 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;