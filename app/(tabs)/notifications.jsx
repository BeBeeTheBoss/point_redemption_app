import Ionicons from '@expo/vector-icons/Ionicons';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from "react";
import { FlatList, Image, Platform, RefreshControl, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator } from 'react-native-paper';
import createAPI from '../../lib/api';
import { useAuth } from '../../lib/authContext';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function Settings() {

    const { user } = useAuth();
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(null);
    const notificationListener = useRef();
    const responseListener = useRef();
    const api = createAPI(user?.token, { user_id: user?.id });
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const getNotifications = async () => {

        setLoading(true);

        try {

            const response = await api.get('/notifications');

            setNotifications(response.data.data);

            setLoading(false);
        } catch (e) {
            setLoading(false);

            console.log(e);
        }
    }

    const markAsRead = async (id) => {
        const response = await api.post('/notifications/mark-as-read', { id: id });

        setNotifications(prev => prev.map(noti => {
            if (noti && noti.id === id) {
                return { ...noti, is_read: true };
            }
            return noti;
        }));
    }

    const markAllAsRead = async () => {
        const response = await api.post('/notifications/mark-all-as-read');

        setNotifications(prev => prev.map(noti => {
            return { ...noti, is_read: true };
        }));
    }

    useEffect(() => {

        getNotifications();

        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        // Listener for receiving notification while app is foreground
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
            console.log('Notification Received:', notification);
        });

        // Listener for when user interacts with the notification
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('Notification Response:', response);
            const notification = response.notification;
            getNotifications();
        });

        return () => {
            notificationListener.current?.remove();
            responseListener.current?.remove();
        };

    }, []);

    async function registerForPushNotificationsAsync() {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            alert('Notification permissions not granted!');
            return;
        }

        const tokenData = await Notifications.getExpoPushTokenAsync();
        const token = tokenData.data;

        console.log(token);
        

        await api.post('/users/set-push-noti-token', { token: token });

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX, // 👈 Ensures alert/sound
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return token;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ height: "100%", marginTop: Platform.OS === 'android' ? 60 : 20, }}>
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 20,marginBottom: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>Notifications</Text>
                    <TouchableOpacity onPress={markAllAsRead}>
                        <Ionicons name="checkmark-done-outline" size={24} color="#1F41BB" />
                    </TouchableOpacity>
                </View>

                {loading ?
                    <View style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                        <ActivityIndicator size={45} color='#1F41BB' />
                    </View>
                    :
                    <View style={{ height: "100%", marginHorizontal: 7,paddingBottom:54 }}>
                        <FlatList
                            data={notifications}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => {
                                    router.push({ pathname: 'noti_details', params: { id: item.id } });
                                    !item.is_read && markAsRead(item.id);
                                }} style={{ borderBottomColor: '#b3b3b341', borderBottomWidth: 1, paddingHorizontal: 10, paddingVertical: 10 }}>
                                    <View style={{}}>
                                        <View style={{ width:  "100%" }}>
                                            <View style={{ display: "flex", flexDirection: "row", alignItems: "center",justifyContent: "space-between" }}>
                                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                    <Image source={require('../../assets/images/logo.png')} style={{ width: 50, height: 50, borderRadius: 10 }} />
                                                    <Text style={{ fontSize: 15, fontWeight: "bold", marginLeft: 10,maxWidth: 317 }}>{item.title}</Text>
                                                    {!item?.is_read && <View style={{ height: 15, width: 15, backgroundColor: "#1F41BB", borderRadius: 50, position: "absolute", top: -3, left: 40,borderWidth: 2,borderColor: "white",borderRadius:50 }}></View>}
                                                </View>
                                                <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                    <Text style={{ fontSize: 12,color: '#7a7a7a' }}>{`${item.created_at.split(' ')[0]}${item.created_at.split(' ')[1].charAt(0)}`}</Text>
                                                </View>
                                            </View>
                                            {item.body && <Text style={{ fontSize: 12, marginTop: 2, paddingRight: 7,marginBottom: 15,marginLeft: 62 }}>{item.body.slice(0, 80)}{item.body.length > 50 ? '...' : ''}</Text>}
                                            
                                        </View>
                                        {item?.image && <View>
                                            <Image source={{ uri: item.image }} style={{ width: 150, height: 150, borderRadius: 10,marginLeft: 62 }} />
                                        </View>}
                                    </View>
                                    
                                </TouchableOpacity>
                            )}
                            keyExtractor={item => item.id}
                            refreshControl={<RefreshControl refreshing={loading} onRefresh={getNotifications} />}
                        />
                        {notifications?.length == 0 &&
                            <View style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <Image style={{ width: 180, height: 180, marginTop: -550 }} source={require('../../assets/images/no_data.jpg')} />
                                <Text style={{ fontWeight: "bold", marginTop: -10 }}>No notifications</Text>
                            </View>
                        }
                    </View>}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
});