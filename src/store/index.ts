import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { AuthSlice, createAuthSlice } from "./auth";
import { CalendarSlice, createCalendarSlice } from "./calendar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

const useStore = create<AuthSlice & CalendarSlice>()(
  immer((...props) => ({
    ...createAuthSlice(...props),
    ...createCalendarSlice(...props),
  }))
);

onAuthStateChanged(auth, (user) => {
  useStore.setState((state) => {
    state.auth.user = user;
    state.auth.tried = true;
  });
});

export { useStore };
