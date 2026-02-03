import { useMemo } from "react";
import { Formik, Form } from "formik";
import { Button } from "@/components/ui/button";
import TextField from "@/components/forms/fields/TextField";
import TextAreaField from "@/components/forms/fields/TextAreaField";
import SelectField from "@/components/forms/fields/SelectField";
import { stockInitialValues, stockValidationSchema } from "../validation";
import type { StockFormValues, StockPayload } from "../types";

type Props = {
  initialValues?: Partial<StockPayload>;
  onSubmit: (values: StockFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
};

function normalizeInitial(
  vals: Partial<StockPayload>,
): Partial<StockFormValues> {
  return {
    ...vals,
    // form expects marketplace as single string (select value)
    marketplace: Array.isArray(vals.marketplace)
      ? vals.marketplace[0] || ""
      : ((vals.marketplace ?? "") as string),
    tags: Array.isArray(vals.tags) ? vals.tags.join(", ") : vals.tags || "",
    mainImageFile: undefined,
  };
}

export default function StockForm({
  initialValues = {},
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save",
}: Props) {
  const initial = useMemo(
    () => ({ ...stockInitialValues, ...normalizeInitial(initialValues) }),
    [initialValues],
  );

  return (
    <Formik<StockFormValues>
      initialValues={initial}
      validationSchema={stockValidationSchema}
      enableReinitialize
      onSubmit={(vals: StockFormValues) => {
        const payload: StockFormValues = {
          ...vals,
          quantity: Number(vals.quantity) || 0,
          price: Number(vals.price) || 0,
          tags:
            typeof vals.tags === "string"
              ? (vals.tags as string)
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
              : (vals.tags as string[] | undefined),
        };
        onSubmit(payload);
      }}
    >
      {({
        setFieldValue,
        values,
      }: {
        setFieldValue: (field: string, value: unknown) => void;
        values: Partial<StockFormValues>;
      }) => (
        <Form className="space-y-4">
          <TextField name="title" label="Title" />
          <TextAreaField name="description" label="Description" />

          <div className="grid grid-cols-3 gap-2">
            <TextField name="sku" label="SKU" />
            <SelectField name="marketplace" label="Marketplace">
              <option value="">Select marketplace</option>
              <option value="AMAZON">Amazon</option>
              <option value="EBAY">eBay</option>
              <option value="TIKTOK">TikTok</option>
              <option value="SHOPIFY">Shopify</option>
              <option value="OTHER">Other</option>
            </SelectField>
            <SelectField name="stockStatus" label="Status">
              <option value="DRAFT">Draft</option>
              <option value="IN_STOCK">In stock</option>
              <option value="OUT_OF_STOCK">Out of stock</option>
              <option value="DISCONTINUED">Discontinued</option>
              <option value="ARCHIVED">Archived</option>
            </SelectField>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <TextField name="quantity" label="Quantity" type="number" />
            <TextField name="price" label="Price" type="number" step="0.01" />
            <TextField name="currency" label="Currency" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <TextField name="sizeLabel" label="Size" />
            <TextField name="colorLabel" label="Color" />
          </div>

          <TextField name="tags" label="Tags" helperText="Comma separated" />

          <div>
            <label className="label">Main image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files && e.target.files[0];
                if (!f) return;
                setFieldValue("mainImageFile", f);
                const reader = new FileReader();
                reader.onload = () =>
                  setFieldValue("mainImageUrl", String(reader.result));
                reader.readAsDataURL(f);
              }}
              className="file-input file-input-bordered"
            />
            {values.mainImageUrl ? (
              <img
                src={values.mainImageUrl}
                className="mt-2 w-32 h-32 object-cover rounded"
                alt="preview"
              />
            ) : null}
          </div>

          <div className="pt-4">
            <Button type="submit" isLoading={isSubmitting}>
              {submitLabel}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
