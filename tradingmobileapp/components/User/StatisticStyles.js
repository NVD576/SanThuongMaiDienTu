import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#f0f2f5',
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#333',
    },
    subtitle: {
      fontSize: 20,
      fontWeight: '600',
      marginTop: 20,
      marginBottom: 10,
      color: '#444',
    },
    statContainer: {
      marginVertical: 10,
      padding: 16,
      backgroundColor: '#fff',
      borderRadius: 12,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    storeName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#007bff',
      marginBottom: 4,
    },
    storeValue: {
      fontSize: 16,
      color: '#555',
    },
    errorText: {
      fontSize: 18,
      color: 'red',
      textAlign: 'center',
    },
});

export default styles;
