import { Button, Text, View, TextInput, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { router, useRouter } from "expo-router";
import React, { useState } from 'react';
import { loginUser } from "./services/authService";

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);
        try {
            const result = await loginUser(email, password);
            
            if (result.success && result.data) {
                const userRole = result.data.rol || result.data.rol || result.data.rol;
                
                if (userRole === 'admin') {
                    router.replace('/(tabs)/Pacientes');
                } else if (userRole === 'user') {
                    router.replace('/Usuarios');
                }
            } else {
                Alert.alert('Error', result.message || 'Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error en login:', error);
            Alert.alert('Error', 'Ocurrió un error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Correo"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
            />

            <TextInput
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
            >
                <Text style={styles.buttonText}>INGRESAR</Text>
            </TouchableOpacity>

           
            <TouchableOpacity
                style={[styles.button, { backgroundColor: '#014259' }]} 
                onPress={() => router.push('/login_alta')}
            >
                <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
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