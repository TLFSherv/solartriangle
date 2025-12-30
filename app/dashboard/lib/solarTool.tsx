// use the Sandia temperature model to estimate the temperature of the solar module

/*
1. Calculate back surface temp of module with Sandia module temp formula
   - going to need GTI, Ambient air temp, wind speed 
2. Calculate cell temperature with result from first step
3. Use the result from step 2 to estimate efficiency of solar panel
4. Use efficiency to find power output
*/

function getCellTemperatures(poa: number[], windSpeed: number[], airTemp: number[]) {
    // empirical coefficients based on module construction
    const a = -3.56, b = -0.075;
    // temp difference parameter between back surface and the cell
    const dT = 3;
    return poa.map((E, i) => {
        // calculate back surface temp of module with Sandia module temp formula
        const modTemp = E * Math.pow(Math.E, a + b * windSpeed[i]) + airTemp[i];
        return modTemp + E / 1000 * dT;
    });
}

function getPanelEfficiency(cellTemps: number[]) {
    // module efficiency at STC
    const modEff = 0.20, tempCoeff = -0.004;
    return cellTemps.map(cT => modEff * Math.min((1 + tempCoeff * (cT - 25)), 1));
}

export function getPowerOutput(area: number, poa: number[], windSpeed: number[], airTemp: number[]) {
    const cellTemps = getCellTemperatures(poa, windSpeed, airTemp);
    const panelEff = getPanelEfficiency(cellTemps);
    return poa.map((E, i) => {
        return (E * area * panelEff[i]);
    });
}

export function getPanelLosses(poa: number[], windSpeed: number[], airTemp: number[]) {
    const cellTemps = getCellTemperatures(poa, windSpeed, airTemp);
    const tempCoeff = -0.004;
    return cellTemps.map(cT => 100 - 100 * Math.min((1 + tempCoeff * (cT - 25)), 1));
}

