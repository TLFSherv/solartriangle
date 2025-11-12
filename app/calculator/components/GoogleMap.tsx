"use client"
import { APIProvider, Map, MapCameraChangedEvent } from '@vis.gl/react-google-maps';

export default function GoogleMap() {
    return (
        <APIProvider
            apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY as string}
            onLoad={() => console.log('Maps API has loaded.')}>
            <h1>Google Maps</h1>
            <Map
                style={{ width: '100%', height: '400px' }}
                defaultZoom={13}
                defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
                onCameraChanged={(ev: MapCameraChangedEvent) =>
                    console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                }>
            </Map>
        </APIProvider>
    )
}