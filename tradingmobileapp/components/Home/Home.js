import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, ActivityIndicator } from "react-native";
import Styles from "../../styles/Styles";
import { Chip } from "react-native-paper";
import APIs, { endpoints } from "../../configs/APIs";

const Home = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadStores = async () => {
        try {
            let res = await APIs.get(endpoints["stores"]);
            setStores(res.data.results);
        } catch (error) {
            console.error("Error loading stores:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStores();
    }, []);

    return (
        <View style={Styles.container}>
            <Text style={Styles.title}>Danh sách cửa hàng</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#6200ee" style={{ marginTop: 20 }} />
            ) : (
                <ScrollView
                    contentContainerStyle={Styles.scrollViewContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {stores.map((store) => (
                        <Chip
                            key={store.id}
                            icon="storefront"
                            style={Styles.chip}
                            onPress={() => console.log(`Clicked ${store.name}`)}
                        >
                            {store.name}
                        </Chip>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};

export default Home;
