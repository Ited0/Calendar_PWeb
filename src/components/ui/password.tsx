import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { InputHTMLAttributes, forwardRef, useState } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputClassName?: string | undefined;
}

const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputClassName, ...props }, ref) => {
    const [show, setShow] = useState(false);

    const handleToggle = () => {
      setShow(show => !show);
   }
    
    return (
      <div className={
        cn(
          "flex relative",
          className
        )
      }>
        <input
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            inputClassName
          )}
          ref={ref}
          {...props}
          type={show ? "text" : "password"}
        />
        <span className="flex justify-around items-center cursor-pointer" onClick={handleToggle}>
          { show ? <Eye className="absolute mr-10" /> : <EyeOff className="absolute mr-10"/>}
        </span>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
