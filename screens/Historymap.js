import React, { useRef,useEffect } from 'react';
import { Dimensions, StyleSheet, Image } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Data } from './data';
import MapTopButton from '../Components/maptopscreen';
import BotomButton from '../Components/historybottom';
import Markericon from '../Components/markericon';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0001;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;


const Example = (props) => {
  const mapView = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      coordinatefixer();
    }, 1000);
  }, [props.refresh]);
coordinatefixer = () => {
  mapView.current.fitToCoordinates(props.data, {
    edgePadding: { top: 50, right: 100, bottom: 50, left: 10 },
    animated: true,
  });
}
  return (
    <MapView
      initialRegion={{
        latitude: props.data[1].latitude,
        longitude: props.data[1].longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }}
      style={StyleSheet.absoluteFill}
      ref={mapView}
    >
      <MapView.Marker
        coordinate={{
          latitude: props.data[0].latitude,
          longitude: props.data[0].longitude,
        }}
        pinColor="green"
     />
      <MapView.Marker
        rotation={parseFloat(props.data[props.i].Course)}
        coordinate={{
          latitude: props.data[props.i].latitude,
          longitude: props.data[props.i].longitude,
        }}
        anchor={{x:0.5,y:0.5}}
      >
        <Markericon
          vehicle={props.data[props.i].V_Type}
          ignition={props.data[props.i].Igni}
          speed={props.data[props.i].Speed}
        />
      </MapView.Marker>
      <MapView.Marker
        coordinate={{
          latitude: props.data[props.data.length - 1].latitude,
          longitude: props.data[props.data.length - 1].longitude,
        }}
      />

      <Polyline
        strokeColor="#000"
        coordinates={props.data}
        strokeColors={[
          '#7F0000',
          '#00000000',
          '#B24112',
          '#E5845C',
          '#238C23',
          '#7F0000',
        ]}
        strokeWidth={2}
      />
    </MapView>
  );
};

export default Example;
