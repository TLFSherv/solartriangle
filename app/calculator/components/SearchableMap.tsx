import React from "react";
import { Map, MapCameraChangedEvent, APIProvider } from '@vis.gl/react-google-maps';

export default function SearchableMap({ children }:
    { children: React.ReactNode }) {
    const bermuda = { lat: 32.3078, lng: -64.7505 };
    const nigeria = { lat: 9.05785, lng: 7.49508 };
    return (
        <APIProvider
            apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY as string}
            onLoad={() => console.log('Maps API has loaded.')}>
            {children}
            <Map
                style={{ width: '100%', height: '400px' }}
                defaultZoom={13}
                defaultCenter={nigeria}
                mapId={'f0d837b3785689636fe8a7cc'}
            >
            </Map>
        </APIProvider>
    )
}