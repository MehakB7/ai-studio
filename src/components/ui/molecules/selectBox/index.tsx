import { Select, SelectValue } from "@/components/ui/select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import React from "react";
import { SelectBoxProps } from "./type";
import { Label } from "@/components/ui/label";

const SelectBox = ({ options, placeholder, className, error, errorMessage, value, onValueChange, testId, id}: SelectBoxProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}   >
      <SelectTrigger className={className} data-testid={testId}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent id="select">
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className={option.className}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
      {error && (
        <p className="mt-0.5 text-sm text-color-danger dark:text-color-danger-dark" data-cy={`${name}-error`}>
          {errorMessage}
        </p>
      )}
    </Select>
  );
};

export default SelectBox;
