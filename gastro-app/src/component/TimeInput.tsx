import {
  DateInput,
  DateSegment,
  FieldError,
  Label,
  Text,
  TimeField,
  TimeFieldProps,
  TimeValue,
  ValidationResult,
} from "react-aria-components";

interface TimeInputProps<T extends TimeValue> extends TimeFieldProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export const TimeInput = <T extends TimeValue>({
  label,
  description,
  errorMessage,
  ...props
}: TimeInputProps<T>) => {
  return (
    <TimeField {...props}>
      <Label>{label}</Label>
      <DateInput className="flex w-fit gap-[4px] whitespace-nowrap">
        {(segment) => (
          <DateSegment
            className="bg-[#404142] text-[#FFFFFF] rounded-[8px] h-[30px] px-[10px] tabular-nums text-end"
            segment={segment}
          />
        )}
      </DateInput>

      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
    </TimeField>
  );
};
