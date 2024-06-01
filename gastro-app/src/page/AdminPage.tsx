import { CalendarDate, Time, getLocalTimeZone, toCalendarDateTime } from "@internationalized/date";
import * as Icon from "lucide-react";
import { DateTime, Interval } from "luxon";
import { useEffect, useState } from "react";
import { useDateFormatter } from "react-aria";
import {
  Button,
  Dialog,
  Heading,
  Key,
  ListBox,
  ListBoxItem,
  Modal,
  ModalOverlay,
  Popover,
  PressEvent,
  Select,
  SelectValue,
} from "react-aria-components";
import { Link } from "react-router-dom";
import { useSnapshot } from "valtio";
import { NumberInput } from "../component/NumberInput";
import { SelectInput } from "../component/SelectInput";
import { TimeInput } from "../component/TimeInput";
import { classNames } from "../helper/classes";
import { range, throwError } from "../helper/utils";
import { store } from "../store";
import { Layout } from "./Layout";

export const AdminPage = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const firstDayOfWeek = toFirstDayOfWeek(weekOffset);
  const calendarDays = toCalendarDaysOfWeek(firstDayOfWeek);
  const onCurrentWeekClicked = () => {
    setWeekOffset(0);
  };
  const onPreviousWeekClicked = () => {
    setWeekOffset((weekOffset) => weekOffset - 1);
  };
  const onNextWeekClicked = () => {
    setWeekOffset((weekOffset) => weekOffset + 1);
  };

  return (
    <Layout>
      <div className="bg-[#111315] text-[#FFFFFF] p-[15px]">
        <section className="pb-[32px] flex items-center justify-between">
          <Link
            className="bg-[#2D2D2D] text-[#FFFFFF] rounded-[8px] h-[40px] px-[20px] gap-[4px] flex items-center"
            to="/"
          >
            <Icon.ChevronLeft className="w-[20px] h-[20px] ml-[-5px]" />
            <span>Back</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="pr-[10px]">Week {firstDayOfWeek.weekNumber}</div>
            <DefaultButton onPress={onPreviousWeekClicked}>
              <Icon.ChevronLeft className="w-[20px] h-[20px]" />
            </DefaultButton>
            <DefaultButton onPress={onNextWeekClicked}>
              <Icon.ChevronRight className="w-[20px] h-[20px]" />
            </DefaultButton>
            <DefaultButton onPress={onCurrentWeekClicked}>
              <span>This week</span>
            </DefaultButton>
          </div>
        </section>

        <section>
          <StaffTable calendarDays={calendarDays} />
        </section>

        <Tearsheet>
          <TearsheetContent onCompleted={(shiftValues) => alert(JSON.stringify(shiftValues))} />
        </Tearsheet>
      </div>
    </Layout>
  );
};

const memberNames = ["Alex", "Dennis", "Marc", "Lena", "Emma"];

enum SHIFT_TYPES {
  NO_SHIFT = "NO_SHIFT",
  EARLY_SHIFT = "EARLY_SHIFT",
  MIDDLE_SHIFT = "MIDDLE_SHIFT",
  LATE_SHIFT = "LATE_SHIFT",
  CUSTOM_SHIFT = "CUSTOM_SHIFT",
  VACATION = "VACATION",
}

const shiftLabels: Record<SHIFT_TYPES, string> = {
  [SHIFT_TYPES.NO_SHIFT]: "No shift",
  [SHIFT_TYPES.EARLY_SHIFT]: "Early shift",
  [SHIFT_TYPES.MIDDLE_SHIFT]: "Middle shift",
  [SHIFT_TYPES.LATE_SHIFT]: "Late shift",
  [SHIFT_TYPES.CUSTOM_SHIFT]: "Custom shift",
  [SHIFT_TYPES.VACATION]: "Vacation",
};

type ShiftItem = {
  shiftName?: string;
  startTime: Time | null;
  endTime: Time | null;
  breakTime: string;
};

const shiftDefinitions: Partial<Record<SHIFT_TYPES, ShiftItem>> = {
  [SHIFT_TYPES.NO_SHIFT]: {
    startTime: null,
    endTime: null,
    breakTime: "0",
  },

  [SHIFT_TYPES.VACATION]: {
    startTime: null,
    endTime: null,
    breakTime: "0",
  },

  [SHIFT_TYPES.EARLY_SHIFT]: {
    startTime: new Time(7, 30),
    endTime: new Time(16, 0),
    breakTime: "30",
  },

  [SHIFT_TYPES.MIDDLE_SHIFT]: {
    startTime: new Time(7, 30),
    endTime: new Time(18, 0),
    breakTime: "30",
  },

  [SHIFT_TYPES.LATE_SHIFT]: {
    startTime: new Time(9, 30),
    endTime: new Time(18, 0),
    breakTime: "30",
  },
};

type ActionButtonProps = {
  children?: React.ReactNode;
  onPress?: (e: PressEvent) => void;
  isPrimary?: boolean;
  isDisabled?: boolean;
};

const ActionButton = (props: ActionButtonProps) => {
  return (
    <Button
      className={classNames(
        "h-[40px] w-[220px] flex items-center justify-center rounded-[18px] outline-none",
        !props.isPrimary && "border border-[#505051]",
        props.isPrimary && "bg-[#FFFFFF] text-[#111315]",
        "data-[disabled]:bg-[#47494B]"
      )}
      onPress={props.onPress}
      isDisabled={props.isDisabled}
    >
      {props.children}
    </Button>
  );
};

type DefaultButtonProps = {
  children?: React.ReactNode;
  onPress?: (e: PressEvent) => void;
};

const DefaultButton = (props: DefaultButtonProps) => {
  return (
    <Button
      className={classNames(
        "bg-[#2D2D2D] text-[#FFFFFF]",
        "rounded-[8px] h-[40px] px-[20px] gap-[4px] flex items-center outline-none"
      )}
      onPress={props.onPress}
    >
      {props.children}
    </Button>
  );
};

type TearsheetProps = {
  children?: React.ReactNode;
};

const Tearsheet = (props: TearsheetProps) => {
  const isOpen = useSnapshot(store.board).isOpen;

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(isOpen) => (store.board.isOpen = isOpen)}
      className="fixed inset-0 bg-gray-900/50"
    >
      <Modal className="fixed top-0 left-0 w-full z-10">{props.children}</Modal>
    </ModalOverlay>
  );
};

type TearsheetContentProps = {
  onCompleted?: (shiftValues: ShiftItem) => void;
};

const TearsheetContent = (props: TearsheetContentProps) => {
  const [selectedShift, setSelectedShift] = useState<Key>(SHIFT_TYPES.NO_SHIFT);
  const [startTime, setStartTime] = useState<Time | null>(null);
  const [endTime, setEndTime] = useState<Time | null>(null);
  const [breakTime, setBreakTime] = useState<string>("0");
  useEffect(() => {
    const shiftDefinition = shiftDefinitions[selectedShift as SHIFT_TYPES];
    if (shiftDefinition) {
      setStartTime(shiftDefinition.startTime);
      setEndTime(shiftDefinition.endTime);
      setBreakTime(shiftDefinition.breakTime);
    }
  }, [selectedShift]);
  const isStartTimeDisabled = selectedShift !== SHIFT_TYPES.CUSTOM_SHIFT;
  const isEndTimeDisabled = selectedShift !== SHIFT_TYPES.CUSTOM_SHIFT;
  const isBreakTimeDisabled = selectedShift !== SHIFT_TYPES.CUSTOM_SHIFT;

  return (
    <Dialog className="m-[15px] rounded-[5px] bg-[#292C2D] text-[#FFFFFF] outline-none">
      {({ close }) => (
        <form className="mx-auto w-[640px] h-[300px] grid grid-rows-[auto_1fr_auto] gap-[20px] p-[20px]">
          <section className="flex items-center justify-between">
            <Heading slot="title" className="font-semibold text-lg">
              Edit shift
            </Heading>
            <Button onPress={close}>
              <Icon.X />
            </Button>
          </section>

          <section className="grid grid-cols-3 items-start">
            <div>
              <SelectInput
                label="Shift type"
                items={shiftLabels}
                selectedKey={selectedShift}
                onSelectionChange={(key) => setSelectedShift(key)}
              />
            </div>

            <div>
              <TimeInput
                label="Start time"
                hourCycle={24}
                isDisabled={isStartTimeDisabled}
                value={startTime}
                onChange={setStartTime}
              />
              <TimeInput
                label="End time"
                hourCycle={24}
                isDisabled={isEndTimeDisabled}
                value={endTime}
                onChange={setEndTime}
              />
            </div>

            <div className="flex items-center gap-[10px]">
              <NumberInput
                label="Break time"
                description="minutes"
                isDisabled={isBreakTimeDisabled}
                value={breakTime}
                onChange={setBreakTime}
              />
            </div>
          </section>

          <section className="flex items-center justify-center gap-[20px] mt-[40px]">
            <ActionButton onPress={close}>Cancel</ActionButton>
            <ActionButton
              onPress={() => {
                close();
                props.onCompleted &&
                  props.onCompleted({
                    shiftName: selectedShift as string,
                    startTime,
                    endTime,
                    breakTime,
                  });
              }}
              isPrimary
            >
              Accept changes
            </ActionButton>
          </section>
        </form>
      )}
    </Dialog>
  );
};

type TimeSelectProps = {
  startTime?: string;
  endTime?: string;
  timeStep?: string;
};

const TimeSelect = (_props: TimeSelectProps) => {
  const startTime = DateTime.local(0, 1, 1, 8, 0, 0);
  const endTime = DateTime.local(0, 1, 1, 17, 0, 0);
  const timeSteps = Interval.fromDateTimes(startTime, endTime)
    .splitBy({ minutes: 10 })
    .map((interval) => interval.start ?? throwError("invalid start datetime in interval"));

  return (
    <Select>
      {/* <Label>Time</Label> */}
      <Button>
        <SelectValue />
        <span aria-hidden="true">▼</span>
      </Button>
      <Popover>
        <ListBox>
          {timeSteps.map((timeStep) => {
            return <ListBoxItem key={timeStep.toISOTime()}>{timeStep.toISOTime()}</ListBoxItem>;
          })}
        </ListBox>
      </Popover>
    </Select>
  );
};

type StaffTableProps = {
  calendarDays: DateTime[];
};

const StaffTable = (props: StaffTableProps) => {
  type ShiftItemKey = string;
  type ShiftItems = Map<ShiftItemKey, ShiftItem | null>;

  const [shiftItems, setShiftItems] = useState<ShiftItems>(new Map());
  const updateShiftItems = (key: ShiftItemKey, value: ShiftItem | null) => {
    setShiftItems((map) => new Map(map.set(key, value)));
  };
  useEffect(() => {
    updateShiftItems("Alex-1", {
      shiftName: "Early shift",
      startTime: new Time(7, 30),
      endTime: new Time(18, 0),
      breakTime: "30",
    });
    updateShiftItems("Dennis-2", {
      shiftName: "Late shift",
      startTime: new Time(7, 30),
      endTime: new Time(18, 0),
      breakTime: "30",
    });
    updateShiftItems("Marc-0", {
      shiftName: "Vacation",
      startTime: null,
      endTime: null,
      breakTime: "0",
    });
  }, []);

  let lastCalendarMonthName = "";
  const numOfWeekdays = 7;
  console.log(shiftItems.size);

  return (
    <Table>
      <TableRow>
        <TableHeaderCell></TableHeaderCell>
        {props.calendarDays.map((calendarDay) => {
          const weekdayName = `${formatCalendarDay(calendarDay).weekdayName} ${calendarDay.day}`;
          const calendarMonthName = formatCalendarMonth(calendarDay);
          const showCalendarMonthName = calendarMonthName !== lastCalendarMonthName;
          lastCalendarMonthName = calendarMonthName;

          return (
            <TableHeaderCell key={weekdayName}>
              <div className="whitespace-nowrap">{weekdayName}</div>
              <div
                className={classNames(
                  "whitespace-nowrap text-[#989898]",
                  !showCalendarMonthName && "invisible"
                )}
              >
                {calendarMonthName}
              </div>
            </TableHeaderCell>
          );
        })}
      </TableRow>
      {memberNames.map((memberName) => {
        return (
          <TableRow key={memberName}>
            <TableCell hasFullWidth>
              <div className="p-[5px] pr-[10px]">
                <AvatarLabel name={memberName} initials={memberName[0]} />
              </div>
            </TableCell>
            {range(0, numOfWeekdays).map((index) => {
              const shiftItemKey = `${memberName}-${index}`;
              const shiftItem = shiftItems.get(shiftItemKey) ?? null;
              const hasCard = shiftItem !== null;
              const isDefaultCard = shiftItem === null || shiftItem.shiftName === "Vacation";
              // const hasCard = Math.random() > 0.6;
              // const isDefaultCard = Math.random() > 0.4;
              return (
                <TableCell key={index} hasDashedBorder>
                  <Button className="flex outline-none" onPress={() => (store.board.isOpen = true)}>
                    <CardItem
                      shiftItem={shiftItem}
                      isCardActive={hasCard}
                      isDefaultCard={isDefaultCard}
                    />
                  </Button>
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
    </Table>
  );
};

type CardItemProps = {
  shiftItem: ShiftItem | null;
  isCardActive: boolean;
  isDefaultCard: boolean;
};

const CardItem = (props: CardItemProps) => {
  const timeFormat = useDateFormatter({
    timeStyle: "short",
    hour12: false,
  });
  const toDate = (time: Time): Date => {
    const dateTime = toCalendarDateTime(new CalendarDate(2000, 1, 1), time);
    return dateTime.toDate(getLocalTimeZone());
  };
  const shiftName = props.shiftItem?.shiftName ?? null;
  const shiftItem = props.shiftItem ?? null;

  return (
    <div
      className={classNames(
        !props.isCardActive && "invisible",
        "flex flex-col items-start outline-none bg-[#2D2D2D] w-[140px] h-[90px] rounded-[5px] p-[10px]",
        props.isDefaultCard ? "bg-[#2D2D2D]" : "bg-[#CAE8DD]",
        props.isDefaultCard ? "text-[#FFFFFF]" : "text-[#000000]"
      )}
    >
      <div>{shiftName}</div>
      {shiftItem && (
        <>
          <div className="flex items-center gap-1">
            <span>
              {timeFormat.format(toDate(shiftItem?.startTime!))} -{" "}
              {timeFormat.format(toDate(shiftItem?.endTime!))}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Icon.Coffee className="w-[18px] h-[18px] stroke-[1.5]" />
            <span>{shiftItem?.breakTime} min</span>
          </div>
        </>
      )}
    </div>
  );
};

type AvatarLabelProps = {
  children?: React.ReactNode;
  name: string;
  initials: string;
};

const AvatarLabel = (props: AvatarLabelProps) => {
  const colors = ["#C9CAEC", "#CAE8DD", "#EACAD0"];
  const color = colors[Math.floor(Math.random() * colors.length)];

  return (
    <div className="flex flex-row items-center gap-[6px]">
      <div
        className={classNames(
          "w-[28px] h-[28px] flex items-center justify-center flex-shrink-0 rounded-full bg-[--color] text-[#000000]"
        )}
        style={{ "--color": color } as React.CSSProperties}
      >
        <span className="uppercase text-sm leading-none">{props.initials}</span>
      </div>
      <div className="whitespace-nowrap">{props.name}</div>
    </div>
  );
};

type TableProps = {
  children?: React.ReactNode;
};

const Table = (props: TableProps) => {
  return <div className="table border-collapse">{props.children}</div>;
};

type TableRowProps = {
  children?: React.ReactNode;
};

const TableRow = (props: TableRowProps) => {
  return <div className="table-row">{props.children}</div>;
};

type TableCellProps = {
  children?: React.ReactNode;
  hasDashedBorder?: boolean;
  hasFullWidth?: boolean;
};

const TableCell = (props: TableCellProps) => {
  return (
    <div
      className={classNames(
        "table-cell align-top text-left p-[5px] border border-[#333333]",
        props.hasDashedBorder && "border-dashed",
        props.hasFullWidth && "w-full"
      )}
    >
      {props.children}
    </div>
  );
};

type TableHeaderCellProps = {
  children?: React.ReactNode;
};

const TableHeaderCell = (props: TableHeaderCellProps) => {
  return (
    <div className="table-cell align-top text-center p-[5px] border-y border-[#333333]">
      {props.children}
    </div>
  );
};

const toFirstDayOfWeek = (weekOffset: number, locale = "en-US") => {
  const now = DateTime.now();
  const firstDayOfWeek = DateTime.fromObject({
    weekYear: now.weekYear,
    weekNumber: now.weekNumber,
  }).setLocale(locale);
  return firstDayOfWeek.plus({ weeks: weekOffset });
};

const toCalendarDaysOfWeek = (firstDayOfWeek: DateTime) => {
  const startDate = firstDayOfWeek.startOf("week");
  const endDate = firstDayOfWeek.endOf("week");
  const calendarDays = Interval.fromDateTimes(startDate, endDate)
    .splitBy({ days: 1 })
    .map((interval) => interval.start ?? throwError("invalid start datetime in interval"));
  return calendarDays;
};

const formatCalendarDay = (calendarDay: DateTime) => {
  return {
    date: calendarDay.toISODate() ?? throwError("failed to convert from datetime to iso-date"),
    day: calendarDay.day,
    month: calendarDay.month,
    monthName: calendarDay.toFormat("MMM"),
    weekday: calendarDay.weekday,
    weekdayName: calendarDay.toFormat("EEE"),
  };
};

const formatCalendarMonth = (firstDayOfMonth: DateTime) => {
  return firstDayOfMonth.toFormat("MMM yyyy");
};
