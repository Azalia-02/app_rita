import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Button, Alert, ActivityIndicator } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { medicoRegister } from './services/authService';
import { useRouter } from 'expo-router';

export default function MedicoAltaScreen() {
    const [clave, setClave] = useState("");
    const [nombre, setNombre] = useState("");
    const [app, setApp] = useState("");
    const [apm, setApm] = useState("");
    const [fn, setFn] = useState(new Date()); 
    const [showDatePicker, setShowDatePicker] = useState(false); 
    const [sex, setSex] = useState("Masculino");
    const [tel, setTel] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDateChange = (date: Date) => {
        setShowDatePicker(false); 
        setFn(date); 
    };

    const handleRegister = async () => {
            if (!nombre || !app || !apm || !fn || !sex || !tel || !email) {
                Alert.alert('Error', 'Todos los campos son obligatorios');
                return;
            }
    
            setLoading(true);
    
            try {
                const response = await medicoRegister(clave, nombre, app, apm, fn, sex, tel, email);
                console.log('Respuesta del servidor:', response);
    
                if (response.success) {
                    router.push('/(tabs)/Medicos');
                } else {
                    Alert.alert('Error', response.message || 'Error al registrar usuario');
                }
            } catch (error) {
                Alert.alert('Error', 'Error de conexión con el servidor');
            } finally {
                setLoading(false);
            }
        };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Clave"
                value={clave}
                onChangeText={setClave}
            />
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={nombre}
                onChangeText={setNombre}
            />
            <TextInput
                style={styles.input}
                placeholder="Apellido Paterno"
                value={app}
                onChangeText={setApp}
            />
            <TextInput
                style={styles.input}
                placeholder="Apellido Materno"
                value={apm}
                onChangeText={setApm}
            />

            <TouchableOpacity
                style={styles.input}
                onPress={() => setShowDatePicker(true)} 
            >
                <Text>{fn.toLocaleDateString()}</Text> 
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={fn} 
                    mode="date"
                    display="default"
                    onChange={(event, date) => {
                        if (date) {
                            handleDateChange(date); 
                        }
                    }}
                />
            )}

            <Picker
                selectedValue={sex}
                onValueChange={(itemValue) => setSex(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Femenino" value="Femenino" />
                <Picker.Item label="Masculino" value="Masculino" />
            </Picker>

            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Teléfono"
                value={tel}
                onChangeText={setTel}
                keyboardType="phone-pad"
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
                disabled={loading || !nombre || !email }
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
        padding: 16,
        alignItems: 'center',
        backgroundColor: '#f0f8ff', 
        justifyContent: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 8,
        marginBottom: 12,
        justifyContent: 'center',
        width: '80%',
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