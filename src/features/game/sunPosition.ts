import * as Astronomy from "astronomy-engine";

export function getSunPosition(
  lat: number,
  lon: number,
  evaDate: string,
): {
  elevation: number;
  azimuth: number;
  direction: [number, number, number];
} {
  const observer = new Astronomy.Observer(lat, lon, 0);
  const date = new Date(evaDate);

  const equ = Astronomy.Equator(Astronomy.Body.Sun, date, observer, true, true);

  const hor = Astronomy.Horizon(date, observer, equ.ra, equ.dec, "normal");

  const elevRad = (hor.altitude * Math.PI) / 180;
  const azRad = (hor.azimuth * Math.PI) / 180;

  const x = Math.sin(azRad) * Math.cos(elevRad);
  const y = Math.sin(elevRad);
  const z = -Math.cos(azRad) * Math.cos(elevRad);

  return {
    elevation: hor.altitude,
    azimuth: hor.azimuth,
    direction: [x * 100, y * 100, z * 100],
  };
}

export function getEarthPosition(lat: number, lon: number): [number, number, number] {
  const elevDeg = 60 + lat * 0.5;
  const azDeg = 280 - lon * 0.3;
  const elevRad = (elevDeg * Math.PI) / 180;
  const azRad = (azDeg * Math.PI) / 180;
  const dist = 500;
  const x = Math.sin(azRad) * Math.cos(elevRad) * dist;
  const y = Math.sin(elevRad) * dist;
  const z = -Math.cos(azRad) * Math.cos(elevRad) * dist;
  return [x, y, z];
}
