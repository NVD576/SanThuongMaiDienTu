import React, { useEffect, useState } from "react";
import { Text, View} from "react-native";
import Styles from "../../styles/Styles";
import { Chip } from "react-native-paper";
import APIs, { endpoints } from "../../configs/APIs";

const Home = () => {
    const [stores, setStores] = useState([]);

    const loadStores = async () => {
        let res = await APIs.get(endpoints['stores']);
        setStores(res.data);
    }

    useEffect(() => {
        loadStores();
    }, []);

    return (
        <View style={Styles.container}>
            <Text style={Styles.title_login}>Danh sách cửa hàng</Text>
            {stores.map(s => <Chip key={s.id} icon="label">{s.name}</Chip>)}
        </View>
    ) 
};

export default Home;


