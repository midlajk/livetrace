import React,{useState,useEffect} from 'react';
import { Text, View,TextInput,StyleSheet,TouchableOpacity,ScrollView,FlatList } from 'react-native';
import { Searchbar } from 'react-native-paper';
import * as api from "../services/auth";
import Loader from '../Components/Loader';
import b from "../configuration/Datahandler";


export default function TrackScreen({navigation,route}) {
  //  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
   const [vehivcle, setvehiclve] = useState([]);
   const [counter, setCounter] = useState(0);
   const [serverdate, setServerdate] = useState(new Date());
   const [addressbuffer, setaddressbuffer] = useState({});
   const [livedata, setlivedata] = useState([]);
 
async function getdata(){
  setvehiclve([])
  let response = await api.fetchdatab();
  setServerdate(new Date(response.serverdate))
  let items = response.data;
  setlivedata(items)
  let i = 0;
  await new Promise(async (resolve, reject) => {
  try {
      if (items.length == 0) return resolve();
      let funSync = async () => {
        if(route.params.name == 'List of All Vehicle'){
         
            await setdata(items[i]);

        }
        else if(route.params.name == 'List of all Tracking Vehicle'){
          var lastupdate = new Date(items[i].corrected330);
          offint = items[i].Off_Int == null ? 5400000 : items[i].Off_Int*60000
          diff = serverdate - lastupdate
          if(diff<offint){
            await setdata(items[i]);

          }
        }else if(route.params.name == 'List of all Non-Tracking Vehicle'){
          var lastupdate = new Date(items[i].corrected330);
          offint = items[i].Off_Int == null ? 5400000 : items[i].Off_Int*60000
          diff = serverdate - lastupdate
          if(diff>offint){
            await setdata(items[i]);

          }
        }else if(route.params.name == 'List of all Running Vehicle' && items[i].Igni>0&&items[i].Speed>2){
          await setdata(items[i]);

        }else if(route.params.name == 'List of all Idle Vehicle' && items[i].Igni>0&&items[i].Speed<2){
          await setdata(items[i]);

        }else if(route.params.name == 'List of all Halt Vehicle' && items[i].Igni<1&&items[i].Speed<2){
          await setdata(items[i]);

        }else if(route.params.name == 'List of all Offline Vehicle'){
          var lastupdate = new Date(items[i].corrected330);
          offint = items[i].Off_Int == null ? 5400000 : items[i].Off_Int*60000
          deadint = items[i].Dead_Int == null ? 10800000 : items[i].Dead_Int*60000
          diff = serverdate - lastupdate
          if(diff>offint&&diff<deadint){
            await setdata(items[i]);

          }
        }else if(route.params.name == 'List of all Dead Vehicle'){
          var lastupdate = new Date(items[i].corrected330);
          offint = items[i].Off_Int == null ? 5400000 : items[i].Off_Int*60000
          deadint = items[i].Dead_Int == null ? 10800000 : items[i].Dead_Int*60000
          diff = serverdate - lastupdate
          if(diff> deadint){
            await setdata(items[i]);

          }
        }else if(route.params.name == 'List of all No Gps' && !items[i].Lat && !items[i].Lon){
          await setvehiclve(old=>[...old,items[i]])   

        }
          i++;
          if (i == items.length) {
            setLoading(false)
            resolve()
            }
          else funSync();
      }
      funSync();
  } catch (e) {
      reject(e);
  }
});
  
} 
async function setdata(props){
  if(props.Lat != 0 && props.Lat != null && props.Lon != 0 && props.Lon != null && counter == 0 ||counter == 1 || counter%20 == 0 || !addressbuffer[props.Reg_No] ){
      result = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=`+props.Lat+`,`+props.Lon+`&key=AIzaSyB4Zi4r1J4WhBzLxop9rVY9czHDtI_BOEQ`)
      .then(res => res.json())
      .then((json) => {
        if(json.results.length>0){
          setaddressbuffer(old=>({
            ...old,
            [props.Reg_No]:json.results[0].formatted_address.split(' ').slice(1,20) 
          }))
        }else{
          setaddressbuffer(old=>({
            ...old,
            [props.Reg_No]:'Network issue'
          }))
        }
      })
    }
    
      await setvehiclve(old=>[...old,props])   
     }
      
useEffect(() => {
  setvehiclve([])
  getdata()
  
}, [route.params]);

  const data = route.params.name == 'List of all No data'?b.getVehicle().filter(f => !livedata.find( arr1Obj => arr1Obj.Reg_No === f.Reg_No)&&f.status =='Active'):route.params.name == 'List of All Vehicle'||route.params.name == 'List of all Non-Tracking Vehicle'?[...vehivcle,...b.getVehicle().filter(f => !livedata.find( arr1Obj => arr1Obj.Reg_No === f.Reg_No)&&f.status =='Active')]:vehivcle
  const filteredData = searchText ? data.filter(x =>
    x.Reg_No.toLowerCase().includes(searchText.toLowerCase())
    ): data
    

  return (
    <View style={{flex:1,}}>
             <Loader loading={loading} navigation={navigation} /> 
         <Searchbar
          placeholder="Search"
          onChangeText={(text) => setSearchText(text)}
          value={searchText}
          style={{top:10,width:'90%',alignSelf:'center',borderRadius:16}}
          />
          
          <View style={{ flex: 1, justifyContent: 'center',marginTop:20}}>

                <FlatList
                data={filteredData}
                renderItem={({ item,index }) => (

                <View style={styles.shadow}>
               <TouchableOpacity style={styles.button}
                onPress={() => { 
                  if(item.status == 'Active'){
                    navigation.navigate('Individual Map',{ vehicle:item.Reg_No,imei:item.imei||item.IMEI,correction:item.correction});
                  } 
                 
              }}
              >
        
            
                    <View style={{flex:1,alignItems:'center'}}>
         
                      <Text style={{fontSize:16,color:'#000'}}>{index+1} . {item.Reg_No}</Text>
                      <Text style={styles.text}>IMEI : {item.IMEI || item.imei}</Text>
                      {item.Speed==null?<Text style={styles.text}>
                        No Data
                        </Text>:

                        <View style={{flex:1,alignItems:'center'}}>
                           <Text style={{fontSize:16,color:'#000'}}>Ignition Status : {item.Igni>0?'Online':'Offline'}</Text>
                       <Text style={styles.text}>Speed : {item.Speed}</Text>
                      <Text style={styles.text}>Last Tracked : {item.corrected330.split('T')[0]+' '+item.corrected330.split('T')[1].split('.')[0]}</Text>
            <Text style={styles.text}>Address: {addressbuffer[item.Reg_No]!=null?addressbuffer[item.Reg_No]:'Fetching address...'}</Text>
                        <Text style={{color:'#0783cb',fontSize:10}}>Click Here to Track Live</Text> 
                        </View>}
                      
                      
                        
                        </View>
              
               </TouchableOpacity>
              </View>
                )}
                keyExtractor={(item, Reg_No) => Reg_No.toString()}/>
    

  </View>
  
    
  </View>
  );
       }


const styles = StyleSheet.create({
   
    text: {
         color:'#000',
         fontSize:14,
      
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
        }
   
  })