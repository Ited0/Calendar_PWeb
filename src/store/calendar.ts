import dayjs, { Dayjs, InstanceLocaleDataReturn, MonthNames } from "dayjs";
import { StateCreator } from "zustand";

import { capitalize, chunk } from "lodash";

import "dayjs/locale/pt-BR";
import "dayjs/locale/en";
import "dayjs/locale/en-gb";

import * as dayjsLocaleData from "dayjs/plugin/localeData";
import {
  DocumentData,
  DocumentReference,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AuthSlice } from "./auth";
dayjs.extend(dayjsLocaleData);
dayjs.locale(navigator.language?.toLowerCase() ?? "pt-br");

type MonthIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export interface DayInfo {
  weekday: number;
  name: string;
  day: number;
  month: number;
  inMonth: boolean;
}

type RecurrenceOption = "daily" | "weekly" | "monthly" | "never";
type AlertOption = "15min" | "30min" | "1h" | "2h" | "1d" | "2d" | "1w";

export interface EventInfo {
  id: string;
  start: Date;
  end: Date;
  title: string;
  description: string;
  location: string;
  recurrence: RecurrenceOption;
  alert: AlertOption[] | "none";
}

export interface Event {
  readonly data: EventInfo[];
  readonly load: (start: Date, end: Date) => Promise<void>;
  readonly add: (
    event: EventInfo
  ) => Promise<DocumentReference<DocumentData, DocumentData>>;
  readonly update: (event: EventInfo) => Promise<void>;
  readonly remove: (id: EventInfo["id"]) => Promise<void>;
}

export interface CalendarSlice {
  readonly calendar: {
    readonly events: Event;
    readonly today: Dayjs;
    readonly years: number[];

    readonly localeData: () => InstanceLocaleDataReturn;
    readonly firstDayOfWeek: () => number;
    readonly months: () => MonthNames;

    readonly year: () => number;
    readonly month: () => number;
    readonly monthName: () => string;
    readonly daysInMonth: () => number;
    readonly firstDay: () => number;
    readonly weekdays: () => string[];
    readonly weekdaysName: () => string[];

    readonly changeMonth: (index?: MonthIndex | string) => void;
    readonly changeYear: (index?: number | string) => void;
    readonly getDays: () => DayInfo[][];
  };
}

const MAX_DAYS_SHOW_PER_MONTH = 35;
const MAX_DAYS_SHOW_PER_MONTH_EXTRA_WEEK = MAX_DAYS_SHOW_PER_MONTH + 7;

const rearrangeDays = <T>(weekdays: T[], firstDayOfWeek: number = 0) =>
  firstDayOfWeek % 7 === 0
    ? weekdays
    : [...weekdays.slice(firstDayOfWeek), ...weekdays.slice(0, firstDayOfWeek)];

export const createCalendarSlice: StateCreator<
  CalendarSlice & AuthSlice,
  [["zustand/immer", never]],
  [],
  CalendarSlice
> = (set, get) => ({
  calendar: {
    today: dayjs(),
    events: {
      data: [],
      start: null,
      end: null,
      load: async (start, end) => {
        const { uid } = get().auth.user!;
        const eventsRef = collection(db, "events");
        const q = query(
          eventsRef,
          orderBy("start", "desc"),
          where("start", ">=", start),
          where("start", "<=", end),
          where("userUid", "==", uid)
        );

        onSnapshot(q, (snapshot) => {
          set((state) => {
            const data = snapshot.docs.map((d) => {
              const data = d.data();
              data.created = data.created.toDate();
              data.start = data.start.toDate();
              data.end = data.end.toDate();

              return {
                id: d.id,
                ...data,
              } as EventInfo;
            });

            state.calendar.events.data = data;
          });
        });
      },
      add: async (event) => {
        return await addDoc(collection(db, "events"), {
          ...event,
          created: new Date(),
          userUid: get().auth.user?.uid,
        });
      },
      update: async (event) => {
        const ref = doc(db, "events", event.id);
        return await updateDoc(ref, {
          ...event,
          created: new Date(),
          userUid: get().auth.user?.uid,
        });
      },
      remove: async (id) => {
        const ref = doc(db, "events", id);
        await deleteDoc(ref);
      },
    },
    years: Array.from({ length: 201 }, (_, idx) =>
      dayjs()
        .add(100 - idx, "year")
        .year()
    ),

    localeData: () => get().calendar.today.localeData(),
    firstDayOfWeek: () => get().calendar.localeData().firstDayOfWeek(),
    months: () => get().calendar.localeData().months(),

    year: () => get().calendar.today.year(),
    month: () => get().calendar.today.month(),
    monthName: () => capitalize(get().calendar.today.format("MMMM")),
    daysInMonth: () => get().calendar.today.daysInMonth(),
    firstDay: () => get().calendar.today.startOf("month").day(),
    weekdays: () =>
      rearrangeDays(
        get().calendar.localeData().weekdaysShort(),
        get().calendar.firstDayOfWeek()
      ),
    weekdaysName: () =>
      rearrangeDays(
        get().calendar.localeData().weekdays(),
        get().calendar.firstDayOfWeek()
      ),

    changeMonth: (index?: MonthIndex | string) =>
      set((state) => {
        const { today } = state.calendar;

        state.calendar.today = today.month(index as unknown as number);
      }),
    changeYear: (index?: number | string) =>
      set((state) => {
        const { today } = state.calendar;

        state.calendar.today = today.year(index as unknown as number);
      }),
    getDays: () => {
      const { today, month, weekdays, weekdaysName, firstDay, daysInMonth } =
        get().calendar;
      const lastMonthTotalDays = today.subtract(1, "month").daysInMonth();
      const totalDays = daysInMonth() + firstDay() - 1;
      const monthNumber = month();
      const weekdaysNameArr = weekdaysName();
      const weekdaysArr = weekdays();

      return chunk<DayInfo>(
        Array.from(
          {
            length:
              firstDay() >= 6
                ? MAX_DAYS_SHOW_PER_MONTH_EXTRA_WEEK
                : MAX_DAYS_SHOW_PER_MONTH,
          },
          (_, idx) => {
            let day = idx + 1 - firstDay();
            let month = monthNumber;
            let inMonth = false;

            if (idx < firstDay()) {
              day = lastMonthTotalDays - firstDay() + idx + 1;
              month = monthNumber - (1 % 12);
            } else if (idx > totalDays) {
              day = idx - totalDays;
              month = monthNumber + (1 % 12);
            } else {
              inMonth = true;
            }

            const weekday = idx % 7;
            const name = weekdaysNameArr[weekday];

            return {
              day,
              month,
              name,
              weekday,
              inMonth,
            };
          }
        ),
        weekdaysArr.length
      );
    },
  },
});
