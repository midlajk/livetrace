import React,{useState,useEffect} from 'react';
import { Text, View,TextInput,StyleSheet,TouchableOpacity,ScrollView,FlatList } from 'react-native';
import { Searchbar } from 'react-native-paper';
import Loader from '../Components/Loader';
import b from "../configuration/Datahandler";
import {Data} from './data'
import Icon from 'react-native-vector-icons/Ionicons';
import Iconb from 'react-native-vector-icons/MaterialCommunityIcons';
import * as api from "../services/auth";
import {getPathLength,getDistance} from 'geolib';


export default function TrackingReport(props) {
  const [vehicle, setvehicle] = useState([]);
 

  async function getdata(){
  setvehicle([])
  props.setLoading(true) 
  let items = props.data;
  let i = 0;
  await new Promise(async (resolve, reject) => {
  try {
      if (items.length == 0) return resolve();
      let funSync = async () => {
          await setdata(items[i]);

          i++;
          if (i == items.length) 
          { 
            props.setLoading(false)
            resolve();
          }

          else funSync();
      }
      funSync();
  } catch (e) {
      reject(e);
  }
});
  
   
          

} 
initiallat=props.data[0].latitude
initiallong=props.data[0].longitude

distancevar=0

async function setdata(props){
  
      props.Speed==null? '':
          result = fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=`+props.latitude+`,`+props.longitude+`&key=AIzaSyB4Zi4r1J4WhBzLxop9rVY9czHDtI_BOEQ`)
          .then(res => res.json())
          .then((json) => {
            if(json.results.length>0){
            props.address = json.results[0].formatted_address.split(' ').slice(1,20)
            }
          })
          
        
            var dis = await getDistance({ latitude: initiallat, longitude: initiallong },{ latitude: props.latitude, longitude: props.longitude });
            distancevar = distancevar + (dis/1000) 
            props.cumulative = distancevar
            initiallat= props.latitude
            initiallong= props.longitude
          
         
          
          setvehicle(old=>[...old,props])
    }
useEffect(() => {
  props.setLoading(true)
 getdata()

}, [1]);
 
  return (
    <View style={{ flex: 1, justifyContent: 'center',marginTop:20}}>

                <FlatList
                data={vehicle}
                renderItem={({ item }) => (

                <View style={styles.shadow}>
               <View style={styles.button}
              
              >
        
            
                    <View style={{flex:1,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-around'}}>

                    <Text style={styles.text}>Date And Time : </Text>
                      <Text style={styles.text}>{item.changedtime}</Text>
                      <Text style={styles.text}>Address  </Text>
                      <Text style={styles.text}>{item.address}</Text>
                      <Text style={styles.text}>Cumulative Distance (Kms)</Text>
                      <Text style={styles.text}>{item.cumulative} Kms</Text>
                      <Text style={styles.text}>Speed (km/Hr</Text>
                      <Text style={styles.text}>{item.Speed}</Text>
       
                      <Text style={styles.text}>Ignition Status</Text>
                      <Text style={styles.text}>{item.Igni==1?'Online':'Offline'}</Text>
       
                      
                        
                        </View>
              
               </View>
              </View>
                )}
                keyExtractor={(item, Reg_No) => Reg_No.toString()}/>
    

  </View>
  );
       }

export  function Consolidted(props) {
  const [avgspeed, setaveragespeed] = useState(0);
  const [startaddress, setstartaddress] = useState('');
  const [endaddress, setendaddress] = useState('');
  const [distance, setdistance] = useState(0);
  const [speed, highestspeed] = useState(0);

  pushdata={}
  countarray=[]
  async function getdata(){
  let items = props.data;
  let sum = props.data.reduce(function(prev, current) {
    return prev + +current.Speed
  }, 0);
  const highestMaxScore = Math.max(...props.data.map(data => data.Speed));
  highestspeed(highestMaxScore)
  if(sum>0){
    setaveragespeed(sum/items.length)
  }else{
    setaveragespeed(0)
  }
  
 
  let i = 0;
  await new Promise(async (resolve, reject) => {
  try {
    await setstart(items[0])
    await setend(items[items.length-1])
     var dis = await getPathLength(props.data);
     setdistance(dis/1000) 

     props.setLoading(false)

  } catch (e) {
      reject(e);
  }
});

   
          

} 


async function setstart(props){
      props.Speed==null? '':
          result = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=`+props.latitude+`,`+props.longitude+`&key=AIzaSyB4Zi4r1J4WhBzLxop9rVY9czHDtI_BOEQ`)
          .then(res => res.json())
          .then((json) => {
            if(json.results.length>0){
            setstartaddress(json.results[0].formatted_address.split(' ').slice(1,20))
            }
          })
    }
    async function setend(props){
      props.Speed==null? '':
          result = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=`+props.latitude+`,`+props.longitude+`&key=AIzaSyB4Zi4r1J4WhBzLxop9rVY9czHDtI_BOEQ`)
          .then(res => res.json())
          .then((json) => {
            if(json.results.length>0){
            setendaddress(json.results[0].formatted_address.split(' ').slice(1,20))
            }
          })
    }
useEffect(() => {
  props.setLoading(true)
 getdata()
 
}, [1]);
        return (

           <View style={{ flex: 1,marginTop:20}}>
      
                  
      
      <View style={styles.shadow}>
     <View style={styles.button}
    
    >

  
          <View style={{flex:1,flexDirection:'row',flexWrap:'wrap',justifyContent:'flex-start'}}>

    <Text style={styles.textc}>Day Start Time: </Text>
            <Text style={styles.textc}>{props.data[0].changedtime}</Text>
            <Text style={styles.textc}>Day Start Address  </Text>
            <Text style={styles.textc}>{startaddress}  </Text>
            <Text style={styles.textc}>End Time: </Text>
            <Text style={styles.textc}>{props.data[props.data.length-1].changedtime}</Text>
            <Text style={styles.textc}>End Address  </Text>
            <Text style={styles.textc}>{endaddress}  </Text>


            <Text style={styles.textc}>Last Tracked Time </Text>
            <Text style={styles.textc}> {props.data[props.data.length-1].changedtime} </Text>
            <Text style={styles.textc}>Distance Covered</Text>
            <Text style={styles.textc}>{distance.toFixed(3)} Km</Text>
            <Text style={styles.textc}>Average Speed</Text>
            <Text style={styles.textc}>{avgspeed.toFixed(2)} Km/H</Text>
            <Text style={styles.textc}>Maximum Speed</Text>
            <Text style={styles.textc}>{speed} Km/H</Text>
            
              
              </View>
    
     </View>
    </View>
     

</View>
        );
             }
export  function ADReport(props) {
      const [vehicle, setvehicle] = useState([]);
 

    async function getdata(){
    setvehicle([])
    props.setLoading(true) 
    let items = props.data;
    let i = 0;
    await new Promise(async (resolve, reject) => {
    try {
        if (items.length == 0) return resolve();
        let funSync = async () => {
            await setdata(items[i]);
            i++;
            if (i == items.length) 
            { 
              props.setLoading(false)
              resolve();
            }

            else funSync();
        }
        funSync();
    } catch (e) {
        reject(e);
    }
});
    
     
            
  
  } 
  function setdata(props){
        props.Speed==null? '':
            result = fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=`+props.latitude+`,`+props.longitude+`&key=AIzaSyB4Zi4r1J4WhBzLxop9rVY9czHDtI_BOEQ`)
            .then(res => res.json())
            .then((json) => {
              if(json.results.length>0){
              props.address = json.results[0].formatted_address.split(' ').slice(1,20)
              }
            })
            setvehicle(old=>[...old,props])
      }
  useEffect(() => {
    props.setLoading(true)
   getdata()
   setTimeout(() => {
    getdata()
   }, 3000);

  }, [1]);
   
                return (
                  <View style={{ flex: 1, justifyContent: 'center',marginTop:20}}>
                <FlatList
                      data={vehicle}
                      renderItem={({ item }) => (
      
                      <View style={styles.shadow}>
                     <View style={styles.button}
                    
                    >
              
                  
                          <View style={{flex:1,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-around'}}>
      
                          <Text style={styles.text}>Date And Time : </Text>
                            <Text style={styles.text}>{item.changedtime}</Text>
                            <Text style={styles.text}>Address  </Text>
                            <Text style={styles.text}>{item.address}</Text>
                            <Text style={styles.text}>Analogue-1</Text>
                            <Text style={styles.text}>{item.A1}</Text>
                            <Text style={styles.text}>Digital-1</Text>
                            <Text style={styles.text}>{item.D1}</Text>
     
             
                            
                              
                              </View>
                    
                     </View>
                    </View>
                      )}
                      keyExtractor={(item, Reg_No) => Reg_No.toString()}/>
          
              
                </View>
                );
}
export  function CurrentSummary(props) {
  const [daystarttime, setdaystarttime] = useState('');
  const [startaddress, setstartaddress] = useState('');
  const [currentaddress, setcurrentaddress] = useState('');
  const [lasttracked, setlasttracked] = useState('');
  const [currentspeed, setcurrentspeed] = useState('');
  const [distance, setdistance] = useState(0);

  pushdata={}
  countarray=[]
  async function getdata(){
  let items = props.data;
  let i = 0;
  await new Promise(async (resolve, reject) => {
  try {
    await setstart(items[0])
    await setend(items[items.length-1])
    setcurrentspeed(items[items.length-1].Speed)
    setlasttracked(items[items.length-1].changedtime)
    setdaystarttime(items[0].changedtime)
     var dis = await getPathLength(props.data);
     setdistance(dis/1000) 

     props.setLoading(false)

  } catch (e) {
      reject(e);
  }
});

   
          

} 


async function setstart(props){
      props.Speed==null? '':
          result = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=`+props.latitude+`,`+props.longitude+`&key=AIzaSyB4Zi4r1J4WhBzLxop9rVY9czHDtI_BOEQ`)
          .then(res => res.json())
          .then((json) => {
            if(json.results.length>0){
            setstartaddress(json.results[0].formatted_address.split(' ').slice(1,20))
            }  
          })
    }
    async function setend(props){
      props.Speed==null? '':
          result = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=`+props.latitude+`,`+props.longitude+`&key=AIzaSyB4Zi4r1J4WhBzLxop9rVY9czHDtI_BOEQ`)
          .then(res => res.json())
          .then((json) => {
            if(json.results.length>0){
            setcurrentaddress(json.results[0].formatted_address.split(' ').slice(1,20))
            }
          })
    }
useEffect(() => {
  props.setLoading(true)
 getdata()
 
}, [1]);

    return (
      <View style={{ flex: 1,marginTop:20}}>
      
                  
      
      <View style={styles.shadow}>
     <View style={styles.button}
    
    >

  
          <View style={{flex:1,flexDirection:'row',flexWrap:'wrap',justifyContent:'flex-start'}}>

    <Text style={styles.textc}>Day Start Time: </Text>
            <Text style={styles.textc}>{daystarttime}</Text>
            <Text style={styles.textc}>Day Start Address  </Text>
            <Text style={styles.textc}> {startaddress} </Text>

            <Text style={styles.textc}>Current Address  </Text>
            <Text style={styles.textc}>{currentaddress}</Text>
            <Text style={styles.textc}>Current Speed </Text>
            <Text style={styles.textc}> {currentspeed}  </Text>

            <Text style={styles.textc}>Last Tracked Time </Text>
            <Text style={styles.textc}> {lasttracked} </Text>
            <Text style={styles.textc}>Distance Covered Today</Text>
            <Text style={styles.textc}>{distance.toFixed(2)} Km</Text>
          

            
              
              </View>
    
     </View>
    </View>
     

</View>
    );
}
export  function Halt(props) {
  const [data, setdata] = useState([]);
 

  async function getdata(){
  setdata([])
  props.setLoading(true) 
  let items = props.data;
  let i = 0;
  await new Promise(async (resolve, reject) => {
  try {
      if (items.length == 0) return resolve();
      let funSync = async () => {
          if (i == items.length) 
          {   
            if(countarray.length>0){
             await setstart(items[countarray[0]])
             await setend(items[countarray[countarray.length-1]])
            pushdata.starttime = items[countarray[0]].Time
            pushdata.endtime = items[countarray[countarray.length-1]].Time
            timediff = new Date(pushdata.endtime)-new Date(pushdata.starttime)
            pushdata.timediff=(timediff/60000).toFixed(2)
            setdata(old=>[...old,pushdata])

             }
            props.setLoading(false)
            resolve();
          }else if(items[i].Igni<1&&items[i].Speed<2){
            await setobject(i)
          i++
          funSync();

          }else{

              if(countarray.length>0){
               await setstart(items[countarray[0]])
               await setend(items[countarray[countarray.length-1]])
              pushdata.starttime = items[countarray[0]].Time
              pushdata.endtime = items[countarray[countarray.length-1]].Time
              timediff = new Date(pushdata.endtime)-new Date(pushdata.starttime)
               pushdata.timediff=(timediff/60000).toFixed(2)
              setdata(old=>[...old,pushdata])

            }
            pushdata={}
            countarray=[]
            i++
            funSync();
          

          }


      }
      funSync();
  } catch (e) {
      reject(e);
  }
});
  
   
          

} 
pushdata={}
countarray=[]
async function setobject(i){
 await countarray.push(i)


}

async function setstart(props){
      props.Speed==null? '':
          result = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=`+props.latitude+`,`+props.longitude+`&key=AIzaSyB4Zi4r1J4WhBzLxop9rVY9czHDtI_BOEQ`)
          .then(res => res.json())
          .then((json) => {
            if(json.results.length>0){
            pushdata.startaddress = json.results[0].formatted_address.split(' ').slice(1,20)
            } 
          })
    }
    async function setend(props){
      props.Speed==null? '':
          result = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=`+props.latitude+`,`+props.longitude+`&key=AIzaSyB4Zi4r1J4WhBzLxop9rVY9czHDtI_BOEQ`)
          .then(res => res.json())
          .then((json) => {
            if(json.results.length>0){
            pushdata.endaddress = json.results[0].formatted_address.split(' ').slice(1,20)
            }
          })
    }
useEffect(() => {
  props.setLoading(true)
 getdata()
 
}, [1]);
  
    return (
      <View style={{ flex: 1, justifyContent: 'center',marginTop:20}}>
      <FlatList
            data={data}
            renderItem={({ item }) => (

            <View style={styles.shadow}>
           <View style={styles.button}
          
          >
    
        
                <View style={{flex:1,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-around'}}>

                <Text style={styles.text}>Start Time : </Text>
                  <Text style={styles.text}>{item.starttime}</Text>
                  <Text style={styles.text}>Start Address  </Text>
                  <Text style={styles.text}>{item.startaddress}</Text>
                  <Text style={styles.text}>End Time</Text>
                  <Text style={styles.text}>{item.endtime}</Text>
                  <Text style={styles.text}>End Address</Text>
                  <Text style={styles.text}>{item.endaddress}</Text>
                  <Text style={styles.text}>Total Ignition Off Time</Text>
                  <Text style={styles.text}>{item.timediff} mins</Text>
                  
                    
                    </View>
          
           </View>
          </View>
            )}
            keyExtractor={(item, Reg_No) => Reg_No.toString()}/>

    
      </View>
    );
}
export  function Idiling(props) {
  const [data, setdata] = useState([]);
 

  async function getdata(){
  setdata([])
  props.setLoading(true) 
  let items = props.data;
  let i = 0;
  await new Promise(async (resolve, reject) => {
  try {
      if (items.length == 0) return resolve();
      let funSync = async () => {
          if (i == items.length) 
          {   
            if(countarray.length>0){
             await setstart(items[countarray[0]])
             await setend(items[countarray[countarray.length-1]])
            pushdata.starttime = items[countarray[0]].Time
            pushdata.endtime = items[countarray[countarray.length-1]].Time
            timediff = new Date(pushdata.endtime)-new Date(pushdata.starttime)
            pushdata.timediff=(timediff/60000).toFixed(2)
            setdata(old=>[...old,pushdata])

             }
            props.setLoading(false)
            resolve();
          }else if(items[i].Igni>0&&items[i].Speed<2){
       
            await setobject(i)
          i++
          setTimeout( function() {
            funSync();
        }, 0 );
    

          }else{


              if(countarray.length>0){
               await setstart(items[countarray[0]])
               await setend(items[countarray[countarray.length-1]])
              pushdata.starttime = items[countarray[0]].Time
              pushdata.endtime = items[countarray[countarray.length-1]].Time
              timediff = new Date(pushdata.endtime)-new Date(pushdata.starttime)
               pushdata.timediff=(timediff/60000).toFixed(2)
              setdata(old=>[...old,pushdata])
            
            }
            pushdata={}
            countarray=[]
            i++
            setTimeout( function() {
              funSync();
          }, 0 );
          

          }


      }
      funSync();
  } catch (e) {
      reject(e);
  }
});
  
   
          

} 
pushdata={}
countarray=[]
async function setobject(i){
 await countarray.push(i)


}

async function setstart(props){
      props.Speed==null? '':
          result = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=`+props.latitude+`,`+props.longitude+`&key=AIzaSyB4Zi4r1J4WhBzLxop9rVY9czHDtI_BOEQ`)
          .then(res => res.json())
          .then((json) => {
            if(json.results.length>0){
            pushdata.startaddress = json.results[0].formatted_address.split(' ').slice(1,20)
            } 
          })
    }
    async function setend(props){
      props.Speed==null? '':
          result = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=`+props.latitude+`,`+props.longitude+`&key=AIzaSyB4Zi4r1J4WhBzLxop9rVY9czHDtI_BOEQ`)
          .then(res => res.json())
          .then((json) => {
            if(json.results.length>0){
            pushdata.endaddress = json.results[0].formatted_address.split(' ').slice(1,20)
            }
          })
    }
useEffect(() => {
  props.setLoading(true)
 getdata()
 
}, [1]);
    return (
      <View style={{ flex: 1, justifyContent: 'center',marginTop:20}}>
      <FlatList
            data={data}
            renderItem={({ item }) => (

            <View style={styles.shadow}>
           <View style={styles.button}
          
          >
    
        
                <View style={{flex:1,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-around'}}>

                <Text style={styles.text}>Start Time : </Text>
                  <Text style={styles.text}>{item.starttime}</Text>
                  <Text style={styles.text}>Start Address  </Text>
                  <Text style={styles.text}>{item.startaddress}</Text>
                  <Text style={styles.text}>End Time</Text>
                  <Text style={styles.text}>{item.endtime}</Text>
                  <Text style={styles.text}>End Address</Text>
                  <Text style={styles.text}>{item.endaddress}</Text>
                  <Text style={styles.text}>Total Idle Time</Text>
                  <Text style={styles.text}>{item.timediff} mins</Text>
                  
                    
                    </View>
          
           </View>
          </View>
            )}
            keyExtractor={(item, Reg_No) => Reg_No.toString()}/>

    
      </View>
    );
}
export  function IgnitionON_off(props) {
  const [data, setdata] = useState([]);
 

  async function getdata(){
  setdata([])
  props.setLoading(true) 
  let items = props.data;
  let i = 0;
  await new Promise(async (resolve, reject) => {
  try {
      if (items.length == 0) return resolve();
      let funSync = async () => {
          if (i == items.length) 
          {   
            if(onarray.length>0){
       
            await ondatasave()

             }
             if(offarray.length>0){
          
            await offdatasave()
           
           }
            props.setLoading(false)
            resolve();
          }else if(items[i].Igni>=1){

            if(offarray.length>0){
         
            await offdatasave()
           }
           ondata.push(items[i])
            await seton(i)
          i++
          setTimeout( function() {
            funSync();
        }, 0 );
    

          }else{


              if(onarray.length>0){
              
              await ondatasave()

            }
            
            await setoff(i)
            offdata.push(items[i])

            i++
            setTimeout( function() {
              funSync();
          }, 0 );
          

          }


      }
      funSync();
  } catch (e) {
      reject(e);
  }
});
  
   async function offdatasave(){
    await setstart(items[offarray[0]],'off')
    await setend(items[offarray[offarray.length-1]],'off')
    offpushdata.starttime = items[offarray[0]].Time
    offpushdata.endtime = items[offarray[offarray.length-1]].Time
   timediff = new Date(offpushdata.endtime)-new Date(offpushdata.starttime)

   offpushdata.timediff=(timediff/60000).toFixed(2)
   offpushdata.igni='Off'
   var dis = await getPathLength(offdata);
   offpushdata.totaldistance=(dis/1000)
   var newdata = offdata.filter(function (el) {
     return el.Speed > 50
   });
   var seepddis = await getPathLength(newdata);
   offpushdata.overspeeddistance=(seepddis/1000)
   let sum = offdata.reduce(function(prev, current) {
     return prev + +current.Speed
   }, 0);
   const highestMaxScore = Math.max(...offdata.map(data => data.Speed));
   offpushdata.highspeed=highestMaxScore
   if(sum>0){
    offpushdata.avgspeed=(sum/offdata.length)
   }else{
    offpushdata.avgspeed=0
   }
   setdata(old=>[...old,offpushdata])
   offpushdata={}
  offarray=[]
  offdata=[]
   }
          
   async function ondatasave(){
    await setstart(items[onarray[0]],'on')
    await setend(items[onarray[onarray.length-1]],'on')
    onpushdata.starttime = items[onarray[0]].Time
    onpushdata.endtime = items[onarray[onarray.length-1]].Time
    timediff = new Date(onpushdata.endtime)-new Date(onpushdata.starttime)
    onpushdata.timediff=(timediff/60000).toFixed(2)
     onpushdata.igni='On'

   var dis = await getPathLength(ondata);
   onpushdata.totaldistance=(dis/1000)
   var newdata = ondata.filter(function (el) {
     return el.Speed > 50
   });
   var seepddis = await getPathLength(newdata);
   onpushdata.overspeeddistance=(seepddis/1000)
   let sum = ondata.reduce(function(prev, current) {
     return prev + +current.Speed
   }, 0);
   const highestMaxScore = Math.max(...ondata.map(data => data.Speed));
   onpushdata.highspeed=highestMaxScore
   if(sum>0){
    onpushdata.avgspeed=(sum/ondata.length)
   }else{
    onpushdata.avgspeed=0
   }
   setdata(old=>[...old,onpushdata])
   onpushdata={}
   onarray=[]
   ondata=[]
   }
} 
onpushdata={}
onarray=[]
async function seton(i){
 await onarray.push(i)

}
ondata=[]
offdata=[]
offpushdata={}
offarray=[]
async function setoff(i){
 await offarray.push(i)


}

async function setstart(props,igni){
      props.Speed==null? '':
          result = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=`+props.latitude+`,`+props.longitude+`&key=AIzaSyB4Zi4r1J4WhBzLxop9rVY9czHDtI_BOEQ`)
          .then(res => res.json())
          .then((json) => {
            if(json.results.length>0){
            if(igni=='off'){
              offpushdata.startaddress = json.results[0].formatted_address.split(' ').slice(1,20)

            }else{
              onpushdata.startaddress = json.results[0].formatted_address.split(' ').slice(1,20)

            }
          }
          })
    }
    async function setend(props,igni){
      props.Speed==null? '':
          result = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=`+props.latitude+`,`+props.longitude+`&key=AIzaSyB4Zi4r1J4WhBzLxop9rVY9czHDtI_BOEQ`)
          .then(res => res.json())
          .then((json) => {
            if(json.results.length>0){
            if(igni=='off'){
              offpushdata.endaddress = json.results[0].formatted_address.split(' ').slice(1,20)

            }else{
              onpushdata.endaddress = json.results[0].formatted_address.split(' ').slice(1,20)

            }
          }   
          })
    }
useEffect(() => {
  props.setLoading(true)
 getdata()
 
}, [1]);
    return (
      <View style={{ flex: 1, justifyContent: 'center',marginTop:20}}>
      <FlatList
            data={data}
            renderItem={({ item }) => (

            <View style={styles.shadow}>
           <View style={styles.button}
          
          >
    
        
                <View style={{flex:1,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-around'}}>
                <Text style={styles.text}>Ignition Status : </Text>
                  <Text style={styles.text}>{item.igni}</Text>
                  <Text style={styles.text}>Start Time : </Text>
                  <Text style={styles.text}>{item.starttime}</Text>
                  <Text style={styles.text}>Start Address  </Text>
                  <Text style={styles.text}>{item.startaddress}</Text>
                  <Text style={styles.text}>End Time</Text>
                  <Text style={styles.text}>{item.endtime}</Text>
                  <Text style={styles.text}>End Address</Text>
                  <Text style={styles.text}>{item.endaddress}</Text>
                  <Text style={styles.text}> Total Duration</Text>
                  <Text style={styles.text}>{item.timediff} mins</Text>
                  <Text style={styles.text}>Total Distance</Text>
                  <Text style={styles.text}> {item.totaldistance.toFixed(2)} Km </Text>
                  <Text style={styles.text}>Average Speed</Text>
                  <Text style={styles.text}> {item.avgspeed.toFixed(2)} Km/H </Text>
                  <Text style={styles.text}>Total Overspeed Distance</Text>
                  <Text style={styles.text}>{item.overspeeddistance.toFixed(2)} Km</Text>
                  <Text style={styles.text}>Max Speed</Text>
                  <Text style={styles.text}>{item.highspeed.toFixed(2)} Km/H</Text>
                    </View>
          
           </View>
          </View>
            )}
            keyExtractor={(item, Reg_No) => Reg_No.toString()}/>

    
      </View>
    );
}
export  function OverSpeed(props) {
  const [data, setdata] = useState([]);
 

  async function getdata(){
  setdata([])
  props.setLoading(true) 
  let items = props.data;
  let i = 0;
  await new Promise(async (resolve, reject) => {
  try {
      if (items.length == 0) return resolve();
      let funSync = async () => {
          if (i == items.length) 
          {   
            if(countarray.length>0){
              await datasave()

             }
            props.setLoading(false)
            resolve();
          }else if(items[i].Speed>80){
       
            await setobject(i)
            speeddata.push(items[i])

          i++
          setTimeout( function() {
            funSync();
        }, 0 );
    

          }else{


              if(countarray.length>0){
           
              await datasave()
            }
            
            i++
            setTimeout( function() {
              funSync();
          }, 0 );
          

          }


      }
      funSync();
  } catch (e) {
      reject(e);
  }
});
async function datasave(){
  await setstart(items[countarray[0]])
  await setend(items[countarray[countarray.length-1]])
 pushdata.starttime = items[countarray[0]].Time
 pushdata.endtime = items[countarray[countarray.length-1]].Time
 timediff = new Date(pushdata.endtime)-new Date(pushdata.starttime)
  pushdata.timediff=(timediff/60000).toFixed(2)
  const highestMaxScore = Math.max(...speeddata.map(data => data.Speed));
 var dis = await getPathLength(speeddata);
 pushdata.totaldistance=(dis/1000)
 pushdata.highspeed=highestMaxScore

 setdata(old=>[...old,pushdata])
 speeddata={}
 pushdata=[]
 countarray=[]
 }
  
   
          

} 
speeddata=[]
pushdata={}
countarray=[]
async function setobject(i){
 await countarray.push(i)


}

async function setstart(props){
      props.Speed==null? '':
          result = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=`+props.latitude+`,`+props.longitude+`&key=AIzaSyB4Zi4r1J4WhBzLxop9rVY9czHDtI_BOEQ`)
          .then(res => res.json())
          .then((json) => {
            if(json.results.length>0){
            pushdata.startaddress = json.results[0].formatted_address.split(' ').slice(1,20)
            }
          })
    }
    async function setend(props){
      props.Speed==null? '':
          result = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=`+props.latitude+`,`+props.longitude+`&key=AIzaSyB4Zi4r1J4WhBzLxop9rVY9czHDtI_BOEQ`)
          .then(res => res.json())
          .then((json) => {
            if(json.results.length>0){
            pushdata.endaddress = json.results[0].formatted_address.split(' ').slice(1,20)
            }
          })
    }
useEffect(() => {
  props.setLoading(true)
 getdata()
 
}, [1]);
    return (
      <View style={{ flex: 1, justifyContent: 'center',marginTop:20}}>
      <FlatList
            data={data}
            renderItem={({ item }) => (

            <View style={styles.shadow}>
           <View style={styles.button}
          
          >
    
        
                <View style={{flex:1,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-around'}}>

                  <Text style={styles.text}>Start Time : </Text>
                  <Text style={styles.text}>{item.starttime}</Text>
                  <Text style={styles.text}>Start Address  </Text>
                  <Text style={styles.text}>{item.startaddress}</Text>
                  <Text style={styles.text}>End Time</Text>
                  <Text style={styles.text}>{item.endtime}</Text>
                  <Text style={styles.text}>End Address</Text>
                  <Text style={styles.text}>{item.endaddress}</Text>
                  <Text style={styles.text}> Alert Duration</Text>
                  <Text style={styles.text}>{item.timediff} mins</Text>
                  
                   <Text style={styles.text}> Total Overspeed Distance</Text>
                  <Text style={styles.text}> {item.totaldistance.toFixed(2)} Km</Text>

                  <Text style={styles.text}> Maximum Speed</Text>
                  <Text style={styles.text}>{item.highspeed} Km/H</Text>
                  <Text style={styles.text}> Speed Limit</Text>
                  <Text style={styles.text}>80 Km/H</Text> 
                    </View>
          
           </View>
          </View>
            )}
            keyExtractor={(item, Reg_No) => Reg_No.toString()}/>

    
      </View>
    );
}
export  function Panic(props) {
  const [data, setdata] = useState([]);
 

  async function getdata(){
  setdata([])
  props.setLoading(true) 
  let items = props.data;
  let i = 0;
  await new Promise(async (resolve, reject) => {
  try {
      if (items.length == 0) return resolve();
      let funSync = async () => {
          if (i == items.length) 
          {   
            if(countarray.length>0){
              await datasave()

             }
            props.setLoading(false)
            resolve();
          }else if(items[i].SOS>=1){
       
            await setobject(i)
            panicdata.push(items[i])

          i++
          setTimeout( function() {
            funSync();
        }, 0 );
    

          }else{


              if(countarray.length>0){
               await datasave()
            
            }
            pushdata={}
            countarray=[]
            i++
            setTimeout( function() {
              funSync();
          }, 0 );
          

          }


      }
      funSync();
  } catch (e) {
      reject(e);
  }
});
  
async function datasave(){
  await setstart(items[countarray[0]])
  await setend(items[countarray[countarray.length-1]])
 pushdata.starttime = items[countarray[0]].Time
 pushdata.endtime = items[countarray[countarray.length-1]].Time
 timediff = new Date(pushdata.endtime)-new Date(pushdata.starttime)
  pushdata.timediff=(timediff/60000).toFixed(2)
 var dis = await getPathLength(panicdata);
 pushdata.totaldistance=(dis/1000)

 setdata(old=>[...old,pushdata])
 panicdata=[]
 pushdata=[]
 countarray=[]
 }
          

} 
panicdata=[]
pushdata={}
countarray=[]
async function setobject(i){
 await countarray.push(i)


}

async function setstart(props){
      props.Speed==null? '':
          result = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=`+props.latitude+`,`+props.longitude+`&key=AIzaSyB4Zi4r1J4WhBzLxop9rVY9czHDtI_BOEQ`)
          .then(res => res.json())
          .then((json) => {
            if(json.results.length>0){
            pushdata.startaddress = json.results[0].formatted_address.split(' ').slice(1,20)
            }
          })
    }
    async function setend(props){
      props.Speed==null? '':
          result = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=`+props.latitude+`,`+props.longitude+`&key=AIzaSyB4Zi4r1J4WhBzLxop9rVY9czHDtI_BOEQ`)
          .then(res => res.json())
          .then((json) => {
            if(json.results.length>0){
            pushdata.endaddress = json.results[0].formatted_address.split(' ').slice(1,20)
            }
          })
    }
useEffect(() => {
  props.setLoading(true)
 getdata()
 
}, [1]);
    return (
      <View style={{ flex: 1, justifyContent: 'center',marginTop:20}}>
      <FlatList
            data={data}
            renderItem={({ item }) => (

            <View style={styles.shadow}>
           <View style={styles.button}
          
          >
    
        
                <View style={{flex:1,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-around'}}>

           
                      <Text style={styles.text}>Start Time : </Text>
                  <Text style={styles.text}>{item.starttime}</Text>
                  <Text style={styles.text}>Start Address  </Text>
                  <Text style={styles.text}>{item.startaddress}</Text>
                  <Text style={styles.text}>End Time</Text>
                  <Text style={styles.text}>{item.endtime}</Text>
                  <Text style={styles.text}>End Address</Text>
                  <Text style={styles.text}>{item.endaddress}</Text>
                  <Text style={styles.text}>Alert Duration</Text>
                  <Text style={styles.text}>{item.timediff} mins</Text>
                
                  
                  <Text style={styles.text}> Total Alert Distance</Text>
                  <Text style={styles.text}>{item.totaldistance.toFixed(2)}</Text>
                    </View>
          
           </View>
          </View>
            )}
            keyExtractor={(item, Reg_No) => Reg_No.toString()}/>

    
      </View>
    );
}
export  function Trip(props) {
  const [data, setdata] = useState([]);
 

  async function getdata(){
  setdata([])
  props.setLoading(true) 
  let items = props.data;
  let i = 0;
  await new Promise(async (resolve, reject) => {
  try {
      if (items.length == 0) return resolve();
      let funSync = async () => {
          if (i == items.length) 
          {   
            if(countarray.length>0){
               await datasave()
             }
            props.setLoading(false)
            resolve();
          }else if(items[i].Igni>=1){
            if(items[i].Speed<3){
              idledata.push(items[i])
            }else{
              if(idledata.length>0){
                 stime = idledata[0].Time
              etime = idledata[idledata.length-1].Time
              timedif = new Date(stime)-new Date(etime)
              idletime = idletime+(timedif/60000).toFixed(2) 
              idlecount = idlecount + idledata.length
              idledata=[]
              }
             

            }
            await setobject(i)
            tripdata.push(items[i])

          i++
          setTimeout( function() {
            funSync();
        }, 0 );
    

          }else{


              if(countarray.length>0){
                await datasave()

            }
           
            i++
            setTimeout( function() {
              funSync();
          }, 0 );
          

          }


      }
      funSync();
  } catch (e) {
      reject(e);
  }
});
  
   
async function datasave(){
  if(idledata.length>0){
    stime = idledata[0].Time
    etime = idledata[idledata.length-1].Time
    timedif = new Date(stime)-new Date(etime)
    idletime = idletime+(timedif/60000).toFixed(2) 
    idlecount = idlecount+idledata.length

  }
  await setstart(items[countarray[0]])
  await setend(items[countarray[countarray.length-1]])
 pushdata.starttime = items[countarray[0]].Time
 pushdata.endtime = items[countarray[countarray.length-1]].Time
 timediff = new Date(pushdata.endtime)-new Date(pushdata.starttime)
  pushdata.timediff=(timediff/60000).toFixed(2)
 var dis = await getPathLength(tripdata);
 pushdata.totaldistance=(dis/1000)
 const highestMaxScore = Math.max(...tripdata.map(data => data.Speed));
 pushdata.highspeed=highestMaxScore
 pushdata.idletime=idletime
 pushdata.idlepercentage=(idlecount/tripdata.length)*100
 let sum = tripdata.reduce(function(prev, current) {
  return prev + +current.Speed
}, 0);
if(sum>0){
  pushdata.avgspeed=(sum/tripdata.length)
 }else{
  pushdata.avgspeed=0
 }
 setdata(old=>[...old,pushdata])
 tripdata=[]
 pushdata=[]
 countarray=[]
 idledata=[]
 idletime=0
idlecount=0
 }    

} 
pushdata={}
countarray=[]
tripdata=[]
idledata=[]
idletime=0
idlecount=0

async function setobject(i){
 await countarray.push(i)


}

async function setstart(props){
      props.Speed==null? '':
          result = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=`+props.latitude+`,`+props.longitude+`&key=AIzaSyB4Zi4r1J4WhBzLxop9rVY9czHDtI_BOEQ`)
          .then(res => res.json())
          .then((json) => {
            if(json.results.length>0){
            pushdata.startaddress = json.results[0].formatted_address.split(' ').slice(1,20)
            }   
          })
    }
    async function setend(props){
      props.Speed==null? '':
          result = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=`+props.latitude+`,`+props.longitude+`&key=AIzaSyB4Zi4r1J4WhBzLxop9rVY9czHDtI_BOEQ`)
          .then(res => res.json())
          .then((json) => {
            if(json.results.length>0){
            pushdata.endaddress = json.results[0].formatted_address.split(' ').slice(1,20)
            }
          })
    }
useEffect(() => {
  props.setLoading(true)
 getdata()
 
}, [1]);
    return (
      <View style={{ flex: 1, justifyContent: 'center',marginTop:20}}>
      <FlatList
            data={data}
            renderItem={({ item }) => (

            <View style={styles.shadow}>
           <View style={styles.button}
          
          >
    
        
                <View style={{flex:1,flexDirection:'row',flexWrap:'wrap',justifyContent:'space-around'}}>

                <Text style={styles.text}>Start Time : </Text>
                  <Text style={styles.text}>{item.starttime}</Text>
                  <Text style={styles.text}>Start Address  </Text>
                  <Text style={styles.text}>{item.startaddress}</Text>
                  <Text style={styles.text}>End Time</Text>
                  <Text style={styles.text}>{item.endtime}</Text>
                  <Text style={styles.text}>End Address</Text>
                  <Text style={styles.text}>{item.endaddress}</Text>
                  <Text style={styles.text}>Total Running Time</Text>
                  <Text style={styles.text}>{item.timediff} mins</Text>
 
                  <Text style={styles.text}> Total Distance</Text>
                  <Text style={styles.text}>{item.totaldistance.toFixed(2)} Km</Text>
                  <Text style={styles.text}> Average Speed</Text>
                  <Text style={styles.text}>{item.avgspeed.toFixed(2)} Km/H</Text>
                  <Text style={styles.text}> Total Idling Time</Text>                  
                  <Text style={styles.text}>{item.idletime} mins</Text>
                  <Text style={styles.text}> Idle(%)</Text>
                  <Text style={styles.text}>{item.idlepercentage} %</Text>
                  <Text style={styles.text}> Max Speed</Text>
                  <Text style={styles.text}>{item.highspeed} Km/H</Text>

                    </View>
          
           </View>
          </View>
            )}
            keyExtractor={(item, Reg_No) => Reg_No.toString()}/>

    
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
       textc: {
        color:'#000',
        fontSize:14,
     width:'50%',
     textAlign:'center',
     marginTop:10
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
      
   
  })