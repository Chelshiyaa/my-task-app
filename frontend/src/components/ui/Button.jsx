// src/components/ui/Button.jsx
export function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 text-white ${className}`}
    >
      {children}
    </button>
  );
}
