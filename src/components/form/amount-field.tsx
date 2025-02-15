import { CommonFieldProps } from "src/interfaces/field-props";
import { Field } from "@base-ui-components/react";
export default function AmountField ({
  name,
  label,
  type,
  value,
  currencyPrefix,
  onValueChange,
} : CommonFieldProps & {
  currencyPrefix: string
}) {
  return (
    <Field.Root name={name}>
      <Field.Label className="text-sm font-medium text-gray-600">
        {label} <span className="text-red-600">*</span>
      </Field.Label>
      <div className="flex flex-row items-center mt-[12px]">
        <div className="w-[81px] h-10 flex items-center justify-center px-3 bg-slate-100 text-[#64748B] border-gray-200 border-t border-b border-l rounded-l-md">{currencyPrefix}</div>
        <Field.Control
          type={type}
          required
          placeholder="Enter your invoice amount"
          value={value ?? ""}
          onValueChange={(val, e) => onValueChange?.(val, e)}
          className="h-10 w-full rounded-r-md border-t border-b border-r border-gray-200 pl-3.5 text-base text-gray-600 focus:outline focus:outline-2 focus:-outline-offset-1 focus:outline-slate-300 transition-all ease-in-out duration-300"
        />
      </div>
      <Field.Error className="text-sm text-red-800" />
    </Field.Root>
  )
}