import { useState } from "react";
import { MapInterface } from "@/components/booking/MapInterface";
import { TierSelector } from "@/components/booking/TierSelector";
import { BookingForm } from "@/components/booking/BookingForm";
import { BookingStatus } from "@/components/booking/BookingStatus";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface LocationPoint {
  lat: number;
  lng: number;
}

export interface TierOption {
  id: string;
  name: string;
  tier_type: "basic" | "premium" | "elite";
  rate_per_km: number;
  speed_kmh: number;
  description: string;
  capacity: number;
}

const Booking = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState<LocationPoint | null>(null);
  const [destination, setDestination] = useState<LocationPoint | null>(null);
  const [selectedTier, setSelectedTier] = useState<TierOption | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [distance, setDistance] = useState<number>(0);

  const handleReset = () => {
    setPickup(null);
    setDestination(null);
    setSelectedTier(null);
    setBookingId(null);
    setDistance(0);
  };

  if (bookingId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            onClick={handleReset}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Book Another Ride
          </Button>
          <BookingStatus bookingId={bookingId} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            SkyRide
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <MapInterface
              pickup={pickup}
              destination={destination}
              onPickupChange={setPickup}
              onDestinationChange={setDestination}
              onDistanceChange={setDistance}
            />
          </div>

          <div className="space-y-6">
            {pickup && destination && distance > 0 && (
              <>
                <TierSelector
                  distance={distance}
                  selectedTier={selectedTier}
                  onTierSelect={setSelectedTier}
                />
                {selectedTier && (
                  <BookingForm
                    pickup={pickup}
                    destination={destination}
                    distance={distance}
                    tier={selectedTier}
                    onBookingComplete={setBookingId}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Booking;
