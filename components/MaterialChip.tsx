import { useState } from "react";
import { Chip } from "react-native-paper";

type Props = {
  brand: string;
  onSelect: React.Dispatch<React.SetStateAction<BrandObj>>;
};

function MaterialChip({ brand, onSelect }: Props) {
  const [selected, setSelected] = useState(false);
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
    >
      {brand}
    </Chip>
  );
}

export default MaterialChip;
