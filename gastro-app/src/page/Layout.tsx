type LayoutProps = {
  children?: React.ReactNode;
};

export const Layout = (props: LayoutProps) => {
  return (
    <div className="min-h-dvh font-sans grid font-light text-[15px] leading-[20px]">
      {props.children}
    </div>
  );
};
