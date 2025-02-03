import { StyleSheet } from "react-native";
import Colors from "../../colors/Colors";

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    tabBar: {
      height: 60,
      position: 'relative',
      margin: 10,
      borderRadius: 16,
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
    },
    tabButtonContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default styles;