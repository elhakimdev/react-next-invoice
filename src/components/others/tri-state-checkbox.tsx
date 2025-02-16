'use client';

import { forwardRef, useEffect, useState } from 'react';

import { Checkbox } from '@base-ui-components/react';

export type CheckboxState = 'checked' | 'unchecked' | 'indeterminate';
export interface TriStateCheckboxProps {
  state?: CheckboxState;
  indeterminated?: boolean;
  onChange?: (state: CheckboxState) => void;
}

export const TriStateCheckbox = forwardRef<
  HTMLInputElement,
  TriStateCheckboxProps
>(({ state, indeterminated = false, onChange }, ref) => {
  useEffect(() => {
    if (ref && 'current' in ref && ref.current) {
      ref.current.indeterminate = state === 'indeterminate';
    }
  }, [state, ref]);

  const handleClick = () => {
    let nextState: CheckboxState;

    if (indeterminated) {
      // Tri-state cycle: unchecked → checked → indeterminate → unchecked
      nextState =
        state === 'unchecked'
          ? 'checked'
          : state === 'checked'
          ? 'indeterminate'
          : 'unchecked';
    } else {
      // Bi-state cycle: unchecked ↔ checked
      nextState = state === 'unchecked' ? 'checked' : 'unchecked';
    }

    onChange?.(nextState);
  };

  return (
    <Checkbox.Root
      checked={state === 'checked'}
      indeterminate={state === 'indeterminate'}
      onCheckedChange={handleClick}
      className={`flex size-4 items-center justify-center rounded-sm outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800
        data-[checked]:bg-gray-900 data-[unchecked]:border data-[unchecked]:border-gray-400 data-[indeterminate]:bg-gray-900`}
    >
      {state !== 'unchecked' && (
        <Checkbox.Indicator>
          {state === 'checked' && (
            <CheckIcon checkBoxStyle="size-4 text-white" />
          )}
          {state === 'indeterminate' && (
            <MinusIcon checkBoxStyle="size-4 text-white" />
          )}
        </Checkbox.Indicator>
      )}
    </Checkbox.Root>
  );
});

TriStateCheckbox.displayName = 'TriStateCheckbox';

const CheckIcon = ({
  checkBoxStyle = 'size-6',
}: {
  checkBoxStyle?: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      strokeWidth={4}
      className={checkBoxStyle}
    >
      <path
        fillRule="evenodd"
        d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

const MinusIcon = ({
  checkBoxStyle = 'size-6',
}: {
  checkBoxStyle?: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      strokeWidth={2}
      className={checkBoxStyle}
    >
      <path
        fillRule="evenodd"
        d="M4.25 12a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default TriStateCheckbox;
