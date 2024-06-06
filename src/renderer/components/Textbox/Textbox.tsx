import React from "react";
import styles from "./Textbox.module.scss";

const Textbox = React.forwardRef<
  HTMLInputElement,
  React.HTMLAttributes<HTMLInputElement> & { placeholder?: string }
>((props, ref) => {
  return (
    <input
      {...props}
      ref={ref}
      className="bg-gray-800 p-2 rounded-lg border border-gray-700"
    />
  );
});

export default Textbox;
