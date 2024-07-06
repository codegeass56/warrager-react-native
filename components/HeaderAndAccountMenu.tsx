import { StyleSheet, View } from "react-native";
import HomeScreenHeader from "./HomeScreen/HomeScreenHeader";
import UserAccountMenu from "./HomeScreen/UserAccountMenu";

type Props = {
  avatarLabel: string;
  profileColor: string;
  onLogout: () => Promise<void>;
};

function HeaderAndAccountMenu({ avatarLabel, profileColor, onLogout }: Props) {
  return (
    <View style={styles.headerAndAccountMenuContainer}>
      <HomeScreenHeader />
      <UserAccountMenu
        avatarLabel={avatarLabel}
        profileColor={profileColor}
        onLogout={onLogout}
        style={styles.accountMenu}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerAndAccountMenuContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
  accountMenu: {
    position: "absolute",
    right: 30,
  },
});

export default HeaderAndAccountMenu;
