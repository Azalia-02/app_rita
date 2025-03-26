import React, { useState } from "react";
import { useRouter } from 'expo-router';
import { View, TextInput, Alert, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { loginRegister } from './services/authService';
import { Picker } from '@react-native-picker/picker';

export default function RegisterScreen() {
    const [nombre, setNombre] = useState('');
    const [app, setApp] = useState('');
    const [apm, setApm] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('user');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async () => {
        if (!nombre || !app || !apm || !email || !password || !rol) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }
    
        setLoading(true);
    
        try {
            const response = await loginRegister(nombre, app, apm, email, password, rol);
            console.log('Respuesta del servidor:', response);
    
            if (response.success) {
                if (rol === 'admin') {
                    router.replace('/(tabs)/Pacientes');
                } else if (rol === 'user') {
                    router.replace('/Usuarios');
                } 
            } else {
                Alert.alert('Error', response.message || 'Error al registrar usuario');
            }
        } catch (error) {
            console.error('Error en registro:', error);
            Alert.alert('Error', 'Error de conexión con el servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}
                autoCapitalize="words"
            />

            <TextInput
                style={styles.input}
                placeholder="Apellido Paterno"
                value={app}
                onChangeText={setApp}
                autoCapitalize="words"
            />

            <TextInput
                style={styles.input}
                placeholder="Apellido Materno"
                value={apm}
                onChangeText={setApm}
                autoCapitalize="words"
            />

            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
            />

            <Picker
                selectedValue={rol}
                onValueChange={(itemValue) => setRol(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Usuario" value="user" />
                <Picker.Item label="Administrador" value="admin" />
            </Picker>

            <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
                disabled={loading || !nombre || !email || !password}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Registrarse</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f8ff', 
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    picker: {
        width: '80%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    button: {
        width: '80%',
        height: 40,
        backgroundColor: '#014259',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});