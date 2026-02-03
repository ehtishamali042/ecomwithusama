declare module "formik" {
  import * as React from "react";

  export function useField(
    name: string | { name: string; type?: string },
  ): [any, any, any];

  export interface FormikConfig<Values> {
    initialValues: Values;
    validationSchema?: any;
    onSubmit: (values: Values, helpers?: any) => void;
    enableReinitialize?: boolean;
    children?: React.ReactNode | ((props: any) => React.ReactNode);
  }

  export class Formik<Values = any> extends React.Component<
    FormikConfig<Values>
  > {}

  export const Form: React.FC<any>;

  export type FormikProps<T> = any;

  export default Formik;
}
