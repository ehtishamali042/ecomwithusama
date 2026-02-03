import React from "react";
import { useField } from "formik";
import { Switch } from "@/components/ui/switch";

type Props = React.ComponentProps<typeof Switch> & {
  label?: string;
  name: string;
  helperText?: string;
};

export default function SwitchField({ label, helperText, ...props }: Props) {
  const [field, meta] = useField({ name: props.name, type: "checkbox" });

  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <span className="label-text">{label}</span>
        <Switch {...field} {...props} />
      </label>
      {meta.touched && meta.error ? (
        <p className="text-sm text-error mt-1">{meta.error}</p>
      ) : helperText ? (
        <p className="text-sm text-muted mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}
