import { DateTime, Interval } from "luxon";
import { Link } from "react-router-dom";
import { Layout } from "./Layout";

export const AdminPage = () => {
  const firstCalendarDay = toFirstDayOfMonth(2024, 5);
  const calendarDays = toCalendarDays(firstCalendarDay);
  const calendarMonth = formatCalendarMonth(firstCalendarDay);
  const weekdayNames = calendarDays.slice(0, 7).map((calendarDay) => {
    return formatCalendarDay(calendarDay).weekdayName;
  });

  return (
    <Layout>
      <div className="p-4">
        <Link className="underline text-blue-600" to="/">
          back
        </Link>
        <div className="pb-4">
          <div>{calendarMonth}</div>
          <StaffTable weekdayNames={weekdayNames} />
        </div>
      </div>
    </Layout>
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
              return <TableCell key={index}>{index + 1}</TableCell>;
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

const range = (start: number, end: number): number[] => {
  return [...Array(end - start).keys()].map((index) => start + index);
};

const toFirstDayOfMonth = (year: number, month: number, locale = "en-US") => {
  return DateTime.fromObject({ year, month, day: 1 }).setLocale(locale);
};

const toCalendarDays = (firstDayOfMonth: DateTime, weekdayOffset = 0) => {
  const startDate = firstDayOfMonth.startOf("month").startOf("week").plus({ days: weekdayOffset });
  const endDate = firstDayOfMonth.endOf("month").endOf("week").plus({ days: weekdayOffset });
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

const throwError = (message: string): never => {
  throw new Error(message);
};
