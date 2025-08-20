import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Foundation from '@expo/vector-icons/Foundation';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { Button } from "react-native-paper";
import createAPI from '../../lib/api';
import { useAuth } from "../../lib/authContext";

export default function Profile() {

    const { user, authLoading, removeUser, storeUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const api = createAPI(user?.token);

    useEffect(() => {
        
        onRefresh();
        
    }, []);

    const onRefresh = async () => {
        setLoading(true);

        try {
            const response = await api.get(`/users/${user.id}`);
            console.log(response.data.data);
            
            storeUser(response.data.data);

        } catch (e) {
            console.log(e);
        }

        setLoading(false);
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 25 }}>
            <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />} style={{ height: "100%", paddingHorizontal: Platform.OS === 'android' ? 0 : 25, paddingTop: Platform.OS === 'android' ? 0 : 30 }}>
                <View style={styles.header}>
                    <View style={{ width: "50%"}}>
                        <Text style={{ fontSize: 13 }}>You are logged in as</Text>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', marginTop: 2 }}>{user?.name}</Text>
                    </View>
                    <View>
                        <Link href={"/profile_edit"}>
                            <Button mode="contained" buttonColor="#8181812f" textColor="black" style={{ borderRadius: 15 }}>
                                <FontAwesome name="edit" size={13} color="black" /> Edit</Button>
                        </Link>
                    </View>
                </View>
                <View style={styles.info}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Profile info</Text>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: 20 }}>
                        <Feather name="user" size={24} color="#1F41BB" style={{ marginLeft: -2 }}/>
                        <Text style={{ marginLeft: 6,textTransform: "capitalize" }}>{user?.role} </Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: 20 }}>
                        <Foundation name="mail" size={24} color="#1F41BB" />
                        <Text style={{ marginLeft: 10 }}>{user?.email}</Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: 20 }}>
                        <MaterialIcons name="business-center" size={24} color="#1F41BB" style={{ marginLeft: -2 }} />
                        <Text style={{ marginLeft: 8 }}>{user?.business_name} {user?.branch_name ? "(" + user?.branch_name + ")" : ""}</Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: 20, marginBottom: 11 }}>
                        <AntDesign name="calendar" size={24} color="#1F41BB" style={{ marginLeft: -2 }} />
                        <Text style={{ marginLeft: 10 }}>{user?.campaign_start_date} - {user?.campaign_end_date}</Text>
                    </View>
                </View>

                <TouchableHighlight underlayColor="#81818141" onPress={() => { router.push("/change_password") }} style={{ marginTop: 20, backgroundColor: "#8181811c", paddingHorizontal: 20, paddingVertical: 16, borderRadius: 10 }}>
                    <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <Entypo name="key" size={20} color="#1F41BB" style={{ marginRight: 7 }} />
                        <Text>Change your password</Text>
                    </View>
                </TouchableHighlight>

                <Button mode="contained" onPress={removeUser} buttonColor="#B10303" textColor="white" style={{ borderRadius: 11, padding: 5, marginTop: 20 }}>
                    <FontAwesome name="sign-out" size={17} style={{ marginRight: 17 }} color="white" />
                    <Text style={{ fontSize: 17 }}> Logout</Text>
                </Button>
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginHorizontal: 10 }}>
                    <Text style={{ fontSize: 13, marginTop: 20 }}>Copyright © 2025</Text>
                    <Text style={{ fontSize: 13, marginTop: 20 }}>Version 1.0.0</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: {
        marginTop: Platform.OS === 'android' ? 60 : 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    info: {
        marginTop: 25,
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: "#8181811c"
    }
});