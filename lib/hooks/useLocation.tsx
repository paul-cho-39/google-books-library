import React, { useEffect, useState } from "react";

type LocationProps = {
  latitude: number | undefined | null;
  longitude: number | undefined | null;
  timestamp: number | string | undefined | null;
};

const GeoLocation = () => {
  const [location, setLocation] = useState<LocationProps | null>({
    latitude: null,
    longitude: null,
    timestamp: null,
  });
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      position &&
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp,
        });
    });
  }, []);

  const { hour, min, sec } = timeStampHelper(location?.timestamp as number);
  return location;
};

export default GeoLocation;

function timeStampHelper(date: Exclude<LocationProps["timestamp"], null>) {
  const newDate = new Date((date as number) * 1000);
  return {
    hour: newDate.getHours(),
    min: newDate.getMinutes(),
    sec: newDate.getSeconds(),
  };
}
