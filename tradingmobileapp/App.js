import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Home from './components/Home/Home';
import Login from './components/User/Login'
import { MyDispatchContext, MyUserContext } from './configs/UserContexts';
import { useReducer } from 'react';
import MyUserReducer from './configs/UserReducers';
// import Component from 'react-native-paper/lib/typescript/components/List/ListItem';

const Stack = createStackNavigator();

export default function App() {
  const [user,dispatch] = useReducer(MyUserReducer, null);

  return (

        <NavigationContainer>
          <MyUserContext.Provider value={user}>
            <MyDispatchContext.Provider value={dispatch}>
              <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Login" component={Login} />
              </Stack.Navigator>
            </MyDispatchContext.Provider>
          </MyUserContext.Provider>
        </NavigationContainer>


  );
}

