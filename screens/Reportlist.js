import React,{useState,useEffect} from 'react';
import { Text, View,TextInput,StyleSheet,TouchableOpacity,ScrollView,FlatList } from 'react-native';
import { Searchbar } from 'react-native-paper';
import * as api from "../services/auth";
import Loader from '../Components/Loader';
import b from "../configuration/Datahandler";
import {Data} from './data'
import TrackingReport from '../Components/Reportdata'
import {ADReport} from '../Components/Reportdata'
import {Consolidted} from '../Components/Reportdata'
import {CurrentSummary} from '../Components/Reportdata'
import {Halt} from '../Components/Reportdata'
import {Idiling} from '../Components/Reportdata'
import {IgnitionON_off} from '../Components/Reportdata'
import {OverSpeed} from '../Components/Reportdata'
import {Panic} from '../Components/Reportdata'
import {Trip} from '../Components/Reportdata'


export default function TrackScreen({navigation,route}) {
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
   const [vehicle, setvehicle] = useState([]);
  const [serverdate, setServerdate] = useState('');

  var listofdata = [];
  var notfound = [];
  const [list, setList] = useState([]);
  var elmts
  useEffect(() => {
    elmts = b.getVehicle().find( arr1Obj => arr1Obj.Reg_No === route.params.vehicle)
    setLoading(true) 
          getdata()
    
        
  }, []);
   
    async function getdata() {  
      let response = await api.history(route.params.from,route.params.to,route.params.vehicle); 
      const newArr = response.HistoryData.map(obj => {
        var lastupdatestring = new Date(obj.Time);
       lastupdatestring.setMinutes(lastupdatestring.getMinutes()+elmts.Gmt_Corr||0);
       return {...obj, changedtime: lastupdatestring.toLocaleString()}
      })     
      setList(newArr)
      setLoading(false) 
   

    }
  const data = Data.HistoryData
  function isObjectEmpty(obj) {
    var name;
    for (name in obj) {
      return false;
    }
    return true;
  }

  return (
    <View style={{flex:1}}>
                           <Loader loading={loading} navigation={navigation} />

         <View style={styles.header}>
             <View style={{width:'100%',flexDirection:'row',justifyContent:'center'}}>
            <Text style={{color:'#000',fontWeight:'bold'}}>{route.params.name} :</Text>
             <Text style={{color:'#F33A6A',fontWeight:'bold'}}> {route.params.vehicle}</Text>
             </View>
             <View style={{
   borderBottomColor: 'black', 
   borderBottomWidth: 0.5, 
   width:'90%',marginTop:5,marginBottom:10}}>
</View>
             <Text style={{color:'#000'}}> From : {route.params.from}</Text>
             <Text style={{color:'#000'}}>From : {route.params.to}</Text>
             
      
        </View>
        {
            route.params.name =='AD IN/OUT'?isObjectEmpty(list)?<View></View>:
            <ADReport data={list} setLoading={setLoading}/>:
            route.params.name =='Consolidated'?isObjectEmpty(list)?<View></View>:
            <Consolidted data={list} setLoading={setLoading}/>:
            route.params.name =='Current Summary'?isObjectEmpty(list)?<View></View>:<CurrentSummary setLoading={setLoading} data={list}/>:
            route.params.name =='Halt'?isObjectEmpty(list)?<View></View>:
            <Halt data={list} setLoading={setLoading}/>:
            route.params.name =='Idiling'?isObjectEmpty(list)?<View></View>:
            <Idiling data={list} setLoading={setLoading}/>:
            route.params.name =='Ignition ON/OFF'?isObjectEmpty(list)?<View></View>:
            <IgnitionON_off data={list} setLoading={setLoading}/>:
            route.params.name =='Panic'?isObjectEmpty(list)?<View></View>:
            <Panic data={list} setLoading={setLoading}/>:
            route.params.name =='Over Speed'?isObjectEmpty(list)?<View></View>:
            <OverSpeed data={list} setLoading={setLoading}/>:
            route.params.name =='Trip'?isObjectEmpty(list)?<View></View>:
            <Trip data={list} setLoading={setLoading}/>:isObjectEmpty(list)?<View></View>:
               <TrackingReport data={list} setLoading={setLoading}/>
        }
    
 
  
    
  </View>
  );
       }


const styles = StyleSheet.create({
   
    text: {
         color:'#000',
         fontSize:14,
      width:'50%',
      textAlign:'center'
       },
       textb: {
        color:'#fff',
        fontSize:16,
     
      },
       button: {
         width:'90%',borderRadius:16,backgroundColor:'#fff',justifyContent:'center',alignItems:'center',
         padding:20,
         flexDirection:'row',justifyContent:'space-between',
         shadowColor:'#000',
            shadowOffset:{
                width:0,
                height:10
            },
            shadowOpacity:0.25,
            shadowRadius:3.5,
            elevation:6,
        },
        shadow:{
            
            alignItems:'center',margin:5
        },  
        header:{width:'90%',height:100,backgroundColor:'#dedfe0',marginTop:20,borderRadius:15,justifyContent:'center',alignItems:'center',paddingLeft:20,elevation:3,alignSelf:'center'},
   
  })