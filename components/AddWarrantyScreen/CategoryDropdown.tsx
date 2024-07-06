import { Control } from "react-hook-form";
import FormDropdown from "../FormComponents/FormDropdown";
import { DropDownPropsInterface } from "react-native-paper-dropdown";

type Props = {
  control: Control<any>;
  componentName: string;
  label: string;
  mode: "outlined" | "flat";
};

const categoryList = [
  {
    label: "Electronics",
    value: "electronics",
  },
  {
    label: "Toys",
    value: "toys",
  },
  {
    label: "Others",
    value: "others",
  },
];

function CategoryDropdown({ control, componentName, label, mode }: Props) {
  return (
    <FormDropdown
      control={control}
      componentName={componentName}
      label={label}
      mode={mode}
      dropdownItems={categoryList}
    />
  );
}

export default CategoryDropdown;
