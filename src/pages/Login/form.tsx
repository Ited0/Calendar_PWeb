import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSnackbar } from "notistack";
import { Loader2 } from "lucide-react";
import { useStore } from "@/store";
import { LoginSchema } from "@/lib/schemas/auth";

export const LoginForm = () => {
  const { login } = useStore(store => store.auth);
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  });

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    const { email, password } = values;

    await login(email, password)
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch((error) => {
        let message = "Ocorreu algum erro!";

        if (error.code === "auth/invalid-login-credentials") {
          message = "Credenciais inválidas!";
        }

        enqueueSnackbar(message, {
          variant: "error",
        });
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="lg:w-2/3"
                  type="email"
                  placeholder="Email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    className="lg:w-2/3"
                    placeholder="Senha"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between lg:w-2/3 items-center">
            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Lembrar de mim?</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Button asChild variant="link" className="max-md:pr-0">
              <Link to="/forgot">Esqueceu a senha?</Link>
            </Button>
          </div>
        </div>

        <Button
          size="lg"
          className="w-48"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 h-fit w-fit animate-spin" />
          )}
          Logar
        </Button>
      </form>
    </Form>
  );
};
