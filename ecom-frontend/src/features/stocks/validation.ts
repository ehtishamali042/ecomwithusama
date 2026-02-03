import * as Yup from "yup";
import type { StockFormValues } from "./types";

export const stockInitialValues: StockFormValues = {
  title: "",
  description: "",
  sku: "",
  marketplace: "",
  stockStatus: "DRAFT",
  quantity: 0,
  price: 0,
  currency: "GBP",
  sizeLabel: "",
  colorLabel: "",
  tags: "",
  mainImageUrl: "",
};

export const stockValidationSchema = Yup.object().shape({
  title: Yup.string().trim().required("Title is required"),
  description: Yup.string().nullable(),
  sku: Yup.string().nullable(),
  marketplace: Yup.string().nullable(),
  stockStatus: Yup.string()
    .oneOf(["DRAFT", "IN_STOCK", "OUT_OF_STOCK", "DISCONTINUED", "ARCHIVED"]) // backend statuses
    .required("Status is required"),
  quantity: Yup.number().integer().min(0).required("Quantity is required"),
  price: Yup.number().min(0).required("Price is required"),
  currency: Yup.string().required("Currency is required"),
  sizeLabel: Yup.string().nullable(),
  colorLabel: Yup.string().nullable(),
  tags: Yup.mixed(),
  mainImageUrl: Yup.string().nullable(),
});

export type StockValidationShape = typeof stockValidationSchema;
