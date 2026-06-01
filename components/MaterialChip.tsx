import { useColorScheme } from "react-native";
import { Chip, Icon } from "react-native-paper";

type Props = {
  brand: string;
  onSelect: React.Dispatch<React.SetStateAction<BrandObj>>;
  isSelected: boolean;
};

function MaterialChip({ brand, onSelect, isSelected }: Props) {
  const colorScheme = useColorScheme();
  const textColor = {
    color: colorScheme === "dark" ? "black" : "white",
  };
  return (
    <Chip
      onPress={() => {
        onSelect((prevBrands) => {
          return {
            ...prevBrands,
            [brand]: !prevBrands[brand],
          };
        });
      }}
      selected={isSelected}
      icon={() => {
        if (isSelected) {
          return <Icon source={"close"} size={20} color={textColor.color} />;
        }
      }}
      style={{
        backgroundColor: colorScheme === "dark" ? "#7cacf8" : "#1F41BB",
      }}
      textStyle={textColor}
    >
      {brand}
    </Chip>
  );
}

export default MaterialChip;
