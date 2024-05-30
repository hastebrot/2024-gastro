import clsx from "clsx";

type LayoutProps = {
  children?: React.ReactNode;
};

export const Layout = (props: LayoutProps) => {
  return (
    <div
      className={clsx(
        "min-h-[100vh] font-sans grid font-light text-[15px] leading-[20px]",
        "supports-[-webkit-touch-callout:none]:min-h-[-webkit-fill-available]"
      )}
    >
      {props.children}
    </div>
  );
};
