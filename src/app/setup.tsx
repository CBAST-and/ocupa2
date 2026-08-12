import { useState, useEffect } from "react";
import { Text, View } from "react-native";
import { getToken } from "@/services/auth";

export default function Setup() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const checkToken = async () => {
      const tempToken = await getToken();
      if (tempToken) {
        setToken(tempToken);
      }

      console.log("[SETUP] Token:", token);
    };

    checkToken();
  }, []);

  return (
    <View>
      <Text>Token: {token}</Text>
    </View>
  );
}
