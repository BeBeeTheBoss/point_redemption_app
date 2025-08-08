import { useCameraPermissions } from "expo-camera";
import { Link } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Scan(){

    const [permissions, requestPermission] = useCameraPermissions();

    useEffect(() => {

        if(permissions?.granted){
            // router.replace('/scan_qr');
        }

    }, [permissions]);

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <TouchableOpacity onPress={requestPermission}>
                    <Text>Allow Camera</Text>
                </TouchableOpacity>
                <Link href={"/scan_qr"} disabled={!permissions?.granted}>Profile</Link>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });