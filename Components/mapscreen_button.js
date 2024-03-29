
import React, { useState,useEffect } from "react";
import {  StyleSheet, Text, TouchableOpacity, View,Image } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/Feather';
import Trackingicons from './trackingicons';
import Nontrackingicon from './nontrackingicon';
import b from "../configuration/Datahandler";
import SubcatgNAv from './subcategorylistnav';

const App = (props) => {
  const [tracking, setTracking] = useState(true);
  const [nonTracking, setNonTracking] = useState(true);

    var nonTrackingVehicle = [];
    var trackingVehicle = [];
      
  useEffect(() => {
    }, []);
    offlinecount=0
    deadcount=0
    Running=0
    Idle=0
    Halt=0
    Nogps=0
      props.list.forEach(element => {
          servdate = new Date(props.serverdate)
          lastupdate = new Date(element.corrected330)
          diff = servdate - lastupdate
          offint = element.Off_Int == null ? 90 : element.Off_Int
          dead = element.Dead_Int == null ? 180 : element.Dead_Int
          if(diff>offint*60000){
            nonTrackingVehicle=[...nonTrackingVehicle,element ];
            offlinecount++
            if(diff>dead*60000){
              deadcount++
            }

          }else{

            trackingVehicle=[...trackingVehicle,element ];

          }
          element.Igni>0&&element.Speed>2?Running++:
          element.Igni>0&&element.Speed<2?Idle++:
          element.Igni<1&&element.Speed<2?Halt++:element.Lat==0&&element.Lon==0?Nogps++:element.Lat==null&&element.Lon==null?Nogps++:''
        
        
      });
    

  
const vehicle = b.getVehicle().filter(f => !props.list.find( arr1Obj => arr1Obj.Reg_No === f.Reg_No)&&f.status =='Active') 
    
  
  return (

    <View style={styles.bottomviewcontainer}>    
{props.screen=='mainscreen' ?

////Main screen button configuration
      <View style={{width:'100%',alignItems:'center'}}>

      
                <TouchableOpacity
                    style={[styles.button,{justifyContent:'center',width:'90%'}]}
                    onPress={() => {
                    
                      props.navigation.navigate('Vehicle Seperate List',{name:'List of All Vehicle'});
                  }}
                  > 
                 <Icon
                                  name={'format-list-bulleted'}
                                  size={20}
                                  color={'#fff'}
                            
                              />
                  <Text style={{color:'#fff'}}> List all Vehicle</Text>
                  </TouchableOpacity>
                  
                  
                  <TouchableOpacity
                    style={[styles.button]}
                    onPress={() => {
                    
                      props.navigation.navigate('Tracking Vehicle');
                  }}
                  > 
                    <Icon
                                  name={'google-maps'}
                                  size={20}
                                  color={'#fff'}
                            
                              />
                  <Text style={{color:'#fff'}}> Tracking Vehicle</Text>
                <Text style={{color:'#fff'}}> {trackingVehicle.length}</Text>
                  </TouchableOpacity>
            
                  <TouchableOpacity
                  
                    style={[styles.button]}
                    onPress={() => {
                    
                      props.navigation.navigate('Non-Tracking Vehicle');
                  }}
                  > 
                    <Icon
                  name={'map-marker-off'}
                  size={20}
                  color={'#fff'}
            
              />
                  <Text style={{color:'#fff'}}> Non-Tracking Vehicle</Text>
                  <Text style={{color:'#fff'}}> {nonTrackingVehicle.length + vehicle.length}</Text>
                  </TouchableOpacity>
                  </View>

                  // First condition  check



                  :props.screen=='Tracking Vehicle sub'||props.screen=='NonTracking Vehicle Sub' ?
                  <View  style={{width:'100%',alignItems:'center'}}>
                  <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                  <SubcatgNAv navigation={props.navigation} screen={props.screen} sub={props.sub}/>
                    <View style={{width:'20%'}}> 
                      <TouchableOpacity
                    style={[styles.button,{justifyContent:'center',width:'100%'}]}
                    onPress={() => {
                    
                      props.navigation.navigate('All Vehicle');
                  }}
                  > 
                 <FontAwesome5
                                  name={'refresh-ccw'}
                                  size={20}
                                  color={'#fff'}
                            
                              />
              
                  </TouchableOpacity>
                      </View>      
                 </View>

                 <View style={{width:'100%',alignItems:'center'}}>
                      <TouchableOpacity
                    style={[styles.button]}
                    onPress={() => {
                    
                      props.navigation.navigate('Tracking Vehicle');
                  }}
                  > 
                    <Icon
                                  name={'google-maps'}
                                  size={20}
                                  color={'#fff'}
                            
                              />
                  <Text style={{color:'#fff'}}> Tracking Vehicle</Text>
                <Text style={{color:'#fff'}}> {trackingVehicle.length}</Text>
                  </TouchableOpacity>
            
                  <TouchableOpacity
                  
                    style={[styles.button]}
                    onPress={() => {
                    
                      props.navigation.navigate('Non-Tracking Vehicle');
                  }}
                  > 
                    <Icon
                  name={'map-marker-off'}
                  size={20}
                  color={'#fff'}
            
              />
                  <Text style={{color:'#fff'}}> Non-Tracking Vehicle</Text>
                  <Text style={{color:'#fff'}}> {nonTrackingVehicle.length + vehicle.length}</Text>
                  </TouchableOpacity>
                  </View> 
                  </View>
                  :
                   <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                   <View style={{width:'70%'}}>
                      <TouchableOpacity
                   style={[styles.button,{justifyContent:'center',width:'95%'}]}
                   onPress={() => {
                   
                     props.navigation.navigate('Vehicle Seperate List',{name:'List of all ' + props.screen});
                 }}
                 > 
                <Icon
                                 name={'format-list-bulleted'}
                                 size={20}
                                 color={'#fff'}
                           
                             />
                 <Text style={{color:'#fff'}}> List all {props.screen}</Text>
                 </TouchableOpacity>
                 </View>
                   <View style={{width:'20%'}}> 
                     <TouchableOpacity
                   style={[styles.button,{justifyContent:'center',width:'100%'}]}
                   onPress={() => {
                   
                     props.navigation.navigate('All Vehicle');
                 }}
                 > 
                <FontAwesome5
                                 name={'refresh-ccw'}
                                 size={20}
                                 color={'#fff'}
                           
                             />
             
                 </TouchableOpacity>
                     </View>      
                </View>
                  
             ////second condition check

}
{/* second condition check */}




{props.screen=='Tracking Vehicle' ?
tracking ?
 <View style={{width:'100%',alignItems:'center'}}>


             <TouchableOpacity
                    style={[styles.button,{borderBottomLeftRadius:0,borderBottomRightRadius:0}]}
                    onPress={()=>setTracking(false)}
                  > 
                    <Icon
                                  name={'google-maps'}
                                  size={20}
                                  color={'#fff'}
                            
                              />
                  <Text style={{color:'#fff'}}> Tracking Vehicle</Text>
                  <Text style={{color:'#fff'}}> {trackingVehicle.length}</Text>
                  <Icon
                                  name={'chevron-down'}
                                  size={20}
                                  color={'#fff'}
                            
                              />
                  </TouchableOpacity>

                {/* Vehicle icons and Names of icon */}
                  
                   <Trackingicons Running={Running}  Idle={Idle} Halt={Halt} Nogps={Nogps} navigation={props.navigation}/>
                {/* Vehicle icons and Names of icon */}
                  </View>

                  ////Second sub condition fail


            :
            <View style={{width:'100%',alignItems:'center'}}>
              <TouchableOpacity
            style={[styles.button]}
            onPress={()=>setTracking(true)}
          > 
            <Icon
                          name={'google-maps'}
                          size={20}
                          color={'#fff'}
                    
                      />
          <Text style={{color:'#fff'}}> Tracking Vehicle</Text>
          <Text style={{color:'#fff'}}> {trackingVehicle.length}</Text>
          <Icon
                          name={'chevron-down'}
                          size={20}
                          color={'#fff'}
                    
                      />
          </TouchableOpacity>
         
          <TouchableOpacity
                  
                  style={[styles.button]}
                  onPress={() => {
                  
                    props.navigation.navigate('Non-Tracking Vehicle');
                }}
                > 
                  <Icon
                name={'map-marker-off'}
                size={20}
                color={'#fff'}
          
            />
                <Text style={{color:'#fff'}}> Non-Tracking Vehicle</Text>
                <Text style={{color:'#fff'}}> {nonTrackingVehicle.length + vehicle.length}</Text>
                </TouchableOpacity>
   
         </View>
          ////Third condition check on second condition fail 
          :props.screen=='Non-Tracking Vehicle' ?
          nonTracking ?
          <View style={{width:'100%',alignItems:'center'}}>


              <TouchableOpacity
                 style={[styles.button,{borderBottomLeftRadius:0,borderBottomRightRadius:0}]}
                 onPress={()=>setNonTracking(false)}
               > 
                 <Icon
                               name={'map-marker-off'}
                               size={20}
                               color={'#fff'}
                         
                           />
               <Text style={{color:'#fff'}}> Non-Tracking Vehicle</Text>
               <Text style={{color:'#fff'}}> {nonTrackingVehicle.length + vehicle.length}</Text>
               <Icon
                               name={'chevron-down'}
                               size={20}
                               color={'#fff'}
                         
                           />
               </TouchableOpacity>


                {/* Vehicle icons and Names of icon */}
                                
                <Nontrackingicon offlinecount={offlinecount}  deadcount={deadcount} nodata={vehicle.length} navigation={props.navigation}/>
                {/* Vehicle icons and Names of icon */}


               </View>
               ///third condition sub fail
               :
               <View style={{width:'100%',alignItems:'center'}}>
                  <TouchableOpacity
               style={[styles.button]}
               onPress={() => {
               
                 props.navigation.navigate('Tracking Vehicle');
             }}
             > 
               <Icon
                             name={'google-maps'}
                             size={20}
                             color={'#fff'}
                       
                         />
             <Text style={{color:'#fff'}}> Tracking Vehicle</Text>
             <Text style={{color:'#fff'}}> {trackingVehicle.length}</Text>
             </TouchableOpacity>
               <TouchableOpacity
               style={[styles.button]}
               
               onPress={()=>setNonTracking(true)}
             > 
               <Icon
                             name={'map-marker-off'}
                             size={20}
                             color={'#fff'}
                       
                         />
             <Text style={{color:'#fff'}}> Non-Tracking Vehicle</Text>
             <Text style={{color:'#fff'}}> {nonTrackingVehicle.length + vehicle.length}</Text>
             <Icon
                             name={'chevron-down'}
                             size={20}
                             color={'#fff'}
                       
                         />
             </TouchableOpacity>
         
               </View>
               /// third condition fail
                  :
             <View>

             </View>
            
            
            }
                 
                  </View>

  );
};

const styles = StyleSheet.create({
  bottomviewcontainer:{
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
  },
  button: {
    
    width: '90%',
    height: 38,
    borderRadius:10,
    marginTop:10,
    backgroundColor: '#000',
    elevation: 5,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent:'space-around'
},
iconstyle: {width: 26, height: 28},
});

export default App;