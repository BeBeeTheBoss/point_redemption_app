import EvilIcons from '@expo/vector-icons/EvilIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router } from 'expo-router';
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import Toast from 'react-native-toast-message';
import createAPI from '../lib/api';
import { useAuth } from "../lib/authContext";

export default function ProfileEdit() {

    const { user, authLoading, removeUser } = useAuth();
    const [name, setName] = useState(user?.name);
    const [nameError, setNameError] = useState('');
    const [businessName,setBusinessName] = useState(user?.business_name);
    const [businessNameError, setBusinessNameError] = useState('');
    const [loading, setLoading] = useState(false);
    const api = createAPI(user.token);

    const validate = () => {
        let isValid = true;

        if (name == '') { isValid = false; setNameError('Name is required'); } else { setNameError(''); isValid = true; }
        if (businessName == '') { isValid = false; setBusinessNameError('Business Name is required'); } else { setBusinessNameError(''); isValid = true; }

        return isValid;
    }

    const handleUpdateProfile = async () => {

        if(!validate()) return;

        setLoading(true);

        try{
            const response = await api.post('/users/update',{
                name: name,
                business_name: businessName,
            });

            setLoading(false);

            if(response.data.status == 200){
                Toast.show({
                    type: 'success',
                    text1: "Profile Updated Successfully",
                    position: 'top',
                    visibilityTime: 3000,
                });

                router.push('/profile', { updated: true });

            }

        }catch(e){
            setLoading(false);

            console.log(e);
        }
        
    }

    return (
        <View style={styles.container}>

            <Text style={{ fontWeight: 'bold' }}>Name</Text>
            <TextInput style={[styles.textInput, { borderWidth: nameError ? 1 : 0, borderColor: nameError ? "red" : "" }]} editable={!loading} value={name} onChangeText={setName}/>
            {nameError && <Text style={{ color: 'red', fontSize: 12, fontWeight: "bold", marginLeft: 7, marginTop: -2 }}>{nameError}</Text>}

            <View style={{ display:"flex",justifyContent:"space-between",flexDirection:"row",alignItems:"center" }}>
                <Text style={{ fontWeight: 'bold',marginTop:12 }}>Email</Text>
                <EvilIcons name="lock" size={24} color="black" />
            </View>
            <TextInput style={styles.textInput} editable={false} value={user.email}/>

            <Text style={{ fontWeight: 'bold',marginTop:12 }}>Business Name</Text>
            <TextInput style={[styles.textInput, { borderWidth: businessNameError ? 1 : 0, borderColor: businessNameError ? "red" : "" }]} editable={!loading} value={businessName} onChangeText={setBusinessName}/>
            {businessNameError && <Text style={{ color: 'red', fontSize: 12, fontWeight: "bold", marginLeft: 7, marginTop: -2 }}>{businessNameError}</Text>}

            <View style={{ marginTop: 25,display: "flex",flexDirection: "row",justifyContent: "space-around" }}>
                <Button mode="contained" onPress={router.back} style={[styles.button,{backgroundColor: "#8181811c"}]} textColor='black'>Cancel</Button>
                <Button mode="contained" style={[styles.button,{backgroundColor: "#1F41BB"}]} onPress={handleUpdateProfile}>
                    {loading ? <Text style={{ fontSize: 15 }}> <ActivityIndicator size={14} color="white" /> Saving</Text> : <View style={{ display: "flex",flexDirection: "row",alignItems: "center" }}><FontAwesome name="save" size={14} color="white" /><Text style={{ fontSize: 15,color: "white" }}> Save</Text></View>}
                </Button>
            </View>

            <Toast/>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    textInput: {
        height: 50,
        borderRadius: 10,
        backgroundColor: '#8181811c',
        borderWidth: 0,
        marginTop: 7,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    button:{
        height: 48,
        paddingTop: 4,
        width: "48%",
        borderRadius: 10,
        display: "flex",
        elevation: 2,
        borderWidth: 1,
        borderColor: "#b9b9b980",
    }
});