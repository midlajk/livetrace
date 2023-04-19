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
  const [userdata, setUserdata] = useState({});
  const [counter, setCounter] = useState(0);
  var trackingVehicle = [];
  const [refresh, setRefresh] = useState(0);

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
          if(diff<offint*60000){
            trackingVehicle=[...trackingVehicle,element ];
          }
        
      });
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                     <Loader loading={loading} navigation={navigation} />
                     {trackingVehicle.length>0&&trackingVehicle.length<2?<IndividualMap list={trackingVehicle} navigation={navigation} />:<Mapview list={trackingVehicle} navigation={navigation} />}

   <MapTopButton getdata={getdata} navigation={navigation} setButtonVisible={setButtonVisible} buttonVisible={buttonVisible} setRefresh={setRefresh} refresh={refresh}/>

{buttonVisible?<MapButton screen='Tracking Vehicle' navigation={navigation} list={trackingVehicle}  serverdate={serverdate} />:<View></View>}

    </View>
  );
}
