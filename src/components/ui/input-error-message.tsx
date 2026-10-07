import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface IProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  msg?: string;
}
const InputErrorMessage = ({ msg, className, ...props }: IProps) => {
  return msg ? (
    <span
      role="alert"
      className={cn("block pt-2 text-sm font-normal text-red-700", className)}
      {...props}
    >
      {msg}
    </span>
  ) : null;
};

export default InputErrorMessage;
