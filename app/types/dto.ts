import {
    type NewSolarArray, type NewPolygon, type NewAddress,
    type SolarArray, type Polygon, type Address, type Countries
} from "../../src/db/schema"

export type UserData = {
    id: string;
    email: string;
}

export type UserSolarData = {
    solarArrays: SolarArray;
    polygons: Polygon
    addresses: Address;
    countries: Countries;
};

export type UserSolarDataUpdate = {
    solarArray: NewSolarArray;
    polygon: NewPolygon
}

export type UserSolarDataInsert = {
    solarArray: NewSolarArray;
    polygon: NewPolygon;
    address: NewAddress;
}