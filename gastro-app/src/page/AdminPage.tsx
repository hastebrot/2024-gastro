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
      <div className="p-4">
        <Link className="underline text-blue-600" to="/">
          back
        </Link>
        <div className="pb-4 flex items-center gap-2">
          <button className="underline text-blue-600" onClick={onCurrentWeekClicked}>
            current
          </button>
          <button className="underline text-blue-600" onClick={onPreviousWeekClicked}>
            prev
          </button>
          <button className="underline text-blue-600" onClick={onNextWeekClicked}>
            next
          </button>
          <div>
            {calendarMonth} (week {firstDayOfWeek.weekNumber})
          </div>
        </div>
        <StaffTable weekdayNames={weekdayNames} />
        <Tearsheet />
      </div>
    </Layout>
  );
};

type TearsheetProps = {};

const Tearsheet = (props: TearsheetProps) => {
  const isOpen = useSnapshot(store.board).isOpen;

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={(isOpen) => (store.board.isOpen = isOpen)}
      className="fixed inset-0 bg-gray-500/50"
    >
      <Modal className="fixed bottom-0 left-0 w-full z-10">
        <TearsheetContent />
      </Modal>
    </ModalOverlay>
  );
};

type TimeSelectProps = {
  startTime: string;
  endTime: string;
  timeStep: string;
};

const TimeSelect = () => {
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
  const memberNames = [
    "staff member 0000",
    "staff member 1111",
    "staff member 2222",
    "staff member 3333",
  ];

  return (
    <Table>
      <TableRow>
        <TableCell></TableCell>
        {props.weekdayNames.map((weekdayName) => {
          return <TableCell key={weekdayName}>{weekdayName}</TableCell>;
        })}
      </TableRow>
      {memberNames.map((memberName) => {
        return (
          <TableRow key={memberName}>
            <TableCell>
              <AvatarLabel name={memberName} initials={memberName[0]} />
            </TableCell>
            {range(0, numOfWeekdays).map((index) => {
              return (
                <TableCell key={index}>
                  <Button
                    className="flex outline-none w-full h-full bg-green-500"
                    onPress={() => (store.board.isOpen = true)}
                  >
                    .
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
  return (
    <div className="flex flex-row items-center gap-[5px]">
      <div className="w-[24px] h-[24px] flex items-center justify-center flex-shrink-0 rounded-full bg-slate-300">
        <span className="uppercase text-sm leading-none">{props.initials}</span>
      </div>
      <div>{props.name}</div>
    </div>
  );
};

type TableProps = {
  children?: React.ReactNode;
};

const Table = (props: TableProps) => {
  return <div className="table border-collapse border border-slate-400">{props.children}</div>;
};

type TableRowProps = {
  children?: React.ReactNode;
};

const TableRow = (props: TableRowProps) => {
  return <div className="table-row">{props.children}</div>;
};

type TableCellProps = {
  children?: React.ReactNode;
};

const TableCell = (props: TableCellProps) => {
  return <div className="table-cell p-2 border border-slate-400">{props.children}</div>;
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
