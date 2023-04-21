import React from "react";

export function Grid({ children, columns }) {
  return (
    <div
      className={`sm:grid grid-cols-${columns} gap-x-0 gap-y-8 sm:gap-8 md:gap-12 lg:gap-16 items-center pb-12`}
    >
      {children}
    </div>
  );
}
