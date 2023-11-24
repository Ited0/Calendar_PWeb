import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { StateCreator } from "zustand";
import { auth } from "../lib/firebase";
import { z } from "zod";
import { EditProfileSchema } from "@/lib/schemas/profile";

export interface AuthSlice {
  readonly auth: {
    readonly tried: boolean;
    readonly user: User | null;
    readonly register: (
      email: string,
      password: string,
      name: string
    ) => Promise<UserCredential>;
    readonly login: (
      email: string,
      password: string
    ) => Promise<UserCredential>;
    readonly logout: () => Promise<void>;
    readonly update: (
      user: Partial<z.infer<typeof EditProfileSchema>>
    ) => Promise<void>;
  };
}

export const createAuthSlice: StateCreator<
  AuthSlice,
  [["zustand/immer", never]],
  []
> = (set, get) => ({
  auth: {
    tried: false,
    user: null,
    register: async (email, password, name) =>
      await createUserWithEmailAndPassword(auth, email, password).then(
        async (user) => {
          await get().auth.update({ displayName: name });

          return {...user, user: {...user.user, displayName: name}};
        }
      ),
    login: async (email, password) =>
      await signInWithEmailAndPassword(auth, email, password),
    logout: async () => {
      set((state) => {
        state.auth.tried = false;
      });

      return signOut(auth);
    },
    update: async (user) => await updateProfile(get().auth.user!, user),
  },
});
