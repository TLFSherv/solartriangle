# Project: SolarTriangle (Solar Analysis Tool)

**The Challenge: Homeowners often struggle to estimate the ROI of solar panels because energy output depends on highly specific variables: roof size, orientation, local weather, and solar irradiance.**

**The Solution:** I built an end-to-end tool that removes the guesswork. By allowing users to physically "draw" their installation on a map, the app calculates the exact area and fetches hyper-local weather data to provide a professional-grade energy projection.

Technical Highlights:

- Math & Geometry: Performed geometric calculations on user-drawn polygons to determine surface area and panel capacity.

- State Management: Used Next.js Middleware and Redis to create a seamless, high-performance flow for unauthenticated users.

- Visual Insights: Chose D3.js specifically to handle the high-density data of solar irradiance, providing users with a "Heat Map" of their energy potential over a 12-month cycle.
