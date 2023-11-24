import { useModal } from "@/components/modal-provider";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useStore } from "@/store";
import { EventInfo } from "@/store/calendar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EditProfileSchema } from "@/lib/schemas/profile";

export const Content = () => {
  const {user, update} = useStore((store) => store.auth);
  const { enqueueSnackbar } = useSnackbar();
  const { close } = useModal<EventInfo>();

  const form = useForm<z.infer<typeof EditProfileSchema>>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      displayName: user?.displayName || "",
      photoURL: user?.photoURL || "",
      phoneNumber: user?.phoneNumber || ""
    },
  });

  async function onSubmit(values: z.infer<typeof EditProfileSchema>) {
    update(values)
      .then(() => {
        enqueueSnackbar("Perfil salvo", {
          variant: "success",
        });
        close();
      })
      .catch((error) => {
        enqueueSnackbar("Erro ao salvar: " + error.message, {
          variant: "error",
        });
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-x-4">
                <FormLabel className="text-right">
                  Nome <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nome"
                    className="col-span-3"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="col-start-2 col-span-3" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="photoURL"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-x-4">
                <FormLabel className="text-right">Link para Foto</FormLabel>
                <FormControl>
                  <Input
                    placeholder="URL"
                    className="col-span-3"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="col-start-2 col-span-3" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-x-4">
                <FormLabel className="text-right">Telefone</FormLabel>
                <FormControl>
                  <Input
                    className="col-span-3 resize-none max-h-32 h-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="col-start-2 col-span-3" />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="gap-y-4">
          <Button variant="ghost" type="button" onClick={close}>
            Cancelar
          </Button>

          <Button type="submit">Salvar</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
