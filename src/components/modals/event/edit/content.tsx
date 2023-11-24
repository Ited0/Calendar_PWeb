import { useModal } from "@/components/modal-provider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import { EventInfo } from "@/store/calendar";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { filter, includes, isArray, map, pull, union } from "lodash";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EditEventSchema } from "@/lib/schemas/event";
import { alerts } from "@/lib/constants/event";
import { CalendarIcon } from "lucide-react";
import dayjs from "dayjs";
import { Calendar } from "@/components/ui/calendar";

export const Content = () => {
  const { events } = useStore((store) => store.calendar);
  const { enqueueSnackbar } = useSnackbar();
  const { close, data } = useModal<EventInfo>();

  const form = useForm<z.infer<typeof EditEventSchema>>({
    resolver: zodResolver(EditEventSchema),
    defaultValues: {
      ...data,
    },
  });

  async function onSubmit(values: z.infer<typeof EditEventSchema>) {
    events
      .update(values as unknown as EventInfo)
      .then(() => {
        enqueueSnackbar("Evento editado", {
          variant: "success",
        });
        close();
      })
      .catch((error) => {
        enqueueSnackbar("Erro ao editar: " + error.message, {
          variant: "error",
        });
      });
  }

  async function handleDelete() {
    events
      .remove(data!.id)
      .then(() => {
        enqueueSnackbar("Evento deletado", {
          variant: "success",
        });
        close();
      })
      .catch((error) => {
        enqueueSnackbar("Erro ao deletar: " + error.message, {
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
            name="title"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-x-4">
                <FormLabel className="text-right">
                  Título <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nome do Evento"
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
            name="start"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-x-4">
                <FormLabel className="text-right">
                  De <span className="text-destructive">*</span>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "col-span-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          dayjs(field.value).format("LL LT")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="col-start-2 col-span-3" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-x-4">
                <FormLabel className="text-right">
                  A <span className="text-destructive">*</span>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "col-span-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          dayjs(field.value).format("LL LT")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="col-start-2 col-span-3" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-x-4">
                <FormLabel className="text-right">Localização</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Local"
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
            name="description"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-x-4">
                <FormLabel className="text-right">Nota</FormLabel>
                <FormControl>
                  <Textarea
                    id="description"
                    className="col-span-3 resize-none max-h-32 h-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="col-start-2 col-span-3" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recurrence"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-x-4">
                <FormLabel className="text-right">Recorrência</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione a recorrência" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Nunca</SelectItem>
                      <SelectItem value="daily">Diária</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="col-start-2 col-span-3" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="alert"
            render={({ field }) => (
              <FormItem className="grid grid-cols-4 items-center gap-x-4">
                <FormLabel className="text-right">Alerta</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "col-span-3 justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {isArray(field.value)
                          ? map(
                              filter(alerts, (item) =>
                                includes(field.value, item["value"])
                              ),
                              (item) => item.value
                            ).join(" | ")
                          : alerts.find((item) => item.value === "none")?.label}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Selecione os alertas..."
                        className="h-9"
                      />
                      <CommandEmpty>Nenhum alerta encontrado.</CommandEmpty>
                      <CommandGroup>
                        {alerts.map((alert) => (
                          <CommandItem
                            value={alert.label}
                            key={alert.value}
                            onSelect={() => {
                              const values = field.value;
                              let data: typeof values = "none";

                              if (
                                alert.value !== "none" &&
                                values !== undefined
                              ) {
                                if (values === "none") {
                                  data = [alert.value];
                                } else {
                                  data = includes(values, alert.value)
                                    ? pull(values, alert.value)
                                    : union(values, [alert.value]);
                                }
                              }

                              form.setValue("alert", data);
                            }}
                          >
                            {alert.label}
                            <CheckIcon
                              className={cn(
                                "ml-auto h-4 w-4",
                                (
                                  isArray(field.value)
                                    ? includes(field.value, alert.value)
                                    : alert.value === field.value
                                )
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="gap-y-4">
          <Button variant="ghost" type="button" onClick={close}>
            Cancelar
          </Button>

          <AlertDialog>
            <Button variant="destructive" asChild>
              <AlertDialogTrigger>Deletar</AlertDialogTrigger>
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Tem certeza que deseja deletar o evento?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação não pode ser desfeita. Isto irá deletar
                  permanentement o evento!
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={handleDelete}>
                  Continuar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button type="submit">Salvar</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
