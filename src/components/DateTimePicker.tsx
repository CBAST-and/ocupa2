import NativeDateTimePicker from "@expo/ui/community/datetime-picker";

export type DateTimePickerProps = {
  value: Date;
  onValueChange: (event: unknown, date?: Date) => void;
  onDismiss?: () => void;
  mode?: "date" | "time";
  presentation?: "dialog" | "inline";
  minimumDate?: Date;
  maximumDate?: Date;
};

export default function DateTimePicker(props: DateTimePickerProps) {
  return <NativeDateTimePicker {...props} />;
}
