
type LatLng = {
    lat: number;
    lng: number;
};

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

export function latLngToXY(latLng: google.maps.LatLng | LatLng,
    origin: google.maps.LatLng | LatLng) {
    const R = 6378137; // Earth radius (meters)
    let lat = 0, lng = 0;
    let originLat = 0, originLng = 0;
    if ("toJSON" in latLng) {
        lat = latLng.lat();
        lng = latLng.lng();
    } else {
        lat = latLng.lat;
        lng = latLng.lng;
    }

    if ("toJSON" in origin) {
        originLat = origin.lat();
        originLng = origin.lng();
    } else {
        originLat = origin.lat;
        originLng = origin.lng;
    }

    const dLat = (lat - originLat) * Math.PI / 180;
    const dLng = (lng - originLng) * Math.PI / 180;

    const x = R * dLng * Math.cos(originLat * Math.PI / 180);
    const y = R * dLat;

    return { x, y };
}

export function getPolygonArea(path: google.maps.LatLng[] | LatLng[]) {
    return google.maps.geometry.spherical.computeArea(path);
}

export function getPolygonPath(polygon: google.maps.Polygon) {
    const path = polygon.getPath().getArray();
    return path.map(p => ({ lat: p.lat(), lng: p.lng() }));
}

export function getPolygonAzimuth(path: google.maps.LatLng[] | LatLng[]) {
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

