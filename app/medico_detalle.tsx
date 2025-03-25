import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { medicosDetails } from "./services/authService";

interface Medico {
    id_medico: string;
    clave: string;
    nombre: string;
    app: string;
    apm: string;
    fn: string;
    sex: string;
    tel: string;
    email: string;
}

export default function MedicoDetailScreen() {
    const { id_medico } = useLocalSearchParams<{ id_medico: string }>();
    const router = useRouter();
    const [medico, setMedico] = useState<Medico | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMedico = async () => {
            try {
                if (!id_medico) {
                    throw new Error('ID de médico no proporcionado');
                }

                const response = await medicosDetails(id_medico.toString());
                
                if (response.success && response.data) {
                    setMedico(response.data);
                } else {
                    Alert.alert('Error', response.message || 'No se pudieron obtener los datos del médico');
                    router.back();
                }
            } catch (error) {
                console.error('Error al cargar médico:', error);
                Alert.alert('Error', 'No se pudo cargar la información del médico');
                router.back();
            } finally {
                setLoading(false);
            }
        };

        fetchMedico();
    }, [id_medico]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#014259" />
            </View>
        );
    }

    if (!medico) {
        return (
            <View style={styles.container}>
                <Text>No se encontró información del médico</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <View style={styles.field}>
                    <Text style={styles.label}>Clave:</Text>
                    <Text style={styles.value}>{medico.clave}</Text>
                </View>
                
                <View style={styles.field}>
                    <Text style={styles.label}>Nombre:</Text>
                    <Text style={styles.value}>{medico.nombre}</Text>
                </View>
                
                <View style={styles.field}>
                    <Text style={styles.label}>Apellido Paterno:</Text>
                    <Text style={styles.value}>{medico.app}</Text>
                </View>
                
                <View style={styles.field}>
                    <Text style={styles.label}>Apellido Materno:</Text>
                    <Text style={styles.value}>{medico.apm}</Text>
                </View>
                
                <View style={styles.field}>
                    <Text style={styles.label}>Fecha de Nacimiento:</Text>
                    <Text style={styles.value}>
                    {new Date(medico.fn).toLocaleDateString()}
                    </Text>
                </View>
                
                <View style={styles.field}>
                    <Text style={styles.label}>Sexo:</Text>
                    <Text style={styles.value}>{medico.sex}</Text>
                </View>
                
                <View style={styles.field}>
                    <Text style={styles.label}>Teléfono:</Text>
                    <Text style={styles.value}>{medico.tel}</Text>
                </View>
                
                <View style={styles.field}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{medico.email}</Text>
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