import { FieldControlValue } from "src/components/form/text-field";
import { ValidationRule } from "src/interfaces/field-props";

export const CommonValidationRules = {
  Min: (length: number, message?: string): ValidationRule => (value: FieldControlValue) => value != null && String(value).trim().length < length ? (message ?? `Must be at least ${length} characters.`) : null,
  Max: (length: number, message?: string): ValidationRule => (value: FieldControlValue) => value != null && String(value).trim().length > length ? (message ?? `Must be at most ${length} characters.`) : null,
  Alphanumeric: (message?: string): ValidationRule => (value: FieldControlValue) => value != null && !/^[a-zA-Z0-9]+$/.test(String(value)) ? (message ?? "Only letters and numbers are allowed.") : null,
  SpecialCharactersOnly: (message?: string): ValidationRule => (value: FieldControlValue) => value != null && !/^[^a-zA-Z0-9]+$/.test(String(value)) ? (message ?? "Only special characters are allowed.") : null,
  NumericOnly: (message?: string) : ValidationRule => (value: FieldControlValue) => value != null && !/^\d+$/.test(String(value)) ? (message ?? "Only numeric are allowed") : null,
};
