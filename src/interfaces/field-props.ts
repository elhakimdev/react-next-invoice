import { FieldControl } from "node_modules/@base-ui-components/react/esm/field/control/FieldControl";
import { FieldLabel } from "node_modules/@base-ui-components/react/esm/field/label/FieldLabel";
import { FieldRoot } from "node_modules/@base-ui-components/react/esm/field/root/FieldRoot";

export type FieldRootProps = FieldRoot.Props;
export type FieldLabelProps = FieldLabel.Props;
export type FieldControlProps = FieldControl.Props;

export type ValidationRule = (val: string | number | readonly string[] | unknown | undefined) => string | null | undefined;

export type CommonFieldProps = FieldRootProps & FieldLabelProps & FieldControlProps & {
  id: string,
  label: string,
  rules: ValidationRule[],
  mask: string
};