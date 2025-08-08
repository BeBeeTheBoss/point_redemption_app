import { StyleSheet, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function Loader(){
    return (
        <View style={styles.container}>
            <ActivityIndicator size={35} />
            <Text style={{ marginTop: 10, fontSize: 15,fontWeight: "bold" }}>Loading</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: "#cacaca31",
        justifyContent: "center",
        alignItems: "center",
        position:  "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }
})