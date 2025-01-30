import React, { useEffect, useState, useReducer } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './components/Home/Home';
import StoreProducts from './components/Home/ProductDetails';
import Login from './components/User/Login';
import Default from './components/DefaultApp/Default';
import { MyDispatchContext, MyUserContext } from './configs/UserContexts';
import MyUserReducer from './configs/UserReducers';
import Register from './components/User/Register';
import UserProfile from './components/User/UserProfile';
import ProductDetails from './components/Home/ProductDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShoppingCart from './components/Home/ShoppingCart';
import Bill from './components/Home/Bill';
import ProductComparison from './components/Home/ProductComparison ';

const Stack = createStackNavigator();

export default function App() {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const appStateListener = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background') {
        // Ứng dụng chuyển sang chế độ nền, xóa `user_id` ở đây
        AsyncStorage.removeItem('user_id');
      }
      setAppState(nextAppState);
    });

    return () => {
      appStateListener.remove();
    };
  }, [appState]);

  return (
    <NavigationContainer>
      <MyUserContext.Provider value={{ user, loginInfo: (userData) => dispatch({ type: 'login', payload: userData }) }}>
        <MyDispatchContext.Provider value={dispatch}>
          <View style={{ flex: 1, marginTop: 25 }}>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Default">
              <Stack.Screen name="Default" component={Default} />
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="ProductDetails" component={ProductDetails} />
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen name="UserProfile" component={UserProfile} />
              <Stack.Screen name="ShoppingCart" component={ShoppingCart}/>
              <Stack.Screen name="Bill" component={Bill}/>
              <Stack.Screen name="ProductComparison" component={ProductComparison}/>
            </Stack.Navigator>
          </View>
        </MyDispatchContext.Provider>
      </MyUserContext.Provider>
    </NavigationContainer>
  );
}

