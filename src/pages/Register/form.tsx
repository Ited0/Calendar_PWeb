import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useSnackbar } from "notistack";
import { Loader2 } from "lucide-react";
import { useStore } from "@/store";
import { RegisterSchema } from "@/lib/schemas/auth";

export const RegisterForm = () => {
  const { register } = useStore((store) => store.auth);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: ""
    },
  });

  async function onSubmit(values: z.infer<typeof RegisterSchema>) {
    const { email, password, name } = values;

    await register(email, password, name)
      .then(() => {
        navigate("/", { replace: true });
      })
      .catch(() => {
        const message = "Ocorreu algum erro!";

        enqueueSnackbar(message, {
          variant: "error",
        });
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
      <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="lg:w-2/3"
                  placeholder="Nome"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
