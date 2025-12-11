import React, { useState, useEffect, useRef } from "react"
import { useMap } from '@vis.gl/react-google-maps';
import Image from "next/image";
import shapes from '../../../public/shapes.png'
import erase from '../../../public/eraser.png'
import { createRectanglePoints } from '../lib/geometryTool'

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
    shape: google.maps.LatLng[];
}

export default function DrawingTool(props: {
    inputs: FormInputs,
    setInputs: React.Dispatch<React.SetStateAction<FormInputs>>
}) {
    const map = useMap();
    const [polygons, setPolygons] = useState<{ id: number; polygon: google.maps.Polygon }[] | null>(null);
    const polygonsRef = useRef<{ id: number; polygon: google.maps.Polygon }[] | null>(polygons);
    const idRef = useRef(0);
    const { inputs, setInputs } = props;

    useEffect(() => {
        polygonsRef.current = polygons;
        setInputs(prev => ({ ...prev, polygons: polygonsRef.current || [] }))
        // De-select polygon if click outside of polygon
        document.addEventListener("mousedown", resetPolygonStrokes);

        // Delete with keyboard
        const handler = (e: KeyboardEvent) => {
            if ((e.key === "Delete" || e.key === "Backspace"))
                deletePolygon();
        };
        window.addEventListener("keydown", handler);

        return () => {
            window.removeEventListener("keydown", handler);
            document.removeEventListener("mousedown", resetPolygonStrokes);
        }
    }, [polygons]);

    const handleClick = (poly: google.maps.Polygon) => {
        poly.setOptions({ strokeColor: "#F0662A" });
        setInputs((prev) => ({
            ...prev,
            polygons: polygonsRef.current || []
        }));
    }

    const addPolygon = () => {
        if (!map) return;

        const center = map.getCenter();
        const zoom = map.getZoom();

        if (!center || !zoom) return;

        const length = screen.width / 10 * (156543 / Math.pow(2, zoom));
        const path = createRectanglePoints(center, length, length);

        const poly = new google.maps.Polygon({
            paths: path,
            strokeColor: "#1E1E1E",
            fillColor: "#444444",
            fillOpacity: 0.25,
            draggable: true,
            editable: true,
        });

        if (polygons) setPolygons([...polygons, { id: idRef.current, polygon: poly }]);
        else setPolygons([{ id: idRef.current, polygon: poly }]);
        idRef.current = idRef.current + 1;

        poly.addListener("click", () => handleClick(poly));
        // update polygon if vertices change
        poly.getPath().addListener("set_at", () => {
            setInputs((prev) => ({ ...prev, polygons: polygonsRef.current || [] }))
        });

        poly.setMap(map);
    }

    const deletePolygon = () => {
        if (!polygons) return;
        const selectedPolygon = polygons?.filter((p) =>
            p.polygon.get("strokeColor") === '#F0662A'
        )[0];
        if (!selectedPolygon) return;
        selectedPolygon.polygon.setMap(null);
        setPolygons(polygons?.filter((poly) => poly !== selectedPolygon));
    }

    const resetPolygonStrokes = () => {
        polygons?.forEach((p) => {
            if (p.polygon.get("strokeColor") === '#F0662A')
                p.polygon.setOptions({ strokeColor: "#1E1E1E" });
        })
    }

    return (
        <div className="mb-2">
            <div className="flex ml-auto w-3/10 my-1 rounded-4xl border-3 border-[#444444] py-1">
                <ol className="flex flex-1 justify-around items-center text-xs text-center font-[Inter]">
                    <li className="cursor-pointer" onClick={addPolygon}>
                        <Image src={shapes} width={30} height={30} alt={"shapes"} />
                        Add
                    </li>
                    <li className="cursor-pointer" onClick={deletePolygon}>
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