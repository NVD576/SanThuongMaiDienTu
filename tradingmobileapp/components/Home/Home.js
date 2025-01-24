import React, { useEffect, useState } from "react";
import { Text, View} from "react-native";
import Styles from "../../styles/Styles";
import { Chip } from "react-native-paper";
import APIs, { endpoints } from "../../configs/APIs";

const Home = () => {
    const [stores, setStores] = useState([]);

    const loadStores = async () => {
        try {
            let res = await APIs.get(endpoints['stores']);
            setStores(res.data.results)
        } catch (error) {
            console.error("Error loading stores:", error);
        }
    };
    

    useEffect(() => {
        loadStores();
    }, []);

    return (
        <View style={Styles.container}>
            <Text>Danh sách cửa hàng</Text>
            {stores.map((s) => <Chip key={s.id} icon="label">{s.name}</Chip>)}
        </View>
    ) 
};



