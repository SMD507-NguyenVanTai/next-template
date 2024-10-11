import { Dispatch, SetStateAction, useCallback, useState } from 'react';

// Define the type for the return object
export type UseBooleanReturnType = {
  value: boolean;
  onTrue: VoidFunction;
  onFalse: VoidFunction;
  onToggle: VoidFunction;
  setValue: Dispatch<SetStateAction<boolean>>;
};

export function useBoolean(defaultValue: boolean = false): UseBooleanReturnType {
  const [value, setValue] = useState<boolean>(defaultValue);

  const onTrue = useCallback(() => {
    setValue(true);
  }, []);

  const onFalse = useCallback(() => {
    setValue(false);
  }, []);

  const onToggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return {
    value,
    onTrue,
    onFalse,
    onToggle,
    setValue,
  };
}
