import React from "react";
import { useField } from "formik";
import { Select } from "@/components/ui/select";

type Props = React.ComponentProps<typeof Select> & {
  label?: string;
  name: string;
  helperText?: string;
};

export default function SelectField({
  label,
  helperText,
  children,
  ...props
}: Props) {
  const [field, meta] = useField(props.name);

  return (
    <div className="form-control w-full">
      {label ? (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      ) : null}
      <Select {...field} {...props}>
        {children}
      </Select>
      {meta.touched && meta.error ? (
        <p className="text-sm text-error mt-1">{meta.error}</p>
      ) : helperText ? (
        <p className="text-sm text-muted mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}
