import { storeData, getData } from "../utils/storage";

const API_URL = 'http://192.168.0.13:3000';

// Función para iniciar sesión
export const loginUser = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
        console.log('Realizando solicitud de login a:', `${API_URL}/api/redirige`);
        console.log('Datos enviados:', { email, password });

        const response = await fetch(`${API_URL}/api/redirige`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        console.log('Respuesta del servidor (status):', response.status);

        const data = await response.json();
        console.log('Respuesta del servidor (data):', data);

        if (response.ok && data.id_login) { 
            return { success: true };
        }
        return { success: false, message: data.msg || 'Error en login' };
    } catch (error) {
        console.error('Error en loginUser:', error);
        return { success: false, message: 'Error de conexión con el servidor' };
    }
};

// Función para registrar un nuevo usuario
export const loginRegister = async (nombre: string, app: string, apm: string, email: string, password: string, rol: string): Promise<{ success: boolean; message?: string }> => {
    try {
        console.log('Realizando solicitud de registro a:', `${API_URL}/api/registros`);
        console.log('Datos enviados:', { nombre, app, apm, email, password });

        const response = await fetch(`${API_URL}/api/registros`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, app, apm, email, password, rol })
        });

        console.log('Respuesta del servidor (status):', response.status);

        const data = await response.json();
        console.log('Respuesta del servidor (data):', data);

        if (response.ok) {
            return { success: true };
        }
        return { success: false, message: data.msg || 'Error en registro' };
    } catch (error) {
        console.error('Error en loginRegister:', error);
        return { success: false, message: 'Error de conexión con el servidor' };
    }
};

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

//Función de médicos
export const medicos = async (page: number, search: string = ''): Promise<{ success: boolean; data?: Medico[]; total?: number; message?: string }> => {
    try {
        const response = await fetch(`${API_URL}/api/medicos?page=${page}&limit=6&search=${encodeURIComponent(search)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al obtener los médicos');
        }

        const result = await response.json();
        return { success: true, data: result.data, total: result.total };
    } catch (error) {
        console.error('Error en medicos:', error);
        return { success: false, message: 'Error de conexión con el servidor' };
    }
};

// Función para registrar un nuevo médico
export const medicoRegister = async (clave: string, nombre: string, app: string, apm: string, fn: string, sex: string, tel: string, email: string): Promise<{ success: boolean; message?: string }> => {
    try {
        console.log('Realizando solicitud de registro a:', `${API_URL}/api/medicos`);
        console.log('Datos enviados:', { clave, nombre, app, apm, fn, sex, tel, email });

        const response = await fetch(`${API_URL}/api/medicos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ clave, nombre, app, apm, fn, sex, tel, email })
        });

        console.log('Respuesta del servidor (status):', response.status);

        const data = await response.json();
        console.log('Respuesta del servidor (data):', data);

        if (response.ok) {
            return { success: true };
        }
        return { success: false, message: data.msg || 'Error en registro' };
    } catch (error) {
        console.error('Error en medicoRegister:', error);
        return { success: false, message: 'Error de conexión con el servidor' };
    }
};

// Función para editar un médico
export const medicoEdit = async (id_medico: string, clave: string, nombre: string, app: string, apm: string, fn: string, sex: string, tel: string, email: string): Promise<{ success: boolean; message?: string }> => {
    try {
        console.log('Realizando solicitud de actualización a:', `${API_URL}/api/medicos/${id_medico}`);
        console.log('Datos enviados:', { clave, nombre, app, apm, fn, sex, tel, email });

        const response = await fetch(`${API_URL}/api/medicos/${id_medico}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ clave, nombre, app, apm, fn, sex, tel, email }),
        });

        console.log('Respuesta del servidor (status):', response.status);

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text(); 
            console.error('Respuesta no es JSON:', text);
            return { success: false, message: 'Error en el servidor: Respuesta no es JSON' };
        }

        const data = await response.json();
        console.log('Respuesta del servidor (data):', data);

        if (response.ok) {
            return { success: true, message: data.message || 'Médico actualizado exitosamente' };
        }
        return { success: false, message: data.error || 'Error en actualización' };
    } catch (error) {
        console.error('Error en medicoEdit:', error);
        return { success: false, message: 'Error de conexión con el servidor' };
    }
};

//Función para obtener detalles de médicos
export const medicosDetails = async (id_medico: string): Promise<{ success: boolean; data?: { id_medico: string; clave: string; nombre: string; app: string; apm: string; fn: string; sex: string; tel: string; email: string; }; message?: string; }> => {
    try {
      const response = await fetch(`${API_URL}/api/medicos/${id_medico}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Respuesta no es JSON:', text);
        return { success: false, message: 'Error en el formato de respuesta del servidor' };
      }
  
      const data = await response.json();
  
      if (!response.ok) {
        return { success: false, message: data.error || 'Error al obtener los detalles del médico' };
      }
  
      return { 
        success: true,
        data: {
          id_medico: data.id_medico,
          clave: data.clave,
          nombre: data.nombre,
          app: data.app,
          apm: data.apm,
          fn: data.fn,
          sex: data.sex,
          tel: data.tel,
          email: data.email
        }
      };
    } catch (error) {
      console.error('Error en medicosDetails:', error);
      return { success: false, message: 'Error de conexión con el servidor' };
    }
  };

//Función para eliminar un medico
export const medicoDelete = async (id_medico: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch(`${API_URL}/api/medicos/${id_medico}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await response.json();
      return response.ok 
        ? { success: true, message: data.message || 'Médico eliminado' }
        : { success: false, message: data.error || 'Error al eliminar' };
    } catch (error) {
      console.error('Error:', error);
      return { success: false, message: 'Error de conexión' };
    }
  };

  interface Paciente {
    id_paciente: number;
    nombre: string;
    app: string;
    apm: string;
    sex: string;
    fn: string;
    tel: string;
}

//Función de pacientes
export const pacientes = async (page: number, search: string = ''): Promise<{ success: boolean; data?: Paciente[]; total?: number; message?: string }> => {
    try {
        const response = await fetch(`${API_URL}/api/pacientes?page=${page}&limit=6&search=${encodeURIComponent(search)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al obtener los pacientes');
        }

        const result = await response.json();
        return { success: true, data: result.data, total: result.total };
    } catch (error) {
        console.error('Error en pacientes:', error);
        return { success: false, message: 'Error de conexión con el servidor' };
    }
};

// Función para registrar un nuevo paciente
export const pacienteRegister = async (nombre: string, app: string, apm: string, sex: string, fn: string, tel: string): Promise<{ success: boolean; message?: string }> => {
    try {
        console.log('Realizando solicitud de registro a:', `${API_URL}/api/pacientes`);
        console.log('Datos enviados:', { nombre, app, apm, sex, fn, tel });

        const response = await fetch(`${API_URL}/api/pacientes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, app, apm, sex, fn, tel })
        });

        console.log('Respuesta del servidor (status):', response.status);

        const data = await response.json();
        console.log('Respuesta del servidor (data):', data);

        if (response.ok) {
            return { success: true };
        }
        return { success: false, message: data.msg || 'Error en registro' };
    } catch (error) {
        console.error('Error en pacienteRegister:', error);
        return { success: false, message: 'Error de conexión con el servidor' };
    }
};

// Función para editar un paciente
export const pacienteEdit = async (id_paciente: string, nombre: string, app: string, apm: string, sex: string, fn: string,  tel: string): Promise<{ success: boolean; message?: string }> => {
    try {
        console.log('Realizando solicitud de actualización a:', `${API_URL}/api/pacientes/${id_paciente}`);
        console.log('Datos enviados:', { nombre, app, apm, sex, fn, tel });

        const response = await fetch(`${API_URL}/api/pacientes/${id_paciente}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, app, apm, sex, fn,  tel }),
        });

        console.log('Respuesta del servidor (status):', response.status);

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text(); 
            console.error('Respuesta no es JSON:', text);
            return { success: false, message: 'Error en el servidor: Respuesta no es JSON' };
        }

        const data = await response.json();
        console.log('Respuesta del servidor (data):', data);

        if (response.ok) {
            return { success: true, message: data.message || 'Paciente actualizado exitosamente' };
        }
        return { success: false, message: data.error || 'Error en actualización' };
    } catch (error) {
        console.error('Error en pacienteEdit:', error);
        return { success: false, message: 'Error de conexión con el servidor' };
    }
};

//Función para obtener detalles de pacientes
export const pacientesDetails = async (id_paciente: string): Promise<{ success: boolean; data?: { id_paciente: string; nombre: string; app: string; apm: string; sex: string; fn: string; tel: string; }; message?: string; }> => {
    try {
      const response = await fetch(`${API_URL}/api/pacientes/${id_paciente}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Respuesta no es JSON:', text);
        return { success: false, message: 'Error en el formato de respuesta del servidor' };
      }
  
      const data = await response.json();
  
      if (!response.ok) {
        return { success: false, message: data.error || 'Error al obtener los detalles del paciente' };
      }
  
      return { 
        success: true,
        data: {
          id_paciente: data.id_paciente,
          nombre: data.nombre,
          app: data.app,
          apm: data.apm,
          sex: data.sex,
          fn: data.fn,
          tel: data.tel,
        }
      };
    } catch (error) {
      console.error('Error en pacientesDetails:', error);
      return { success: false, message: 'Error de conexión con el servidor' };
    }
  };

//Función para eliminar un paciente
export const pacienteDelete = async (id_paciente: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch(`${API_URL}/api/pacientes/${id_paciente}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await response.json();
      return response.ok 
        ? { success: true, message: data.message || 'Paciente eliminado' }
        : { success: false, message: data.error || 'Error al eliminar' };
    } catch (error) {
      console.error('Error:', error);
      return { success: false, message: 'Error de conexión' };
    }
  };

  interface Cita {
    id_cita?: number;
    fecha: string;
    hora: string;
    id_paciente: number;
    id_medico: number;
    detalle: string;
  }

//Función de citas
export const citas = async (): Promise<{ success: boolean; data?: any[]; message?: string }> => {
    try {
      const response = await fetch(`${API_URL}/api/citas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Respuesta no es JSON');
      }
  
      const data = await response.json();
  
      if (!response.ok) {
        return { 
          success: false, 
          message: data.error || 'Error al obtener citas' 
        };
      }
  
      return { 
        success: true, 
        data: data 
      };
    } catch (error) {
      console.error('Error en citas:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  };

// Función para registrar una nueva cita
export const createCita = async (fecha: string, hora: string, id_paciente: number, id_medico: number, detalle: string): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      if (!fecha || !hora || !id_paciente || !id_medico) {
        return { 
          success: false, 
          message: 'Todos los campos son requeridos' 
        };
      }
  
      const response = await fetch(`${API_URL}/api/citas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          fecha, 
          hora, 
          id_paciente, 
          id_medico, 
          detalle 
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        return { 
          success: false, 
          message: data.error || 'Error al crear cita' 
        };
      }
  
      return { 
        success: true, 
        data: data,
        message: 'Cita creada exitosamente' 
      };
    } catch (error) {
      console.error('Error en createCita:', error);
      return { 
        success: false, 
        message: 'Error de conexión con el servidor' 
      };
    }
  };