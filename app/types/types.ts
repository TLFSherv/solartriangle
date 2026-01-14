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

type Dataset = {
    x: string[];
    y: number[];
    type: 'months' | 'hrs' | 'days';
    name: string;
}

type ColorGradient = {
    offset: number;
    stopColor: string;
}[]

export { type FormInputs, type Suggestion, type Dataset, type ColorGradient }