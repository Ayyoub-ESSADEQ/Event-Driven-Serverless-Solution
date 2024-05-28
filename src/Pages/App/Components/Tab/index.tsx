import { ReactNode } from "react";

interface TabProps {
  children: ReactNode;
  active?: boolean;
}

export function Tab(props: Readonly<TabProps>) {
  const activeStyle = props.active
    ? "border-t border-x"
    : "border-b opacity-50";

  return (
    <div
      className={`${activeStyle} flex gap-2 bg-white flex-row items-center flex-grow text-[22px] px-2 py-2 rounded-tr-lg `}
    >
      {props.children}
    </div>
  );
}
