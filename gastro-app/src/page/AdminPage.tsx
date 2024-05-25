import { Link } from "react-router-dom";
import { Layout } from "./Layout";

export const AdminPage = () => {
  return (
    <Layout>
      <div className="p-4">
        <Link className="underline text-blue-600" to="/">
          back
        </Link>
        <div className="pb-4">
          <StaffTable />
        </div>
      </div>
    </Layout>
  );
};

const StaffTable = () => {
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
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
      </TableRow>
      {memberNames.map((memberName) => {
        return (
          <TableRow>
            <TableCell>
              <AvatarLabel name={memberName} initials={memberName[0]} />
            </TableCell>
            {range(0, numOfWeekdays).map((index) => {
              return <TableCell>{index + 1}</TableCell>;
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
