// src/components/ui/Input.jsx
export function Input({ label, ...props }) {
  return (
    <div className="flex flex-col">
      {label && <label className="mb-1">{label}</label>}
      <input
        {...props}
        className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      />
    </div>
  );
}
