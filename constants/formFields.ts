export const PRODUCT_NAME_FIELD_NAME = "productName";
export const DATE_FIELD_NAME = "dateOfPurchase";
export const CURRENCY_FIELD_NAME = "currencyType";
export const PRODUCT_PRICE_FIELD_NAME = "productPrice";
export const CATEGORY_FIELD_NAME = "productCategory";
export const WARRANTY_PERIOD_FIELD_NAME = "warrantyPeriod";
export const WARRANTY_DURATION_TYPE_FIELD_NAME = "warrantyDurationType";
export const BRAND_FIELD_NAME = "productBrand";
export const STORE_NAME_FIELD_NAME = "storeName";
export const STORE_LOCATION_FIELD_NAME = "storeLocation";
export const STORE_EMAIL_FIELD_NAME = "storeEmail";
export const STORE_CONTACT_FIELD_NAME = "storeContact";

export type FormData = {
  [PRODUCT_NAME_FIELD_NAME]: string;
  [DATE_FIELD_NAME]: Date;
  [CURRENCY_FIELD_NAME]: string;
  [PRODUCT_PRICE_FIELD_NAME]: string;
  [CATEGORY_FIELD_NAME]: string;
  [WARRANTY_PERIOD_FIELD_NAME]: string;
  [WARRANTY_DURATION_TYPE_FIELD_NAME]: string;
  [BRAND_FIELD_NAME]: string;
  [STORE_NAME_FIELD_NAME]: string;
  [STORE_LOCATION_FIELD_NAME]: string;
  [STORE_EMAIL_FIELD_NAME]: string;
  [STORE_CONTACT_FIELD_NAME]: string;
  dateCreated: string;
};
