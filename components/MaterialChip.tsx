import { useState } from "react";
import { useColorScheme } from "react-native";
import { Chip, Icon } from "react-native-paper";

type Props = {
  brand: string;
  onSelect: React.Dispatch<React.SetStateAction<BrandObj>>;
};

function MaterialChip({ brand, onSelect }: Props) {
  const [selected, setSelected] = useState(false);
  const colorScheme = useColorScheme();
  const textColor = {
    color: colorScheme === "dark" ? "black" : "white",
  };
  return (
    <Chip
      onPress={() => {
        if (selected) {
          setSelected(false);
          onSelect((brands) => {
            return {
              ...brands,
              [brand]: false,
            };
          });
        } else {
          setSelected(true);
          onSelect((brands) => {
            return {
              ...brands,
              [brand]: true,
            };
          });
        }
      }}
      selected={selected}
      icon={() => {
        if (selected) {
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
