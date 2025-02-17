/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { Field, Select } from '@base-ui-components/react';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

import { ArrowIcon } from '../icons/arrow-icon';
import { CheckIcon } from '../icons/check-icon';
import { ChevronUpDownIcon } from '../icons/chevron-up-down-icon';

export interface ShowEntryOption {
  key: string;
  value: number;
  text: string;
}

export interface DatatableShowEntriesProps {
  entries: ShowEntryOption[];
  value: number;
  defaultValue: number;
  onValueChange: ((value: number, event?: Event) => void) | undefined;
}

export interface DatatableShowEntriesRef {
  setEntries: (value: number) => void;
}

const DatatableShowEntries = forwardRef<
  DatatableShowEntriesRef,
  DatatableShowEntriesProps
>(({ entries, value, defaultValue, onValueChange }, ref) => {
  const [selectedEntries, setSelectedEntries] = useState(value || defaultValue);

  useImperativeHandle(ref, () => ({
    setEntries: (value: number) => setSelectedEntries(value),
  }));

  const handleOnValueChange = (val: number, event?: Event) => {
    setSelectedEntries((prev) => val);
    onValueChange?.(val, event);
  };

  return (
    <Field.Root name="pageOptions">
      <div className="my-[24px]">
        <Select.Root
          defaultValue={selectedEntries}
          value={selectedEntries}
          onValueChange={handleOnValueChange}
        >
          <Select.Trigger className="flex h-10 items-center justify-between gap-3 rounded-md bg-white shadow-sm border border-gray-200 pr-3 pl-3.5 text-base text-gray-600 select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100 data-[popup-open]:bg-gray-100">
            <Select.Value placeholder="Show entries" />
            <Select.Icon className="flex">
              <ChevronUpDownIcon />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner className="outline-none z-50" side="bottom" sideOffset={8}>
              <Select.Popup className="group origin-top rounded-md bg-[canvas] py-1 text-gray-600 shadow-lg shadow-gray-200 outline outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[ending-style]:transition-none data-[starting-style]:scale-90 data-[starting-style]:opacity-0 data-[side=bottom]:scale-100 data-[side=bottom]:opacity-100 dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
                <Select.Arrow className="top-[-8px]">
                  <ArrowIcon />
                </Select.Arrow>
                {entries.map((option) => (
                  <Select.Item
                    key={option.key}
                    className="grid min-w-[var(--anchor-width)] cursor-pointer grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pr-4 pl-2.5 text-sm leading-4 outline-none select-none group-data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)] group-data-[side=none]:pr-12 group-data-[side=none]:text-base group-data-[side=none]:leading-4 data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-700 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-200"
                    value={option.value}
                  >
                    <Select.ItemIndicator className="col-start-1">
                      <CheckIcon className="size-3" />
                    </Select.ItemIndicator>
                    <Select.ItemText className="col-start-2">
                      {option.text}
                    </Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      </div>
      <Field.Error className="text-sm text-red-800" />
    </Field.Root>
  );
});

DatatableShowEntries.displayName = 'DatatableShowEntriesComponent';

export default DatatableShowEntries;
