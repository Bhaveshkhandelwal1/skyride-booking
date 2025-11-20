import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation } from "lucide-react";
import type { LocationPoint } from "@/pages/Booking";

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapInterfaceProps {
  pickup: LocationPoint | null;
  destination: LocationPoint | null;
  onPickupChange: (point: LocationPoint) => void;
  onDestinationChange: (point: LocationPoint) => void;
  onDistanceChange: (distance: number) => void;
}

const MapClickHandler = ({
  pickup,
  onPickupChange,
  onDestinationChange,
}: {
  pickup: LocationPoint | null;
  onPickupChange: (point: LocationPoint) => void;
  onDestinationChange: (point: LocationPoint) => void;
}) => {
  useMapEvents({
    click: (e) => {
      const point = { lat: e.latlng.lat, lng: e.latlng.lng };
      if (!pickup) {
        onPickupChange(point);
      } else {
        onDestinationChange(point);
      }
    },
  });
  return null;
};

const calculateDistance = (point1: LocationPoint, point2: LocationPoint): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((point2.lat - point1.lat) * Math.PI) / 180;
  const dLon = ((point2.lng - point1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((point1.lat * Math.PI) / 180) *
      Math.cos((point2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const MapInterface = ({
  pickup,
  destination,
  onPickupChange,
  onDestinationChange,
  onDistanceChange,
}: MapInterfaceProps) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (pickup && destination) {
      const dist = calculateDistance(pickup, destination);
      onDistanceChange(Number(dist.toFixed(2)));
    }
  }, [pickup, destination, onDistanceChange]);

  const handlePickupLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lat = parseFloat(e.target.value);
    if (!isNaN(lat)) {
      onPickupChange({ ...pickup, lat } as LocationPoint);
    }
  };

  const handlePickupLngChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lng = parseFloat(e.target.value);
    if (!isNaN(lng)) {
      onPickupChange({ ...pickup, lng } as LocationPoint);
    }
  };

  const handleDestinationLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lat = parseFloat(e.target.value);
    if (!isNaN(lat)) {
      onDestinationChange({ ...destination, lat } as LocationPoint);
    }
  };

  const handleDestinationLngChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lng = parseFloat(e.target.value);
    if (!isNaN(lng)) {
      onDestinationChange({ ...destination, lng } as LocationPoint);
    }
  };


  const bengaluruCenter: [number, number] = [12.9716, 77.5946];

  return (
    <Card className="overflow-hidden shadow-lg">
      <div className="p-4 bg-card border-b">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Navigation className="h-5 w-5 text-primary" />
          Select Your Route
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {!pickup ? "Click to set pickup location" : !destination ? "Click to set destination" : "Route selected"}
        </p>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="pickup-lat">Pickup Latitude</Label>
            <Input
              id="pickup-lat"
              type="number"
              value={pickup?.lat ?? ""}
              onChange={handlePickupLatChange}
              placeholder="e.g., 12.9716"
            />
          </div>
          <div>
            <Label htmlFor="pickup-lng">Pickup Longitude</Label>
            <Input
              id="pickup-lng"
              type="number"
              value={pickup?.lng ?? ""}
              onChange={handlePickupLngChange}
              placeholder="e.g., 77.5946"
            />
          </div>
          <div>
            <Label htmlFor="dest-lat">Destination Latitude</Label>
            <Input
              id="dest-lat"
              type="number"
              value={destination?.lat ?? ""}
              onChange={handleDestinationLatChange}
              placeholder="e.g., 12.9716"
            />
          </div>
          <div>
            <Label htmlFor="dest-lng">Destination Longitude</Label>
            <Input
              id="dest-lng"
              type="number"
              value={destination?.lng ?? ""}
              onChange={handleDestinationLngChange}
              placeholder="e.g., 77.5946"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          {pickup && (
            <Badge variant="secondary" className="gap-1">
              <MapPin className="h-3 w-3" />
              Pickup Set
            </Badge>
          )}
          {destination && (
            <Badge variant="secondary" className="gap-1">
              <MapPin className="h-3 w-3" />
              Destination Set
            </Badge>
          )}
        </div>
      </div>

      <div className="relative h-[500px]">
        <MapContainer
          center={bengaluruCenter}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
          whenReady={() => setMapLoaded(true)}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler
            pickup={pickup}
            onPickupChange={onPickupChange}
            onDestinationChange={onDestinationChange}
          />
          {pickup && <Marker position={[pickup.lat, pickup.lng]} />}
          {destination && <Marker position={[destination.lat, destination.lng]} />}
          {pickup && destination && (
            <Polyline
              positions={[
                [pickup.lat, pickup.lng],
                [destination.lat, destination.lng],
              ]}
              color="#0EA5E9"
              weight={3}
              opacity={0.7}
              dashArray="10, 10"
            />
          )}
        </MapContainer>
      </div>
    </Card>
  );
};
