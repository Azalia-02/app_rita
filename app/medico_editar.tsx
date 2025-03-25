import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { medicoEdit } from './services/authService';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function MedicoEditScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{
        id_medico: string;
        clave: string;
        nombre: string;
        app: string;
        apm: string;
        fn: string;
        sex: string;
        tel: string;
        email: string;
    }>();

    const [formData, setFormData] = useState({
        id_medico: params.id_medico || "",
        clave: params.clave || "",
        nombre: params.nombre || "",
        app: params.app || "",
        apm: params.apm || "",
        fn: params.fn ? new Date(params.fn) : new Date(),
        sex: params.sex || "Masculino",
        tel: params.tel || "",
        email: params.email || ""
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleDateChange = (event: any, date?: Date) => {
        setShowDatePicker(false);
        if (date) {
            setFormData({...formData, fn: date});
        }
    };

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData({...formData, [field]: value});
    };

    const handleRegister = async () => {
        if (!formData.clave || !formData.nombre || !formData.app || !formData.apm || !formData.sex || !formData.tel || !formData.email) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }

        setLoading(true);

        try {
            const response = await medicoEdit(
                formData.id_medico,
                formData.clave,
                formData.nombre,
                formData.app,
                formData.apm,
                formatDate(formData.fn),
                formData.sex,
                formData.tel,
                formData.email
            );

            if (response.success) {
                Alert.alert('Éxito', response.message || 'Médico actualizado exitosamente');
                router.back();
            } else {
                Alert.alert('Error', response.message || 'Error al actualizar médico');
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
                value={formData.clave}
                onChangeText={(text) => handleInputChange('clave', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={formData.nombre}
                onChangeText={(text) => handleInputChange('nombre', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Apellido Paterno"
                value={formData.app}
                onChangeText={(text) => handleInputChange('app', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Apellido Materno"
                value={formData.apm}
                onChangeText={(text) => handleInputChange('apm', text)}
            />

            <TouchableOpacity
                style={styles.input}
                onPress={() => setShowDatePicker(true)}
            >
                <Text>{formData.fn.toLocaleDateString()}</Text>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={formData.fn}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            <Picker
                selectedValue={formData.sex}
                onValueChange={(itemValue) => handleInputChange('sex', itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Femenino" value="Femenino" />
                <Picker.Item label="Masculino" value="Masculino" />
            </Picker>

            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Teléfono"
                value={formData.tel}
                onChangeText={(text) => handleInputChange('tel', text)}
                keyboardType="phone-pad"
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
                disabled={loading} 
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Actualizar</Text>
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