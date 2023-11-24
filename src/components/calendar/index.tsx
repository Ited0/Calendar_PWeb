import { cn } from "@/lib/utils";

import { Day } from "./day";
import { SelectYear } from "./year";
import { SelectMonth } from "./month";
import { useStore } from "@/store";

export const Calendar = () => {
  const calendar = useStore(state => state.calendar);

  return (
    <div className="flex gap-8 justify-center items-center">
      <div className="w-full h-fit m-2 p-2 space-y-2">
        <SelectYear />
        <SelectMonth />

        <div className="flex flex-col gap-2">
          <div className="flex gap-x-4 text-center">
            {calendar.weekdays().map((dayName, idx) => (
              <div
                key={`weekday-${dayName}`}
                className={cn(
                  "w-6 h-6 border-2 border-slate-600 text-sm rounded-full flex justify-center items-center uppercase",
                  {
                    "border-red-600": idx === 0 || idx == 6,
                    "text-red-500": idx === 0 || idx == 6,
                  }
                )}
              >
                {dayName.substring(0, 1)}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 relative">
            {calendar.getDays().map((week, weekIdx) => (
              <div
                key={`${calendar.monthName}-week-${weekIdx}}`}
                className="flex gap-x-4"
              >
                {week.map((d, idx) => (
                  <Day
                    key={`${d.month}-week-${weekIdx}-day-${idx}`}
                    day={d}
                    active={true}
                    className="max-w-full max-h-full"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
