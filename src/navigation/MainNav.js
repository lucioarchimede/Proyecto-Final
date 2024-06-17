import { Text, View } from 'react-native'
import React, { Component } from 'react'
import {NavigationContainer} from "@react-navigation/native"
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import Register from "../screens/Register"
import Login from "../screens/Login"
import TabNav from './TabNav'
import Home from '../screens/Home'


const Stack = createNativeStackNavigator();


 class MainNav extends Component {
  render() {
    return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name='Register' component={Register}  />
            <Stack.Screen name='Login' component={Login}
            options={{headerShow : false}} />

            <Stack.Screen
            options={{headerShow: false}}
             name='tabnav' component={TabNav} />

        </Stack.Navigator>
    </NavigationContainer>
    )
  }
}






export default MainNav;