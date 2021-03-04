import React from 'react';
import './simpleMap.scss';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';


const SimpleMap = (props) => {
    const { lat, lon, zoom } = props;

    return (lat && lon) ? (
        <MapContainer center={[lat, lon]} zoom={zoom}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, lon]}>
            </Marker>
        </MapContainer >
    ) : null;
}

export default SimpleMap;