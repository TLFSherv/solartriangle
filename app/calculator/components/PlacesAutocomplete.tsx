import React, { useState, useEffect, useRef } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';


const PlacesAutocomplete = () => {
    const [placeAutocomplete, setPlaceAutocomplete] =
        useState<google.maps.places.Autocomplete | null>(null);
    let inputRef = useRef<HTMLInputElement | null>(null);
    // triggers loading the places library and returns the API Object once complete (the
    // component calling the hook gets automatically re-rendered when this is
    // the case)
    const places = useMapsLibrary('places');

    useEffect(() => {

        const fetch = async () => {
            // request needed libraries
            await google.maps.importLibrary("places") as google.maps.PlacesLibrary

            inputRef.current = new google.maps.places.Autocomplete({})
        }
        if (!places || !inputRef.current) return;

        const options = {
            fields: ['geometry', 'name', 'formatted_address']
        };


    }, [places])

    useEffect(() => {
        if (!placeAutocomplete) return;
        console.log(placeAutocomplete);

    }, [placeAutocomplete])

    return (
        <div className="mt-4 flex flex-col justify-center items-center">
            <label htmlFor="address" className="block">
                address
            </label>
            <input
                ref={inputRef}
                name="address"
                className="py-1 px-2 border-2 border-[#444444] rounded-md w-4/5"
                type="text"
                autoComplete="false" />
        </div>
    )

};

export default PlacesAutocomplete