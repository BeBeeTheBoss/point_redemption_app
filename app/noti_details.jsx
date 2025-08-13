import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import createAPI from "../lib/api";
import { useAuth } from "../lib/authContext";

export default function NotiDetails() {

    const { id } = useLocalSearchParams();
    const { user } = useAuth();
    const [notification, setNotification] = useState(null);
    const api = createAPI(user?.token, { user_id: user?.id });

    const getNotification = async () => {
        try {

            const response = await api.get(`/notifications/${id}`);

            setNotification(response?.data?.data[0]);

        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getNotification();
    }, [])

    return (
        <View style={styles.container}>
            <ScrollView>
                {notification?.image && <Image source={{ uri: notification?.image }} style={{ width: "100%", height: 350 }} />}
                <View style={styles.content}>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>{notification?.title}</Text>
                    <Text style={{ fontSize: 12, color: "gray", }}>{notification?.created_at}</Text>
                    <Text style={{ fontSize: 15, marginTop: 20 }}>{notification?.body}</Text>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    content: {
        padding: 20,
    }
})