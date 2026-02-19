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

function latLngToXY(latLng: google.maps.LatLng, origin: google.maps.LatLng) {
    const R = 6378137; // Earth radius (meters)
    const dLat = (latLng.lat() - origin.lat()) * Math.PI / 180;
    const dLng = (latLng.lng() - origin.lng()) * Math.PI / 180;

    const x = R * dLng * Math.cos(origin.lat() * Math.PI / 180);
    const y = R * dLat;

    return { x, y };
}

export function getPolygonArea(polygon: google.maps.Polygon) {
    return google.maps.geometry.spherical.computeArea(polygon.getPath().getArray());
}

export function getPolygonPath(polygon: google.maps.Polygon) {
    const path = polygon.getPath().getArray();
    return path.map(p => ({ lat: p.lat(), lng: p.lng() }));
}

export function getPolygonAzimuth(polygon: google.maps.Polygon) {
    const path = polygon.getPath().getArray();

    if (path.length < 2) return 0;

    // const a = google.maps.geometry.spherical.computeArea(path);
    // Use centroid as origin
    let bounds = new google.maps.LatLngBounds();
    path.forEach((p) => bounds.extend(p));
    const centroid = bounds.getCenter() || path[0];

    // Convert to XY
    const points = path.map(p => latLngToXY(p, centroid));

    // Compute covariance terms
    let sumXX = 0, sumXY = 0, sumYY = 0;

    for (const p of points) {
        sumXX += p.x * p.x;
        sumXY += p.x * p.y;
        sumYY += p.y * p.y;
    }

    // Principal axis angle
    const angleRad = 0.5 * Math.atan2(2 * sumXY, sumXX - sumYY);

    // Convert to degrees and normalize
    let angleDeg = angleRad * 180 / Math.PI;
    if (angleDeg < 0) angleDeg += 360;

    return angleDeg;
}

