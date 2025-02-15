/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ElementRef, FocusEvent, forwardRef, useImperativeHandle, useRef, useState } from "react";
import { applyMask, extractRawValue } from "src/utils/masking/apply-mask";

import { BaseUIEvent } from "node_modules/@base-ui-components/react/esm/utils/types";
import { CommonFieldProps } from "src/interfaces/field-props";
import { Field } from "@base-ui-components/react";
import clsx from "clsx";

export type FieldControlValue = string | number | readonly string[] | unknown | undefined;
export type FieldControlRef = {
  focus: () => void;
  blur: () => void;
  clear: () => void;
  isValid: () => boolean;
  isDirty: () => boolean;
  isTouched: () => boolean;
  getValue: () => string;
  root: React.ElementRef<typeof Field.Root>;
  control: React.ElementRef<typeof Field.Control>;
  label: React.ElementRef<typeof Field.Label>;
  error: React.ElementRef<typeof Field.Error>;
}


const TextField = forwardRef<FieldControlRef, CommonFieldProps & { [key: string]: unknown }>(
  ({ id, type, label, name, required, placeholder, value, onValueChange, onBlur, validationMode, rules, mask, ...props }, ref) => {
    
    // State
    const [error, setError] = useState<string | null>(null);
    const [maskedValue, setMaskedValue] = useState(value ? String(value) : "");
    const [isDirty, setIsDirty] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    
    // Refs to expose actual component types
    const rootRef = useRef<React.ElementRef<typeof Field.Root>>(null);
    const controlRef = useRef<React.ElementRef<typeof Field.Control>>(null);
    const labelRef = useRef<React.ElementRef<typeof Field.Label>>(null);
    const errorRef = useRef<React.ElementRef<typeof Field.Error>>(null);

    // Expose composition as internal state
    useImperativeHandle(ref, () => ({
      focus: () => controlRef.current?.focus(),
      blur: () => controlRef.current?.blur(),
      clear: () => {
        setIsDirty(false);
        setIsTouched(false);
        setMaskedValue("");
        setError(null);
        onValueChange?.("", new Event("clear"));
      },
      isValid: () => (isDirty || isTouched) && !error,
      isDirty: () => isDirty,
      isTouched: () => isTouched,
      getValue: () => maskedValue,
      root: rootRef.current!,
      control: controlRef.current!,
      label: labelRef.current!,
      error: errorRef.current!,
    }));

    let errorMessage: string | null = null;
    
    const validate = (val: FieldControlValue) => {
      // If field is required.
      if(required) {
        if(String(val).trim().length === 0) {
          setError(`This ${label} is Required`);
          return error;
        }
      }

      // If field contains rules.
      if (rules) {
        for (const rule of rules) {
          const error = rule(val)!;
          if (error) {
            errorMessage = error;
            setError(errorMessage);
            return error;
          }
        }
      }
      
      setError(null);
      return null;
    };

    const handleOnValueChange = (value: any, event: Event) => {
      const rawValue = value;
      
      const input = (event as unknown as React.ChangeEvent<HTMLInputElement>).target;
      const cursorPosition = input?.selectionStart ?? rawValue.length;
      
      const { maskedValue, newCursorPosition } = mask ? applyMask(rawValue, mask, cursorPosition) : {
        maskedValue: rawValue,
        newCursorPosition: cursorPosition 
      };

      const valueToValidate = extractRawValue(rawValue, mask);

      validate(valueToValidate);
      setIsDirty(true);
      setMaskedValue(maskedValue);
      onValueChange?.(maskedValue, event);

      // Restore the cursor position after masking
      requestAnimationFrame(() => {
        if (input) {
          const finalPosition = Math.min(newCursorPosition, maskedValue.length);
          input.setSelectionRange(finalPosition, finalPosition);
        }
      });
    };

    const handleOnBlurValue = (e: BaseUIEvent<FocusEvent<HTMLInputElement, Element>>) => {
      setIsTouched(true);
      validate(e.target.value);
      onBlur?.(e);
    }
    
    return (
      <Field.Root
        ref={rootRef}
        name={name}
        id={`${id}-field-root`}
        {...props}
        className={clsx(
          "relative flex flex-col gap-1",
          "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed",
          "data-[valid]:border-green-500 data-[invalid]:border-red-500"
        )}
        validate={validate}
        validationMode={validationMode ?? "onChange"}
      >
        <Field.Label
          ref={labelRef}
          id={`${id}-field-label`}
          className="text-sm font-medium text-gray-700 transition-all data-[disabled]:text-gray-400"
        >
          {label} {required && <span className="text-red-600">*</span>}
        </Field.Label>

        <Field.Control
          ref={controlRef}
          id={`${id}-field-control`}
          type={type}
          required={required}
          placeholder={placeholder ?? "Enter value"}
          value={maskedValue}
          onBlur={(event) => {
            handleOnBlurValue(event)
          }}
          onValueChange={(val, e) => {
            handleOnValueChange(val, e)
          }}
          className={clsx(
            "h-10 w-full rounded-md border pl-3.5 text-sm text-gray-600 transition-all duration-300 ease-in-out mt-3",
            "border-gray-300 shadow-inner bg-white outline-none", // Ensure no outline shifts
          
            // Disabled State
            "data-[disabled]:bg-gray-100 data-[disabled]:text-gray-400",
          
            // Default State (Gray)
            "focus:ring-[0.5px] focus:border-transparent focus:ring-gray-400 focus:bg-gray-50 focus:shadow-sm",
          
            // Error State (Red)
            "data-[invalid]:border-red-500 data-[invalid]:focus:border-red-500 data-[invalid]:focus:ring-[0.5px] focus:border-transparent data-[invalid]:focus:ring-red-400",
            "data-[invalid]:focus:text-red-700 data-[invalid]:focus:shadow-red-100 data-[invalid]:text-red-600",
          
            // Valid State (Green)
            "data-[valid]:border-green-500 data-[valid]:focus:border-green-500 data-[valid]:focus:ring-[0.5px] focus:border-transparent data-[valid]:focus:ring-green-400",
            "data-[valid]:focus:text-green-700 data-[valid]:focus:shadow-green-100 data-[valid]:text-green-600"
          )}
        />

        {/* Smooth Error Transition */}
        <div className="relative min-h-[20px] overflow-hidden">
          <Field.Error
            ref={errorRef}
            id={`${id}-field-error`}
            className={clsx(
              "absolute left-0 top-0 text-sm text-red-600 transition-all duration-50 ease-in-out",
              error
                ? "opacity-100 transform translate-y-0 max-h-[20px]"
                : "opacity-0 transform translate-y-[-10px] max-h-0"
            )}
          >
            {error}
          </Field.Error>
        </div>
      </Field.Root>
    );
  }
);

TextField.displayName = "TextField";

export default TextField;
