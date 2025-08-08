import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs, router } from "expo-router";
import { Pressable, View } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#1F41BB",
        tabBarInactiveTintColor: "#1F41BB",
        tabBarStyle: {
          // position: "absolute",
          height: 100,
          // bottom: 30,
          paddingTop: 20,
          // marginHorizontal: 20,
          // borderRadius: 20,
          // borderTopLeftRadius: 50,
          // borderTopRightRadius: 50,
          backgroundColor: "white",
          paddingBottom: 5,
          // elevation: 1, // Android shadow
          shadowColor: "#000", // iOS shadow
          shadowOffset: { width: 0, height: 1 }, // iOS shadow
          shadowOpacity: 0.25, // iOS shadow
          shadowRadius: 3.84, // iOS shadow

        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarButton: (props) => (
            <Pressable
              {...props}
              android_ripple={null}
              style={props.style}
            >
              {props.children}
            </Pressable>
          ),
          tabBarIcon: ({ color, size, focused }) => {
            return focused ? (
              <Ionicons name="home" size={size} color={"#1F41BB"} />
            ) : (
              <Ionicons name="home-outline" size={size} color={"#1F41BB"} />
            )
          }
        }}
      />

      <Tabs.Screen name="search"
        options={{
          headerShown: false,
          title: "Search",
          tabBarButton: (props) => (
            <Pressable
              {...props}
              android_ripple={null}
              style={props.style}
            >
              {props.children}
            </Pressable>
          ),
          tabBarIcon: ({ color, size, focused }) => {
            return focused ? (
              <FontAwesome5 name="search" size={21} color={"#1F41BB"} />
            ) : (
              <AntDesign name="search1" size={24} color={"#1F41BB"} />
            )
          }
        }} />

      <Tabs.Screen name="permission"
        options={{
          title: "",
          headerShown: false,
          tabBarButton: (props) => (
            <Pressable
              onPress={() => router.push("/scan")}
              android_ripple={null}
              style={props.style}
            >
              {props.children}
            </Pressable>
          ),
          tabBarIcon: ({ color, size, focused }) => {
            return (
              <View style={{ backgroundColor: "#1F41BB", width: 73, height: 73, borderRadius: 50, alignItems: "center", justifyContent: "center", marginBottom: 60 }}>
                <MaterialCommunityIcons name="line-scan" size={33} color="white" />
              </View>
            );
          }
        }} />

      <Tabs.Screen name="notifications"
        options={{
          headerShown: false,
          title: "Notifications",
          tabBarButton: (props) => (
            <Pressable
              {...props}
              android_ripple={null}
              style={props.style}
            >
              {props.children}
            </Pressable>
          ),
          tabBarIcon: ({ color, size, focused }) => {
            return focused ? (
              <Ionicons name="notifications-sharp" size={24} color={"#1F41BB"} />
            ) : (
              <Ionicons name="notifications-outline" size={24} color={"#1F41BB"} />
            )
          }
        }} />

      <Tabs.Screen name="profile"
        options={{
          headerShown: false,
          title: "Profile",
          tabBarButton: (props) => (
            <Pressable
              {...props}
              android_ripple={null}
              style={props.style}
            >
              {props.children}
            </Pressable>
          ),
          tabBarIcon: ({ color, size, focused }) => {
            return focused ? (
              <FontAwesome name="user" size={28} color={"#1F41BB"} />
            ) : (
              <FontAwesome name="user-o" size={23} color={"#1F41BB"} />
            )
          }
        }} />
    </Tabs>
  );
}
