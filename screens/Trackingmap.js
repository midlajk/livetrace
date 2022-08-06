import React,{useState,useEffect} from  'react';
import { View } from 'react-native';
import * as api from "../services/auth";
import Loader from '../Components/Loader';
import MapButton from '../Components/mapscreen_button';
import MapTopButton from '../Components/maptopscreen';
import Mapview from '../Components/MapView';
import b from "../configuration/Datahandler";
import IndividualMap from '../Components/individualmapview';

export default function Tracking({navigation}) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [serverdate, setServerdate] = useState('');
  const [vehicle, setvehicle] = useState([]);
  const [userdata, setUserdata] = useState({});
  const [counter, setCounter] = useState(0);
  var trackingVehicle = [];

  useEffect(() => {
    setLoading(true) 
    getdata()
    setvehicle(b.getVehicle())
    setUserdata(b.getUser())  

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
          if(diff<offint*60000){
            trackingVehicle=[...trackingVehicle,element ];
          }
        }
        
      });
    });
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                     <Loader loading={loading} navigation={navigation} />
                     {trackingVehicle.length>0&&trackingVehicle.length<2?<IndividualMap list={trackingVehicle} navigation={navigation} />:<Mapview list={trackingVehicle} navigation={navigation} />}

   <MapTopButton getdata={getdata} navigation={navigation} setButtonVisible={setButtonVisible} buttonVisible={buttonVisible}/>

{buttonVisible?<MapButton screen='Tracking Vehicle' navigation={navigation} list={trackingVehicle}  serverdate={serverdate} data={trackingVehicle}/>:<View></View>}

    </View>
  );
}
