import React, { useState, useEffect, useRef } from "react"
import { useMap } from '@vis.gl/react-google-maps';
import Image from "next/image";
import undo from '../../../public/undo.png'
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
    const [selectedCircleId, setSelectedCircleId] = useState<number>();
    const [circles, setCircles] = useState<{ id: number, circle: google.maps.Circle }[]>([]);
    const circleIdRef = useRef(1);
    const circleStateStack = useRef<Map<number, { lat: number; lng: number }[]>>(new Map);
    const polygonStateStack = useRef<Map<number, { lat: number; lng: number }[][]>>(new Map);

    // add event listener to add circles to map
    useEffect(() => {
        // Add a listener for the click event
        map?.addListener("click", addCircle);
    }, [map]);

    // when 4 circles are added to the map, replace with polygon
    useEffect(() => {
        if (circles.length === 4) {
            // create polygon
            const polygonId = polygonIdRef.current;
            const path = circles.map(c => c.circle.getCenter());
            if (path) addPolygon({ id: polygonId, area: 0, azimuth: 0, path: path as google.maps.LatLng[] });
            // remove all circles
            circles.forEach(c => c.circle.setMap(null));
            setCircles([]);
            setSelectedCircleId(0);
        }
    }, [circles])

    function addCircle(event: google.maps.MapMouseEvent) {
        if (!map) return

        // put a limit on the number of polygons
        if (polygonsRef.current && polygonsRef.current.length > 5) return

        const center = map.getCenter();
        const zoom = map.getZoom();

        if (!center || !zoom) return;
        const radius = Math.max(Math.round(2154434.69 * (0.464) ** zoom), 1);

        const circle = new google.maps.Circle({
            strokeColor: '#ffdd00ff',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#ffdd00ff',
            fillOpacity: 0.35,
            center: event.latLng,
            radius,
            draggable: true,
        })
        const id = circleIdRef.current;
        circle.addListener('click', () => {
            setSelectedCircleId(id);
        });

        circle.addListener('dragstart', () => {
            const center = circle.getCenter();
            if (!center || !circleStateStack.current) return
            const currState = { lat: center?.lat(), lng: center?.lng() };
            let prevStates = circleStateStack.current?.get(id);
            if (prevStates) circleStateStack.current.set(id, [...prevStates, currState]);
            else circleStateStack.current.set(id, [currState]);
        });

        setCircles((prev) => [...prev, { id, circle }]);
        circle.setMap(map);
        circleIdRef.current = id + 1;
    }
    // update solarArray input object to be consistent with polygons
    useEffect(() => {
        if (!polygons) return
        polygonsRef.current = polygons;

        if (polygons.length === 0) {
            setInputs((prev) => ({ ...prev, solarArrays: [] }));
            return
        }

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

    const addPolygon = (input?: { id: number; area: number; azimuth: number; path: { lat: number; lng: number }[] | google.maps.LatLng[] | undefined }) => {
        if (!map) return;

        const center = map.getCenter();
        const zoom = map.getZoom();

        if (!center || !zoom) return;
        let { id, area, azimuth, path } = input || { id: 0, area: 0, azimuth: 0, polygon: undefined };
        if (!path) {
            const length = screen.width / 10 * (156543 / Math.pow(2, zoom));
            path = createRectanglePoints(center, length, length);
        }
        if (!id) {
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
            draggable: true
        });

        if (!area || !azimuth) {
            area = Number(getPolygonArea(polygon).toFixed(2));
            azimuth = Number(getPolygonAzimuth(polygon).toFixed(2));
        }

        setPolygons((prev) =>
            prev ? [...prev, { id: id, area, azimuth, polygon }]
                : [{ id: id, area, azimuth, polygon }]
        );

        polygon.addListener("click", () => setActiveId(id));
        polygon.addListener("dragstart", () => {
            const currState = polygon.getPath().getArray().map(path => ({ lat: path.lat(), lng: path.lng() }));
            if (!currState || !polygonStateStack.current) return

            let prevStates = polygonStateStack.current?.get(id);
            if (prevStates) polygonStateStack.current.set(id, [...prevStates, currState]);
            else polygonStateStack.current.set(id, [currState]);
        });

        setActiveId(id);
        polygon.setMap(map);
        polygonIdRef.current = id + 1;
    }

    const deletePolygon = () => {
        if (selectedCircleId) {
            const newCircles = circles.filter(c => c.id !== selectedCircleId);
            const circleToDelete = circles.filter(c => c.id === selectedCircleId)[0];
            setCircles(newCircles);
            setSelectedCircleId(0);
            circleToDelete.circle.setMap(null);
            circleStateStack.current.delete(selectedCircleId);
            return
        }
        if (!polygons) return;
        const selectedPolygon = polygons?.filter((p) =>
            p.polygon.get("strokeColor") === '#F0662A'
        )[0];
        if (!selectedPolygon) return;
        selectedPolygon.polygon.setMap(null);
        const newPolygons = polygons?.filter((poly) => poly !== selectedPolygon);
        setPolygons(() => newPolygons);
        polygonStateStack.current.delete(selectedPolygon.id);
        // make another polygon active after deleting
        if (newPolygons.length > 0) setActiveId(() => newPolygons[0].id);
    }

    function undoAction() {
        if (!circleStateStack.current) return
        circles.forEach(({ id, circle }) => {
            let lastState = circleStateStack.current?.get(id)?.pop();
            if (lastState) circle.setCenter(lastState);
        });

        if (!polygons || !polygonStateStack.current) return
        polygons.forEach(poly => {
            let lastState = polygonStateStack.current.get(poly.id)?.pop();
            if (lastState) poly.polygon.setPath(lastState);
        });
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
                    Click on the map to add points for drawing your solar array. Add four points to draw the solar array.
                </p>
            </div>
            <div className="flex ml-auto sm:w-3/10 my-1 rounded-4xl border-3 border-[#444444] py-1">
                <ol className="flex flex-1 justify-around items-center text-xs text-center font-[Inter]">
                    <li className="cursor-pointer mx-auto" onClick={undoAction}>
                        <Image src={undo} width={30} height={30} alt={"undo arrow"} />
                        Undo
                    </li>
                    <li className="cursor-pointer mx-auto" onClick={deletePolygon}>
                        <Image src={erase} width={30} height={30} alt={"eraser"} />
                        Erase
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