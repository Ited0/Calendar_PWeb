import { Combobox, ComboboxOption } from "../ui/combobox";
import { useStore } from "@/store";

export const SelectYear = () => {
  const { year, years, changeYear } = useStore(state => state.calendar);
  const onChangeYear = (value?: string) => changeYear(value);

  const data = years.map(
    (year) =>
      ({
        label: year.toString(),
        value: year.toString(),
      } as ComboboxOption<string>)
  );

  return (
    <Combobox
      data={data}
      empty="Ano não encontrado"
      placeholder={year().toString()}
      setValue={onChangeYear}
      value={year().toString()}
    />
  );
};
