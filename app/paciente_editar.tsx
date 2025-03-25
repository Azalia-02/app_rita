import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { pacienteEdit } from './services/authService';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function PacienteEditScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{
        id_paciente: string;
        nombre: string;
        app: string;
        apm: string;
        sex: string;
        fn: string;
        tel: string;
    }>();

    const [formData, setFormData] = useState({
        id_paciente: params.id_paciente || "",
        nombre: params.nombre || "",
        app: params.app || "",
        apm: params.apm || "",
        sex: params.sex || "Masculino",
        fn: params.fn ? new Date(params.fn) : new Date(),
        tel: params.tel || ""
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
        if (!formData.nombre || !formData.app || !formData.apm || !formData.sex || !formData.tel ) {
            Alert.alert('Error', 'Todos los campos son obligatorios');
            return;
        }

        setLoading(true);

        try {
            const response = await pacienteEdit(
                formData.id_paciente,
                formData.nombre,
                formData.app,
                formData.apm,
                formData.sex,
                formatDate(formData.fn),
                formData.tel
            );

            if (response.success) {
                Alert.alert('Éxito', response.message || 'Paciente actualizado exitosamente');
                router.back();
            } else {
                Alert.alert('Error', response.message || 'Error al actualizar paciente');
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

            <Picker
                selectedValue={formData.sex}
                onValueChange={(itemValue) => handleInputChange('sex', itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="Femenino" value="Femenino" />
                <Picker.Item label="Masculino" value="Masculino" />
            </Picker>

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