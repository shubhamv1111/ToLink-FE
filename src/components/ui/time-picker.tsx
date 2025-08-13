"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ScrollArea } from "./scroll-area";
import { cn } from "@/lib/utils";

type TimePickerProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /**
   * When true, shows 12-hour selection with AM/PM and returns a 24h value string (HH:mm)
   */
  use12Hour?: boolean;
};

const HOURS_12 = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
const MERIDIEM = ["AM", "PM"] as const;

function toDisplay12h(value: string | undefined): { hour?: string; minute?: string; meridiem?: "AM" | "PM" } {
  if (!value) return {};
  const [hh, mm] = value.split(":");
  if (hh == null || mm == null) return {};
  const hourNum = Number(hh);
  const isPM = hourNum >= 12;
  const normalized = hourNum % 12 === 0 ? 12 : hourNum % 12;
  const hourStr = String(normalized).padStart(2, "0");
  return { hour: hourStr, minute: mm, meridiem: isPM ? "PM" : "AM" };
}

function to24hString(hour?: string, minute?: string, meridiem?: "AM" | "PM"): string | "" {
  if (!hour || !minute || !meridiem) return "";
  let h = Number(hour);
  if (meridiem === "AM") {
    h = h % 12; // 12 AM -> 0
  } else {
    h = h % 12 + 12; // 12 PM -> 12
  }
  return `${String(h).padStart(2, "0")}:${minute}`;
}

export function TimePicker({ value, onChange, placeholder = "Pick time", disabled, className, use12Hour = true }: TimePickerProps) {
  const initial = useMemo(() => toDisplay12h(value), [value]);
  const [open, setOpen] = useState(false);
  const [hour, setHour] = useState<string | undefined>(initial.hour);
  const [minute, setMinute] = useState<string | undefined>(initial.minute);
  const [meridiem, setMeridiem] = useState<"AM" | "PM" | undefined>(initial.meridiem);

  useEffect(() => {
    const parsed = toDisplay12h(value);
    setHour(parsed.hour);
    setMinute(parsed.minute);
    setMeridiem(parsed.meridiem);
  }, [value]);

  useEffect(() => {
    if (!use12Hour) return; // not implemented 24h UI here
    const updated = to24hString(hour, minute, meridiem);
    if (updated) onChange(updated);
  }, [hour, minute, meridiem]);

  const label = useMemo(() => {
    if (use12Hour) {
      if (hour && minute && meridiem) return `${hour}:${minute} ${meridiem}`;
      return placeholder;
    }
    return value || placeholder;
  }, [use12Hour, hour, minute, meridiem, value, placeholder]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn("w-full justify-start font-normal", className)}
        >
          <Clock className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="grid grid-cols-3 gap-0 p-1">
          <TimeList
            values={HOURS_12}
            selected={hour}
            onSelect={setHour}
            ariaLabel="Hours"
          />
          <TimeList
            values={MINUTES}
            selected={minute}
            onSelect={setMinute}
            ariaLabel="Minutes"
          />
          <TimeList
            values={MERIDIEM as unknown as string[]}
            selected={meridiem}
            onSelect={(v) => setMeridiem((v as "AM" | "PM") || undefined)}
            ariaLabel="AM/PM"
          />
        </div>
        <div className="flex items-center justify-between border-t p-1.5">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setHour(undefined);
              setMinute(undefined);
              setMeridiem(undefined);
              onChange("");
            }}
          >
            Clear
          </Button>
          <Button
            type="button"
            onClick={() => setOpen(false)}
          >
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

type TimeListProps = {
  values: string[];
  selected?: string;
  onSelect: (value: string | undefined) => void;
  ariaLabel: string;
};

function TimeList({ values, selected, onSelect, ariaLabel }: TimeListProps) {
  return (
    <ScrollArea className="h-60 w-16">
      <ul aria-label={ariaLabel} className="divide-y">
        {values.map((val) => (
          <li key={val}>
            <button
              type="button"
              className={cn(
                "w-full px-1.5 py-1.5 text-center text-sm hover:bg-accent hover:text-accent-foreground",
                selected === val && "bg-accent text-accent-foreground"
              )}
              onClick={() => onSelect(val)}
            >
              {val}
            </button>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}

export default TimePicker;


