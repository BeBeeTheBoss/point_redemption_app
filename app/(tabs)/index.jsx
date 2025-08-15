import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, FlatList, Image, Platform, RefreshControl, SafeAreaView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, IconButton } from "react-native-paper";
import Toast from 'react-native-toast-message';
import BlurCircle from "../../assets/images/blur_circle.png";
import createAPI from "../../lib/api";
import { useAuth } from "../../lib/authContext";

const { width } = Dimensions.get('window');

export default function Index() {

  const { user, authLoading, removeUser } = useAuth();
  const api = createAPI(user?.token);
  const { success } = useLocalSearchParams();

  const translateX1 = useRef(new Animated.Value(0)).current;
  const translateX2 = useRef(new Animated.Value(0)).current;
  const translateX3 = useRef(new Animated.Value(0)).current;
  const [histories, setHistories] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState('This month');
  const [openSelect, setOpenSelect] = useState(false);

  const loopAnimation1 = (animatedValue, delay = 0) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: width - 30,
          duration: 4000,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const loopAnimation2 = (animatedValue, delay = 0) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: -width + 60,
          duration: 4000,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const loopAnimation3 = (animatedValue, delay = 0) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: width - 50,
          duration: 4000,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const getHistories = async (filterBy = null) => {

    setLoading(true);

    try {
      const response = await api.get('/histories', { params: { filterBy: filterBy ?? selectedOption } });

      let redeemedUsersArray = [];
      let total = 0;

      response.data.data.forEach(item => {
        if (!redeemedUsersArray.includes(item.member_idcard)) {
          redeemedUsersArray.push(item.member_idcard);
        }
        total += item.redeemed_points;
      });

      setTotalUsers(redeemedUsersArray.length);
      setTotalPoints(total);

      setHistories(response.data.data);

      setLoading(false);

    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }

  const handleSelect = (option) => {
    setOpenSelect(false);
    setSelectedOption(option.label);
    getHistories(option.label);
  }

  useEffect(() => {

    if (success) {
      Toast.show({
        type: 'success',
        text1: success,
        position: 'top',
        visibilityTime: 3000,
      });
    }

    getHistories();

    loopAnimation1(translateX1, 0);
    loopAnimation2(translateX2, 1000); // staggered start
    loopAnimation3(translateX3, 1000);

  }, [user]);

  if (authLoading && !user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size={30} color="black" />
      </View>
    );
  } else {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white", paddingBottom: 40, height: "100%" }}>


        <Animated.Image
          source={BlurCircle}
          style={[
            styles.imageLarge,
            {
              top: -70,
              left: -130,
              transform: [{ translateX: translateX1 }],
              opacity: Platform.OS === 'ios' ? 1 : 0.8,
            },
          ]}
        />

        <Animated.Image
          source={BlurCircle}
          style={[
            styles.imageSmall,
            {
              top: 400,
              left: 300, // Instead of right: -10
              transform: [{ translateX: translateX2 }],
              opacity: Platform.OS === 'ios' ? 0.6 : 0.7,
            },
          ]}
        />

        <Animated.Image
          source={BlurCircle}
          style={[
            styles.imageMedium,
            {
              top: 670,
              left: -50,
              transform: [{ translateX: translateX3 }],
              opacity: Platform.OS === 'ios' ? 1 : 0.8,
            },
          ]}
        />


        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: Platform.OS === 'ios' ? 20 : 60,
            marginBottom: 20,
            marginHorizontal: 20
          }}
        >

          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Home</Text>
          {/* <AntDesign name="filter" size={24} color="black" /> */}

        </View>

        <View style={{ display: "flex", marginHorizontal: 20, flexDirection: "row", marginBottom: 20 }}>

          <View style={{ backgroundColor: "#1f41bbff", padding: 15, width: "49%", borderRadius: 10 }}>
            <Text style={{ color: "white" }}>Total Users</Text>
            <Text style={{ fontSize: 28, marginVertical: 5, fontWeight: "bold", color: "white" }}><FontAwesome5 name="users" size={20} color="white" /> {totalUsers.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</Text>
            <Text style={{ fontSize: 12, color: "white",textTransform: "lowercase" }}>{selectedOption}</Text>
          </View>
          <View style={{ backgroundColor: "#0a818aff", padding: 15, width: "49%", marginLeft: 5, borderRadius: 10 }}>
            <Text style={{ color: "white" }}>Points Used</Text>
            <Text style={{ fontSize: 28, marginVertical: 5, fontWeight: "bold", color: "white" }}><FontAwesome5 name="coins" size={20} color="white" /> {totalPoints.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</Text>
            <Text style={{ fontSize: 12, color: "white",textTransform: "lowercase" }}>{selectedOption}</Text>
          </View>

        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            marginHorizontal: 25
          }}
        >

          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#1F41BB" }}>Histories</Text>
          <View style={{ position: "relative",width: 150 }}>
            <TouchableHighlight activeOpacity={0.6}
              underlayColor="#DDDDDD" onPress={() => { setOpenSelect(!openSelect) }} style={{ borderWidth: 0.5, borderColor: "#DDDDDD", paddingHorizontal: 20, paddingVertical: 7, borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text>{selectedOption}</Text>
                <AntDesign name="caretdown" size={10} style={{ marginLeft:8 }} color="#636363af" />
              </View>
            </TouchableHighlight>
            {openSelect && <View style={{ elevation: 0, position: "absolute", top: 38, backgroundColor: "#fff", borderRadius: 10, borderWidth: 0.5, borderColor: "#6363636c", width: 100, zIndex: 1, width: "100%",padding: 2 }}>
              <FlatList
                data={[{ 'label': 'This month', 'value': 'month' }, { 'label': 'This day', 'value': 'day' }]}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableHighlight activeOpacity={0.6} onPress={(e) => {handleSelect(item)}} underlayColor="#DDDDDD" style={{ paddingHorizontal: 20, paddingVertical: 10,borderRadius: 10 }}>
                      <Text>{item.label}</Text>
                    </TouchableHighlight>
                  )
                }}
              />
            </View>}
          </View>

        </View>


        {loading ?

          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size={35} color='#1F41BB' style={{ marginTop: -40, alignSelf: "center" }} />
          </View>

          :

          histories.length === 0 ?
            <FlatList
              data={[1]}
              renderItem={({ item, index }) => {
                return (
                  <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
                    <View>
                      <View style={{ justifyContent: "center", alignItems: "center" }}>
                        <Image source={require("../../assets/images/no_history.png")} style={{ width: 200, height: 200 }} />
                      </View>
                      <Text style={{ textAlign: "center", fontSize: 13, fontWeight: "bold", color: "#1F41BB", marginTop: -20 }}>No History</Text>
                    </View>
                  </View>
                )
              }}
              refreshControl={<RefreshControl refreshing={loading} onRefresh={getHistories} />}
            />
            :

            <FlatList
              data={histories}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity onPress={() => router.push({ pathname: "/history_details", params: { id: item.id } })}>
                    <View style={{ paddingVertical: 15, backgroundColor: '#7a7a7a11', marginHorizontal: 20, borderRadius: 10, marginBottom: 10, borderColor: '#7a7a7a41', display: "flex", flexDirection: "row", alignItems: "center", paddingHorizontal: 10 }}>
                      <IconButton icon={"star-outline"} style={{ backgroundColor: "#20a10048" }} iconColor="#077703ff" size={20}></IconButton>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={{ fontSize: 14, fontWeight: "bold" }}>{item.member_name} redeemed <Text style={{ color: "#1F41BB" }}>{item.promotion_name}</Text> x{item.qty}</Text>
                        <Text style={{ fontSize: 12, color: "#686868ff", marginTop: 5 }}>{item.redeemed_points} points . {item.created_at}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
              refreshControl={<RefreshControl refreshing={loading} onRefresh={getHistories} />}
            />
        }

        {
        }

        <Toast />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: 330,
    height: 330,
    position: 'absolute',
    top: -70,
    left: -70,
  },
  imageLarge: {
    position: 'absolute',
    width: 330,
    height: 330,
  },
  imageSmall: {
    position: 'absolute',
    width: 120,
    height: 120,
  },
  imageMedium: {
    position: 'absolute',
    width: 180,
    height: 180,
  },
});
