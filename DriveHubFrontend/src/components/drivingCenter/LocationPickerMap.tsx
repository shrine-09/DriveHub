import { useEffect } from "react";
import L from "leaflet";
import {
    MapContainer,
    Marker,
    TileLayer,
    useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

type LocationPickerMapProps = {
    latitude: number | null;
    longitude: number | null;
    onLocationChange: (lat: number, lng: number) => void;
};

function ClickHandler({
                          onLocationChange,
                      }: {
    onLocationChange: (lat: number, lng: number) => void;
}) {
    useMapEvents({
        click(e) {
            onLocationChange(e.latlng.lat, e.latlng.lng);
        },
    });

    return null;
}

function RecenterMap({
                         latitude,
                         longitude,
                     }: {
    latitude: number | null;
    longitude: number | null;
}) {
    const map = useMapEvents({});

    useEffect(() => {
        if (latitude !== null && longitude !== null) {
            map.setView([latitude, longitude], 15);
        }
    }, [latitude, longitude, map]);

    return null;
}

export default function LocationPickerMap({
                                              latitude,
                                              longitude,
                                              onLocationChange,
                                          }: LocationPickerMapProps) {
    const defaultCenter: [number, number] =
        latitude !== null && longitude !== null
            ? [latitude, longitude]
            : [27.7172, 85.324]; // Kathmandu fallback

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <MapContainer
                center={defaultCenter}
                zoom={13}
                style={{ height: "420px", width: "100%" }}
                scrollWheelZoom
            >
                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <ClickHandler onLocationChange={onLocationChange} />
                <RecenterMap latitude={latitude} longitude={longitude} />

                {latitude !== null && longitude !== null ? (
                    <Marker position={[latitude, longitude]} />
                ) : null}
            </MapContainer>
        </div>
    );
}