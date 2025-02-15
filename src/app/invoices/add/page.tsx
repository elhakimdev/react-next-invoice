/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { MouseEvent, useEffect, useRef, useState } from "react";
import TextField, { FieldControlRef } from "src/components/form/text-field";

import { AppPageTitle } from "src/components/app-page-title";
import { ArrowIcon } from "src/components/icons/arrow-icon";
import { CheckIcon } from "src/components/icons/check-icon";
import { ChevronUpDownIcon } from "src/components/icons/chevron-up-down-icon";
import { CommonValidationRules } from "src/utils/validation-rules/common-rules";
import { Field } from '@base-ui-components/react/field';
import { Fieldset } from '@base-ui-components/react/fieldset';
import { InvoiceStatus } from "src/interfaces/invoice-status";
import { Select } from "@base-ui-components/react";
import ToastMessage from "src/components/others/toast-message";
import { addInvoice } from "src/services/invoices/add-invoice";
import { invoiceStatusOptions } from "src/constants/invoice-status-options";

export enum AvailableStatus {
  Pending,
  Paid,
  Unpaid
}

export type StatusOptionsVal = keyof typeof AvailableStatus | string | undefined;

export interface InvoiceRequestForm {
  name: string,
  date: string,
  number: string,
  amount: string|number,
  status: StatusOptionsVal,
}

export default function AddInvoice() { 

  const [availableOptions] = useState<InvoiceStatus[]>([...invoiceStatusOptions]);
  const [newInvoice, setNewInvoice] = useState<Partial<InvoiceRequestForm>>({});
  const [isValid, setIsValid] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFieldValid, setIsFieldValid] = useState({
    name: false,
    number: false,
    date: false,
    amount: false,
  });
  const [toast, setToast] = useState<{ type: "success" | "error"; title: string, message: string; visible: boolean }>({
    type: "success",
    title: "",
    message: "",
    visible: false,
  });

  const nameInputRef = useRef<FieldControlRef>(null);
  const numberInputRef = useRef<FieldControlRef>(null);
  const dateInputRef = useRef<FieldControlRef>(null); 
  const amountInputRef = useRef<FieldControlRef>(null); 
  
  const handleChange = (value: unknown, e: Event) => {
    const { name } = (e as unknown as React.ChangeEvent<HTMLInputElement>).target;
    setNewInvoice(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: StatusOptionsVal) => {
    setNewInvoice(prev => ({ ...prev, "status": value }));
  };

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
      return;
    }
  
    setIsFieldValid((prev) => {
      const updatedFields = {
        ...prev,
        "name": nameInputRef.current?.isValid() as boolean,
        "number": numberInputRef.current?.isValid() as boolean,
        "date": dateInputRef.current?.isValid() as boolean,
        "amount": amountInputRef.current?.isValid() as boolean,
      };
      setIsValid(Object.values(updatedFields).every(Boolean));
  
      return updatedFields;
    });
  
  }, [isMounted, newInvoice]);

  const handleOnClickAddInvoice = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) =>  {
    e.preventDefault();
    setIsSaving(true);
    try {
      await addInvoice(newInvoice);
      showSuccess();
    } catch (error) {
      showError();
    } finally {
      setIsSaving(false);
    }
  }

  const showSuccess = () => {
    setToast({ type: "success", title: "Invoice added successfully!", message: "You can view and manage your invoice in the 'My Invoices' section.", visible: true });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
  };

  const showError = () => {
    setToast({ type: "error", title:"", message: "Failed to add invoice. Try again later!", visible: true });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
  };
  
  return (
    <div>
      <AppPageTitle title="Add Invoice"/>
      <div className="bg-white w-[1000px] min-h-[500px] rounded-md shadow-md border-gray-200 border flex flex-col">
        <div className="border-b border-[#E2E8F0] p-[26px] text-[#1C2434] font-semibold">
          Invoice Form
        </div>
        <Fieldset.Root className={"grid grid-cols-2 grid-rows-3 p-[26px] gap-x-[36px] gap-y-[18px]"}>
          <TextField 
            id="name"
            name="name"
            label="Invoice Name"
            type="text"
            ref={nameInputRef}
            placeholder="Enter your invoice name"
            required={true}
            value={newInvoice.name}
            onValueChange={(val: unknown, e: Event) => handleChange(val, e)}
            rules={[
              CommonValidationRules.Alphanumeric(),
              CommonValidationRules.Min(5),
              CommonValidationRules.Max(20),
            ]}
          />
          <TextField 
            id="number"
            name="number"
            label="Invoice Number"
            type="text"
            ref={numberInputRef}
            placeholder="Enter your invoice number"
            required={true}
            value={newInvoice.number}
            mask="INV/99/99/9999/9999999999-99"
            onValueChange={(val: unknown, e: Event) => handleChange(val, e)}
          />
          <TextField 
            id="date"
            name="date"
            label="Invoice date"
            type="text"
            ref={dateInputRef}
            placeholder="DD/MM/YYYY"
            mask="99/99/9999"
            required={true}
            value={newInvoice.date}
            onValueChange={(val: unknown, e: Event) => handleChange(val, e)}
          />
          <TextField 
            id="amount"
            name="amount"
            label="Amount (Rp.)"
            type="text"
            ref={amountInputRef}
            placeholder="Rp. 999.999.999,99"
            mask="Rp. 999.999.999,99"
            required={true}
            value={newInvoice.amount}
            onValueChange={(val: unknown, e: Event) => handleChange(val, e)}
          />
          <Field.Root name="status">
            <Field.Label className="text-sm font-medium text-gray-600">
              Status <span className="text-red-600">*</span>
            </Field.Label>
            <div className="mt-[12px]">
              <Select.Root onValueChange={(val) => handleStatusChange(val as string)}>
                <Select.Trigger className="flex h-10 min-w-36 items-center justify-between gap-3 rounded-md border border-gray-200 pr-3 pl-3.5 text-base text-gray-600 select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100 data-[popup-open]:bg-gray-100">
                  <Select.Value placeholder="Please chose status" />
                  <Select.Icon className="flex">
                    <ChevronUpDownIcon />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Positioner className="outline-none" sideOffset={8}>
                    <Select.Popup className="group origin-[var(--transform-origin)] rounded-md bg-[canvas] py-1 text-gray-600 shadow-lg shadow-gray-200 outline outline-1 outline-gray-200 transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[ending-style]:transition-none data-[starting-style]:scale-90 data-[starting-style]:opacity-0 data-[side=none]:data-[starting-style]:scale-100 data-[side=none]:data-[starting-style]:opacity-100 data-[side=none]:data-[starting-style]:transition-none dark:shadow-none dark:-outline-offset-1 dark:outline-gray-300">
                      <Select.Arrow className="data-[side=bottom]:top-[-8px] data-[side=left]:right-[-13px] data-[side=left]:rotate-90 data-[side=right]:left-[-13px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-8px] data-[side=top]:rotate-180">
                        <ArrowIcon />
                      </Select.Arrow>
                      {
                        availableOptions.map((option) => {
                          return (
                            <Select.Item
                              key={option.key}
                              className="grid min-w-[var(--anchor-width)] cursor-pointer grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pr-4 pl-2.5 text-sm leading-4 outline-none select-none group-data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)] group-data-[side=none]:pr-12 group-data-[side=none]:text-base group-data-[side=none]:leading-4 data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-700 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-200"
                              value={option.value}
                            >
                              <Select.ItemIndicator className="col-start-1">
                                <CheckIcon className="size-3" />
                              </Select.ItemIndicator>
                              <Select.ItemText className="col-start-2">{option.text}</Select.ItemText>
                            </Select.Item>
                          )
                        })
                      }
                    </Select.Popup>
                  </Select.Positioner>
                </Select.Portal>
              </Select.Root>
            </div>
            <Field.Error className="text-sm text-red-800" />
          </Field.Root>
        </Fieldset.Root>
        <div className="flex justify-end flex-row p-[26px]">
          <button 
            className={`bg-[#3C50E0] text-white rounded-sm w-[259px] h-[50px] p-[13px] px-[30px] py-[13px] hover:cursor-pointer 
              disabled:bg-gray-200 disabled:text-gray-900 disabled:cursor-not-allowed`}
              disabled={!isValid || isSaving}
              
              onClick={(e) => handleOnClickAddInvoice(e)}
          >
            {isSaving ? 'Saving...' : '+ Add Invoice'} 
          </button>
        </div>
      </div>
      
      {/* Toaster */}
      <ToastMessage 
        type={toast.type} 
        title={toast.title}
        message={toast.message} 
        visible={toast.visible} 
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))} 
      />
    </div>
  );
}