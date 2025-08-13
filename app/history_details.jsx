import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import createAPI from "../lib/api";
import { useAuth } from "../lib/authContext";

export default function HistoryDetails() {

    const { id } = useLocalSearchParams();
    const { user } = useAuth();
    const api = createAPI(user?.token);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState(null);

    const getHistory = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/histories/${id}`);
            setHistory(response.data.data);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            console.log(e);
        }
    }

    useEffect(() => {
        getHistory();
    }, [])

    if (loading) return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <ActivityIndicator size={30} color="#1F41BB" style={{ marginTop: "50%" }} />
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={{ padding: 20, backgroundColor: "white", borderWidth: 1, borderRadius: 10, borderColor: "#d3d3d381", marginTop: 5,elevation: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={{ width: 45, height: 45, backgroundColor: "#1F41BB", borderRadius: 50, justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>{history?.member_name.charAt(0).toUpperCase()}</Text>
                        </View>
                        <Text style={{ marginLeft: 7, fontSize: 15, fontWeight: "bold" }}>{history?.member_name}</Text>
                    </View>
                    <View style={{ backgroundColor: "#DCFCE7", padding: 5, borderRadius: 5 }}>
                        <Text style={{ color: "#015508ff", fontWeight: "bold" }}>Redeemed</Text>
                    </View>
                </View>
                <View style={{ height: 1,backgroundColor: "#d3d3d381",marginTop: 15 }}></View>
                <View style={{ marginTop: 15, flexDirection: "row", justifyContent: "space-between" }}>
                    <Text>Points Used</Text>
                    <Text style={{ fontWeight: "bold",color: "#038a0eff",textAlign: "right"}}>{history?.redeemed_points}</Text>
                </View>
                <View style={{ marginTop: 15, flexDirection: "row", justifyContent: "space-between" }}>
                    <Text>Coupon</Text>
                    <Text style={{ fontWeight: "bold",width: "60%",textAlign: "right"}}>{history?.promotion_name}</Text>
                </View>
                <View style={{ marginTop: 15, flexDirection: "row", justifyContent: "space-between" }}>
                    <Text>Quantity</Text>
                    <Text style={{ fontWeight: "bold",width: "60%",textAlign: "right"}}>x{history?.qty}</Text>
                </View>
                <View style={{ marginTop: 15, flexDirection: "row", justifyContent: "space-between" }}>
                    <Text>Redeemed at</Text>
                    <Text style={{ fontWeight: "bold",width: "60%",textAlign: "right"}}>{history?.business_name} ({history?.branch_name})</Text>
                </View>
                <View style={{ marginTop: 15, flexDirection: "row", justifyContent: "space-between" }}>
                    <Text>Redeemed date</Text>
                    <Text style={{ fontWeight: "bold", width: "60%", textAlign: "right" }}>
                        {new Date(history?.created_at).toLocaleString('en-CA', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        }).replace(',', '')}
                    </Text>
                </View>
                <View style={{ marginTop: 15, flexDirection: "row", justifyContent: "space-between",paddingBottom: 10 }}>
                    <Text>Redeemed time</Text>
                    <Text style={{ fontWeight: "bold", width: "60%", textAlign: "right" }}>
                        {new Date(history?.created_at).toLocaleString('en-CA', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        }).replace('a.m.', 'AM').replace('p.m.', 'PM').replace(',', '')}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 10
    }
});