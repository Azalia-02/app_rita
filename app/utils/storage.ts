import AsyncStorage from '@react-native-async-storage/async-storage'

//Guardar los valores de almacenamiento
export const storeData = async (key: string , value: string) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
        console.log('Error al guardar en storeData', error);
    }
}

//Obtener los valores almacenados
export const getData =  async (key: string) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (error) {
        console.log('Error al obtener getData', error);
    }
}

export const removeData = async (key : string) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.log('Error al obtener removeData', error);
    }
}

export const clearStorage = async() => {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.log('Error al obtener clearStorage', error);
    }
}