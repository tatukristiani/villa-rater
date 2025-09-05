import { format } from "date-fns";
import type { VillaDateOption } from "../types";

interface DateSelectorProps {
  options: VillaDateOption[];
  value?: string;
  onChange: (optionId: string) => void;
  disabled?: boolean;
}

// Component to select a date option for a villa
export default function DateSelector({
  options,
  value,
  onChange,
  disabled = false,
}: DateSelectorProps) {
  if (!options.length) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        No dates available
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {options.map((option) => {
        const startDate = new Date(option.start_date);
        const endDate = new Date(option.end_date);
        const price = (option.price_cents / 100).toFixed(2);
        const isSelected = value === option.id;

        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            disabled={disabled}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              isSelected
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">
                  {format(startDate, "MMM d")} -{" "}
                  {format(endDate, "MMM d, yyyy")}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.round(
                    (endDate.getTime() - startDate.getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  nights
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  €{price}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  total
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
