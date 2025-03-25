import { useEffect, useState } from "react";
import { User } from "@/types/User";

const API_URL = "https://jsonplaceholder.typicode.com/users";

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        try{
            const response = await fetch(API_URL);
            const data: User[] = await response.json();
            setUsers(data);
        }
        catch (error){
            setError('Error al obtener la información');
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    },[]);

    return {users, loading, error}
}