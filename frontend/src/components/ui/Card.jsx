// src/components/ui/Card.jsx
export function Card({ children, className = "" }) {
  return (
    <div
      className={`p-4 rounded shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ${className}`}
    >
      {children}
    </div>
  );
}
