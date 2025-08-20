import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import Toast from "react-native-toast-message";
import createAPI from '../lib/api';
import { useAuth } from '../lib/authContext';

const { width } = Dimensions.get('window');

export default function Login() {

    const translateX1 = useRef(new Animated.Value(0)).current;
    const translateX2 = useRef(new Animated.Value(0)).current;
    const translateX3 = useRef(new Animated.Value(0)).current;

    const api = createAPI();

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const { storeUser } = useAuth();

    const loopAnimation1 = (animatedValue, delay = 0) => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: width - 100,
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

    useEffect(() => {
        loopAnimation1(translateX1, 0);
        loopAnimation2(translateX2, 1000); // staggered start
        loopAnimation3(translateX3, 1000);

        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardVisible(true);
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardVisible(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };

    }, []);


    const validate = () => {

        let isValid = true;

        if (email == '') {
            isValid = false;
            setEmailError('Email is required');
        } else {
            setEmailError('');
        }
        if (password == '') {
            isValid = false;
            setPasswordError('Password is required');
        } else {
            setPasswordError('');
        }

        return isValid;
    }


    const handleLogin = async () => {

        if (!validate()) return;

        setLoading(true);

        try {

            const response = await api.post('login', {
                email: email,
                password: password
            }, {
                timeout: 15000,
            })

            if (response.data.status != 200) {

                if (response.data.status == 404) {
                    setEmailError(response.data.message);
                } else if (response.data.status == 401) {
                    setPasswordError(response.data.message);
                }

                Toast.show({
                    type: 'error',
                    text1: "Can't signin",
                    text2: response.data.message,
                    position: 'top',
                    visibilityTime: 3000,
                });

            } else {
                Toast.show({
                    type: 'success',
                    text1: response.data.message,
                    position: 'top',
                    visibilityTime: 3000,
                })

                storeUser(response.data.data);
                router.replace('/');

            }

            setLoading(false);

        } catch (e) {
            if (e.code === 'ECONNABORTED') {
                Toast.show({
                    type: 'error',
                    text1: "Can't signin",
                    text2: "Server is not reachable",
                    position: 'top',
                    visibilityTime: 3000,
                });
            }
            setLoading(false);
            console.log(e)
        }

    }

    return (
        <SafeAreaView style={styles.container}>

            {!keyboardVisible && <Image
                source={require('../assets/images/PRO_1_Global_Logo.png')}
                style={{ width: 120, height: 40, marginTop: Platform.OS === 'android' ? 80 : 50, marginLeft: 20 }}
            />}

            <Animated.Image
                source={require('../assets/images/blur_circle.png')}
                style={[
                    styles.imageLarge,
                    {
                        top: -70,
                        left: -70,
                        transform: [{ translateX: translateX1 }],
                        opacity: Platform.OS === 'ios' ? 1 : 0.8,
                    },
                ]}
            />

            {/* Bottom right small blur */}
            <Animated.Image
                source={require('../assets/images/blur_circle.png')}
                style={[
                    styles.imageSmall,
                    {
                        top: 550,
                        left: 300, // Instead of right: -10
                        transform: [{ translateX: translateX2 }],
                        opacity: Platform.OS === 'ios' ? 0.6 : 0.7,
                    },
                ]}
            />

            {/* Bottom left medium blur */}
            <Animated.Image
                source={require('../assets/images/blur_circle.png')}
                style={[
                    styles.imageMedium,
                    {
                        bottom: -70,
                        left: -50,
                        transform: [{ translateX: translateX3 }],
                        opacity: Platform.OS === 'ios' ? 1 : 0.8,
                    },
                ]}
            />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F41BB' }}>Login here</Text>
                <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Welcome back you've </Text>
                <Text style={{ fontWeight: 'bold' }}>been missed!</Text>

                <View style={{ width: '100%', marginTop: 20 }}>
                    <TextInput placeholder="Email" onChangeText={setEmail} value={email} autoCapitalize='none' style={[styles.inputBox, emailError ? { borderWidth: 1, borderColor: "red" } : null]} placeholderTextColor={"#626262"} />
                    {emailError && <Text style={{ color: "red", marginTop: 7, marginLeft: 2, fontSize: 12, fontWeight: 'bold' }}>{emailError}</Text>}

                    <TextInput placeholder="Password" onChangeText={setPassword} value={password} secureTextEntry style={[styles.inputBox, passwordError ? { borderWidth: 1, borderColor: "red" } : null]} placeholderTextColor={"#626262"} />
                    {passwordError && <Text style={{ color: "red", marginTop: 7, marginLeft: 2, fontSize: 12, fontWeight: 'bold' }}>{passwordError}</Text>}

                    <Text style={{ marginVertical: 20, color: '#1F41BB', fontSize: 12, textAlign: 'right', fontWeight: 'bold' }}>Forgot your password?</Text>

                    <Button mode="contained" style={styles.button} onPress={handleLogin}>
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{loading ? <ActivityIndicator size={20} color="white" /> : 'Login'}</Text>
                    </Button>

                </View>

            </KeyboardAvoidingView>
            <Toast />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 50,
        marginTop: -90
    },
    inputBox: {
        width: '100%',
        height: 45,
        borderRadius: 7,
        borderColor: 'gray',
        backgroundColor: '#F1F4FF',
        marginTop: 20,
        paddingHorizontal: 10,
    },
    button: {
        width: '100%',
        height: 45,
        borderRadius: 7,
        backgroundColor: '#1F41BB',
    },
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