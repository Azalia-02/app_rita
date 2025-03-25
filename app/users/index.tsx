import { useUsers } from "@/hooks/useUsers";
import React from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { red } from "react-native-reanimated/lib/typescript/Colors";
import { User } from "@/types/User";

const UserListScreen = () => {
    const {error, loading, users} = useUsers();

    if(loading){
        return <ActivityIndicator size='large' color='red'/>
    }

    if(error){
        return <Text>{error}</Text>;
    }

    const renderItem = ({item}: {item: User}) => (
        <View>
            <Text>{item.name}</Text>
            <Text>{item.email}</Text>
            <Text>{item.phone}</Text>
        </View>
    )

    return(
        <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        />
    )
}

export default UserListScreen;
