import React, { useState, useEffect } from "react"
import { useMap } from '@vis.gl/react-google-maps';
import Image from "next/image";
import shapes from '../../../../public/shapes.png'
import erase from '../../../../public/eraser.png'

export function createRectanglePoints(
    center: (google.maps.LatLng | undefined),
    width: number,
    height: number) {

    if (!center) return;
    const earth = 6378137; // radius of Earth

    const dLat = (height / 2) / earth;
    const dLng = (width / 2) / (earth * Math.cos(center.lat() * Math.PI / 180));

    return [
        { lat: center.lat() + dLat * 180 / Math.PI, lng: center.lng() - dLng * 180 / Math.PI }, // top-left
        { lat: center.lat() + dLat * 180 / Math.PI, lng: center.lng() + dLng * 180 / Math.PI }, // top-right
        { lat: center.lat() - dLat * 180 / Math.PI, lng: center.lng() + dLng * 180 / Math.PI }, // bottom-right
        { lat: center.lat() - dLat * 180 / Math.PI, lng: center.lng() - dLng * 180 / Math.PI }, // bottom-left
    ];
}

export default function DrawingTool() {
    const map = useMap();
    const [polygons, setPolygons] = useState<google.maps.Polygon[] | null>(null);
    const [area, setArea] = useState<number>(0);
    // De-select polygon on map click
    useEffect(() => {
        if (!map) return;
        const listener = map.addListener("click", resetPolygonStrokes);
        return () => google.maps.event.removeListener(listener);
    }, [map, polygons]);

    // Delete with keyboard
    useEffect(() => {
        if (!polygons) return;
        const handler = (e: KeyboardEvent) => {
            if ((e.key === "Delete" || e.key === "Backspace"))
                deletePolygon();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
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
            resetPolygonStrokes();
            poly.setOptions({ strokeColor: "#F0662A" });
            const a = google.maps.geometry.spherical.computeArea(poly.getPath());
            setArea(Number(a.toFixed(2)));
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
                <div className="flex flex-2 space-x-2 items-center justify-end mx-4">
                    <label className="text-sm">Area:</label>
                    <input
                        className="py-1 px-2 border-1 border-[#444444] rounded-md w-1/2 max-w-xs"
                        name="area"
                        value={area}
                        type="number"
                        disabled />
                </div>
            </div>
            <div className="text-[10px]">
                <a href="https://www.flaticon.com/free-icons/shapes"
                    title="shapes icons">Shapes icons created by Freepik - Flaticon</a>
            </div>
        </>
    );
}