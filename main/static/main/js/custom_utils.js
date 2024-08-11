function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians) {
  return (radians * 180) / Math.PI;
}

function calculateBearing(coordinate1, coordinate2) {
  var lat1Rad = toRadians(coordinate1.latitude);
  var lat2Rad = toRadians(coordinate2.latitude);
  var deltaLonRad = toRadians(coordinate2.longitude - coordinate1.longitude);

  var y = Math.sin(deltaLonRad) * Math.cos(lat2Rad);
  var x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLonRad);

  var bearingRad = Math.atan2(y, x);
  var bearingDeg = toDegrees(bearingRad);

  // Normalize to 0-360 degrees
  return (bearingDeg + 360) % 360;
}

export { calculateBearing };
