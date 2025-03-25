import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { pacientes, medicos, createCita, citas } from '../services/authService';

interface Paciente {
  id_paciente: number; 
  nombre: string;
  app: string;
  apm: string;
}

interface Medico {
  id_medico: number;
  nombre: string;
  app: string;
  apm: string;
}

interface Cita {
  id_cita: string;
  id_paciente: number;
  id_medico: number;
  fecha: string;
  hora: string;
  detalle: string;
  paciente_nombre?: string;
  medico_nombre?: string;
}

export default function CitasScreen() {
  const [listaPacientes, setListaPacientes] = useState<Paciente[]>([]);
  const [listaMedicos, setListaMedicos] = useState<Medico[]>([]);
  const [listaCitas, setListaCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    id_cita: '',
    fecha: new Date(),
    hora: '09:00',
    id_paciente: '',
    id_medico: '',
    detalle: ''
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [pacientesRes, medicosRes, citasRes] = await Promise.all([
          pacientes(1, ''),
          medicos(1, ''),
          citas()
        ]);
        
        if (pacientesRes.success && pacientesRes.data) {
          setListaPacientes(pacientesRes.data);
        }
        if (medicosRes.success && medicosRes.data) {
          setListaMedicos(medicosRes.data);
        }
        if (citasRes.success && citasRes.data && pacientesRes.data && medicosRes.data) {
          const citasConNombres = citasRes.data.map((cita: Cita) => {
          const paciente = pacientesRes.data?.find((p: Paciente) => p.id_paciente === cita.id_paciente);
          const medico = medicosRes.data?.find((m: Medico) => m.id_medico === cita.id_medico);
            return {
              ...cita,
              paciente_nombre: paciente ? `${paciente.nombre} ${paciente.app} ${paciente.apm}` : '',
              medico_nombre: medico ? `${medico.nombre} ${medico.app} ${medico.apm}` : ''
            };
          });
          setListaCitas(citasConNombres);
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setFormData({ ...formData, fecha: date });
    }
  };

  const generateHours = () => {
    const hours = [];
    for (let i = 9; i <= 18; i++) {
      hours.push(`${i.toString().padStart(2, '0')}:00`);
      if (i < 18) hours.push(`${i.toString().padStart(2, '0')}:30`);
    }
    return hours;
  };

  const fechaStr = formData.fecha.toISOString().split('T')[0];

  const handleSave = async () => {
    setLoading(true);
    try {
      if (!formData.id_paciente || !formData.id_medico) {
        alert("Debes seleccionar un paciente y un médico");
        return;
      }
  
      const idPaciente = Number(formData.id_paciente);
      const idMedico = Number(formData.id_medico);
  
      const response = await createCita(
        fechaStr,                     
        formData.hora,
        idPaciente,
        idMedico,
        formData.detalle || ""        
      );
  
      if (response.success && response.data) {
        const paciente = listaPacientes.find(p => p.id_paciente === idPaciente);
        const medico = listaMedicos.find(m => m.id_medico === idMedico);
        
        const nuevasCitas = [...listaCitas, {
          ...response.data,
          paciente_nombre: paciente ? `${paciente.nombre} ${paciente.app} ${paciente.apm}` : '',
          medico_nombre: medico ? `${medico.nombre} ${medico.app} ${medico.apm}` : ''
        }];

        const resetForm = () => {
          setFormData({
            id_cita: '',
            id_paciente: '',
            id_medico: '',
            fecha: new Date(),
            hora: '09:00',
            detalle: ''
          });
        };
        
        setListaCitas(nuevasCitas);
        resetForm();
      } else {
        alert(response.message || 'Error al crear cita');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Cita }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.paciente_nombre}</Text>
      <Text style={styles.tableCell}>{item.medico_nombre}</Text>
      <Text style={styles.tableCell}>{item.fecha}</Text>
      <Text style={styles.tableCell}>{item.hora}</Text>
      <Text style={styles.tableCell}>{item.detalle}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Agendar Nueva Cita</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Paciente:</Text>
        <Picker
          selectedValue={formData.id_paciente}
          onValueChange={(itemValue) => handleInputChange('id_paciente', itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione un paciente..." value="" />
          {listaPacientes.map(paciente => (
            <Picker.Item 
              key={paciente.id_paciente} 
              label={`${paciente.nombre} ${paciente.app} ${paciente.apm}`} 
              value={paciente.id_paciente.toString()} 
            />
          ))}
        </Picker>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Médico:</Text>
        <Picker
          selectedValue={formData.id_medico}
          onValueChange={(itemValue) => handleInputChange('id_medico', itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione un médico..." value="" />
          {listaMedicos.map(medico => (
            <Picker.Item 
              key={medico.id_medico} 
              label={`${medico.nombre} ${medico.app} ${medico.apm}`} 
              value={medico.id_medico.toString()} 
            />
          ))}
        </Picker>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Fecha:</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{formData.fecha.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={formData.fecha}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Hora:</Text>
        <Picker
          selectedValue={formData.hora}
          onValueChange={(itemValue) => handleInputChange('hora', itemValue)}
          style={styles.picker}
        >
          {generateHours().map(hora => (
            <Picker.Item key={hora} label={hora} value={hora} />
          ))}
        </Picker>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Motivo:</Text>
        <TextInput
          style={styles.textInput}
          value={formData.detalle}
          onChangeText={(text) => handleInputChange('detalle', text)}
          placeholder="Descripción del motivo de la cita"
          multiline
        />
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveButtonText}>
          {loading ? 'Guardando...' : 'Guardar Cita'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Citas Agendadas</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Paciente</Text>
        <Text style={styles.headerCell}>Médico</Text>
        <Text style={styles.headerCell}>Fecha</Text>
        <Text style={styles.headerCell}>Hora</Text>
        <Text style={styles.headerCell}>Motivo</Text>
      </View>
      
      {listaCitas.length > 0 ? (
        <FlatList
          data={listaCitas}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_cita.toString()}
          scrollEnabled={false}
        />
      ) : (
        <Text style={styles.noDataText}>No hay citas agendadas</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: '600',
    color: '#444',
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dateInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  textInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#014259',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#014259',
    padding: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  headerCell: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 8,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontStyle: 'italic',
  },
});