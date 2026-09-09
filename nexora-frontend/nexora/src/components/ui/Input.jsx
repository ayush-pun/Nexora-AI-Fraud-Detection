import { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      name,
      placeholder,
      rightIcon,
      error,
      ...props
    },
    ref
  ) => {
    return (
      <div>
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>

        <div className="relative">
          <input
            ref={ref}
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            className={`w-full rounded-xl border bg-white px-4 py-3 pr-12 outline-none transition duration-200
              ${
                error
                  ? "border-red-500 focus:ring-red-100 focus:border-red-500"
                  : "border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              }`}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-4 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-500">
            {error.message}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;