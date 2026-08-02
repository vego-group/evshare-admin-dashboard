"use client";

import { forwardRef } from "react";
import { Lock, Mail } from "lucide-react";
import InputErrorMessage from "@/components/ui/input-error-message";
import { cn } from "@/lib/utils";

interface LoginFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  error?: string;
}

const LoginField = forwardRef<HTMLInputElement, LoginFieldProps>(
  ({ id, label, type = "text", error, className, ...props }, ref) => {
    const hasError = Boolean(error);

    return (
      <div>
        {label ? (
          <label
            htmlFor={id}
            className="mb-1.5 block text-right text-xs font-medium text-secondary"
          >
            {label}
          </label>
        ) : null}

        <div
          className={cn(
            "flex h-10 items-center gap-2 rounded-lg border border-[#dbe4ef] bg-[#eef3fb] px-3 transition",
            hasError && "border-red-400",
          )}
        >
          <input
            id={id}
            ref={ref}
            type={type}
            className={cn(
              "h-full w-full border-none bg-transparent text-right text-sm text-secondary placeholder:text-gray-400 focus:outline-none",
              className,
            )}
            {...props}
          />

          {type === "password" ? (
            <Lock className="size-4 shrink-0 text-gray-400" />
          ) : (
            <Mail className="size-4 shrink-0 text-gray-400" />
          )}
        </div>

        <InputErrorMessage msg={error} />
      </div>
    );
  },
);

LoginField.displayName = "LoginField";

export default LoginField;
