# Project: SolarTriangle (Solar Analysis Tool)
An application for future solar purchasers to estimate and analyse the potential energy yield of their future system.

**The Challenge: Homeowners often struggle to estimate the ROI of solar panels because energy output depends on highly specific variables: roof size, orientation, local weather, and solar irradiance.**

**The Solution:** I built an end-to-end tool that removes the guesswork. By allowing users to physically "draw" their installation on a map, the app calculates the exact area and fetches hyper-local weather data to provide a professional-grade energy projection.

## Tech Stack
![Static Badge](https://img.shields.io/badge/Next.js-black?logo=Next.js)
![Static Badge](https://img.shields.io/badge/React-61DBFB?logo=react&logoColor=white)
![Static Badge](https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white)
![Static Badge](https://img.shields.io/badge/PostgreSQL-blue?logo=postgresql&logoColor=white)
![Static Badge](https://img.shields.io/badge/D3.js-white?logo=D3)
![Static Badge](https://img.shields.io/badge/Redis-white?logo=Redis)

## Screenshots
<img width="2988" height="1472" alt="image" src="https://github.com/user-attachments/assets/c7d529d7-88ce-4ee4-9b4d-f6308c7af890" />

## Live Demo Link
https://solartriangle.vercel.app/ 

## Key Features
- Google Maps API Integration : Google Maps is integrated for users to view their home, as well as draw polygons on the map to represent their solar panels
- Google Maps Address Autosuggestion API: users are given autosuggestions when searching for their address to make the search process efficient as well as reduce errors.
- Custom visualizations: D3.js is utilised to create intuitive data visualisations
- Accounts and data caching: users can navigate to other pages on the site without their inputs being lost; users can also create accounts to permanently save the results from the solar calculator

