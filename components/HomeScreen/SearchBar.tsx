// import Button from "./Button";

import React, { useState } from "react";
import { Control, Controller } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Searchbar, TextInput } from "react-native-paper";

type Props = {
  control: Control<{
    search: string;
  }>;
};

export default function SearchBar({ control }: Props) {
  return (
    <View>
      <Controller
        name="search"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Searchbar
            placeholder="Search your products"
            onChangeText={onChange}
            value={value}
            loading={false}
            style={styles.searchbar}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchbar: {
    borderRadius: 10,
  },
});
