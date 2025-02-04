import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: { 
        padding: 20, 
        backgroundColor: "#f8f9fa", 
        flexGrow: 1 
    },
    title: { 
        fontSize: 26, 
        fontWeight: "bold", 
        textAlign: "center", 
        marginBottom: 20, 
        color: "#333" 
    },
    input: {
        height: 50,
        borderColor: "#e0e0e0",
        borderWidth: 1,
        borderRadius: 12,
        paddingLeft: 15,
        fontSize: 16,
        backgroundColor: "#fff",
        marginBottom: 20,
      },
    label: { 
        fontSize: 16, 
        fontWeight: "bold", 
        marginBottom: 5, 
        color: "#555" 
    },
    imagePicker: { 
        backgroundColor: "#e9ecef", 
        padding: 12, 
        alignItems: "center", 
        borderRadius: 10, 
        marginVertical: 10 
    },
    imagePickerText: { 
        color: "#555", 
        fontSize: 16 
    },
    avatar: { 
        width: 100, 
        height: 100, 
        alignSelf: 'center', 
        borderRadius: 50, 
        marginVertical: 15, 
        borderWidth: 2, 
        borderColor: "#ccc"
    },
    button: { 
        marginTop: 20, 
        backgroundColor: "#28a745", 
        paddingVertical: 12, 
        borderRadius: 8, 
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#fff"
    },
    buttonPressed: {
        opacity: 0.8
    }
});

export default styles;
