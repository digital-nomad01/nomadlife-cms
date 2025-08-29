/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
  Wifi, 
  Snowflake, 
  Armchair, 
  Monitor, 
  MonitorSpeaker,
  Coffee, 
  Coffee as Tea, 
  UtensilsCrossed,
  TreePine,
  Zap,
  Car,
  Heart,
  Volume2,
  Users,
  Clock,
  Printer,
  Users as MeetingRoom,
  Mountain,
  Sun
} from "lucide-react";

export interface AmenityConfig {
  name: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
}

export const AMENITY_CONFIG: Record<string, AmenityConfig> = {
  wifi: {
    name: "wifi",
    label: "High-Speed WiFi",
    description: "100+ Mbps fiber internet",
    icon: Wifi
  },
  aircon: {
    name: "aircon",
    label: "Air Conditioning",
    description: "Climate controlled environment",
    icon: Snowflake
  },
  ergonomic_chairs: {
    name: "ergonomic_chairs",
    label: "Ergonomic Chairs",
    description: "Comfortable seating for long work sessions",
    icon: Armchair
  },
  standing_desks: {
    name: "standing_desks",
    label: "Standing Desks",
    description: "Adjustable height workstations",
    icon: Monitor
  },
  monitors: {
    name: "monitors",
    label: "External Monitors",
    description: "Additional screens for productivity",
    icon: MonitorSpeaker
  },
  coffee: {
    name: "coffee",
    label: "Coffee & Tea",
    description: "Unlimited beverages included",
    icon: Coffee
  },
  tea: {
    name: "tea",
    label: "Tea Selection",
    description: "Variety of premium teas",
    icon: Tea
  },
  food: {
    name: "food",
    label: "Food Available",
    description: "Snacks and meals on-site",
    icon: UtensilsCrossed
  },
  outdoor_seating: {
    name: "outdoor_seating",
    label: "Outdoor Seating",
    description: "Work in fresh air with nature views",
    icon: TreePine
  },
  power_outlets: {
    name: "power_outlets",
    label: "Power Outlets",
    description: "Plenty of charging stations",
    icon: Zap
  },
  parking: {
    name: "parking",
    label: "Parking Available",
    description: "Secure parking for vehicles",
    icon: Car
  },
  pet_friendly: {
    name: "pet_friendly",
    label: "Pet Friendly",
    description: "Bring your furry companions",
    icon: Heart
  },
  quiet_zones: {
    name: "quiet_zones",
    label: "Quiet Zones",
    description: "Dedicated silent work areas",
    icon: Volume2
  },
  community_events: {
    name: "community_events",
    label: "Community Events",
    description: "Regular networking and social events",
    icon: Users
  },
  open_24_7: {
    name: "open_24_7",
    label: "24/7 Access",
    description: "Work anytime with secure keycard access",
    icon: Clock
  },
  printing: {
    name: "printing",
    label: "Printing & Scanning",
    description: "Full office services available",
    icon: Printer
  },
  meeting_rooms: {
    name: "meeting_rooms",
    label: "Meeting Rooms",
    description: "Private spaces for calls and meetings",
    icon: MeetingRoom
  },
  mountain_views: {
    name: "mountain_views",
    label: "Mountain Views",
    description: "Inspiring natural scenery",
    icon: Mountain
  },
  rooftop_terrace: {
    name: "rooftop_terrace",
    label: "Rooftop Terrace",
    description: "Outdoor workspace with mountain views",
    icon: Sun
  }
};

// Helper function to get amenity config
export const getAmenityConfig = (amenityName: string): AmenityConfig | null => {
  return AMENITY_CONFIG[amenityName] || null;
};

// Get all available amenity names for the form
export const getAvailableAmenities = (): string[] => {
  return Object.keys(AMENITY_CONFIG);
};
