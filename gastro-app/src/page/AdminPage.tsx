import clsx from "clsx";
import * as Icon from "lucide-react";
import { DateTime, Interval } from "luxon";
import { useState } from "react";
import {
  Button,
  Dialog,
  Heading,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Modal,
  ModalOverlay,
  Popover,
  PressEvent,
  Select,
  SelectValue,
  TextField,
} from "react-aria-components";
import { Link } from "react-router-dom";
import { useSnapshot } from "valtio";
import { range, throwError } from "../helper/utils";
import { store } from "../store";
import { Layout } from "./Layout";

export const AdminPage = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const firstDayOfWeek = toFirstDayOfWeek(weekOffset);
  const calendarMonth = formatCalendarMonth(firstDayOfWeek);
  const calendarDays = toCalendarDaysOfWeek(firstDayOfWeek);
  const weekdayNames = calendarDays.map((calendarDay) => {
    return `${formatCalendarDay(calendarDay).weekdayName} ${calendarDay.day}`;
  });
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
      <div className="bg-[#111315] text-[#FFFFFF] p-4">
        <div className="pb-4 flex items-center justify-between">
          <Link
            className="bg-[#2D2D2D] text-[#FFFFFF] rounded-[8px] h-[40px] px-[20px] gap-[4px] flex items-center"
            to="/"
          >
            <Icon.ChevronLeft className="w-[20px] h-[20px]" />
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="pr-[10px]">
              Week {firstDayOfWeek.weekNumber} ({calendarMonth})
            </div>
            <DefaultButton onPress={onPreviousWeekClicked}>
              <Icon.ChevronLeft className="w-[20px] h-[20px]" />
            </DefaultButton>
            <DefaultButton onPress={onNextWeekClicked}>
              <Icon.ChevronRight className="w-[20px] h-[20px]" />
            </DefaultButton>
            <DefaultButton onPress={onCurrentWeekClicked}>This week</DefaultButton>
          </div>
        </div>
        <StaffTable weekdayNames={weekdayNames} />
        <Tearsheet />
      </div>
    </Layout>
  );
};

type DefaultButtonProps = {
  children?: React.ReactNode;
  onPress?: (e: PressEvent) => void;
};

const DefaultButton = (props: DefaultButtonProps) => {
  return (
    <Button
      className="bg-[#2D2D2D] text-[#FFFFFF] rounded-[8px] h-[40px] px-[20px] gap-[4px] flex items-center"
      onPress={props.onPress}
    >
      {props.children}
    </Button>
  );
};

type TearsheetProps = {};

const Tearsheet = (props: TearsheetProps) => {
  const isOpen = useSnapshot(store.board).isOpen;

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(isOpen) => (store.board.isOpen = isOpen)}
      className="fixed inset-0 bg-gray-900/50"
    >
      <Modal className="fixed bottom-0 left-0 w-full z-10">
        <TearsheetContent />
      </Modal>
    </ModalOverlay>
  );
};

type TimeSelectProps = {
  startTime?: string;
  endTime?: string;
  timeStep?: string;
};

const TimeSelect = (props: TimeSelectProps) => {
  const startTime = DateTime.local(0, 1, 1, 8, 0, 0);
  const endTime = DateTime.local(0, 1, 1, 17, 0, 0);
  const timeSteps = Interval.fromDateTimes(startTime, endTime)
    .splitBy({ minutes: 10 })
    .map((interval) => interval.start ?? throwError("invalid start datetime in interval"));

  return (
    <Select>
      <Label>Time</Label>
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

const TearsheetContent = () => {
  return (
    <Dialog className="h-[250px] p-4 bg-white outline-none">
      {({ close }) => (
        <form>
          <div className="grid grid-cols-2">
            <Heading slot="title">Heading</Heading>
            <div>
              <Icon.X />
            </div>
          </div>

          <TimeSelect />

          <TextField className="grid grid-cols-2">
            <Label>Start time</Label>
            <Input type="time" />
          </TextField>

          <TextField className="grid grid-cols-2">
            <Label>End time</Label>
            <Input type="time" />
          </TextField>

          <TextField className="grid grid-cols-2">
            <Label>Break time</Label>
            <Input type="time" />
          </TextField>

          <div className="grid grid-cols-2">
            <Button onPress={close}>Accept changes</Button>
            <Button onPress={close}>Cancel</Button>
          </div>
        </form>
      )}
    </Dialog>
  );
};

type StaffTableProps = {
  weekdayNames: string[];
};

const StaffTable = (props: StaffTableProps) => {
  const numOfWeekdays = 7;
  const memberNames = ["A 0000", "B 1111", "C 2222", "D 3333", "E 4444"];

  return (
    <Table>
      <TableRow>
        <TableHeaderCell></TableHeaderCell>
        {props.weekdayNames.map((weekdayName) => {
          return (
            <TableHeaderCell key={weekdayName}>
              <span className="whitespace-nowrap">{weekdayName}</span>
            </TableHeaderCell>
          );
        })}
      </TableRow>
      {memberNames.map((memberName) => {
        return (
          <TableRow key={memberName}>
            <TableCell>
              <div className="p-[5px] pr-[10px]">
                <AvatarLabel name={memberName} initials={memberName[0]} />
              </div>
            </TableCell>
            {range(0, numOfWeekdays).map((index) => {
              const hasCard = Math.random() > 0.6;
              const isDefaultCard = Math.random() > 0.4;
              return (
                <TableCell key={index} hasDashedBorder>
                  <Button
                    className={clsx(
                      !hasCard && "invisible",
                      "flex outline-none bg-[#2D2D2D] w-[120px] h-[90px] rounded-[5px] p-[10px]",
                      isDefaultCard ? "bg-[#2D2D2D]" : "bg-[#CAE8DD]",
                      isDefaultCard ? "text-[#FFFFFF]" : "text-[#000000]"
                    )}
                    onPress={() => (store.board.isOpen = true)}
                  >
                    Lorem
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
        className={clsx(
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
};

const TableCell = (props: TableCellProps) => {
  return (
    <div
      className={clsx(
        "table-cell align-top text-left p-[5px] border border-[#333333]",
        props.hasDashedBorder && "border-dashed"
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
  return firstDayOfMonth.toFormat("MMMM yyyy");
};
