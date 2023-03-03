import axios from 'axios';

import * as c from '../configuration/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DataHandler from "../configuration/Datahandler";


export async function login(){
    let email = await AsyncStorage.getItem('email')
    let password = await AsyncStorage.getItem('password')

    try{ 
        
        let res = await axios.post(c.LOGIN, {"request": {
            "userMailid": email,
            "password": password
            }} );
            DataHandler.setUser(res.data.status); 
            DataHandler.setServerDate(res.data.server.dateTime)
            const newArr = res.data.response.ConfigData.map(obj => {
                var lastupdate = new Date(obj.Expiry_Date);
                var server = new Date(res.data.server.dateTime);
                diff = lastupdate - server
                if(diff/86400000 >=7 ){
                    return {...obj, status: 'Active'}
                }else if(diff/86400000 >=-28 ){
                    return {...obj, status: 'Expired'}
                }else{
                    return {...obj, status: 'Suspended'}
                }
            })
            DataHandler.setVehicle(newArr)// Save User

            return res;
    }catch (e) {
        throw handler(e);
        
    }
}

// export async function fetchdata(){
  
//     let email = await AsyncStorage.getItem('email')
//     let password = await AsyncStorage.getItem('password')
//     try{

  
//         let res = await axios.post(c.DATA, {"request": {
//             "userMailid": email,
//             "password": password
//             }} );
            
//          return res
        
//     }catch (e) {
//         throw handler(e);
//     }
// }
export async function fetchdatab(){
    let email = await AsyncStorage.getItem('email')
    let password = await AsyncStorage.getItem('password')
    try{

  
        let res = await axios.post(c.DATA, {"request": {
            "userMailid": email,
            "password": password
            }} );

  let newArr = []
    res.data.response.LiveData.forEach((obj) => {
      var veh = DataHandler.getVehicle().find( arr1Obj => arr1Obj.Reg_No === obj.Reg_No)
      if(veh.status=='Active'){
        var lastupdate = new Date(obj.Time);
        var lastupdatestring = new Date(obj.Time);
       lastupdate.setMinutes(lastupdate.getMinutes()+330+veh.Gmt_Corr||0);
       lastupdatestring.setMinutes(lastupdatestring.getMinutes()+veh.Gmt_Corr||0);
       newArr.push({...obj, corrected330: lastupdate.toISOString(),noncorrected330: lastupdatestring.toISOString(),correction:veh.Gmt_Corr||0,status:veh.status,Off_Int:veh.Off_Int,Dead_Int:veh.Dead_Int} )          

      }
    });            
         return {data:newArr,serverdate:res.data.server.dateTime}
        
    }catch (e) {
        return {data:'err'}
    }
}
export async function singledata(imei){


    let email = await AsyncStorage.getItem('email')
    let password = await AsyncStorage.getItem('password')
    try{

  
        let res = await axios.post(c.DATA_SINGLE, {
            "header": {
            "appVersion": "1.0",
            "clientName": "tracker" 
            },
            "request": {
            "userMailid": email,
            "password": password,
            "imei_single": imei	
            }
        });
            const newarray = res.data.response.LiveData.map(data=>{
                var veh = DataHandler.getVehicle().find( arr1Obj => arr1Obj.Reg_No === data.Reg_No)
                  var lastupdatestring = new Date(data.Time);
                  lastupdatestring.setMinutes(lastupdatestring.getMinutes()+330+veh.Gmt_Corr||0);
                  var timeb = lastupdatestring.toISOString()
                  return {...data,time:timeb.split('T')[0]+' '+timeb.split('T')[1].split('.')[0]}


            })
         return newarray
        
    }catch (e) {
        throw handler(e);
    }
}

export async function history(from,to,vehicle){
        var fromtime = new Date(from)
        fromtime.setHours(fromtime.getHours() + 5);
        fromtime.setMinutes(fromtime.getMinutes() + 30);
        var totime = new Date(to)
        totime.setHours(totime.getHours() + 5);
        totime.setMinutes(totime.getMinutes() + 30);
    let email = await AsyncStorage.getItem('email')
    let password = await AsyncStorage.getItem('password')
    try{

  
        let res = await axios.post(c.HISTORY_DATA, {
            "header": {
            "appVersion": "1.0",
            "clientName": "tracker" 
            },
            "request": {
            "userMailid": email,
            "password": password,
            "regNumber": vehicle,
            "fromDate": fromtime.toISOString(),
            "fromTime": "12:00AM",
            "toDate": totime.toISOString(),
            "toTime": "11:59PM",
            "rowLimit": "5000"
            }
        });
         return res.data.response
        
    }catch (e) {
        console.log('here err')

        throw handler(e);

    }
}
export async function report(data){

    let email = await AsyncStorage.getItem('email')
    let password = await AsyncStorage.getItem('password')
    try{

  
        let res = await axios.post(c.REPORT, {
            "header": {
            "appVersion": "1.0",
            "clientName": "tracker" 
            },
            "request": {
            "CustName": data.name,
            "RegNo": data.vehicle,
            "MobNo": data.mobile,
            "Serial": data.imei,
            "Fault": data.fault,
            "Comments": data.comment,
            "UserName": email,
            "Password": password
            }
        });
            
         return res.data.status
        
    }catch (e) {

        throw handler(e);

    }
}




export function handler(err) {
    let error = err;

    if (err.response && err.response.data.hasOwnProperty("message"))
        error = err.response.data;
    else if (!err.hasOwnProperty("message")) error = err.toJSON();

    return new Error(error.message);
}
