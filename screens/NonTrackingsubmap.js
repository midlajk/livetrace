import React,{useState,useEffect} from  'react';
import { View } from 'react-native';
import * as api from "../services/auth";
import Loader from '../Components/Loader';
import MapButton from '../Components/mapscreen_button';
import MapTopButton from '../Components/maptopscreen';
import Mapview from '../Components/MapView';
import b from "../configuration/Datahandler";
import IndividualMap from '../Components/individualmapview';

export default function Tracking({navigation,route}) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [serverdate, setServerdate] = useState('');
  const [userdata, setUserdata] = useState({});
  const [counter, setCounter] = useState(0);
  const [refresh, setRefresh] = useState(0);

  var offline=[];
  var dead=[];
  var nodata=[]
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
    var deadvehicle = [];
    var offline = [];
    var nodata = [];


      list.forEach(element => {
            found=true
          var servdate = new Date(serverdate)
          var lastupdate = new Date(element.corrected330);
          diff = servdate - lastupdate
          offint = list.Off_Int == null ? 90 : list.Off_Int
          dead = list.Dead_Int == null ? 180 : list.Dead_Int
          if(diff>offint*60000){

            if(diff>dead*60000){
                deadvehicle=[...deadvehicle,element ];
            }else{
                offline=[...offline,element ];

            }

          }
          
      });
    
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                     <Loader loading={loading} navigation={navigation} />
                     {route.params.name=='Offline Vehicle'?offline.length>0&&offline.length<2?
                     <IndividualMap list={offline} navigation={navigation}/>:<Mapview list={offline} navigation={navigation}/>
                     :
                     route.params.name=='Dead Vehicle'?deadvehicle.length>0&&deadvehicle.length<2?
                     <IndividualMap list={deadvehicle} navigation={navigation}/>:<Mapview list={deadvehicle} navigation={navigation}/>
                     :<Mapview list={[]} navigation={navigation}/> }
                     


   <MapTopButton getdata={getdata} navigation={navigation} setButtonVisible={setButtonVisible} buttonVisible={buttonVisible} setRefresh={setRefresh} refresh={refresh}/>
   {buttonVisible?<MapButton screen='NonTracking Vehicle Sub' navigation={navigation} list={list}  serverdate={serverdate} sub={route.params.name} />:<View></View>}

    </View>
  );
}
