import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { pacientesDetails } from "./services/authService";

interface Paciente {
    id_paciente: string;
    nombre: string;
    app: string;
    apm: string;
    fn: string;
    sex: string;
    tel: string;
}

export default function PacienteDetailScreen() {
    const { id_paciente } = useLocalSearchParams<{ id_paciente: string }>();
    const router = useRouter();
    const [paciente, setPaciente] = useState<Paciente | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPaciente = async () => {
            try {
                if (!id_paciente) {
                    throw new Error('ID de paciente no proporcionado');
                }

                const response = await pacientesDetails(id_paciente.toString());
                
                if (response.success && response.data) {
                    setPaciente(response.data);
                } else {
                    Alert.alert('Error', response.message || 'No se pudieron obtener los datos del paciente');
                    router.back();
                }
            } catch (error) {
                console.error('Error al cargar paciente:', error);
                Alert.alert('Error', 'No se pudo cargar la información del paciente');
                router.back();
            } finally {
                setLoading(false);
            }
        };

        fetchPaciente();
    }, [id_paciente]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#014259" />
            </View>
        );
    }

    if (!paciente) {
        return (
            <View style={styles.container}>
                <Text>No se encontró información del paciente</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                
                <View style={styles.field}>
                    <Text style={styles.label}>Nombre:</Text>
                    <Text style={styles.value}>{paciente.nombre}</Text>
                </View>
                
                <View style={styles.field}>
                    <Text style={styles.label}>Apellido Paterno:</Text>
                    <Text style={styles.value}>{paciente.app}</Text>
                </View>
                
                <View style={styles.field}>
                    <Text style={styles.label}>Apellido Materno:</Text>
                    <Text style={styles.value}>{paciente.apm}</Text>
                </View>
                
                <View style={styles.field}>
                    <Text style={styles.label}>Fecha de Nacimiento:</Text>
                    <Text style={styles.value}>
                    {new Date(paciente.fn).toLocaleDateString()}
                    </Text>
                </View>
                
                <View style={styles.field}>
                    <Text style={styles.label}>Sexo:</Text>
                    <Text style={styles.value}>{paciente.sex}</Text>
                </View>
                
                <View style={styles.field}>
                    <Text style={styles.label}>Teléfono:</Text>
                    <Text style={styles.value}>{paciente.tel}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#f0f8ff',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    field: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 3,
    },
    value: {
        fontSize: 16,
        color: '#333',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
    },
    loadingContainer: { // ← Estilo añadido
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f8ff',
      },
});