// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React,{useState,useRef,useEffect,createRef} from 'react';
import {StyleSheet, View, TouchableHighlight,Text} from 'react-native';
import Markericon from './markericon';
import MapView, { PROVIDER_GOOGLE, LatLng, Marker,AnimatedRegion } from 'react-native-maps';
import  b from "../configuration/Datahandler";

const Mapview = (props) => {
    const {list,navigation, ...attributes} = props;
      const mapRef = useRef();
      const [maptype, setMaptype] = useState('standard');
      useEffect(() => {
        setMaptype(b.getmaptype())

      }, []);
      mapRef.current={latitude:list[0].Lat,longitude:list[0].Lon}
  return (
    <View style={styles.container}>
    <MapView
      provider={PROVIDER_GOOGLE} // remove if not using Google Maps
      style={styles.map}
      showUserLocation={true}
      followUserLocation={true}
      mapType={maptype}
      initialRegion={{
        latitude: list[0].Lat,
        longitude: list[0].Lon,
        latitudeDelta: .09,
        longitudeDelta: .09,
      }}
    >
  
      <Marker.Animated
      coordinate ={{
       latitude: list[0].Lat,
       longitude: list[0].Lon,
      }}
       onpress
      rotation={parseFloat(list[0].Course)}
      title={list[0].Reg_No+" , "+list[0].V_Type}
      description="Tap to track live"
      ref={mapRef.current}

      onCalloutPress={() => {
                    
        navigation.navigate('Individual Map',{ vehicle:list[0].Reg_No,imei:list[0].imei});
    }}>
         
        <Markericon vehicle={list[0].V_Type} ignition={list[0].Igni} speed={list[0].Speed}  />
               
           </Marker.Animated>

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