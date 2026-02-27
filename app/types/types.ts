export type SolarArray = {
    id: number;
    capacity: number;
    quantity: number;
    area: number;
    azimuth: number;
    tilt: number;
    losses: number;
    shape: { lat: number; lng: number; }[];
    areaToQuantity: boolean;
}

export type LocationData = {
    country: string;
    countryCode: string;
    countryCoords: {
        lat: number;
        lng: number;
    }
    timeZone: string;
    address: string;
    addressCoords: {
        lat: number;
        lng: number;
    }
}

export type CalculatorData = {
    location: LocationData,
    solarArrays: SolarArray[]
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


export type SolarAPIParams = {
    lat: string;
    lng: string;
    capacity: number;
    quantity: number;
    azimuth: number;
    tilt: number;
    timeZone: string;
    losses: number;
}

export enum WarningStatus {
    Active,
    Inactive,
    Execute
}

