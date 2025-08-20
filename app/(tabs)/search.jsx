import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, IconButton } from "react-native-paper";
import createAPI from "../../lib/api";
import { useAuth } from "../../lib/authContext";

export default function Search() {

    const [searchData, setSearchData] = useState([]);
    const [searchKey, setSearchKey] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const api = createAPI(user?.token);

    const search = async () => {

        setLoading(true);

        try {
            const response = await api.get('histories', { params: { searchKey: searchKey,from: "search" } });
            setSearchData(response.data.data);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            console.log(e);
        }

    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center",marginTop: Platform.OS === 'ios' ? -40 : 0,marginHorizontal: Platform.OS === 'ios' ? 20 : 0 }}>
                <TextInput mode="outlined" placeholder="Search" value={searchKey} style={styles.searchBox} onChangeText={(e) => setSearchKey(e)} />
                <TouchableOpacity onPress={search}>
                    <IconButton iconColor="white" icon="magnify" style={styles.searchButton} />
                </TouchableOpacity>
            </View>
            {loading ?
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size={35} color='#1F41BB' style={{ marginTop: -40, alignSelf: "center" }} />
                </View> : <View style={{ backgroundColor: "white",height: Platform.OS === 'ios' ? "101%" : "98%"}}>
                    {searchData.length > 0 ?
                        <FlatList
                            data={searchData}
                            style={{ marginBottom: 70,marginHorizontal: Platform.OS === 'ios' ? 20 : 0,paddingBottom: Platform.OS === 'ios' ? 0 : 20 }}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity onPress={() => router.push({ pathname: "/history_details", params: { id: item.id } })} style={{ marginBottom: (index === searchData.length - 1 && Platform.OS === 'android') ? 15.5 : 0 }}>
                                        <View style={{ paddingVertical: 15, backgroundColor: '#7a7a7a11', borderRadius: 10, marginBottom: 10, borderColor: '#7a7a7a41', display: "flex", flexDirection: "row", alignItems: "center", paddingHorizontal: 10 }}>
                                            <IconButton icon={"star-outline"} style={{ backgroundColor: "#20a10048" }} iconColor="#077703ff" size={20}></IconButton>
                                            <View style={{ flex: 1, marginLeft: 10 }}>
                                                <Text style={{ fontSize: 14, fontWeight: "bold" }}>{item.member_name} redeemed <Text style={{ color: "#1F41BB" }}>{item.promotion_name}</Text> x{item.qty}</Text>
                                                <Text style={{ fontSize: 12, color: "#686868ff", marginTop: 5 }}>{item.redeemed_points} points . {item.created_at}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            }}
                        /> :                                                                                    
                        <FlatList data={[1]} renderItem={({ item }) => (
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: "51%",paddingBottom: 100 }}>
                                <Image source={require("../../assets/images/no_data.jpg")} style={{ width: 180, height: 180 }} />
                                <Text style={{ fontWeight: "bold", marginTop: -10 }}>No Data Found</Text> 
                            </View>
                        )}
                        />
                    }
                </View>}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 20
    },
    searchBox: {
        height: 50,
        borderRadius: 10,
        backgroundColor: '#8181811c',
        borderWidth: 0,
        marginTop: 47,
        marginBottom: 10,
        width: "90%",
        paddingHorizontal: 10,
    },
    searchButton: {
        backgroundColor: "#1F41BB",
        marginTop: 40
    }
})