import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Plane, Zap, Clock, Shield } from "lucide-react";
import heroImage from "@/assets/hero-flying-taxi.jpg";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Plane,
      title: "Aerial Travel",
      description: "Skip traffic with direct point-to-point flights",
    },
    {
      icon: Zap,
      title: "Fast Booking",
      description: "Book in seconds with our simple interface",
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "Reduce hours of commute to minutes",
    },
    {
      icon: Shield,
      title: "Autonomous & Safe",
      description: "AI-powered crafts with top safety standards",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge variant="secondary" className="w-fit">
                Now Available in Bengaluru
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Beat The Traffic.
                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mt-2">
                  Take to The Skies.
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Experience the future of urban mobility with SkyRide's autonomous flying taxis. 
                Fast, efficient, and designed for Bengaluru's busy professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate("/booking")}
                  className="text-lg h-14 shadow-lg hover:shadow-xl transition-all"
                >
                  <Plane className="mr-2 h-5 w-5" />
                  Book a SkyRide
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/booking")}
                  className="text-lg h-14"
                >
                  Learn More
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
              <img
                src={heroImage}
                alt="Flying taxi soaring above Bengaluru cityscape"
                className="relative rounded-3xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose SkyRide?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Revolutionary aerial transportation designed for modern Bengaluru
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="p-6 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 container mx-auto px-4">
        <Card className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-primary/20 p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Skip the Traffic?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of Bengaluru commuters who've already made the switch to aerial travel
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/booking")}
            className="text-lg h-14 shadow-lg hover:shadow-xl transition-all"
          >
            Book Your First Flight
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 SkyRide. Transforming urban mobility in Bengaluru.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
