// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React,{useState,useRef,useEffect,createRef} from 'react';
import {StyleSheet, View, TouchableHighlight,Text} from 'react-native';
import MapView, { PROVIDER_GOOGLE,Marker,Callout } from 'react-native-maps';
import Markericon from './markericon';

const Mapview = (props) => {
    const {list,navigation, ...attributes} = props;
      const mapRef = createRef();
      useEffect(() => {
        if (mapRef.current) {
          // list of _id's must same that has been provided to the identifier props of the Marker
          mapRef.current.fitToSuppliedMarkers(list.map(({ Reg_No }) => Reg_No),{ edgePadding: 
            {top: 100,
              right: 100,
              bottom: 100,
              left: 100},
              animated: true,
              latitudeDelta: 1,
             longitudeDelta: 1,
      
          });
        }
      }, [list]);
  return (
    <View style={styles.container}>
    <MapView
        ref={mapRef} 
      provider={PROVIDER_GOOGLE} // remove if not using Google Maps
      style={styles.map}
      
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
      title={marker.Reg_No+" , "+marker.V_Type}
      description="Tap to track live"
      onCalloutPress={() => {
                    
        navigation.navigate('Individual Map',{ vehicle:marker.Reg_No,imei:marker.imei});
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