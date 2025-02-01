import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f9f9f9",
      padding: 16,
    },
    card: {
      marginBottom: 16,
      borderRadius: 8,
      elevation: 3,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginRight: 16,
    },
    userInfo: {
      flex: 1,
    },
    name: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#333",
    },
    role: {
      fontSize: 14,
      color: "#777",
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
    },
    divider: {
      marginVertical: 8,
    },
    detailRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    label: {
      fontSize: 16,
      fontWeight: "600",
      color: "#555",
    },
    value: {
      fontSize: 16,
      color: "#333",
    },
    logoutButton: {
      marginTop: 16,
    },
    createStoreButton: {
      marginTop: 10,
      backgroundColor: "#4CAF50", // Màu xanh lá
    },
    
  });
  
  export default styles;