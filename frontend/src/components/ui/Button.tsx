import React from "react";
import clsx from "clsx";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  light?: boolean;
  submit?: boolean;
  inverted?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, className, onClick, light, submit, inverted, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={submit ? "submit" : "button"}
      className={clsx(
        "relative flex items-center justify-center px-5 py-2.5 border rounded-lg font-inter font-medium text-[16px] leading-[20px] transition",
        {
          // Default Dark Theme (for dark backgrounds)
          "border-[#003F8C] bg-[#003F8C]/50 text-white shadow-[inset_0px_0px_12px_rgba(255,255,255,0.24)] hover:bg-blue-600 hover:border-blue-600 hover:text-white":
            !light && !inverted,

          // Light Theme (for light backgrounds)
          "border-blue-400 text-blue-600 hover:bg-blue-600 hover:text-white": light,

          // Inverted Theme (opposite of light)
          "bg-blue-600 text-white hover:bg-transparent hover:text-blue-600 hover:border-blue-600": inverted,

          // Disabled state
          "pointer-events-none opacity-50": disabled,
        },
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
