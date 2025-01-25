import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Home from './components/Home/Home';
import StoreProducts from './components/Home/StoreProducts';
import Login from './components/User/Login'
import Default from './components/DefaultApp/Default';
import { MyDispatchContext, MyUserContext } from './configs/UserContexts';
import { useReducer } from 'react';
import MyUserReducer from './configs/UserReducers';
import Register from './components/User/Register'
import UserProfile from './components/User/UserProfile';
// import Component from 'react-native-paper/lib/typescript/components/List/ListItem';

const Stack = createStackNavigator();

export default function App() {
  const [user,dispatch] = useReducer(MyUserReducer, null);

  return (

        <NavigationContainer>
          <MyUserContext.Provider value={{ user, loginInfo: (userData) => dispatch({ type: "login", payload: userData }) }}>
            <MyDispatchContext.Provider value={dispatch}>
            <View style={{ flex: 1, marginTop: 25 }}>
              <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Default">
                <Stack.Screen name="Default" component={Default} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="StoreProducts" component={StoreProducts} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="UserProfile" component={UserProfile} />
              </Stack.Navigator>
            </View>
            </MyDispatchContext.Provider>
          </MyUserContext.Provider>
        </NavigationContainer>

  );
}

