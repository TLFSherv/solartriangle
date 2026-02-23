'use client'
import { Map, APIProvider } from '@vis.gl/react-google-maps';
import { useMap } from '@vis.gl/react-google-maps';
import { useEffect, useRef, useContext } from 'react';
import { colors } from '../lib/dataTools'
import { type SolarArray, type CalculatorData } from '@/app/types/types'
import { CalculatorContext } from '../context/CalculatorProvider';

export default function GoogleMap({ dataColors }: { dataColors: string[] }) {
    const calculatorData: CalculatorData = useContext(CalculatorContext);
    return (
        <div className='mx-4'>
            <APIProvider
                apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY as string}
                onLoad={() => console.log('Maps API has loaded.')}>
                <Map
                    style={{ width: '100%', height: '400px' }}
                    defaultZoom={20}
                    defaultCenter={{
                        lat: calculatorData.location.addressCoords.lat,
                        lng: calculatorData.location.addressCoords.lng
                    }}
                    mapId={'f0d837b3785689636fe8a7cc'}
                >
                </Map>
                <PolygonPanels
                    solarArrays={calculatorData.solarArrays}
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
