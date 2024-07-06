import { useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Avatar, Divider, Menu } from "react-native-paper";

type Props = {
  avatarLabel: string;
  profileColor: string;
  onLogout: () => Promise<void>;
  style?: StyleProp<ViewStyle>;
};

function UserAccountMenu({
  avatarLabel,
  profileColor,
  onLogout,
  style,
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={style}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <TouchableOpacity onPress={() => setVisible(true)}>
            <Avatar.Text
              label={avatarLabel}
              color="white"
              size={54}
              style={{
                backgroundColor: `${profileColor ? profileColor : "red"}`,
              }}
            />
          </TouchableOpacity>
        }
        anchorPosition="bottom"
      >
        {/*//TODO: Implement logic to edit profile */}
        {/* <Menu.Item onPress={() => {}} title="Edit Profile" />
        <Divider /> */}
        <Menu.Item onPress={onLogout} title="Logout" />
      </Menu>
    </View>
  );
}

export default UserAccountMenu;
