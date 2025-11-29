import React, { useState, useEffect } from "react"
import { useMap } from '@vis.gl/react-google-maps';
import Image from "next/image";
import shapes from '../../../../public/shapes.png'
import erase from '../../../../public/eraser.png'
import { createRectanglePoints, computePolygonAzimuth } from '../lib/geometryTool'

type FormInputs = {
    address: string;
    location: { lat: number; lng: number } | null;
    area: number;
    azimuth: number;
    capacity: number;
    quantity: number;
    polygons: google.maps.Polygon[] | null;
}

export default function DrawingTool(props: {
    inputs: FormInputs,
    setInputs: React.Dispatch<React.SetStateAction<FormInputs>>
}) {
    const map = useMap();
    const [polygons, setPolygons] = useState<google.maps.Polygon[] | null>(null);
    const { inputs, setInputs } = props;
    useEffect(() => {
        setInputs({ ...inputs, polygons: polygons })

        // De-select polygon if click outside of polygon
        document.addEventListener("mousedown", resetPolygonStrokes);

        // Delete with keyboard
        if (!polygons) return;
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

        if (polygons) setPolygons([...polygons, poly]);
        else setPolygons([poly]);


        poly.addListener("click", () => {
            //resetPolygonStrokes();
            poly.setOptions({ strokeColor: "#F0662A" });
            const area = google.maps.geometry.spherical.computeArea(poly.getPath());
            const azimuth = computePolygonAzimuth(poly) || 0;
            setInputs({
                ...inputs,
                ['area']: Number(area.toFixed(2)),
                ['azimuth']: Number(azimuth.toFixed(2))
            });
        });
        resetPolygonStrokes();
        poly.setMap(map);
    }

    const deletePolygon = () => {
        if (!polygons) return;
        const selectedPolygon = polygons?.filter((poly) =>
            poly.get("strokeColor") === '#F0662A'
        )[0];
        if (!selectedPolygon) return;
        selectedPolygon.setMap(null);
        setPolygons(polygons?.filter((poly) => poly !== selectedPolygon));
    }

    const resetPolygonStrokes = () => {
        polygons?.forEach((p) => {
            if (p.get("strokeColor") === '#F0662A')
                p.setOptions({ strokeColor: "#1E1E1E" });
        })
    }

    return (
        <>
            <div className="flex my-2 rounded-3xl border-2 border-[#444444] py-1">
                <ol className="flex flex-1 justify-evenly items-center text-xs text-center font-[Inter]">
                    <li className="cursor-pointer" onClick={addPolygon}>
                        <Image src={shapes} width={30} height={30} alt={"shapes"} />
                        Add
                    </li>
                    <li className="cursor-pointer" onClick={deletePolygon}>
                        <Image src={erase} width={30} height={30} alt={"eraser"} />
                        Erase
                    </li>
                </ol>
                <div className="flex justify-end flex-2 space-x-6 items-center mx-4">
                    <div>
                        <label className="text-sm">Area:</label>
                        <input
                            className="py-1 px-2 border-1 border-[#444444] w-3/4 rounded-md max-w-xs"
                            name="area"
                            value={inputs.area || 0}
                            type="number"
                            disabled />
                    </div>
                    <div>
                        <label className="text-sm">Azimuth:</label>
                        <input
                            className="py-1 px-2 border-1 border-[#444444] w-3/5 rounded-md max-w-xs"
                            name="azimuth"
                            value={inputs.azimuth || 0}
                            type="number"
                            disabled />
                    </div>
                </div>
            </div>
            <div className="text-[10px]">
                <a href="https://www.flaticon.com/free-icons/shapes"
                    title="shapes icons">Shapes icons created by Freepik - Flaticon</a>
            </div>
        </>
    );
}