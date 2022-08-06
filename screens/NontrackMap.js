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
  const [vehicle, setvehicle] = useState([]);
  const [userdata, setUserdata] = useState({});
  const [counter, setCounter] = useState(0);

  var nonTrackingVehicle = [];
  var notrack = [];
  useEffect(() => {
    setLoading(true) 
    getdata()
    setUserdata(b.getUser())  
    setvehicle(b.getVehicle())

  }, []);
  useEffect(() => {
    setTimeout(() => {

      setCounter(old=>old+1)
      getdata()
    }, userdata.int_Refresh*1000);
  }, [counter]);
   
   
    async function getdata() {
    
        let response = await api.fetchdata(); 
          setServerdate(response.data.server.dateTime)
         setList(response.data.response.LiveData)
        setLoading(false) 

    }
    vehicle.forEach(vehicle => {
      list.forEach(element => {
        if(vehicle.Reg_No == element.Reg_No){
          servdate = new Date(serverdate)
          var lastupdate = new Date(element.Time);
          var lastupdatestring = new Date(element.Time);
          lastupdate.setMinutes(lastupdate.getMinutes()+330+vehicle.Gmt_Corr||0);
          lastupdatestring.setMinutes(lastupdatestring.getMinutes()+vehicle.Gmt_Corr||0);
          element.changedtime = lastupdatestring.toLocaleString()
          element.correction = vehicle.Gmt_Corr||0

          diff = servdate - lastupdate
          offint = vehicle.Off_Int == null ? 90 : vehicle.Off_Int
          if(diff>offint*60000){
            nonTrackingVehicle=[...nonTrackingVehicle,element ];
          }
        }
        
      });
    });
         
    vehicle.forEach(vehicle => {
            found=false
            list.forEach(element => {
              if(vehicle.Reg_No == element.Reg_No){
                found=true
              }
              });
              if(!found){
                notrack=[...notrack,vehicle ];
              }
            });

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                     <Loader loading={loading} navigation={navigation} />
                     {nonTrackingVehicle.length>0&&nonTrackingVehicle.length<2?<IndividualMap list={nonTrackingVehicle} navigation={navigation} />:<Mapview list={nonTrackingVehicle} navigation={navigation} />}
   <MapTopButton getdata={getdata} navigation={navigation} setButtonVisible={setButtonVisible} buttonVisible={buttonVisible}/>

   {buttonVisible?<MapButton screen='Non-Tracking Vehicle' navigation={navigation} list={list}  serverdate={serverdate} data={[...notrack,...nonTrackingVehicle]}/>:<View></View>}
    </View>
  
  );
}

