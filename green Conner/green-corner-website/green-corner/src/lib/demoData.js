// Demo/fallback content for The Green Corner — Grill Pub (Nyamirambo, Kigali).
//
// The owner confirmed the concept and the Signature Fish / Grilled Meats /
// Sides / Drinks menu (see menuCategories below). Business details not yet
// confirmed by the owner — phone, hours, exact pricing tier — stay clearly
// marked PLACEHOLDER until they provide them. Nothing marked PLACEHOLDER is
// ever shown to a real customer (see isPlaceholderText() in lib/media.js).

export const businessInfo = {
  name: "The Green Corner",
  tagline: "Fire-grilled fish & brochettes in Nyamirambo",
  phone: "PLACEHOLDER — add real phone number",
  whatsapp: "250700000000",
  instagram: "@greencorner.rw",
  facebookUrl: "",
  tiktokUrl: "",
  neighborhood: "Nyamirambo",
  city: "Kigali, Rwanda",
  priceRange: "PLACEHOLDER — confirm pricing",
  googleRating: null,
  googleReviewCount: null,
  serviceOptions: ["Grilled Fish", "Brochettes", "Cold Drinks"],
  description:
    "The Green Corner is a grill pub in Nyamirambo, Kigali, known for fire-grilled fish, goat and beef brochettes, and an ice-cold selection of local beers. A lively, no-frills spot to eat well and unwind.",
  mapsQuery: "Nyamirambo, Kigali, Rwanda",
  logoUrl: "/images/logo.png",
  heroMediaType: "images",
  heroVideoUrl: null,
  heroImage1: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?q=80&w=800",
  heroImage2: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800",
  heroImage3: "https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=800"
};

// PLACEHOLDER hours — confirm with the owner.
export const hours = [
  { day: "Monday", open: "7:00 AM", close: "8:00 PM" },
  { day: "Tuesday", open: "7:00 AM", close: "8:00 PM" },
  { day: "Wednesday", open: "7:00 AM", close: "8:00 PM" },
  { day: "Thursday", open: "7:00 AM", close: "8:00 PM" },
  { day: "Friday", open: "7:00 AM", close: "9:00 PM" },
  { day: "Saturday", open: "8:00 AM", close: "9:00 PM" },
  { day: "Sunday", open: "8:00 AM", close: "6:00 PM" }
];

// Photos standing in for real venue photography — reusing the same
// Unsplash food photos as the menu for now. Replace with real interior/food
// photos of Green Corner via the admin Gallery page.
export const galleryImages = [
  { id: "g1", url: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?q=80&w=800", caption: "PLACEHOLDER — the big grilled fish", category: "Fish" },
  { id: "g2", url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800", caption: "PLACEHOLDER — goat brochettes on the grill", category: "Grilled Meats" },
  { id: "g3", url: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?q=80&w=800", caption: "PLACEHOLDER — beef brochette", category: "Grilled Meats" },
  { id: "g4", url: "https://images.unsplash.com/photo-1633494541571-0814fdbfa54b?q=80&w=800", caption: "PLACEHOLDER — roasted potatoes", category: "Sides" },
  { id: "g5", url: "https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=800", caption: "PLACEHOLDER — cold local beer", category: "Drinks" }
];

// Confirmed menu content provided by the owner for Green Corner as a grill
// pub — fire-grilled fish, brochettes, sides and drinks. Photos are stock
// images (Unsplash, free-to-use) standing in until real food photography
// from the venue is available.
export const menuCategories = [
  {
    id: "fish",
    name: "Signature Fish",
    items: [
      { id: "m1", name: "Legendary Big Grilled Fish (Amafi Manini)", description: "A massive, fire-grilled fish smothered in onions, garlic, and local spices.", price: "18,500", image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?q=80&w=800", specialty: true }
    ]
  },
  {
    id: "meats",
    name: "Grilled Meats",
    items: [
      { id: "m2", name: "Classic Goat Brochette (Zingalo)", description: "Tender goat meat, marinated and grilled over an open flame.", price: "1,500", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800", specialty: true },
      { id: "m3", name: "Beef Brochette", description: "Premium cuts of beef, seasoned with Rwandan spices.", price: "1,200", image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?q=80&w=800" }
    ]
  },
  {
    id: "sides",
    name: "Sides",
    items: [
      { id: "m4", name: "Whole Roasted Potatoes (Ibirayi)", description: "Deep-fried, whole savory potatoes crispy on the outside.", price: "2,000", image: "https://images.unsplash.com/photo-1633494541571-0814fdbfa54b?q=80&w=800" },
      { id: "m5", name: "Fried Plantains (Mizuzu)", description: "Sweet, golden-brown fried plantains.", price: "2,500", image: "https://images.unsplash.com/photo-1662993888358-db809fdb89a9?q=80&w=800" }
    ]
  },
  {
    id: "drinks",
    name: "Drinks",
    items: [
      { id: "m6", name: "Ice Cold Local Beers", description: "Perfectly chilled Skol, Mutzig, or Primus.", price: "1,500", image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=800" }
    ]
  }
];

// Sample/placeholder promotional content — NOT confirmed real promotions.
export const specials = [
  {
    id: "s1",
    title: "Happy Hour Brochettes",
    description: "PLACEHOLDER — a sample idea: discounted brochettes during early evening hours, confirm timing and pricing with the owner.",
    tag: "Sample idea",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800"
  },
  {
    id: "s2",
    title: "Fish & Beer Combo",
    description: "PLACEHOLDER — a sample idea: grilled fish plus a cold beer for a set combo price, confirm concept and pricing with the owner.",
    tag: "Sample idea",
    image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?q=80&w=800"
  },
  {
    id: "s3",
    title: "Weekend Grill Night",
    description: "PLACEHOLDER — a sample idea: extended grill menu and live atmosphere on weekend evenings, confirm concept with the owner.",
    tag: "Sample idea",
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=800"
  }
];

// Sample review shown until real ones are added via Admin → Reviews.
export const reviews = [
  {
    id: "r1",
    author_name: "A regular customer",
    rating: 5,
    quote: "PLACEHOLDER — replace with a real customer quote, or delete this from Admin → Reviews."
  }
];
