import {
  FieldError,
  Input,
  Label,
  Text,
  TextField,
  TextFieldProps,
  ValidationResult,
} from "react-aria-components";
import { classNames } from "../helper/classes";

interface NumberInputProps extends TextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export const NumberInput = ({ label, description, errorMessage, ...props }: NumberInputProps) => {
  return (
    <TextField
      {...props}
      className={classNames(
        "[&_input::-webkit-outer-spin-button]:[-webkit-appearance:none]",
        "[&_input::-webkit-inner-spin-button]:[-webkit-appearance:none]",
        "[&_input[type=number]]:[-moz-appearance:textfield]"
      )}
      type="number"
    >
      <Label>{label}</Label>
      <div className="flex w-fit gap-[4px] whitespace-nowrap">
        <Input
          className={classNames(
            "bg-[#404142] text-[#FFFFFF] rounded-[8px] h-[30px] px-[10px] tabular-nums",
            "data-[disabled]:text-[#989898]"
          )}
        />
      </div>

      {description && <Text slot="description">{description}</Text>}
      <FieldError>{errorMessage}</FieldError>
    </TextField>
  );
};
