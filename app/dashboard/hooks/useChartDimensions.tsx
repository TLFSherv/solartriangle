import React, { useState, useEffect, useRef } from "react";

export default function useChartDimensions(dimensions: {
    height: number,
    width: number
}): [React.RefObject<HTMLDivElement | undefined>,
        { width: number, height: number }] {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const ref = useRef<HTMLDivElement | undefined>(undefined);

    useEffect(() => {
        if (dimensions.width && dimensions.height) return;

        const element = ref.current;
        const resizeObserver = new ResizeObserver(
            entries => {
                if (!Array.isArray(entries)) return;
                if (!entries.length) return;

                const entry = entries[0];

                if (width !== entry.contentRect.width)
                    setWidth(entry.contentRect.width);
                if (height !== entry.contentRect.height)
                    setHeight(entry.contentRect.height);
            }
        );
        if (!element) return;
        resizeObserver.observe(element);

        return () => resizeObserver.unobserve(element);
    }, []);

    return [ref, {
        width: dimensions.height | width,
        height: dimensions.height | height
    }]
}