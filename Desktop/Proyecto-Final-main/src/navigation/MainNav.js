import { Text, View } from 'react-native'
import React, { Component } from 'react'
import {NavigationContainer} from "@react-navigation/native"
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import Register from "../screens/Register"
import Login from "../screens/Login"
import Comentarios from "../screens/Comentarios"
import TabNav from './TabNav'
import UsersProfile from '../screens/UsersProfile'


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
             
              <Stack.Screen
          name='Comentarios'
          component={Comentarios}
        /> 
        <Stack.Screen
          name='UsersProfile'
          component={UsersProfile}
        />

        </Stack.Navigator>
    </NavigationContainer>
    )
  }
}






export default MainNav;