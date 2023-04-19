import React,{useState,useEffect} from  'react';
import { Text, View ,TouchableOpacity,StyleSheet} from 'react-native';
import {Data} from './data'
import * as api from "../services/auth";
import Loader from '../Components/Loader';

import MapTopButton from '../Components/maptopscreen';
import Mapview from './Historymap';
import BotomButton from '../Components/historybottom';

export default function Tracking({navigation,route}) {
  const [value, setValue] = useState(0);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [pause, setPause] = useState(0);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    setLoading(true) 
    setdata()
  }, []);
   
    async function setdata() {
      setLoading(true) 
      let response = await api.history(route.params.from,route.params.to,route.params.vehicle);
      setList(response)
      setLoading(false) 
   

    }
    function getdata() {

    };
    function isObjectEmpty(obj) {
      var name;
      for (name in obj) {
        return false;
      }
      return true;
    }
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                              <Loader loading={loading} navigation={navigation} />

                              {isObjectEmpty(list)?<View></View>:<Mapview i={value} data={list.HistoryData} navigation={navigation} refresh={refresh} />}
                     <MapTopButton getdata={getdata} navigation={navigation} setButtonVisible={setButtonVisible} buttonVisible={buttonVisible} setRefresh={setRefresh} refresh={refresh}/>

                     {isObjectEmpty(list)?<View></View>:buttonVisible?<BotomButton correction={route.params.correction} data={list.HistoryData}  navigation={navigation} setValue={setValue}  value={value} setPause={setPause} pause={pause}/>:<View style={{alignItems:'center',justifyContent:'center'}}><Text>No data</Text></View>}
    
     
    </View>
  );
}
