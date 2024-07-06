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
    <View style={styles.container}>
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
  container: {
    // width: "100%",
  },
  searchContainer: {
    backgroundColor: "green",
    // width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
  },
  searchbar: {
    borderRadius: 10,
  },
});
