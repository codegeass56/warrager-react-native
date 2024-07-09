export {};

declare global {
  type Nullable<T> = T | null;

  //   {
  //     id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
  //     dateCreated: "12/04/2019",
  //     dateModified: "12/04/2024",
  //     dateOfPurchase: "12/04/2019",
  //     expiryDate: "02/08/2020",
  //     purchaseLocation: "Sharaf DG Mankhool",
  //     productName: "LG Washing machine",
  //     imgSrc: "https://picsum.photos/200",
  //     brand: "LG",
  //   },
  type BrandObj = {
    [key: string]: boolean;
  };

  type Product = {
    id: string;
    currencyType: string;
    dateCreated: string;
    dateOfExpiry: string;
    dateOfPurchase: string;
    productBrand: string;
    productName: string;
    productPrice: string;
    storeContact: string;
    storeEmail: string;
    storeName: string;
    warrantyDurationType: string;
    warrantyPeriod: string;
    dateModified: string;
    imageUri: string;
  };

  type TextFieldProps = {
    componentName: string;
    control: Control<any>;
    placeholderText?: string;
    mode?: "flat" | "outlined" | undefined;
    label?: string;
    style?: StyleProp<TextStyle>;
    placeholderTextColor?: string;
    keyboardType?: KeyboardTypeOptions;
    returnKeyType?: ReturnKeyTypeOptions;
    autocomplete?:
      | "additional-name"
      | "address-line1"
      | "address-line2"
      | "birthdate-day"
      | "birthdate-full"
      | "birthdate-month"
      | "birthdate-year"
      | "cc-csc"
      | "cc-exp"
      | "cc-exp-day"
      | "cc-exp-month"
      | "cc-exp-year"
      | "cc-number"
      | "country"
      | "current-password"
      | "email"
      | "family-name"
      | "given-name"
      | "honorific-prefix"
      | "honorific-suffix"
      | "name"
      | "new-password"
      | "off"
      | "one-time-code"
      | "postal-code"
      | "street-address"
      | "tel"
      | "username";
    autoFocus?: boolean;
    right?: React.ReactNode;
    secureTextEntry?: boolean;
    validation?: ErrorProps;
    editable?: boolean;
    autoCapitalize?: "none" | "words" | "sentences" | "characters";
  };

  type ErrorProps = {
    errors: FieldErrors<any>;
    rules: Omit<
      RegisterOptions<any, string>,
      "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"
    >;
  };
}
