import AntDesign from '@expo/vector-icons/AntDesign';
import { useIsFocused } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import LottieView from 'lottie-react-native';
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import Toast from "react-native-toast-message";
import createAPI from "../lib/api";
import { useAuth } from "../lib/authContext";

export default function Scan() {
  const { user } = useAuth();
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const api = createAPI(user?.token);

  const isFocused = useIsFocused();

  console.log(isFocused);

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.centerContainer} >
        <View>
          <Image source={require('../assets/images/camera_permission.png')} style={{ width: 260, height: 260 }} />
          <Text style={{ textAlign: "center", marginTop: 10, fontWeight: "bold", fontSize: 20 }}>Enable Camera</Text>
          <Text style={{ textAlign: "center", marginTop: 10, width: 260 }}>Camera permission is required to scan QR code</Text>


          <Button style={{ marginTop: 40, backgroundColor: "#1F41BB" }} mode="contained" onPress={() => requestPermission()}>Allow</Button>
          <Button style={{ marginTop: 10 }} textColor="#1F41BB" mode="text" onPress={() => router.back()}>Don't Allow</Button>


        </View>
      </View>
    );
  }

  const handleScan = async ({ data, type }) => {

    if (!scanned) {

      setScanning(true);
      setScanned(true);
      console.log(data);

      const response = await api.post('redeem-points', { idcard: data.split('|')[1], points: data.split('|')[3], promotion_code: (data.split('|')[5]).split(',')[0], qty: data.split('|')[4] });
      console.log(response.data);

      if (response.data.status == 200) {

        setScanning(false);
        setScanned(false);
        router.push({ pathname: '/', params: { success: "Points redeemed successfully" } });
      } else {
        setInvalid(response.data.message);
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(prev => (prev === "back" ? "front" : "back"));
  };


  if (scanning) {
    return (
      <LinearGradient
        colors={['#ffffffff', '#ffffffff']}
        style={styles.newContainer}
      >
        <View>
          {invalid ? (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.errorText}>{invalid}</Text>
              <Image source={require('../assets/images/error.png')} style={styles.errorImage} />
              <Button
                style={styles.button}
                mode="contained"
                buttonColor="#1F41BB"
                textColor="#fff"
                onPress={() => {
                  setInvalid(false);
                  setScanned(false);
                  setScanning(false);
                }}
              >
                Try Again
              </Button>
            </View>
          ) : (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.loadingText}>Saving data, please wait...</Text>
              <LottieView
                source={require('../assets/animations/loader.json')}
                autoPlay
                loop
                style={styles.lottie}
              />
            </View>
          )}
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container} >
      {isFocused && <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "ean8", "upc_a", "upc_e", "code39", "code128"]
        }}
        onBarcodeScanned={handleScan}
      >
        <View style={styles.overlay} >
          <View style={styles.scanArea} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.buttonText}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>}
      <Button
        style={{ position: "absolute", top: 50, left: 10}}
        mode="text"
        textColor="#fff"
        onPress={() => router.back()}
      ><AntDesign name="left" size={13} color="white" /> Back</Button>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  container: { flex: 1 },
  message: { textAlign: "center", marginTop: 20 },
  camera: { flex: 1 },
  buttonContainer: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center"
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 10
  },

  newContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D7263D",
    marginBottom: 12,
  },
  errorImage: {
    width: 70,
    height: 70,
    marginTop: 20,
  },
  button: {
    marginTop: 24,
    borderRadius: 8,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 15,
    letterSpacing: 1,
  },
  lottie: {
    width: 80,
    height: 80,
    marginTop: 10,
  },

});


















