// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React,{useState,useRef,useEffect,createRef} from 'react';
import {StyleSheet, View, TouchableHighlight,Text} from 'react-native';
import MarkerIcon from './markericon';
import MapView, { PROVIDER_GOOGLE, LatLng, Marker,AnimatedRegion,Polyline } from 'react-native-maps';
import  b from "../configuration/Datahandler";

const Mapview = (props) => {
    const {list,navigation, ...attributes} = props;
    const mapView = useRef(null);
    const [maptype, setMaptype] = useState('standard');
    const [polyline, setpoliline] = useState([]);

      useEffect(() => {
        setMaptype(b.getmaptype())

      }, []);
      const [region, setRegion] = useState({latitude: list[0].Lat,
        longitude: list[0].Lon,
        latitudeDelta: .01,
        longitudeDelta: .01});
        const handleRegionChangeComplete = (newRegion) => {
          setRegion(newRegion);
        }
      useEffect(() => {
        lats={latitude:list[0].Lat,longitude:list[0].Lon}
        setpoliline(old=>[...old,lats])
        console.log(polyline)
        if (region && region.contains && region.contains({latitude:list[0].Lat,longitude:list[0].Lon})) {
        } else {

          const newRegion = {
            latitude: list[0].Lat,
            longitude: list[0].Lon,
            latitudeDelta: region.latitudeDelta,
            longitudeDelta: region.longitudeDelta,
          };
          
          mapView.current.animateToRegion(newRegion, 1000);
      
        }
      }, [list[0]]);
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
        latitudeDelta: .01,
        longitudeDelta: .01,
      }}
      onRegionChangeComplete={handleRegionChangeComplete}
      ref={mapView} 

    >
  
      <Marker.Animated
      coordinate ={{
       latitude: list[0].Lat,
       longitude: list[0].Lon,
      }}
      rotation={parseFloat(list[0].Course)}
      title={list[0].Reg_No+" , "+list[0].V_Type}
      description="Tap to track live"
      ref={mapView.current}
        anchor={{x:0.5,y:0.5}}

      onCalloutPress={() => {
                    
        navigation.navigate('Individual Map',{ vehicle:list[0].Reg_No,imei:list[0].imei});
    }}>
         
        <MarkerIcon vehicle={list[0].V_Type} ignition={list[0].Igni} speed={list[0].Speed}  />
               
           </Marker.Animated>
           <Polyline
        strokeColor="#000"
        coordinates={polyline}
        strokeColors={[
          '#7F0000',
          '#00000000',
          '#B24112',
          '#E5845C',
          '#238C23',
          '#7F0000',
        ]}
        strokeWidth={2}
      />
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