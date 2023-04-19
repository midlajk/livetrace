
import React,{useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler'
import Splash from './screens/Splash';
import Login from './screens/Login';
import TrackScreen from './screens/TrackingList';
import SeperateList from './screens/TrackingList';
import Notification from './screens/Notification';
import Tabs from './navigation/slidenav.js';
import ReportGeneration from './screens/ReportFilter';
import IndividualMap from './screens/IndividualTracking';
import Report from './screens/Report';
import Historymap from './screens/Historymapbasic';
import Reportlist from './screens/Reportlist';
import Ionicons from 'react-native-vector-icons/Feather';
import {
  TouchableOpacity
} from 'react-native';
function HomeTabs() {
  return (
   
      <Tabs />

  );
}
const RootStack = createStackNavigator();

function App() {
  const [headercount, setHeadercounter] = useState(0);

  return (
    
      <NavigationContainer>
        <RootStack.Navigator
          initialRouteName="Splash"
          screenOptions={{
           
            headerTintColor: '#000',
            headerTitleStyle: {
              fontSize: 16,
     
            }
          }}
        >
          <RootStack.Screen
            name="Splash"
            component={Splash}
            options={{
              cardStyle: { backgroundColor: '#fff' },
              headerShown: false,
            }}
          />
         
         <RootStack.Screen
            options={{headerShown: false}}
            name="Login Screen"
            component={Login}
            
          />

        <RootStack.Screen
            options={{headerShown: false}}
            name="App Screens"
            component={HomeTabs}
            
            
          />
           <RootStack.Screen
            name="Notification Screen"
            component={Notification}
            
            
          />
            <RootStack.Screen
            name="Report Generation"
            component={ReportGeneration}
            
            
          />
           <RootStack.Screen
            name="Report Screen"
            component={Report}
            
            
          />
           <RootStack.Screen
            name="Reports View"
            component={Reportlist}
            
            
          />
            <RootStack.Screen
            name="Individual Map"
            component={IndividualMap}
            options={({ route }) => ({ title: "Tracking "+route.params.vehicle })}
            
          />
       
          <RootStack.Screen
            name="Vehicle Seperate List"
            component={SeperateList}
            options={({ route,navigation }) => ({ title: route.params.name,
              headerRight: () => (
               
            <Ionicons
            name="refresh-ccw"
            size={25}
            color="black"
            style={{ marginRight: 10 }}
            onPress={() => {
              setHeadercounter(headercount+1)
              navigation.setParams({ headercount: headercount });

            }}
          />
              ), 
              })}
          />
          <RootStack.Screen
            name="Tracking Screen"
            component={TrackScreen}
            options={({ route }) => ({ 
              title: route.params.name
            })}
          />
           <RootStack.Screen
            name="History Map"
            component={Historymap}
            options={({ route }) => ({ title: route.params.name })}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    
  )
}

export default App;