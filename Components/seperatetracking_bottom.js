// Example of Splash, Login and Sign Up in React Native
// https://aboutreact.com/react-native-login-and-signup/

// Import React and Component
import React,{useState} from 'react';
import {StyleSheet, View, TouchableOpacity,Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker'

const Icons = (props) => {
    const {time,status,speed,address,vnumber,setPicker,navigation,gethistory,imei, ...attributes} = props;
    const [buttonVisible, setButtonVisible] = useState(true);
    const [butVisible, setButnVisible] = useState(false);
    const [from, setFrom] = useState(new Date());
    const [to, setTo] = useState(new Date());
    const [clicker, seclicker] = useState('');
    const [open, setOpen] = useState(false)
    const setToday = () => {
      var startdate = new Date()
      startdate.setHours(0,0,0,0);
      var enddate = new Date()
      startdate.setDate(startdate.getDate()+1)
      enddate.setHours(0,0,0,0);
      setFrom(startdate)
      setTo(enddate)
      seclicker('from')
    };
  
    const setYesterday = () => {
      var startdate = new Date()
      startdate.setDate(startdate.getDate()-1)
      startdate.setHours(0,0,0,0);
      var enddate = new Date()
      enddate.setHours(0,0,0,0);
      setFrom(startdate)
      setTo(enddate)
      seclicker('from')
    };
    function settodate(startdate){
      startdate.setDate(startdate.getDate()+1)
      startdate.setHours(0,0,0,0);
      setTo(startdate)
   }
  return (
    <View style={styles.viewstyle}>
                  <View style={{width:'100%',alignItems:'center'}}>


<TouchableOpacity
   style={buttonVisible?[styles.button,{borderBottomLeftRadius:0,borderBottomRightRadius:0}]:[styles.button]}
   onPress={()=>{buttonVisible?setButtonVisible(false):setButtonVisible(true)}}
 > 
   
 <Text style={{color:'#fff'}}> Live Tracking 
 {/* {number[0].Reg_No} */}
 </Text>
 <Icon
                                  name={'chevron-down'}
                                  size={20}
                                  color={'#fff'}
                            
                              />
 </TouchableOpacity>
 {buttonVisible?<View style={{width:'90%',backgroundColor:'#000',borderBottomLeftRadius:10,borderBottomRightRadius:10,padding:10}}>
                
              <Text style={{color:'#fff',width:'100%'}}>
                Last Tracked Time :  {time}
              </Text > 
  
              <Text style={{color:'#fff',}}>
                 Speed :  {speed} --kmph
              </Text > 
       
            
              <Text style={{color:'#fff',}}>
               Status :  {status} 
              </Text > 
              <Text style={{color:'#fff'}}>
                 Location : {address}
              </Text >
       
           
            
            
            </View>:<View>
                </View>}
 


 </View>
 <View style={{width:'100%',alignItems:'center'}}>


<TouchableOpacity
   style={butVisible?[styles.button,{borderBottomLeftRadius:0,borderBottomRightRadius:0}]:[styles.button]}
   onPress={()=>{butVisible?setButnVisible(false):setButnVisible(true)}}
 > 
   
 <Text style={{color:'#fff'}}> Travel Reply
 {/* {number[0].Reg_No} */}
 </Text>
 <Icon
                                  name={'chevron-down'}
                                  size={20}
                                  color={'#fff'}
                            
                              />
 </TouchableOpacity>
 {butVisible?<View style={{width:'90%',backgroundColor:'#000',borderBottomLeftRadius:10,borderBottomRightRadius:10,padding:10,alignItems:'center'}}>
                
              <Text style={{color:'#cdf'}}>
               { vnumber}
              </Text > 
  <View style={{flexDirection:'row',justifyContent:'space-around',width:'100%',padding:5}}>
        <TouchableOpacity onPress={setToday}> 
          <Text style={{color:'#fff',}}>
                       Today
                      </Text > 
        </TouchableOpacity>
        <TouchableOpacity onPress={setYesterday}> 
          <Text style={{color:'#fff',}}>
                       Yesterday
                      </Text > 
        </TouchableOpacity>
  </View>
  <View style={{flexDirection:'row',justifyContent:'space-around',width:'100%',padding:5}}>
        <TouchableOpacity onPress={()=> {setOpen(true); seclicker('from')}}> 
          <Text style={{color:'#fff',textDecorationLine: 'underline',fontSize:12}} adjustsFontSizeToFit={true}>
                       From : {clicker?from.toLocaleString('en-US', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour:'numeric',
  minute:'numeric'
}):'Choose date'}
                      </Text > 
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> {setOpen(true); seclicker('To')}}> 
          <Text style={{color:'#fff',textDecorationLine: 'underline',fontSize:12}} adjustsFontSizeToFit={true}>
                       To : {clicker?to.toLocaleString('en-US', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour:'numeric',
  minute:'numeric'
}):'Choose date'}
                      </Text >
                       
        </TouchableOpacity>
        {open && (
            <DatePicker
            modal
            mode='datetime'
            open={open}
            date={clicker=='from'?from:to}
            onConfirm={(date) => {
              if(clicker=='from'){
                if(date>new Date()){
                  setOpen(false)
                  setFrom(new Date())
                  settodate(new Date())

                }else{
                     setOpen(false)
                setFrom(date)
                settodate(new Date(date))
                }
             
              }else{
                
                     setOpen(false)
                     setTo(date)
                
             
              }
              
            }}
            onCancel={() => {
              setOpen(false)
            }}
          />
      )}
  </View>

              
  <TouchableOpacity style={{width:100,padding:5,backgroundColor:'#f7951d',alignItems:'center',borderRadius:10}}  onPress={()=>{navigation.navigate('History Map',{name:'Travel History Of '+vnumber,from:from.toISOString(),to:to.toISOString(),vehicle:vnumber,correction:props.correction})
  }}> 
          <Text style={{color:'#fff'}}>
                     Start
                      </Text > 
        </TouchableOpacity>
       
           
            
            
            </View>:<View>
                </View>}
 


 </View>

    <TouchableOpacity   style={[styles.button]}
    onPress={() => {  
      navigation.navigate('Report Screen',{ vehicle:vnumber,imei:imei});
  }}>
    <Text style={{color:'#fff'}}> Report</Text>
   </TouchableOpacity>

  
            
            </View>
            
  );
};

export default Icons;

const styles = StyleSheet.create({
    viewstyle: {
        alignItems: 'center',
        position: 'absolute',
        bottom: 40,
        justifyContent:'center',
         width: '100%',
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
        justifyContent:'space-evenly'
    },
});