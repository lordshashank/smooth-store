"use client";
import { Tooltip } from "react-tooltip";

export default function TooltipAdd() {
  return (
    <Tooltip
      place="right"
      id="tooltip"
      className="tooltip-display"
      render={({ content }) => {
        return (
          <div>
            <p>{content}</p>
          </div>
        );
      }}
      opacity={1}
      style={{
        backgroundColor: "var(--bg-primary)",
        color: "var(--clr-primary)",
      }}
    />
  );
}
