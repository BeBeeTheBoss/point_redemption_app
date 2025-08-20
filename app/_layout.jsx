import { Stack } from "expo-router";
import { AuthProvider } from "../lib/authContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="scan" options={{ headerShown: false }} />
        <Stack.Screen
          name="profile_edit"
          options={{
            headerShown: true,
            headerBackTitle: "Profile",
            title: "Edit Profile",
          }}
        />
        <Stack.Screen
          name="change_password"
          options={{
            headerShown: true,
            headerBackTitle: "Profile",
            title: "Change Password",
          }}
        />
        <Stack.Screen
          name="noti_details"
          options={{
            headerShown: true,
            headerBackTitle: "Back",
            title: "Notification",
          }}
        />
        <Stack.Screen
          name="history_details"
          options={{
            headerShown: true,
            headerBackTitle: "Back",
            title: "History",
          }}
        />
        {/* This screen will show when offline */}
        <Stack.Screen
          name="no_internet_screen"
          options={{
            headerShown: false,
            animation: "slide_from_bottom"
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
