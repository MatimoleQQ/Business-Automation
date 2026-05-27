export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "px-3 py-2 rounded-lg text-sm transition active:scale-95";

  const styles = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white",
    danger: "bg-red-600 hover:bg-red-500 text-white",
    ghost: "bg-gray-800 hover:bg-gray-700 text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}