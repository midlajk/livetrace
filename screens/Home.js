import React,{useState,useEffect}  from 'react';
import { Text, View ,TouchableOpacity,StyleSheet,Animated,Image,Modal} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FontAwesome5 from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { PROVIDER_GOOGLE,Marker,Callout } from 'react-native-maps';
import * as api from "../services/auth";
import Loader from '../Components/Loader';
import MapButton from '../Components/mapscreen_button';
import MapTopButton from '../Components/maptopscreen';

export default function HomeScreen({navigation}) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  useEffect(() => {
    getdata()
  }, []);
   
    async function getdata() {
      setLoading(true) 
        let response = await api.fetchdata(); 
         setList(response.data.response.LiveData)
        setLoading(false) 

    }
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
               <Loader loading={loading} navigation={navigation} />

              <View style={styles.container}>
     <MapView
       provider={PROVIDER_GOOGLE} // remove if not using Google Maps
       style={styles.map}
       region={{
        latitude:10.850516,
        longitude: 76.271080,
        latitudeDelta: 7,
        longitudeDelta: 1,
      }}
     >
       {list.map((marker,index)=>{
       return(
       <Marker key={index}  coordinate ={{
        latitude: marker.Lat,
        longitude: marker.Lon,
       }}
       image={require('../Assets/sport-car.png')}
       title={marker.Reg_No}
       description="Tap to track live"/>
            
 
       )
     })}
     </MapView>
   </View> 
   <MapTopButton getdata={getdata} navigation={navigation}/>

    <MapButton screen='mainscreen' navigation={navigation}/>
    </View>
  );
}

const styles = StyleSheet.create({

container: {
  ...StyleSheet.absoluteFillObject,
  height: '100%',
  width: 400,
  justifyContent: 'flex-end',
  alignItems: 'center',
},
map: {
  ...StyleSheet.absoluteFillObject,
},

})
