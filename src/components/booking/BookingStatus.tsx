import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Plane, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BookingStatusProps {
  bookingId: string;
}

type BookingStatus = "requested" | "craft_assigned" | "en_route" | "arrived" | "in_flight" | "completed" | "cancelled";

interface Booking {
  id: string;
  status: BookingStatus;
  craft_id: string;
  user_name: string;
  fare_amount: number;
  estimated_arrival_minutes: number;
  tier_type: string;
}

const statusSteps = [
  { key: "requested", label: "Booking Requested", icon: Clock },
  { key: "craft_assigned", label: "Craft Assigned", icon: Plane },
  { key: "en_route", label: "En Route to Pickup", icon: MapPin },
  { key: "arrived", label: "Arrived at Pickup", icon: CheckCircle2 },
  { key: "in_flight", label: "In Flight", icon: Plane },
  { key: "completed", label: "Journey Completed", icon: CheckCircle2 },
];

export const BookingStatus = ({ bookingId }: BookingStatusProps) => {
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", bookingId)
        .single();

      if (data) {
        setBooking(data as Booking);
      }
    };

    fetchBooking();

    // Simulate status progression for demo
    const interval = setInterval(async () => {
      const { data } = await supabase
        .from("bookings")
        .select("status")
        .eq("id", bookingId)
        .single();

      if (data) {
        const currentIndex = statusSteps.findIndex((s) => s.key === data.status);
        if (currentIndex < statusSteps.length - 1) {
          const nextStatus = statusSteps[currentIndex + 1].key as BookingStatus;
          await supabase
            .from("bookings")
            .update({ status: nextStatus })
            .eq("id", bookingId);
          
          setBooking((prev) => prev ? { ...prev, status: nextStatus } : null);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [bookingId]);

  if (!booking) {
    return (
      <Card className="p-6">
        <p>Loading booking details...</p>
      </Card>
    );
  }

  const currentStepIndex = statusSteps.findIndex((s) => s.key === booking.status);

  return (
    <Card className="p-6 shadow-lg max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-muted-foreground">
          Your SkyRide is on the way, {booking.user_name}
        </p>
      </div>

      <div className="bg-muted/30 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Craft ID</p>
            <p className="font-semibold text-lg">{booking.craft_id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Tier</p>
            <Badge variant="secondary" className="text-sm">
              {booking.tier_type.toUpperCase()}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Fare</p>
            <p className="font-semibold text-lg text-primary">₹{booking.fare_amount}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">ETA</p>
            <p className="font-semibold text-lg">{booking.estimated_arrival_minutes} min</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg mb-4">Journey Status</h3>
        {statusSteps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.key} className="flex items-center gap-4">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </p>
              </div>
              {isCurrent && (
                <Badge variant="default" className="animate-pulse">
                  Current
                </Badge>
              )}
              {isCompleted && index < currentStepIndex && (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
