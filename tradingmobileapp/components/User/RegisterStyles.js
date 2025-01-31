import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: "#fff", flexGrow: 1 },
    title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
    input: { marginBottom: 15 },
    label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
    imagePicker: { backgroundColor: "#f0f0f0", padding: 10, alignItems: "center", borderRadius: 8, marginVertical: 10 },
    imagePickerText: { color: "#333" },
    avatar: { width: 100, height: 100, alignSelf: 'center', borderRadius: 50, marginVertical: 10 },
    button: { marginTop: 15 }
});

export default styles;