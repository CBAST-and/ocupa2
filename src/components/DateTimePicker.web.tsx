import { useEffect, useState } from "react";
import { TextInput } from "react-native";

import type { DateTimePickerProps } from "./DateTimePicker";

function toInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function DateTimePicker({
  value,
  onValueChange,
  onDismiss,
  minimumDate,
  maximumDate,
}: DateTimePickerProps) {
  const [inputValue, setInputValue] = useState(toInputValue(value));

  useEffect(() => {
    setInputValue(toInputValue(value));
  }, [value]);

  return (
    <TextInput
      autoFocus
      value={inputValue}
      placeholder="AAAA-MM-DD"
      onChangeText={(nextValue) => {
        setInputValue(nextValue);
        const date = new Date(`${nextValue}T12:00:00`);
        if (!Number.isNaN(date.getTime())) {
          if (minimumDate && date < minimumDate) return;
          if (maximumDate && date > maximumDate) return;
          onValueChange(null, date);
          onDismiss?.();
        }
      }}
      keyboardType="numbers-and-punctuation"
      accessibilityLabel="Selecciona una fecha (AAAA-MM-DD)"
    />
  );
}
