import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Map, TileLayer, GeoJSON } from 'react-leaflet';
import { mapSources } from '../../../common/constants/map';

import styled from 'styled-components';

const defaultLatLng = [40.4514974,-79.9902600]; // Pittsburgh strip

const zoom = 12;

const StyledMap = styled(Map)`
  height: 100%;
  width: 67vw;
`;

const sources = ["openStreetMap"];

const style = (feature) => {
  return {
    color: '#ffffff',
    weight: 2,
    fillColor: "#ffffff",
    fillOpacity: 0.2
  };
}
export default ({ sourceKeys = sources, geoJson }) => {
  
  const dispatch = useDispatch();
  
  const geoJsonRef = useRef(null)
  
  // highlight on mouseOver
  const highlightFeature = (e) => {
    const layer = e.target;
  
    layer.setStyle({
        fillColor: '#3388ff',
        fillOpacity: 0.6,
        
    });
    layer.openPopup();
  }
  // reset default style on mouseOut
  const resetHighlight = (e) => {
    const layer = e.target;
    const boundary = layer.feature.properties.Neighborhood_2010_HOOD;
    
    layer.setStyle({
       fillColor: '#ffffff',
       fillOpacity: 0.2,
    });
    layer.closePopup();
  }
  const selectFeature = (e) => {
    const layer = e.target;
    const boundary = layer.feature.properties.Neighborhood_2010_HOOD;
    dispatch({
      type: 'TOGGLE_BOUNDARIES', value: boundary
    })
    layer.setStyle({
      fillColor: '#3388ff',
      fillOpacity: 0.8
    }); 
   
  }
  
  // `component` is now the first argument, since it's passed through the Function.bind method, we'll need to pass it through here to the relevant handlers
  function onEachFeature (component, feature, layer) {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: selectFeature,
    });
    layer.bindPopup(layer.feature.properties.Neighborhood_2010_HOOD)
  }

  return (
    <StyledMap
      id="mapId"
      center={defaultLatLng}
      zoom={zoom}
      zoomControl={false}
    >
      <GeoJSON
        key="test"
        data={geoJson}
        style={style}
        onEachFeature={onEachFeature.bind(null, this)}
        ref={geoJsonRef} />
      {sourceKeys.map(key => (
        <TileLayer
          maxZoom={mapSources[key].maxZoom}
          key={key}
          url={mapSources[key].url}
          attribution={false ? mapSources[key].attribution : ''}
        />
      ))}
    </ StyledMap>
  );
};
