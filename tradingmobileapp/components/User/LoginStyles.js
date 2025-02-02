import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  form: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222", 
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0", 
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#222",
  },
  icon: {
    marginRight: 10,
  },
  button: {
    height: 50,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  forgotPassword: {
    fontSize: 14,
    color: "#007BFF",
    textDecorationLine: "underline",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  register: {
    fontSize: 14,
    color: "#007BFF",
    textDecorationLine: "underline",
  },
});

export default styles;
