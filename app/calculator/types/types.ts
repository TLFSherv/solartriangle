type FormInputs = {
    address: string;
    location: { lat: number; lng: number } | null;
    polygons: { id: number; polygon: google.maps.Polygon }[];
    solarArrays: SolarArray[];
}

type SolarArray = {
    id: number;
    solarCapacity: number;
    numberOfPanels: number;
    area: number;
    azimuth: number;
    shape: { lat: number; lng: number; }[];
}

type Suggestion = {
    placePrediction: {
        placeId: string;
        text: { text: string };
    };
};

type SolarAPIParams = {
    lat: string;
    lng: string;
    capacity: number;
    quantity: number;
    azimuth: number;
    tilt: number;
}

export { type FormInputs, type Suggestion, type SolarArray, type SolarAPIParams }