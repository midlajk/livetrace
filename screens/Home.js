import React,{useState,useEffect}  from 'react';
import {  View,Alert } from 'react-native';
import * as api from "../services/auth";
import Loader from '../Components/Loader';
import MapButton from '../Components/mapscreen_button';
import MapTopButton from '../Components/maptopscreen';
import Mapview from '../Components/MapView';
import b from "../configuration/Datahandler";
import IndividualMap from '../Components/individualmapview';

export default function HomeScreen(props) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [serverdate, setServerdate] = useState('');
  const [userdata, setUserdata] = useState({});
  const [counter, setCounter] = useState(0);
  const [refresh, setRefresh] = useState(0);

useEffect(() => {
   setLoading(true) 
   setUserdata(b.getUser())  
   getdata()
}, [props.route])

  useEffect(() => {
    setTimeout(() => {

      setCounter(old=>old+1)
      getdata()
    }, userdata.int_Refresh*1000);
  }, [counter]);
   
    async function getdata() {
      
        let response = await api.fetchdatab(); 
        
         if(response.data != 'err'){
              setLoading(false) 
              setList(response.data)
              setServerdate(response.serverdate)
         }else{  

                  props.navigation.navigate('Report Problem')
         };
        }

   
      
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
               <Loader loading={loading} navigation={props.navigation} />
               {list.length>0&&list.length<2?<IndividualMap list={list} navigation={props.navigation} />:<Mapview list={list} navigation={props.navigation} first={list[0]} refresh={refresh}/>}
    {/* <Mapview list={list} navigation={props.navigation} first={list[0]} refresh={refresh}/> */}
   <MapTopButton getdata={getdata} navigation={props.navigation} setButtonVisible={setButtonVisible} buttonVisible={buttonVisible} setRefresh={setRefresh} refresh={refresh}/>
{buttonVisible?<MapButton screen='mainscreen' navigation={props.navigation} list={list}  serverdate={serverdate} />:<View></View>}
    
    </View>
  );
}

