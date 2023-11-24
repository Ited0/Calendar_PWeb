import { ReactNode, createContext, useContext, useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { omit } from "lodash";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

type ModalState = "open" | "closed";

type ModalProviderProps = {
  children: React.ReactNode;
  defaultState?: ModalState;
};

export type ModalOptions = {
  header?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
};

type ModalConfig = {
  className: ClassValue;
}

type ModalProviderState = {
  state: ModalState;
  options?: ModalOptions;
  data?: unknown;
  open: (
    options?: ModalOptions & { data?: unknown },
    config?: ModalConfig
  ) => void;
  close: () => void;
};

const initialState: ModalProviderState = {
  state: "closed",
  options: {},
  open: () => null,
  close: () => null,
};

const StateProviderContext = createContext<ModalProviderState>(initialState);

export function ModalProvider({
  children,
  defaultState = "closed",
  ...props
}: ModalProviderProps) {
  const [state, setState] = useState<ModalState>(() => defaultState);
  const [options, setOptions] = useState<ModalOptions>();
  const [data, setData] = useState<unknown>();
  const [config, setConfig] = useState<ModalConfig>();

  const value = {
    state,
    options,
    data,
    open: (
      options?: ModalOptions & { data?: unknown },
      config?: ModalConfig
    ) => {
      setState("open");
      setOptions(omit(options, ["data"]));
      setData(options?.data);

      setConfig(config);
    },
    close: () => {
      setState("closed");
      setOptions(undefined);
      setData(undefined);
    },
  };

  const onOpenChange = () => {
    setState("closed");
    setOptions(undefined);
    setData(undefined);
  };

  return (
    <StateProviderContext.Provider {...props} value={value}>
      {children}

      <Dialog open={state === "open"} onOpenChange={onOpenChange}>
        <DialogContent className={cn("sm:max-w-md", config?.className)}>
          {value.options?.header}

          {value.options?.content}

          {value.options?.footer}
        </DialogContent>
      </Dialog>
    </StateProviderContext.Provider>
  );
}

export const useModal = <T,>() => {
  const context = useContext(StateProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context as ModalProviderState & { data?: T };
};
