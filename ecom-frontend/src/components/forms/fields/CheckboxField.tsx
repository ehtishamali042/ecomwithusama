import React from "react";
import { useField } from "formik";
import { Checkbox } from "@/components/ui/checkbox";

type Props = React.ComponentProps<typeof Checkbox> & {
  label?: string;
  name: string;
  helperText?: string;
};

export default function CheckboxField({ label, helperText, ...props }: Props) {
  const [field, meta] = useField({ name: props.name, type: "checkbox" });

  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <span className="label-text">{label}</span>
        <Checkbox {...field} {...props} />
      </label>
      {meta.touched && meta.error ? (
        <p className="text-sm text-error mt-1">{meta.error}</p>
      ) : helperText ? (
        <p className="text-sm text-muted mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}
