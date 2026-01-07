'use client'
import { Map, APIProvider } from '@vis.gl/react-google-maps';
import { useMap } from '@vis.gl/react-google-maps';
import { inputs } from "../test-data/data";
import { useEffect } from 'react';

export default function GoogleMap() {
    return (
        <div className='space-y-5 text-center'>
            <h1 className='text-3xl font-[Darker_Grotesque] tracking-wider text-[#F0662A] '>Power Heat Map</h1>
            <p className='font-[Space_Grotesk] px-4 text-sm'>
                Change the unit of time with the dropdown below the map.
            </p>
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

    return ('hello')
}
