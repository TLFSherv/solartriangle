'use client'
import { Map, APIProvider } from '@vis.gl/react-google-maps';
import { useMap } from '@vis.gl/react-google-maps';
import { useEffect, useRef, useContext, use } from 'react';
import { colors } from '../lib/dataTools'
import { type SolarArray } from '@/app/calculator/types/types';
import { MapContext } from '../context/MapProvider';

export default function GoogleMap({ dataColors }: { dataColors: string[] }) {
    const contextPromise = useContext(MapContext);
    const mapContext = use(contextPromise as Promise<any>);
    return (
        <div className='mx-4'>
            <APIProvider
                apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY as string}
                onLoad={() => console.log('Maps API has loaded.')}>
                <Map
                    style={{ width: '100%', height: '400px' }}
                    defaultZoom={20}
                    defaultCenter={{
                        lat: parseFloat(mapContext.data.lat),
                        lng: parseFloat(mapContext.data.lng)
                    }}
                    mapId={'f0d837b3785689636fe8a7cc'}
                >
                </Map>
                <PolygonPanels
                    solarArrays={mapContext.data.solarArrays}
                    dataColors={dataColors} />
            </APIProvider>
        </div>
    )
}

function PolygonPanels({ solarArrays, dataColors }:
    { solarArrays: SolarArray[], dataColors: string[] }) {
    const map = useMap();
    const polygons = useRef<google.maps.Polygon[]>([]);

    useEffect(() => {
        if (!map) return;
        solarArrays.map((polygon, i) => {
            const poly = new google.maps.Polygon({
                paths: polygon.shape,
                strokeColor: colors[i],
                strokeWeight: 4,
                fillColor: dataColors[i],
                fillOpacity: 1,
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
