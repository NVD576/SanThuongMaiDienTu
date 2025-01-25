import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 40,
        backgroundColor: "#f9f9f9",
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: "red",
        textAlign: "center",
        marginBottom: 20,
        // color: "#333",
    },
    loginButton: {
        backgroundColor: "#3498db", 
        borderRadius: 50, 
        paddingVertical: 12, 
        paddingHorizontal: 20, 
        elevation: 5, 
    },
    scrollViewContainer: {
        flexGrow: 1,
        alignItems: "center",
    },
    chip: {
        marginVertical: 8,
        padding: 10,
        backgroundColor: "#6200ee",
        borderRadius: 20,
    },
    text_style:{
        fontSize: 40,
        color: "red",

    },
    title_login: {
        fontSize: 20,
        justifyContent: 'center',
        alignContent : 'center'
    }
})