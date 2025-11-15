import { useState } from "react";
// perform api fetch request
export default async function fetchPlaces(
    debouncedSearch: string,
    sessionToken: google.maps.places.AutocompleteSessionToken,
    requestId: number,
    newestRequestId: number,
    isCancelled: boolean) {
    const [result, setResult] =
        useState<google.maps.places.AutocompleteSuggestion[] | undefined>([]);
    try {
        const sessionRequest = {
            input: debouncedSearch,
            sessionToken: sessionToken,
            includedPrimaryTypes: ['premise'],
            origin: { lat: 32.3083, lng: -64.7656 }, // Address of Tynes bay
            language: 'en-US',
            region: 'bm',
            includedRegionCodes: ['bm'],
            locationRestriction: {
                north: 32.3961,
                south: 32.2466,
                east: -64.6480,
                west: -64.8918,
            }
        };

        // Fetch autocomplete suggestions
        const { suggestions } =
            await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(sessionRequest);

        // If the request has been superseded by a newer request, do not render the output.
        if (isCancelled || requestId !== newestRequestId) return;

        setResult(suggestions.map(({ placePrediction }) => ({
            text: placePrediction?.text.toString(),
            placePrediction
        })))

        if (isCancelled) setResult([]);

    } catch (err) {
        console.log('Failed to fetch suggestions: ', err);
    }

    return result;
}