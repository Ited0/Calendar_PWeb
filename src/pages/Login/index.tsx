import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";

import { LoginForm } from "./form";
import { useStore } from "@/store";

export const Login = () => {
  const { user } = useStore((store) => store.auth);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="w-screen h-screen px-4 py-24 flex justify-center items-center sm:px-24 lg:px-36 sm:py-24">
      <div className="absolute flex items-center space-x-2 top-2 right-2">
        <ModeToggle />
      </div>

      <Card className="w-full h-full space-y-8 lg:space-y-16">
        <CardHeader className="space-y-0">
          <CardTitle className="font-bold text-2xl">Bem vindo</CardTitle>
          <CardDescription className="text-base">
            Logue para continuar
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full space-y-8">
          <LoginForm />

          <div>
            Não tem uma conta?{" "}
            <Button asChild variant="link" className="px-0">
              <Link to="/register">Registrar-se</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
