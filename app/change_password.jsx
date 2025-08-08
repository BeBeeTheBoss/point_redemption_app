import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { ActivityIndicator, Button } from 'react-native-paper';
import createAPI from '../lib/api';
import { useAuth } from '../lib/authContext';

export default function ChangePassword() {

    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [oldPasswordError, setOldPasswordError] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const api = createAPI(user.token);

    const validate = () => {
        let isValid = true;

        if (oldPassword == '') { isValid = false; setOldPasswordError('Old Password is required'); } else { setOldPasswordError(''); isValid = true; }
        if (newPassword == '') { isValid = false; setNewPasswordError('New Password is required'); } else { setNewPasswordError(''); isValid = true; }
        if (confirmPassword == '') { isValid = false; setConfirmPasswordError('Confirm Password is required'); } else { setConfirmPasswordError(''); isValid = true; }

        if (newPassword != confirmPassword) { isValid = false; setConfirmPasswordError('Password does not match'); }

        return isValid;

    }

    const handleChangePassword = async () => {

        if (!validate()) return;

        setLoading(true);
        try {
            const response = await api.post('/users/change-password', {
                oldPassword: oldPassword,
                newPassword: newPassword,
                confirmPassword: confirmPassword,
            });

            if (response.data.status == 401) {
                setOldPasswordError(response.data.message);
                setLoading(false);
                return;
            }

            if (response.data.status == 200) {
                setLoading(false);
                router.back();
            }


        } catch (e) {
            setLoading(false);
            console.log(e);
        }



    }

    return (
        <View style={styles.container}>

            <Text style={{ fontWeight: 'bold' }}>Old Password</Text>
            <TextInput style={[styles.textInput, { borderWidth: oldPasswordError ? 1 : 0, borderColor: oldPasswordError ? "red" : "" }]} value={oldPassword} secureTextEntry onChangeText={setOldPassword} placeholder='Old Password' />
            {oldPasswordError && <Text style={{ color: 'red', fontSize: 12, fontWeight: "bold", marginLeft: 7, marginTop: -2 }}>{oldPasswordError}</Text>}

            <Text style={{ fontWeight: 'bold', marginTop: 12 }}>New Password</Text>
            <TextInput style={[styles.textInput, { borderWidth: newPasswordError ? 1 : 0, borderColor: newPasswordError ? "red" : "" }]} value={newPassword} secureTextEntry onChangeText={setNewPassword} placeholder='New Password' />
            {newPasswordError && <Text style={{ color: 'red', fontSize: 12, fontWeight: "bold", marginLeft: 7, marginTop: -2 }}>{newPasswordError}</Text>}

            <Text style={{ fontWeight: 'bold', marginTop: 12 }}>Confirm Password</Text>
            <TextInput style={[styles.textInput, { borderWidth: confirmPasswordError ? 1 : 0, borderColor: confirmPasswordError ? "red" : "" }]} value={confirmPassword} secureTextEntry onChangeText={setConfirmPassword} placeholder='Confirm Password' />
            {confirmPasswordError && <Text style={{ color: 'red', fontSize: 12, fontWeight: "bold", marginLeft: 7, marginTop: -2 }}>{confirmPasswordError}</Text>}

            <View style={{ marginTop: 25, display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                <Button mode="contained" onPress={router.back} style={[styles.button, { backgroundColor: "#8181811c" }]} textColor='black'>Cancel</Button>
                <Button mode="contained" style={[styles.button, { backgroundColor: "#1F41BB" }]} onPress={handleChangePassword}>
                    {loading ? <Text style={{ fontSize: 15 }}> <ActivityIndicator size={14} color="white" /> Updating</Text> : <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}><Text style={{ fontSize: 15, color: "white" }}> Update</Text></View>}
                </Button>
            </View>

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
        marginTop: 7,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    button: {
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