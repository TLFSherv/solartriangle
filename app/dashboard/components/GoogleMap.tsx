'use client'
import { Map, APIProvider } from '@vis.gl/react-google-maps';
import { useMap } from '@vis.gl/react-google-maps';
import { inputs } from "../test-data/data";
import { useEffect, useRef } from 'react';

export default function GoogleMap({ dataColors }: { dataColors: string[] }) {

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
                <PolygonPanels dataColors={dataColors} />
            </APIProvider>
        </div>
    )
}

function PolygonPanels({ dataColors }: { dataColors: string[] }) {
    const map = useMap();
    const polygons = useRef<google.maps.Polygon[]>([]);

    useEffect(() => {
        if (!map) return;
        inputs.solarArrays.map((polygon, i) => {
            const poly = new google.maps.Polygon({
                paths: polygon.shape,
                strokeColor: "#1E1E1E",
                fillColor: dataColors[i],
                fillOpacity: 0.25,
            });
            polygons.current.push(poly);
            poly.setMap(map);
        });

        return () => {
            polygons.current.forEach(poly => poly.setMap(null));
            polygons.current = [];
        }
    }, [map, dataColors.join('-')]);

    return (<br />)
}
