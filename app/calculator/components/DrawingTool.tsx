import React, { useState, useEffect, useRef } from "react"
import { useMap } from '@vis.gl/react-google-maps';
import Image from "next/image";
import shapes from '../../../public/shapes.png'
import erase from '../../../public/eraser.png'
import { createRectanglePoints, getPolygonPath, getPolygonArea, getPolygonAzimuth } from '../lib/geometryTool'
import { FormInputs, SolarArray } from "@/app/types/types";
import { readInputsFromDb } from "@/actions/data";

type Polygon = {
    id: number;
    area: number;
    azimuth: number;
    polygon: google.maps.Polygon;
}
export default function DrawingTool({ inputs, setInputs, activeId, setActiveId }: {
    inputs: FormInputs,
    setInputs: React.Dispatch<React.SetStateAction<FormInputs>>
    activeId: number,
    setActiveId: React.Dispatch<React.SetStateAction<number>>
}) {
    const map = useMap();
    const [polygons, setPolygons] = useState<Polygon[] | null>();
    const polygonsRef = useRef<Polygon[] | null>(polygons);
    const polygonIdRef = useRef(1);
    const mapInitialised = useRef(false);

    // update solarArray input object to be consistent with polygons
    useEffect(() => {
        if (!polygons || polygons.length === 0) return
        polygonsRef.current = polygons;

        const initSolarArray = {
            id: 0,
            solarCapacity: 0,
            numberOfPanels: 0,
            area: 0,
            azimuth: 0,
            shape: [],
            areaToPanels: false,
        };
        // store each solarArray in the array at the index equal to its id
        const lastId = polygons.reduce((largest, current) => (current.id > largest.id ? current : largest)).id;
        const solarArraysById: SolarArray[] = Array.from({ length: lastId + 1 }, () => initSolarArray);
        inputs.solarArrays.forEach(s => solarArraysById[s.id] = s);
        let newSolarArrays = polygons.map(
            ({ id, area, azimuth, polygon }) =>
                ({ ...solarArraysById[id], id, area, azimuth, shape: getPolygonPath(polygon) })
        );
        setInputs(prev => ({ ...prev, solarArrays: newSolarArrays }));
    }, [polygons]);


    useEffect(() => {
        resetPolygonStrokes();
        polygonsRef.current?.forEach((p) => {
            if (p.id === activeId) p.polygon.setOptions({ strokeColor: "#F0662A" });
        })
    }, [activeId]);

    // init polygons on map load
    useEffect(() => {
        const initMap = async () => {
            const { data } = await readInputsFromDb();
            if (!map || !data || mapInitialised.current) return

            // add polygons to map
            inputs.solarArrays.forEach((sa) => addPolygon({ id: sa.id, area: sa.area, azimuth: sa.azimuth, path: sa.shape }))
            mapInitialised.current = true;
        }
        // only call once
        if (!mapInitialised.current) initMap();
    }, [inputs])

    const addPolygon = (input?: { id: number; area: number; azimuth: number; path: { lat: number; lng: number }[] | undefined }) => {
        if (!map) return;

        const center = map.getCenter();
        const zoom = map.getZoom();

        if (!center || !zoom) return;
        let { id, area, azimuth, path } = input || { id: 0, area: 0, azimuth: 0, polygon: undefined };
        if (!input) {
            const length = screen.width / 10 * (156543 / Math.pow(2, zoom));
            path = createRectanglePoints(center, length, length);

            let lastId = 0;
            if (polygons && polygons.length > 0)
                lastId = polygons.reduce((largest, current) => (current.id > largest.id ? current : largest)).id;
            id = lastId + 1;
        }

        const polygon = new google.maps.Polygon({
            paths: path,
            strokeColor: id === 1 ? "#F0662A" : "#1E1E1E",
            fillColor: "#444444",
            fillOpacity: 0.25,
            draggable: true,
            editable: true,

        });

        setPolygons((prev) =>
            prev ? [...prev, { id: id, area, azimuth, polygon }]
                : [{ id: id, area, azimuth, polygon }]
        );

        polygon.addListener("click", () => setActiveId(id));

        // update polygon if vertices change
        polygon.getPath().addListener("set_at", () => {
            // debounce updating area and azimuth
            setTimeout(() => {
                const poly = polygonsRef.current?.find(p => p.id === id);
                if (!poly?.polygon) return
                const area = Number(getPolygonArea(poly.polygon).toFixed(2));
                const azimuth = Number(getPolygonAzimuth(poly.polygon).toFixed(2));
                polygonsRef.current = polygonsRef.current?.map(p => p.id === id ? { ...p, area, azimuth } : p);
                setPolygons(polygonsRef.current);
            }, 3000);
        });
        setActiveId(id);
        polygon.setMap(map);
        polygonIdRef.current = id + 1;
    }

    const deletePolygon = () => {
        if (!polygons) return;
        const selectedPolygon = polygons?.filter((p) =>
            p.polygon.get("strokeColor") === '#F0662A'
        )[0];
        if (!selectedPolygon) return;
        selectedPolygon.polygon.setMap(null);
        const newPolygons = polygons?.filter((poly) => poly !== selectedPolygon);
        setPolygons(() => newPolygons);
        // make another polygon active after deleting
        if (newPolygons.length > 0) setActiveId(() => newPolygons[0].id);
    }

    const resetPolygonStrokes = () => {
        polygonsRef.current?.forEach((p) => {
            if (p.polygon.get("strokeColor") === '#F0662A')
                p.polygon.setOptions({ strokeColor: "#1E1E1E" });
        })
    }

    return (
        <div className="mb-2 space-y-6">
            <div>
                <p className="text-sm sm:text-lg">
                    Add shapes on the map to represent your solar array.
                </p>
            </div>
            <div className="flex ml-auto sm:w-3/10 my-1 rounded-4xl border-3 border-[#444444] py-1">
                <ol className="flex flex-1 justify-around items-center text-xs text-center font-[Inter]">
                    <li className="cursor-pointer mx-auto" onClick={() => addPolygon()}>
                        <Image src={shapes} width={30} height={30} alt={"shapes"} />
                        Add shape
                    </li>
                    <li className="cursor-pointer mx-auto" onClick={deletePolygon}>
                        <Image src={erase} width={30} height={30} alt={"eraser"} />
                        Erase shape
                    </li>
                </ol>
            </div>
            <div className="text-right text-[8px]">
                <a href="https://www.flaticon.com/free-icons/shapes"
                    title="shapes icons">Shapes icons created by Freepik - Flaticon</a>
            </div>
        </div>
    );
}