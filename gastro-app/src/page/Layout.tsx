type LayoutProps = {
  children?: React.ReactNode;
};

export const Layout = (props: LayoutProps) => {
  return <div className="min-h-dvh font-sans grid">{props.children}</div>;
};
