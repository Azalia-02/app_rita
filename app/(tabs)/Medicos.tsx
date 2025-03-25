import React, { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, Alert } from "react-native";
import { medicos, medicoDelete } from '../services/authService'; 
import { useRouter } from 'expo-router';

interface Medico {
    id_medico: number;
    clave: string;
    nombre: string;
    app: string;
    apm: string;
    fn: string;
    sex: string;
    tel: string;
    email: string;
}

export default function MedicosScreen() {
    const [medicosData, setMedicosData] = useState<Medico[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [hasMore, setHasMore] = useState(true);
    const router = useRouter();

    const fetchMedicos = useCallback(async (page: number, search: string = '', reset: boolean = false) => {
        if ((!reset && !hasMore) || loading) return;

        setLoading(true);
        try {
            const result = await medicos(page, search);
            if (result.success && result.data) {
                const newItems = reset 
                    ? result.data 
                    : result.data.filter(newItem => 
                        !medicosData.some(item => item.id_medico === newItem.id_medico)
                    );

                setMedicosData(prev => 
                    reset ? newItems : [...prev, ...newItems]
                );
                
                setTotal(result.total || 0);
                setHasMore(result.data.length > 0 && medicosData.length + result.data.length < (result.total || 0));
            }
        } catch (error) {
            console.error("Error al cargar médicos:", error);
        } finally {
            setLoading(false);
        }
    }, [medicosData, hasMore, loading]);

    useEffect(() => {
        if (searchQuery) {
            setPage(1);
            fetchMedicos(1, searchQuery, true);
        } else {
            fetchMedicos(page, searchQuery, page === 1);
        }
    }, [page, searchQuery]);

    const handleEditMedico = (medico: Medico) => {
        router.push({
            pathname: "/medico_editar",
            params: { id_medico: medico.id_medico,
                      clave: medico.clave,
                      nombre: medico.nombre,
                      app: medico.app,
                      apm: medico.apm,
                      fn: medico.fn, 
                      sex: medico.sex,
                      tel: medico.tel,
                      email: medico.email }
          });
      };

    const handleDetailsMedico = (medico: Medico) => {
        router.push({
            pathname: "/medico_detalle",
            params: { id_medico: medico.id_medico }
          });
      };

      const handleDelete = async (id: string) => {
        Alert.alert(
          'Confirmar',
          '¿Eliminar este médico?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Eliminar', 
              onPress: async () => {
                const result = await medicoDelete(id);
                if (result.success) {
                  setTotal(prev => prev - 1);
                  setMedicosData(prev => prev.filter(m => m.id_medico.toString() !== id));
                  Alert.alert('Éxito', 'Médico eliminado');
                } else {
                  Alert.alert('Error', result.message || 'No se pudo eliminar');
                }
              }
            }
          ]
        );
      };

      const renderItem = ({ item }: { item: Medico }) => (
        <View style={styles.row}>
          <Text style={styles.cell}>{item.nombre}</Text>
          <Text style={styles.cell}>{item.app}</Text>
          <Text style={styles.cell}>{item.fn}</Text>
          <View style={styles.actionsColumn}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditMedico(item)}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDetailsMedico(item)}
            >
              <Text style={styles.buttonText}>Detalle</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => handleDelete(item.id_medico.toString())}
            >
              <Text style={styles.buttonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Buscar médico..."
                value={searchQuery}
                onChangeText={(text) => {
                    setSearchQuery(text);
                    setPage(1); 
                }}
            />

            <TouchableOpacity
                style={styles.newButton}
                onPress={() => router.push("/medico_alta")}
            >
                <Text style={styles.newButtonText}>Nuevo Registro</Text>
            </TouchableOpacity>

            <View style={styles.header}>
                <Text style={styles.headerCell}>Nombre</Text>
                <Text style={styles.headerCell}>Apellido Paterno</Text>
                <Text style={styles.headerCell}>Fecha de Nacimiento</Text>
                <Text style={styles.headerCell}>Acciones</Text>
            </View>

            {loading && page === 1 ? (
                <ActivityIndicator size="large" color="#014259" />
            ) : (
            <FlatList
                data={medicosData}
                keyExtractor={(item) => `${item.id_medico}-${page}`} 
                renderItem={renderItem}
                onEndReached={() => {
                if (!loading && medicosData.length < total) {
                setPage(prevPage => prevPage + 1);
                }
                }}
                onEndReachedThreshold={0.2} 
                ListEmptyComponent={
                loading ? (
            <ActivityIndicator size="large" color="#014259" />
                ) : (
            <Text style={styles.emptyText}>No hay médicos registrados.</Text>
                )
                }
                ListFooterComponent={
                loading && page > 1 ? (
            <ActivityIndicator size="small" color="#014259" style={styles.loadingFooter} />
                ) : null
                }
                extraData={total} 
            />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#f0f8ff',
    },
    searchInput: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 8,
      marginBottom: 12,
      backgroundColor: '#fff',
    },
    header: {
      flexDirection: 'row',
      backgroundColor: '#014259',
      padding: 10,
      borderRadius: 5,
    },
    headerCell: {
      flex: 1,
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    row: {
      flexDirection: 'row',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      alignItems: 'center',
    },
    cell: {
      flex: 1,
      textAlign: 'center',
    },
    actionsColumn: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    actionButton: {
      padding: 6,
      borderRadius: 4,
      marginVertical: 2, 
      width: 60,
      alignItems: 'center',
      backgroundColor: '#014259',
    },
    deleteButton: {
      backgroundColor: '#014259',
    },
    buttonText: {
      color: '#fff',
      fontSize: 12,
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 20,
      color: '#888',
    },
    newButton: {
      backgroundColor: '#014259',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginBottom: 12,
    },
    newButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    loadingFooter: {
        paddingVertical: 20,
      },
      
  });