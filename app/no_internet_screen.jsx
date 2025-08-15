import NetInfo from "@react-native-community/netinfo";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function NoInternetScreen() {
  const router = useRouter();

  const retryConnection = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected && state.isInternetReachable) {
        router.replace("/(tabs)");
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Illustration using simple shapes */}
      <View style={styles.cloud}>
        <View style={styles.cloudPart1} />
        <View style={styles.cloudPart2} />
        <View style={styles.cloudPart3} />
      </View>
      <View style={styles.exclamation}>
        <Text style={styles.exclamationText}>!</Text>
      </View>

      {/* Text */}
      <Text style={styles.title}>No Internet Connection</Text>
      <Text style={styles.subtitle}>
        Oops! You are offline. Please check your network and try again.
      </Text>

      {/* Retry Button */}
      <TouchableOpacity style={styles.button} onPress={retryConnection}>
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f9f9f9",
  },
  cloud: {
    flexDirection: "row",
    marginBottom: 20,
  },
  cloudPart1: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#b0c4de",
    marginRight: -20,
  },
  cloudPart2: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#b0c4de",
    marginRight: -20,
    marginTop: 10,
  },
  cloudPart3: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#b0c4de",
    marginTop: 20,
  },
  exclamation: {
    position: "absolute",
    top: 70,
    left: "56%",
    marginLeft: -12,
    backgroundColor: "#ff6b6b",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  exclamationText: {
    color: "#fff",
    fontWeight: "bold",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
