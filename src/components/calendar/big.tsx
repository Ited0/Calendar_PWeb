import {
  Calendar,
  View,
  dayjsLocalizer,
  Messages,
  SlotInfo,
} from "react-big-calendar";
import dayjs from "dayjs";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useModal } from "../modal-provider";
import { EventCreate } from "../modals/event/create";
import { useStore } from "@/store";
import { EventInfo } from "@/store/calendar";
import { EventEdit } from "../modals/event/edit";
import { isArray } from "lodash";

const localizer = dayjsLocalizer(dayjs);
const messages: Messages = {
  month: "Mês",
  week: "Semana",
  day: "Dia",
  today: "Hoje",
  yesterday: "Ontem",
  tomorrow: "Amanhã",
  previous: "<",
  next: ">",
  showMore: (total) => `+${total} mais`,
  noEventsInRange: "Sem eventos registrados.",
  allDay: "Dia inteiro",
  date: "Data",
  time: "Hora",
  event: "Evento",
};

function EventAgenda({ event }: { event: EventInfo }) {
  return (
    <span className="cursor-pointer h-full w-full">
      <em className="text-primary">{event.title}</em>
      <p className="text-black dark:text-white ml-4">{event.description}</p>
      <p className="text-black/80 dark:text-white/80 ml-4">{event.location}</p>
    </span>
  );
}

export const BigCalendar = () => {
  const { data, load } = useStore((state) => state.calendar.events);
  const modal = useModal();
  const [initialLoad, setInitialLoad] = useState(false);

  const createModalOptions = useMemo(() => EventCreate, []);
  const editModalOptions = useMemo(() => EventEdit, []);
  const { components } = useMemo(
    () => ({
      components: {
        agenda: {
          event: EventAgenda,
        },
      },
    }),
    []
  );

  const [currentView, setCurrentView] = useState<View>("month");

  const handleSelectSlot = useCallback(
    (slot: SlotInfo) => {
      slot = { ...slot, end: dayjs(slot.end).subtract(1, "second").toDate() };
      modal.open({ ...createModalOptions, data: slot });
    },
    [modal, createModalOptions]
  );

  const handleSelectEvent = useCallback(
    (event: EventInfo) => {
      modal.open({ ...editModalOptions, data: event });
    },
    [editModalOptions, modal]
  );

  const handleRangeChange = useCallback(
    (
      range:
        | Date[]
        | {
            start: Date;
            end: Date;
          },
      view?: View | undefined
    ) => {
      let start = null, end = null;

      if (isArray(range)) {
        switch(view) {
          case "week":
            start = range[0];
            end = range[6];
            break;
          case "day":
          default:
            start = range[0];
            end = dayjs(range[0]).add(1, "day").toDate();
            break;
        }
      } else {
        start = range.start; 
        end = range.end
      }

      if (view !== currentView) {
        load(start, end);
      }
    },
    [currentView, load]
  );

  useEffect(() => {
    if (initialLoad) return;

    const start = dayjs().startOf("month").subtract(7, "day").toDate();
    const end = dayjs().endOf("month").add(7, "day").toDate();

    load(start, end);
    setInitialLoad(true);
  }, [initialLoad, load]);

  return (
    <div className="w-full h-[91%] p-2">
      <Calendar
        localizer={localizer}
        events={data}
        startAccessor="start"
        endAccessor="end"
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        onRangeChange={handleRangeChange}
        className="w-full h-full"
        view={currentView}
        onView={(view) => {
          setCurrentView(view);
        }}
        messages={messages}
        components={components}
        selectable
      />
    </div>
  );
};
