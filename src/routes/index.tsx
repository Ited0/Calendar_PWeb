import { Routes, Route } from "react-router-dom";

import { Home } from "@/pages/Home";
import { Login } from "@/pages/Login";
import { LoggedLayout } from "@/components/layout/logged";

import { useStore } from "@/store";
import { Loader2 } from "lucide-react";
import { Register } from "@/pages/Register";

export const AppRoutes = () => {
  const tried = useStore((state) => state.auth.tried);

  if (!tried) {
    return (
      <div className="flex items-center justify-center text-sm text-muted-foreground w-screen h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LoggedLayout />}>
        <Route index={true} element={<Home />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}