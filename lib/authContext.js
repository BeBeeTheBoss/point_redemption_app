import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import createAPI from "../lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const loadUser = async () => {
    const storedUser = await AsyncStorage.getItem("user");

    if (storedUser) {
      setAuthLoading(false);
      setUser(JSON.parse(storedUser));
    } else {
      setAuthLoading(false);
      router.replace("/login");
    }
  };

  useEffect(() => {
    
    loadUser();
  }, []);

  const storeUser = async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  };

  const removeUser = async () => {
    try {
      const api = createAPI(user.token);
      await api.post("logout");
      setUser(null);
      await AsyncStorage.removeItem("user");
      loadUser();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, storeUser, removeUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
