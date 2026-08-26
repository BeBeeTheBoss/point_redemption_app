import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { router } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import createAPI from "../lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [deviceId, setDeviceId] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  const loadUser = async () => {
    const storedUser = await AsyncStorage.getItem("user");
    const deviceId = await AsyncStorage.getItem("deviceId");
    const deviceName = await AsyncStorage.getItem("deviceName");

    console.log("storedUser", storedUser);
    

    if (storedUser) {
      const api = createAPI();

      try {
        const response = await api.get("get-user", {
          params: { user_id: JSON.parse(storedUser).id },
          timeout: 15000,
        });

        if (response.data.status != 200) {
          setUser(null);
          await AsyncStorage.removeItem("user");
          router.replace("/login");
        }

        setAuthLoading(false);
        setUser(JSON.parse(storedUser));
        setDeviceId(deviceId);
        setDeviceName(deviceName);
      } catch (error) {
        console.log(error);
        setUser(null);
        await AsyncStorage.removeItem("user");
        router.replace("/login");
      }
    } else {
      setAuthLoading(false);
      router.replace("/login");
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const reachable = state.isInternetReachable;

      if (reachable === null) {
        setIsConnected(null);
        return;
      }

      const online = state.isConnected && reachable;
      setIsConnected(online);

      if (!online) {
        router.replace("/no_internet_screen");
      } else {
        loadUser();
        router.replace("/(tabs)");
      }
    });

    return () => unsubscribe();
  }, []);

  const storeUser = async (userData, deviceId, deviceName) => {
    console.log("DeviceId stored", deviceId);

    setUser(userData);
    setDeviceId(deviceId);
    setDeviceName(deviceName);
    await AsyncStorage.multiSet([
      ["user", JSON.stringify(userData)],
      ["deviceId", deviceId],
      ["deviceName", deviceName],
    ]);
  };

  const removeUser = async () => {
    try {
      console.log(deviceId);

      const api = createAPI(user.token);
      await api.post("logout", { deviceId: deviceId });
      setUser(null);
      await AsyncStorage.removeItem("user");
      loadUser();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, storeUser, removeUser, authLoading, deviceId, deviceName }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
