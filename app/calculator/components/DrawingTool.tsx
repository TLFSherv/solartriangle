import React, { useState, useEffect, useRef } from "react"
import { useMap } from '@vis.gl/react-google-maps';
import Image from "next/image";
import shapes from '../../../public/shapes.png'
import erase from '../../../public/eraser.png'
import { createRectanglePoints } from '../lib/geometryTool'
import { FormInputs, SolarArray } from "@/app/types/types";
import { cacheExists, getCachedData } from "@/actions/data";

export default function DrawingTool(props: {
    inputs: FormInputs,
    setInputs: React.Dispatch<React.SetStateAction<FormInputs>>
    activeId: number,
    setActiveId: React.Dispatch<React.SetStateAction<number>>
}) {
    const map = useMap();
    const [polygons, setPolygons] = useState<{ id: number; polygon: google.maps.Polygon }[] | null>(props.inputs.polygons);
    const polygonsRef = useRef<{ id: number; polygon: google.maps.Polygon }[] | null>(polygons);
    const polygonIdRef = useRef(1);
    const populatedMap = useRef(false);
    const { setInputs } = props;

    useEffect(() => {
        polygonsRef.current = polygons;
        setInputs(prev => ({ ...prev, polygons: polygonsRef.current || [] }))
    }, [polygons]);

    useEffect(() => {
        resetPolygonStrokes();
        polygonsRef.current?.forEach((p) => {
            if (p.id === props.activeId)
                p.polygon.setOptions({ strokeColor: "#F0662A" });
        })
    }, [props.activeId])

    // populate map with solar panels if user returns to calculator
    useEffect(() => {
        const populateMap = async () => {
            const exists = await cacheExists('calculatorData');
            if (!exists || !map ||
                !props.inputs.polygons.length) return

            // add event listeners back
            props.inputs.polygons.forEach(({ id, polygon: poly }) => {
                poly.addListener("click", () => props.setActiveId(id));

                // update polygon if vertices change
                poly.getPath().addListener("set_at", () => {
                    setInputs((prev) => ({ ...prev, polygons: props.inputs.polygons || [] }))
                });

                poly.setMap(map);
            })
            populatedMap.current = true;
            setPolygons(props.inputs.polygons);
        }
        // only call once
        if (!populatedMap.current) populateMap();
    }, [props.inputs.polygons.join('-')])

    const addPolygon = () => {
        if (!map) return;

        const center = map.getCenter();
        const zoom = map.getZoom();

        if (!center || !zoom) return;

        const length = screen.width / 10 * (156543 / Math.pow(2, zoom));
        const path = createRectanglePoints(center, length, length);
        const id = ((props.inputs.polygons.at(-1)?.id || -1) + 1) || polygonIdRef.current;

        const poly = new google.maps.Polygon({
            paths: path,
            strokeColor: id === 1 ? "#F0662A" : "#1E1E1E",
            fillColor: "#444444",
            fillOpacity: 0.25,
            draggable: true,
            editable: true,
        });

        if (polygons) setPolygons([...polygons, { id: id, polygon: poly }]);
        else setPolygons([{ id: id, polygon: poly }]);

        poly.addListener("click", () => props.setActiveId(id));

        // update polygon if vertices change
        poly.getPath().addListener("set_at", () => {
            setInputs((prev) => ({ ...prev, polygons: polygonsRef.current || [] }))
        });

        poly.setMap(map);
        polygonIdRef.current = id + 1;
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
        polygonsRef.current?.forEach((p) => {
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