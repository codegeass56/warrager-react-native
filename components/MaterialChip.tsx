import { useState } from "react";
import { useColorScheme } from "react-native";
import { Chip } from "react-native-paper";

type Props = {
  brand: string;
  onSelect: React.Dispatch<React.SetStateAction<BrandObj>>;
};

function MaterialChip({ brand, onSelect }: Props) {
  const [selected, setSelected] = useState(false);
  const colorScheme = useColorScheme();
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
      style={{
        backgroundColor: colorScheme === "dark" ? "#7cacf8" : "#1F41BB",
      }}
      textStyle={{
        color: colorScheme === "dark" ? "black" : "white",
      }}
    >
      {brand}
    </Chip>
  );
}

export default MaterialChip;
