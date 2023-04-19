// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React,{useState,useRef,useEffect,createRef} from 'react';
import {StyleSheet, View, TouchableHighlight,Text} from 'react-native';
import Markericon from './markericon';
import  { PROVIDER_GOOGLE, LatLng, Marker } from 'react-native-maps';
import MapView from "react-native-map-clustering";

import  b from "../configuration/Datahandler";

const Mapview = (props) => {
    const {list,navigation,refresh, ...attributes} = props;
    const [maptype, setMaptype] = useState('standard');
      const mapRef = createRef();
      useEffect(() => {
        setMaptype(b.getmaptype())
        if (mapRef.current) {
          // list of _id's must same that has been provided to the identifier props of the Marker
          mapRef.current.animateToRegion({
            latitude: 11.949263,
            longitude: 75.609764,
            latitudeDelta: 2,
            longitudeDelta: 5,
          },1000);
        
        }
      }, [refresh]);
  return (
    <View style={styles.container}>
    <MapView
    toolbarEnabled={true}
        ref={mapRef} 
      provider={PROVIDER_GOOGLE} // remove if not using Google Maps
      style={styles.map}
      mapType={maptype}
      showUserLocation={true}
      followUserLocation={true}
      initialRegion={{
        latitude: 11.949263,
        longitude: 75.609764,
        latitudeDelta: 1,
        longitudeDelta: 1,
      }}
    >

      {list.map((marker,index)=>{
      return(
      <Marker 
      
      key={index}
      identifier={marker.Reg_No}
      coordinate ={{
       latitude: marker.Lat,
       longitude: marker.Lon,
      }}
      rotation={parseFloat(marker.Course)}
      title={marker.Reg_No+" , "+marker.V_Type}
      description="Tap to track live"
      onCalloutPress={() => {
                    
        navigation.navigate('Individual Map',{ vehicle:marker.Reg_No,imei:marker.imei,correction:marker.correction});
    }}>
         
        <Markericon vehicle={marker.V_Type} ignition={marker.Igni} speed={marker.Speed}  />
               
           </Marker>

      )
    })}
    
    </MapView>
  </View> 
            
  );
};


export default Mapview;

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: '100%',
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
      },
      map: {
        ...StyleSheet.absoluteFillObject,
      },
      bubble: {
        flexDirection: 'column',
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderRadius: 6,
        borderColor: '#ccc',
        borderWidth: 0.5,
        padding: 15,
        width: 150,
      },
      // Arrow below the bubble
      arrow: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#fff',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -32,
      },
      arrowBorder: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderTopColor: '#007a87',
        borderWidth: 16,
        alignSelf: 'center',
        marginTop: -0.5,
        // marginBottom: -15
      },
});