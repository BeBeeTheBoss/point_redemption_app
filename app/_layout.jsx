import { Stack } from "expo-router";
import { AuthProvider } from "../lib/authContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="scan" options={{ headerShown: false }} />
        <Stack.Screen name="profile_edit" options={{ headerShown: true,headerBackTitle: "Profile",title:"Edit Profile" }} />
        <Stack.Screen name="change_password" options={{ headerShown: true,headerBackTitle: "Profile",title:"Change Password" }} />
        <Stack.Screen name="noti_details" options={{ headerShown: true,headerBackTitle: "Notifications",title:"Notification" }} />
      </Stack>
    </AuthProvider>
  );
}
