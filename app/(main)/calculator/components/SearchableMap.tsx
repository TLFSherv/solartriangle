"use client"
import { memo } from 'react'
import { APIProvider, Map, MapCameraChangedEvent } from '@vis.gl/react-google-maps';
import PlacesAutocomplete from './PlacesAutocomplete';
import DrawingTool from './DrawingTool';

export default memo(function SearchableMap() {
    return (
        <APIProvider
            apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY as string}
            onLoad={() => console.log('Maps API has loaded.')}>
            <PlacesAutocomplete />
            <DrawingTool />
            <Map
                style={{ width: '100%', height: '400px' }}
                defaultZoom={13}
                defaultCenter={{ lat: 32.3078, lng: -64.7505 }}
                mapId={'f0d837b3785689636fe8a7cc'}
                onCameraChanged={(ev: MapCameraChangedEvent) =>
                    console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                }>
            </Map>

        </APIProvider>
    )
});