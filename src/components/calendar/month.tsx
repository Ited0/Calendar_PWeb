import { capitalize } from "@/lib/utils";
import { Combobox, ComboboxOption } from "../ui/combobox";
import { useStore } from "@/store";

export const SelectMonth = () => {
  const { month, months, changeMonth } = useStore((state) => state.calendar);
  const onChangeMonth = (value?: string) => changeMonth(value);

  const data = months().map(
    (month, idx) =>
      ({
        label: capitalize(month),
        value: idx.toString(),
      } as ComboboxOption<string>)
  );

  return (
    <Combobox
      data={data}
      empty="Mês não encontrado"
      placeholder={
        data.find((m) => m.value === month().toString())?.label || ""
      }
      setValue={onChangeMonth}
      value={month().toString()}
    />
  );
};
