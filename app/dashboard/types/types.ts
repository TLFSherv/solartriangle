export type Dataset = {
    x: string[];
    y: number[];
    type: 'months' | 'hrs' | 'days';
    name: string;
}

export type ColorGradient = {
    offset: number;
    stopColor: string;
}[]