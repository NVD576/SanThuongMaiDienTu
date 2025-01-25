import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "./APIs"

const MyUserReducer = (currentState, action) => {
    switch (action.type) {
        case "login":
            return action.payload;
        case "logout":
            return null; 
        default:
            return currentState;
    }
};

export default MyUserReducer;
