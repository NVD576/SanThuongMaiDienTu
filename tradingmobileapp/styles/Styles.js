import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        // flex : 1,
        // justifyContent: 'center',
        // alignContent : 'center'
        flex: 1, // Chiếm toàn bộ màn hình
        alignItems: 'center', // Căn giữa theo trục ngang
        paddingTop: 50,
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