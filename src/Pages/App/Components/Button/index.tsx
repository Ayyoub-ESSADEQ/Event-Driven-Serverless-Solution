import { ReactNode } from "react";

interface ButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Button(props: Readonly<ButtonProps>) {
  return (
    <div
      {...props}
      className="button-3d bg-white rounded-md flex hover:cursor-pointer  size-10 items-center justify-center"
    >
      {props?.children}
    </div>
  );
}
