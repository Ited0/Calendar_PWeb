import { Calendar } from "@/components/calendar";
import { BigCalendar } from "@/components/calendar/big";

export const Home = () => {
  return (
    <div className="lg:flex w-full h-screen ">
      <aside className="fixed inset-0 z-20 flex-none h-full w-1/5 lg:static lg:h-auto lg:overflow-y-visible lg:pt-0 lg:w-72 lg:block hidden border-r-2">
        <Calendar />
      </aside>

      <div className="w-full lg:w-4/5 h-full">
        <BigCalendar />
      </div>
      
    </div>
  );
};
