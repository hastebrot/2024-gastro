import * as Icon from "lucide-react";
import { useState } from "react";
import { I18nProvider, useDateFormatter } from "react-aria";
import { Link } from "react-router-dom";
import { classNames } from "./helper/classes";
import { useInterval } from "./helper/useInterval";
import { Layout } from "./page/Layout";

export const App = () => {
  // const locale = "en-US";
  // const locale = "de-DE";
  const locale = undefined;

  return (
    <I18nProvider locale={locale}>
      <Layout>
        <div className="grid grid-rows-2 sm:grid-rows-1 sm:grid-cols-2">
          <div className="bg-gray-100 p-4">
            <div className="text-xl font-semibold">Good morning!</div>
            <Link className="underline text-blue-600" to="/admin">
              admin
            </Link>
          </div>
          <div className="p-4 flex flex-col gap-8">
            <CurrentDate />
            <PincodeInput
              requiredDigits={4}
              onCompleted={(enteredDigits) => alert(JSON.stringify(enteredDigits))}
            />
          </div>
        </div>
      </Layout>
    </I18nProvider>
  );
};

const CurrentDate = () => {
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
      <div className="text-sm font-semibold">{dateFormat.format(currentDate)}</div>
      <div className="tracking-tight tabular-nums text-5xl font-semibold">
        {timeFormat.format(currentDate)}
      </div>
    </div>
  );
};

type PincodeInputProps = {
  requiredDigits: number;
  onCompleted?: (enteredDigits: string[]) => void;
};

const PincodeInput = (props: PincodeInputProps) => {
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
      <div className="grid grid-cols-3 gap-4 w-fit">
        <PincodeInputButton onClick={onButtonClicked("1")}>1</PincodeInputButton>
        <PincodeInputButton onClick={onButtonClicked("2")}>2</PincodeInputButton>
        <PincodeInputButton onClick={onButtonClicked("3")}>3</PincodeInputButton>
        <PincodeInputButton onClick={onButtonClicked("4")}>4</PincodeInputButton>
        <PincodeInputButton onClick={onButtonClicked("5")}>5</PincodeInputButton>
        <PincodeInputButton onClick={onButtonClicked("6")}>6</PincodeInputButton>
        <PincodeInputButton onClick={onButtonClicked("7")}>7</PincodeInputButton>
        <PincodeInputButton onClick={onButtonClicked("8")}>8</PincodeInputButton>
        <PincodeInputButton onClick={onButtonClicked("9")}>9</PincodeInputButton>
        <div></div>
        <PincodeInputButton onClick={onButtonClicked("0")}>0</PincodeInputButton>
        <PincodeInputButton onClick={onClearButtonClicked}>
          <Icon.Delete className="h-[24px] w-[24px]" />
        </PincodeInputButton>
      </div>
    </div>
  );
};

type PincodeDotsProps = {
  requiredDigits: number;
  enteredDigits: number;
};

const PincodeDots = (props: PincodeDotsProps) => {
  return (
    <div className="flex flex-row gap-6 py-6">
      {range(0, props.requiredDigits).map((index) => {
        if (index < props.enteredDigits) {
          return (
            <div key={index} className="rounded-full shrink-0 w-[14px] h-[14px] bg-teal-600"></div>
          );
        }
        return (
          <div key={index} className="rounded-full shrink-0 w-[14px] h-[14px] bg-gray-300"></div>
        );
      })}
    </div>
  );
};

type PincodeInputButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
};

const PincodeInputButton = (props: PincodeInputButtonProps) => {
  return (
    <button
      className={classNames(
        "bg-gray-200 active:bg-gray-300 font-semibold text-xl w-[65px] h-[65px] rounded-md",
        "flex items-center justify-center"
      )}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

const range = (start: number, end: number): number[] => {
  return [...Array(end - start).keys()].map((index) => start + index);
};
