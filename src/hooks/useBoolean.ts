import { useMemo, useState } from "react"

export const useBoolean = (initialState: boolean | (() => boolean) = false) => {
  const [value, setValue] = useState(initialState);

  const toggle = useMemo(() => () => setValue(prev => !prev), [])

  return [value, setValue, toggle] as const;
}