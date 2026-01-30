export type FormInputs = {
    address: string;
    location: google.maps.LatLng | null;
    polygons: { id: number; polygon: google.maps.Polygon }[];
    solarArrays: SolarArray[];
}
export type SolarArray = {
    id: number;
    solarCapacity: number;
    numberOfPanels: number;
    area: number;
    azimuth: number;
    shape: { lat: number; lng: number; }[];
}

export type Suggestion = {
    placePrediction: {
        placeId: string;
        text: { text: string };
    };
};

export type Dataset = {
    x: string[];
    y: number[];
    type: 'months' | 'hrs' | 'days' | 'weekdays';
    name: string;
}

export type ColorGradient = {
    offset: number;
    stopColor: string;
}[]

export type CalculatorData = {
    address: string;
    lat: string;
    lng: string;
    solarArrays: SolarArray[]
}

export type SolarAPIParams = {
    lat: string;
    lng: string;
    capacity: number;
    quantity: number;
    azimuth: number;
    tilt: number;
}

