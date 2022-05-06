
import React, { useState } from "react";
import {  StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/Feather';

const App = (props) => {
    const {navigation,getdata, ...attributes} = props;
  return (
    <View style={styles.topviewcontainer}>
                  <TouchableOpacity
                  style={styles.button}

                > 
                
                    <Icon
                                name={'fullscreen'}
                                size={25}
                                color={'#000'}
                           
                            />

                 </TouchableOpacity>
                 <TouchableOpacity
                  style={styles.button}
                  onPress={()=>{getdata()}}
                > 
                
                    <FontAwesome5
                                name={'refresh-ccw'}
                                size={20}
                                color={'#000'}
                           
                            />

                 </TouchableOpacity>
                  </View>

  );
};

const styles = StyleSheet.create({
  topviewcontainer:{
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    right: 10,
  },
  button: {
    elevation:5,
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:10
},


});

export default App;