import { useState, useEffect } from "react";

export default function useDebounce(searchString: string): (string | null) {
    const [result, setResult] = useState<string | null>(null);
    useEffect(() => {
        if (!searchString || searchString.trim.length === 0) return;
        const timeoutId = setTimeout(() => {
            setResult(searchString);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchString])
    return result;
}