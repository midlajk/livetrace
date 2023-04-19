import React,{useState,useEffect} from  'react';
import { Text, View ,TouchableOpacity,StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FontAwesome5 from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { PROVIDER_GOOGLE, Marker,Callout } from 'react-native-maps';
import * as api from "../services/auth";
import Loader from '../Components/Loader';
import b from "../configuration/Datahandler";
import MapTopButton from '../Components/maptopscreen';
import Mapview from '../Components/individualmapview';
import BotomButton from '../Components/seperatetracking_bottom';

export default function Tracking({navigation,route}) {
  const [list, setList] = useState([]);
  const [history, sethistory] = useState({});
  const [time, setTime] = useState('');
  const [speed, setSpeed] = useState();
  const [status, setStatus] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [vnumber, setVNumber] = useState('');
  const [picker, setPicker] = useState(false);
  const [fromdate, setFromdate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [counter, setCounter] = useState(0);
  const [vehicle, setvehicle] = useState([]);
  const [userdata, setUserdata] = useState({});
  const [imei, setimei] = useState('');
  const [lasttracked, selasttracked] = useState('');
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    setLoading(true) 
    setvehicle(b.getVehicle())
    setUserdata(b.getUser())  
    getdata()
   

  }, []);
   useEffect(() => {
    setTimeout(() => {
      setCounter(old=>old+1)
      getdata()
    }, userdata.int_Refresh*1000);
   }, [counter])

    async function getdata() {
      let response = await api.singledata(route.params.imei)
      if(response.length!=0){
        setList(response)
        setSpeed(response[0].Speed)
        setStatus(response[0].Igni>0?'Online':'Offline')
        setVNumber(response[0].Reg_No)
        setimei(route.params.imei)
        selasttracked(response[0].time) 
      
        result = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=`+response[0].Lat+`,`+response[0].Lon+`&key=AIzaSyB4Zi4r1J4WhBzLxop9rVY9czHDtI_BOEQ`)
        .then(res => res.json())
        .then((json) => {
          if(json.results.length>0){
            setAddress(json.results[0].formatted_address.split(',').slice(1,6))
  
            }            
     })
     setLoading(false) 
      }

    }
   
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                     <Loader loading={loading} navigation={navigation} />
                  

                     {list.length>0?<Mapview list={list} navigation={navigation} />:<View></View>}
                     <MapTopButton getdata={getdata} navigation={navigation} setButtonVisible={setButtonVisible} buttonVisible={buttonVisible} setRefresh={setRefresh} refresh={refresh}/>

                     {buttonVisible&&list.length>0?<BotomButton correction={route.params.correction} setPicker={setPicker} time={lasttracked} speed={speed} status={status} navigation={navigation} address={address} vnumber={vnumber} imei={imei} />:<View></View>}
    
     
    </View>
  );
}