import { useRef } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { DayInfo } from "@/store/calendar";

export interface DayProps extends React.HTMLAttributes<HTMLDivElement> {
  day: DayInfo;
  active?: boolean;
  show?: boolean;
}

const Day = ({
  day: { day, weekday, inMonth },
  active = true,
  show = true,
  className,
}: DayProps) => {
  const ref = useRef(null);
  const isWeekend = weekday === 0 || weekday == 6;

  return (
    <div
      ref={ref}
      className={cn({
        "opacity-0": !active,
      })}
    >
      <motion.div
        className={cn(
          "flex items-center justify-center w-6 h-6 border border-gray-600 rounded-full",
          {
            "bg-gray-300": !inMonth,
            "text-gray-400": !inMonth,
            "border-red-600": inMonth && isWeekend,
            "text-red-500": isWeekend,
            "text-red-400": !inMonth && isWeekend,
            "cursor-pointer": active && show,
          },
          className
        )}
      >
        {day}
      </motion.div>
    </div>
  );
};

export { Day };
