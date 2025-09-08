import type { RadioFieldProps } from "@type/ui";
import React from "react";


const RadioField: React.FC<RadioFieldProps> = ({
  children,
  className = "",
}) => {
  return (
    <label
      className={["inline-flex items-center p-2 cursor-pointer", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </label>
  );
};

export default RadioField;
