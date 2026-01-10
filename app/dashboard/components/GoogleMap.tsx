'use client'
import { Map, APIProvider } from '@vis.gl/react-google-maps';
import { useMap } from '@vis.gl/react-google-maps';
import { inputs } from "../test-data/data";
import { useEffect } from 'react';

export default function GoogleMap() {
    return (
        <div className='mx-4'>
            <APIProvider
                apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY as string}
                onLoad={() => console.log('Maps API has loaded.')}>
                <Map
                    style={{ width: '100%', height: '400px' }}
                    defaultZoom={20}
                    defaultCenter={{ lat: parseFloat(inputs.lat), lng: parseFloat(inputs.lng) }}
                    mapId={'f0d837b3785689636fe8a7cc'}
                >
                </Map>
                {/* <PolygonPanels /> */}
            </APIProvider>
        </div>
    )
}

function PolygonPanels() {
    const map = useMap();
    useEffect(() => {
        inputs.solarArrays.map(polygon => {
            const poly = new google.maps.Polygon({
                paths: polygon.shape,
                strokeColor: "#1E1E1E",
                fillColor: "#444444",
                fillOpacity: 0.25,
            });
            poly.setMap(map);
        })
    }, [])

    return (<br />)
}
