import * as Icon from "lucide-react";
import { Button } from "react-aria-components";

export const DashboardPage = () => {
  return (
    <div>
      <div className="bg-[#111315] p-[20px] flex justify-end min-h-dvh">
        <div className="rounded-[5px] bg-[#2A2C2D] w-[500px] p-[100px]">
          <div className="grid grid-cols-3 w-fit h-fit">
            <KeycodeButton>1</KeycodeButton>
            <KeycodeButton>2</KeycodeButton>
            <KeycodeButton>3</KeycodeButton>
            <KeycodeButton>4</KeycodeButton>
            <KeycodeButton>5</KeycodeButton>
            <KeycodeButton>6</KeycodeButton>
            <KeycodeButton>7</KeycodeButton>
            <KeycodeButton>8</KeycodeButton>
            <KeycodeButton>9</KeycodeButton>
            <div></div>
            <KeycodeButton>0</KeycodeButton>
            <KeycodeClearButton />
          </div>
        </div>
      </div>
    </div>
  );
};

type KeycodeButtonProps = {
  children?: React.ReactNode;
};

const KeycodeButton = (props: KeycodeButtonProps) => {
  return (
    <Button className="flex p-[8px] group">
      <div className="rounded-[5px] bg-[#404142] group-active:brightness-150 text-[#FFFFFF] flex items-center justify-center w-[90px] h-[90px] text-[24px] leading-none select-none">
        {props.children}
      </div>
    </Button>
  );
};

const KeycodeClearButton = () => {
  return (
    <Button className="relative flex items-center justify-center group">
      <div className="group-active:brightness-150">
        <div className="absolute inset-0 left-[10px] flex items-center justify-center">
          <Icon.X className="h-[20px] w-[20px] text-[#FFFFFF]" strokeWidth={2.5} />
        </div>
        <Icon.Delete className="h-[55px] w-[55px] [&_path]:stroke-[#404142] [&_path]:fill-[#404142] text-transparent" />
      </div>
    </Button>
  );
};
