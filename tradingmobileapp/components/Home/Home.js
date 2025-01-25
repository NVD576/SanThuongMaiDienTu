import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, ActivityIndicator } from "react-native";
import Styles from "../../styles/Styles";
import { Chip, Button  } from "react-native-paper";
import APIs, { endpoints } from "../../configs/APIs";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation(); 

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
                            onPress={() => navigation.navigate("StoreProducts", { storeId: store.id })}
                        >
                            {store.name}
                        </Chip>
                    ))}
                </ScrollView>
            )}
            <Button
                mode="contained"
                onPress={() => navigation.navigate("Login")}
                style={Styles.loginButton} 
                >
                Go to Login
            </Button>
        </View>
    );
};

export default Home;


