import * as Astronomy from "astronomy-engine";

const APOLLO_11_SITE = {
  lat: 0.67409,
  lon: 23.47298,
};

// Apollo 11 EVA start: 1969-07-21 02:56 UTC
const EVA_DATE = new Date("1969-07-21T02:56:00Z");

export function getApollo11SunPosition(): {
  elevation: number;
  azimuth: number;
  direction: [number, number, number];
} {
  const observer = new Astronomy.Observer(
    APOLLO_11_SITE.lat,
    APOLLO_11_SITE.lon,
    0,
  );

  const equ = Astronomy.Equator(
    Astronomy.Body.Sun,
    EVA_DATE,
    observer,
    true,
    true,
  );

  const hor = Astronomy.Horizon(
    EVA_DATE,
    observer,
    equ.ra,
    equ.dec,
    "normal",
  );

  const elevRad = (hor.altitude * Math.PI) / 180;
  const azRad = (hor.azimuth * Math.PI) / 180;

  // Convert altitude/azimuth to a 3D directional light vector
  // azimuth: 0=north, 90=east, 180=south, 270=west
  const x = Math.sin(azRad) * Math.cos(elevRad);
  const y = Math.sin(elevRad);
  const z = -Math.cos(azRad) * Math.cos(elevRad);

  return {
    elevation: hor.altitude,
    azimuth: hor.azimuth,
    direction: [x * 100, y * 100, z * 100],
  };
}

export function getApollo11EarthPosition(): [number, number, number] {
  // Earth appears almost directly overhead from the Apollo 11 site
  // (because the site is near the sub-Earth point on the Moon)
  // Approximately 60° above the horizon, slightly west
  const elevRad = (60 * Math.PI) / 180;
  const azRad = (280 * Math.PI) / 180;
  const dist = 500;
  const x = Math.sin(azRad) * Math.cos(elevRad) * dist;
  const y = Math.sin(elevRad) * dist;
  const z = -Math.cos(azRad) * Math.cos(elevRad) * dist;
  return [x, y, z];
}
