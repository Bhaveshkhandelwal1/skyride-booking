import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { LocationPoint, TierOption } from "@/pages/Booking";

interface BookingFormProps {
  pickup: LocationPoint;
  destination: LocationPoint;
  distance: number;
  tier: TierOption;
  onBookingComplete: (bookingId: string) => void;
}

export const BookingForm = ({
  pickup,
  destination,
  distance,
  tier,
  onBookingComplete,
}: BookingFormProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fare = (distance * tier.rate_per_km).toFixed(2);
  const estimatedTime = Math.ceil((distance / tier.speed_kmh) * 60);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          pickup_lat: pickup.lat,
          pickup_lng: pickup.lng,
          destination_lat: destination.lat,
          destination_lng: destination.lng,
          distance_km: distance,
          fare_amount: parseFloat(fare),
          tier_type: tier.tier_type,
          user_name: name,
          user_phone: phone,
          estimated_arrival_minutes: estimatedTime,
          craft_id: `SR-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Booking Confirmed!",
        description: "Your SkyRide is on the way.",
      });

      onBookingComplete(data.id);
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-6">Confirm Your Booking</h2>
      
      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">Total Fare</span>
          <span className="text-2xl font-bold text-primary">₹{fare}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Estimated arrival: ~{estimatedTime} minutes
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            disabled={loading}
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            required
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Booking...
            </>
          ) : (
            "Confirm & Book"
          )}
        </Button>
      </form>
    </Card>
  );
};
