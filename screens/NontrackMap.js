import React,{useState,useEffect} from  'react';
import {  View } from 'react-native';
import * as api from "../services/auth";
import Loader from '../Components/Loader';
import MapButton from '../Components/mapscreen_button';
import MapTopButton from '../Components/maptopscreen';
import Mapview from '../Components/MapView';
import b from "../configuration/Datahandler";
import IndividualMap from '../Components/individualmapview';

export default function NonTracking({navigation}) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [serverdate, setServerdate] = useState('');
  const [userdata, setUserdata] = useState({});
  const [counter, setCounter] = useState(0);
  const [refresh, setRefresh] = useState(0);

  var nonTrackingVehicle = [];
  useEffect(() => {
    setLoading(true) 
    getdata()
    setUserdata(b.getUser())  

  }, []);
  useEffect(() => {
    setTimeout(() => {

      setCounter(old=>old+1)
      getdata()
    }, userdata.int_Refresh*1000);
  }, [counter]);
   
   
    async function getdata() {
    
      let response = await api.fetchdatab(); 
      setList(response.data)
      setServerdate(response.serverdate)
        setLoading(false) 

    }

      list.forEach(element => {
          servdate = new Date(serverdate)
          var lastupdate = new Date(element.corrected330);
          diff = servdate - lastupdate
          offint = list.Off_Int == null ? 90 : list.Off_Int
          if(diff>offint*60000){
            nonTrackingVehicle=[...nonTrackingVehicle,element ];
          }
        
    });
         
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                     <Loader loading={loading} navigation={navigation} />
                     {nonTrackingVehicle.length>0&&nonTrackingVehicle.length<2?<IndividualMap list={nonTrackingVehicle} navigation={navigation} />:<Mapview list={nonTrackingVehicle} navigation={navigation} />}
   <MapTopButton getdata={getdata} navigation={navigation} setButtonVisible={setButtonVisible} buttonVisible={buttonVisible} setRefresh={setRefresh} refresh={refresh}/>

   {buttonVisible?<MapButton screen='Non-Tracking Vehicle' navigation={navigation} list={list}  serverdate={serverdate} />:<View></View>}
    </View>
  
  );
}

