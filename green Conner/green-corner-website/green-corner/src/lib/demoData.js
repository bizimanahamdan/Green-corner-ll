// Confirmed public content for The Green Corner — grill pub in Nyamirambo, Kigali.
//
// Menu names, prices and descriptions were provided by the owner.
// Phone, WhatsApp, social links, hours, promotions and reviews are left empty
// until the owner adds them in the admin dashboard. Empty is intentional:
// customers should never see PLACEHOLDER labels or dummy numbers.

export const businessInfo = {
  name: "The Green Corner",
  tagline: "Fire-grilled fish & brochettes in Nyamirambo",
  phone: "",
  whatsapp: "",
  instagram: "",
  facebookUrl: "",
  tiktokUrl: "",
  neighborhood: "Nyamirambo",
  city: "Kigali, Rwanda",
  priceRange: "",
  googleRating: null,
  googleReviewCount: null,
  serviceOptions: ["Grilled Fish", "Brochettes", "Cold Drinks"],
  description:
    "The Green Corner is a grill pub in Nyamirambo, Kigali, known for fire-grilled fish, goat and beef brochettes, and an ice-cold selection of local beers. A lively, no-frills spot to eat well and unwind.",
  mapsQuery: "https://maps.app.goo.gl/WCUh9TFjBn4mHRUW6",
  logoUrl: "/images/logo.png",
  heroMediaType: "images",
  heroVideoUrl: null,
  heroImage1: "/images/hero-embers.jpg",
  heroImage2: "",
  heroImage3: ""
};

// Hours stay empty until the owner posts them in Admin → Hours.
export const hours = [];

// Gallery stays empty until real venue photos are uploaded.
export const galleryImages = [];

// Confirmed menu content from the owner. Photos are stand-in stock until
// real plates from the grill are uploaded via Admin → Menu.
export const menuCategories = [
  {
    id: "fish",
    name: "Signature Fish",
    items: [
      {
        id: "m1",
        name: "Legendary Big Grilled Fish (Amafi Manini)",
        description: "A massive, fire-grilled fish smothered in onions, garlic, and local spices.",
        price: "18,500",
        image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?q=80&w=800",
        specialty: true,
        available: true
      }
    ]
  },
  {
    id: "meats",
    name: "Grilled Meats",
    items: [
      {
        id: "m2",
        name: "Classic Goat Brochette (Zingalo)",
        description: "Tender goat meat, marinated and grilled over an open flame.",
        price: "1,500",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800",
        specialty: true,
        available: true
      },
      {
        id: "m3",
        name: "Beef Brochette",
        description: "Premium cuts of beef, seasoned with Rwandan spices.",
        price: "1,200",
        image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?q=80&w=800",
        available: true
      }
    ]
  },
  {
    id: "sides",
    name: "Sides",
    items: [
      {
        id: "m4",
        name: "Whole Roasted Potatoes (Ibirayi)",
        description: "Deep-fried, whole savory potatoes crispy on the outside.",
        price: "2,000",
        image: "https://images.unsplash.com/photo-1633494541571-0814fdbfa54b?q=80&w=800",
        available: true
      },
      {
        id: "m5",
        name: "Fried Plantains (Mizuzu)",
        description: "Sweet, golden-brown fried plantains.",
        price: "2,500",
        image: "https://images.unsplash.com/photo-1662993888358-db809fdb89a9?q=80&w=800",
        available: true
      }
    ]
  },
  {
    id: "drinks",
    name: "Drinks",
    items: [
      {
        id: "m6",
        name: "Ice Cold Local Beers",
        description: "Perfectly chilled Skol, Mutzig, or Primus.",
        price: "1,500",
        image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=800",
        available: true
      }
    ]
  }
];

export const specials = [];

export const reviews = [];
