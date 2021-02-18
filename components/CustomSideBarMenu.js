import React, { Component} from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';
import firebase from 'firebase';
import { Touchable } from 'react-native';
import WelcomeScreen from '../screens/WelcomeScreen';
import { color } from 'react-native-reanimated';

export default class CustomSideBarMenu extends React.Component{
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.drawerItemsContainer}>
                    <DrawerItems
                        {...this.props}
                    />
                </View>
                <View style={styles.logOutContainer}>
                    <TouchableOpacity style={styles.logOutButton} onPress={()=>{
                        this.props.navigation.navigate('WelcomeScreen')
                        firebase.auth().signOut()
                    }}>
                        <Text style={styles.logOutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

var styles = StyleSheet.create({ 
    container : { 
        flex:1 
    }, 
    drawerItemsContainer:{ 
        flex:0.8,
        marginTop: 50, 
    }, 
    logOutContainer : { 
        flex:0.2, 
        justifyContent:'flex-end', 
        marginBottom:50
    }, 
    logOutButton : { 
        //height:30, 
        width:'100%', 
        justifyContent:'center', 
        padding:10 
    }, 
    logOutText:{ 
        fontSize: 15, 
        fontWeight:'bold', 
        color: 'red',
    } 
})