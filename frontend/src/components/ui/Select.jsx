// src/components/ui/Select.jsx
export function Select({ label, options = [], ...props }) {
  return (
    <div className="flex flex-col">
      {label && <label className="mb-1">{label}</label>}
      <select
        {...props}
        className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
