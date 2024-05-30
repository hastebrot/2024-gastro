import * as Icon from "lucide-react";
import {
  Button,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
} from "react-aria-components";

type SelectInputProps = {
  label?: string;
  items: Record<string, string>;
};

export const SelectInput = (props: SelectInputProps) => {
  const keys = Object.keys(props.items);
  const labels = Object.values(props.items);

  return (
    <Select>
      <Label>{props.label}</Label>
      <Button className="flex items-center whitespace-nowrap bg-[#404142] text-[#FFFFFF] rounded-[8px] h-[30px] px-[20px] gap-[4px]">
        <SelectValue />
        <span aria-hidden="true">
          <Icon.ChevronDown className="w-[20px] h-[20px] mr-[-5px]" />
        </span>
      </Button>

      <Popover>
        <ListBox className="text-[#FFFFFF] bg-[#292B2C]">
          {keys.map((key, index) => {
            return (
              <ListBoxItem className="cursor-pointer" key={key}>
                {labels[index]}
              </ListBoxItem>
            );
          })}
        </ListBox>
      </Popover>
    </Select>
  );
};
