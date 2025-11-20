import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Plane, Users, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { TierOption } from "@/pages/Booking";
import { Skeleton } from "@/components/ui/skeleton";

interface TierSelectorProps {
  distance: number;
  selectedTier: TierOption | null;
  onTierSelect: (tier: TierOption) => void;
}

const tierIcons = {
  basic: Plane,
  premium: Zap,
  elite: Users,
};

export const TierSelector = ({ distance, selectedTier, onTierSelect }: TierSelectorProps) => {
  const [tiers, setTiers] = useState<TierOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTiers = async () => {
      const { data, error } = await supabase
        .from("tiers")
        .select("*")
        .order("rate_per_km", { ascending: true });

      if (error) {
        console.error("Error fetching tiers:", error);
      } else if (data) {
        setTiers(data as TierOption[]);
      }
      setLoading(false);
    };

    fetchTiers();
  }, []);

  const calculateFare = (ratePerKm: number) => {
    return (distance * ratePerKm).toFixed(2);
  };

  const calculateTime = (speedKmh: number) => {
    return Math.ceil((distance / speedKmh) * 60);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Select Your Craft</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-2">Select Your Craft</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Distance: <span className="font-medium text-foreground">{distance} km</span>
      </p>

      <div className="space-y-4">
        {tiers.map((tier) => {
          const Icon = tierIcons[tier.tier_type];
          const isSelected = selectedTier?.id === tier.id;
          const fare = calculateFare(tier.rate_per_km);
          const time = calculateTime(tier.speed_kmh);

          return (
            <Card
              key={tier.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                isSelected ? "ring-2 ring-primary shadow-lg" : ""
              }`}
              onClick={() => onTierSelect(tier)}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3 flex-1">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{tier.name}</h3>
                      {isSelected && (
                        <Badge variant="default" className="h-5">
                          <Check className="h-3 w-3" />
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{tier.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-muted-foreground">
                        <Users className="h-3 w-3 inline mr-1" />
                        {tier.capacity} seats
                      </span>
                      <span className="text-muted-foreground">
                        <Zap className="h-3 w-3 inline mr-1" />
                        {tier.speed_kmh} km/h
                      </span>
                      <span className="text-muted-foreground">~{time} min</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">₹{fare}</p>
                  <p className="text-xs text-muted-foreground">Estimated</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </Card>
  );
};
