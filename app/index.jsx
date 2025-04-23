import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="text-3xl font-bold text-red-500">gf app/index.tsx to edit this screen.</Text>
      <Link href="/(tabs)">Boom</Link>
    </View>
  );
}
