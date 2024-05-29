import * as Icon from "lucide-react";
import { useState } from "react";
import { useDateFormatter } from "react-aria";
import { Button, I18nProvider, type PressEvent } from "react-aria-components";
import { Link } from "react-router-dom";
import { useSnapshot } from "valtio";
import { useInterval } from "../helper/hooks";
import { range } from "../helper/utils";
import { store } from "../store";
import { Layout } from "./Layout";

export const LOCALE_NONE = undefined;
export const LOCALE_EN_US = "en-US";
export const LOCALE_DE_DE = "de-DE";

export const DashboardPage = () => {
  const title = useSnapshot(store.board).title;
  store.board.title = "dashboard";
  const locale = LOCALE_NONE;

  return (
    <I18nProvider locale={locale}>
      <Layout>
        <div className="bg-[#111315] p-[20px] flex justify-between min-h-dvh">
          <section>
            <div>{title}</div>
            <div>
              <Link className="text-[#FFFFFF]" to="/admin">
                Admin page
              </Link>
            </div>
            <div>
              <Link className="text-[#FFFFFF]" to="/dashboard">
                Dashboard page
              </Link>
            </div>
          </section>

          <section className="rounded-[5px] bg-[#2A2C2D] w-[500px] p-[100px] gap-[50px]">
            <TimeClock />
            <Pincode
              requiredDigits={4}
              onCompleted={(enteredDigits) => alert(JSON.stringify(enteredDigits))}
            />
          </section>
        </div>
      </Layout>
    </I18nProvider>
  );
};

const TimeClock = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  useInterval(() => {
    setCurrentDate(new Date());
  }, 1000);
  const dateFormat = useDateFormatter({
    dateStyle: "full",
  });
  const timeFormat = useDateFormatter({
    timeStyle: "medium",
    hour12: false,
  });

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-sm text-[#FFFFFF]">{dateFormat.format(currentDate)}</div>
      <div className="tracking-tight tabular-nums text-5xl text-[#FFFFFF]">
        {timeFormat.format(currentDate)}
      </div>
    </div>
  );
};

type PincodeProps = {
  requiredDigits: number;
  onCompleted?: (enteredDigits: string[]) => void;
};

const Pincode = (props: PincodeProps) => {
  const [enteredDigits, setEnteredDigits] = useState<string[]>([]);
  const onButtonClicked = (digit: string) => () => {
    const newEnteredDigits = [...enteredDigits, digit];
    if (newEnteredDigits.length < props.requiredDigits) {
      setEnteredDigits(newEnteredDigits);
    } else {
      setEnteredDigits([]);
      props.onCompleted && props.onCompleted(newEnteredDigits);
    }
  };
  const onClearButtonClicked = () => {
    setEnteredDigits([]);
  };

  return (
    <div className="flex flex-col items-center">
      <PincodeDots enteredDigits={enteredDigits.length} requiredDigits={props.requiredDigits} />
      <div className="grid grid-cols-3 w-fit h-fit">
        <PincodeButton onPress={onButtonClicked("1")}>1</PincodeButton>
        <PincodeButton onPress={onButtonClicked("2")}>2</PincodeButton>
        <PincodeButton onPress={onButtonClicked("3")}>3</PincodeButton>
        <PincodeButton onPress={onButtonClicked("4")}>4</PincodeButton>
        <PincodeButton onPress={onButtonClicked("5")}>5</PincodeButton>
        <PincodeButton onPress={onButtonClicked("6")}>6</PincodeButton>
        <PincodeButton onPress={onButtonClicked("7")}>7</PincodeButton>
        <PincodeButton onPress={onButtonClicked("8")}>8</PincodeButton>
        <PincodeButton onPress={onButtonClicked("9")}>9</PincodeButton>
        <div></div>
        <PincodeButton onPress={onButtonClicked("0")}>0</PincodeButton>
        <PincodeClearButton onPress={onClearButtonClicked} />
      </div>
    </div>
  );
};

type PincodeButtonProps = {
  children?: React.ReactNode;
  onPress?: (e: PressEvent) => void;
};

const PincodeButton = (props: PincodeButtonProps) => {
  return (
    <Button className="flex p-[8px] group outline-none" onPress={props.onPress}>
      <div className="rounded-[5px] bg-[#404142] group-active:brightness-150 text-[#FFFFFF] flex items-center justify-center w-[90px] h-[90px] text-[24px] leading-none select-none">
        {props.children}
      </div>
    </Button>
  );
};

type PincodeClearButtonProps = {
  onPress?: (e: PressEvent) => void;
};

const PincodeClearButton = (props: PincodeClearButtonProps) => {
  return (
    <Button
      className="relative flex items-center justify-center group outline-none"
      onPress={props.onPress}
    >
      <div className="group-active:brightness-150">
        <div className="absolute inset-0 left-[10px] flex items-center justify-center">
          <Icon.X className="h-[20px] w-[20px] text-[#FFFFFF]" strokeWidth={2.5} />
        </div>
        <Icon.Delete className="h-[55px] w-[55px] [&_path]:stroke-[#404142] [&_path]:fill-[#404142] text-transparent" />
      </div>
    </Button>
  );
};

type PincodeDotsProps = {
  requiredDigits: number;
  enteredDigits: number;
};

const PincodeDots = (props: PincodeDotsProps) => {
  return (
    <div className="flex flex-row gap-6 py-8">
      {range(0, props.requiredDigits).map((index) => {
        if (index < props.enteredDigits) {
          return (
            <div key={index} className="rounded-full shrink-0 w-[14px] h-[14px] bg-[#FFFFFF]"></div>
          );
        }
        return (
          <div key={index} className="rounded-full shrink-0 w-[14px] h-[14px] bg-[#404142]"></div>
        );
      })}
    </div>
  );
};
