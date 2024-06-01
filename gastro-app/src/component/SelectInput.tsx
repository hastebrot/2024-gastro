import * as Icon from "lucide-react";
import {
  Button,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectProps,
  SelectValue,
} from "react-aria-components";

type SelectInputProps<T extends object> = SelectProps<T> & {
  label?: string;
  items: Record<string, string>;
};

export const SelectInput = (props: SelectInputProps<object>) => {
  const keys = Object.keys(props.items);
  const labels = Object.values(props.items);

  return (
    <Select {...props}>
      <Label>{props.label}</Label>
      <Button className="flex items-center whitespace-nowrap bg-[#404142] text-[#FFFFFF] rounded-[8px] h-[30px] px-[20px] gap-[4px]">
        <SelectValue />
        <span aria-hidden="true">
          <Icon.ChevronDown className="w-[20px] h-[20px] mr-[-5px]" />
        </span>
      </Button>

      <Popover>
        <ListBox className="flex flex-col bg-[#404142] text-[#FFFFFF] rounded-[8px] py-[5px] gap-[5px] outline-none">
          {keys.map((key, index) => {
            return (
              <ListBoxItem
                className="cursor-pointer w-full px-[20px] outline-none"
                key={key}
                id={key}
              >
                {labels[index]}
              </ListBoxItem>
            );
          })}
        </ListBox>
      </Popover>
    </Select>
  );
};
