import { Text, View, Pressable } from "react-native";
import { router } from "expo-router";

export default function Index() {
  return (
    <View style={{ alignItems: "center" }}>
      <Text style={{ fontSize: 30 }}>PLACEHOLDER</Text>
      <Pressable
        style={{ borderColor: "#000000" }}
        onPress={() => {
          router.push("/login");
        }}>
        <Text style={{ fontWeight: "bold" }}>Ir a login</Text>
      </Pressable>
    </View>
  );
}
