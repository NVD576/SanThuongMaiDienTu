import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, ActivityIndicator, StyleSheet } from "react-native";
import { Chip, Button } from "react-native-paper";
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
        <View style={styles.container}>
            <Text style={styles.title}>Danh Sách Cửa Hàng</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#6200ee" style={styles.loading} />
            ) : (
                <ScrollView
                    contentContainerStyle={styles.scrollViewContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {stores.map((store) => (
                        <Chip
                            key={store.id}
                            icon="storefront"
                            style={styles.chip}
                            textStyle={styles.chipText}
                            onPress={() => navigation.navigate("StoreProducts", { storeId: store.id })}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 16,
        textAlign: "center",
    },
    loading: {
        marginTop: 20,
    },
    scrollViewContainer: {
        paddingVertical: 10,
    },
    chip: {
        marginVertical: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 16,
        backgroundColor: "#fff",
        elevation: 2, // Shadow for Android
        shadowColor: "#000", // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    chipText: {
        fontSize: 16,
        color: "#6200ee",
    },
    button: {
        marginTop: 20,
        backgroundColor: "#6200ee",
        borderRadius: 8,
        alignSelf: "center",
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    buttonText: {
        fontSize: 16,
        color: "#fff",
    },
});
