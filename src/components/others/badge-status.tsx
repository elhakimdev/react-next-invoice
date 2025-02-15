/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import React from "react";
import { StatusOptionsVal } from "src/app/invoices/add/page";
import clsx from "clsx";

interface BadgeProps {
  status: StatusOptionsVal;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  return (
    <span
      className={clsx(
        "px-2 py-[3px] text-[12px] font-base rounded-full",
        {
          "bg-yellow-100 text-yellow-800 border border-yellow-300": status === "pending",
          "bg-green-100 text-green-800 border border-green-300": status === "paid",
          "bg-red-100 text-red-800 border border-red-300": status === "unpaid",
        }
      )}
    >
      {status?.charAt?.(0).toUpperCase?.()! + status?.slice(1)}
    </span>
  );
};