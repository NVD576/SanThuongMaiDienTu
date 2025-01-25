import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Home from './components/Home/Home';
import StoreProducts from './components/Home/StoreProducts';
import Login from './components/User/Login'
// import Component from 'react-native-paper/lib/typescript/components/List/ListItem';

const Stack = createStackNavigator();

export default function App() {
  return (
    // <Login/>
    // <Home/>

    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="StoreProducts" component={StoreProducts} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}

