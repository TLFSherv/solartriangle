import React from "react";

type Suggestion = {
    placePrediction: {
        placeId: string;
        text: { text: string };
    };
};

type Location = { lat: Number; lng: number; };

export default function SuggestionsDropdown(props:
    {
        suggestions: Suggestion[],
        setAddress: React.Dispatch<React.SetStateAction<string | undefined>>,
        setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>,
        setLocation: React.Dispatch<React.SetStateAction<Location | null>>
    }) {
    const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY as string;
    const { suggestions, setAddress, setSuggestions, setLocation } = props;

    async function selectPlace(placeId: string, text: string) {
        setAddress(text);
        setSuggestions([]);

        const response = await fetch(
            `https://places.googleapis.com/v1/places/${placeId}?fields=location&key=${apiKey}`
        );

        const data = await response.json();
        if (!data.location) return;

        const newLoc = {
            lat: data.location.latitude,
            lng: data.location.logitude
        };
        setLocation(newLoc);
    }

    return (
        <div>
            <ul>
                {suggestions.map((s, i) => {
                    const name = s.placePrediction.text.text;
                    return (
                        <li
                            key={i}
                            onClick={() =>
                                selectPlace(
                                    s.placePrediction.placeId,
                                    s.placePrediction.text.text
                                )
                            }>{name}</li>
                    );
                })}
            </ul>
        </div>
    )
}