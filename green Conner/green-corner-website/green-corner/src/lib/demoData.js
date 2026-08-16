// Demo/fallback content for The Green Corner — Smoothie & Salad Bar.
//
// IMPORTANT: unlike earlier drafts of this project, we do not have a verified
// Google Business listing for this version of Green Corner (the bar & grill
// listing found earlier belongs to a different business). Everything below —
// phone, hours, prices, menu — is a clearly marked PLACEHOLDER for the real
// owner to replace from the admin dashboard. Nothing here should be presented
// to a real customer as fact until the owner confirms it.

export const businessInfo = {
  name: "The Green Corner",
  tagline: "Fresh smoothies, salads & juices in Nyamirambo",
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
  serviceOptions: ["Fresh Smoothies", "Cold-Pressed Juices", "Salads & Bowls"],
  description:
    "The Green Corner is a smoothie and salad bar in Nyamirambo, Kigali, built around fresh, whole ingredients — cold-pressed juices, blended smoothies, and salads made to order. A bright, easy stop for something that actually makes you feel good.",
  mapsQuery: "Nyamirambo, Kigali, Rwanda",
  logoUrl: "/images/logo.png",
  heroMediaType: "images",
  heroVideoUrl: null,
  heroImage1: "/images/illustrations/smoothie-glass.svg",
  heroImage2: "/images/illustrations/salad-bowl.svg",
  heroImage3: "/images/illustrations/citrus-slice.svg"
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

// Illustrated placeholders — replace with real food photography from the admin Gallery page.
export const galleryImages = [
  { id: "g1", url: "/images/illustrations/smoothie-glass.svg", caption: "PLACEHOLDER — signature smoothie", category: "Smoothies" },
  { id: "g2", url: "/images/illustrations/salad-bowl.svg", caption: "PLACEHOLDER — house salad", category: "Salads" },
  { id: "g3", url: "/images/illustrations/berry-bowl.svg", caption: "PLACEHOLDER — acai/berry bowl", category: "Bowls" },
  { id: "g4", url: "/images/illustrations/juice-bottle.svg", caption: "PLACEHOLDER — cold-pressed juice", category: "Juices" },
  { id: "g5", url: "/images/illustrations/citrus-slice.svg", caption: "PLACEHOLDER — fresh citrus", category: "Ingredients" }
];

// PLACEHOLDER menu — real dish names and prices must be confirmed with the owner.
export const menuCategories = [
  {
    id: "smoothies",
    name: "Smoothies",
    items: [
      { id: "m1", name: "Green Corner Classic", description: "PLACEHOLDER — spinach, banana, mango, coconut water.", price: "3,500", image: "/images/illustrations/smoothie-glass.svg", specialty: true },
      { id: "m2", name: "Berry Boost", description: "PLACEHOLDER — mixed berries, banana, yogurt.", price: "3,500", specialty: true },
      { id: "m3", name: "Tropical Mango", description: "PLACEHOLDER — mango, pineapple, passion fruit.", price: "3,000" }
    ]
  },
  {
    id: "juices",
    name: "Cold-Pressed Juices",
    items: [
      { id: "m4", name: "Carrot Ginger", description: "PLACEHOLDER — carrot, ginger, orange.", price: "2,500", image: "/images/illustrations/juice-bottle.svg", specialty: true },
      { id: "m5", name: "Beet & Apple", description: "PLACEHOLDER — beetroot, apple, lemon.", price: "2,500" },
      { id: "m6", name: "Pure Passion", description: "PLACEHOLDER — fresh passion fruit juice.", price: "2,000" }
    ]
  },
  {
    id: "salads",
    name: "Salads",
    items: [
      { id: "m7", name: "House Green Salad", description: "PLACEHOLDER — mixed greens, avocado, tomato, house dressing.", price: "4,500", image: "/images/illustrations/salad-bowl.svg", specialty: true },
      { id: "m8", name: "Grilled Chicken Salad", description: "PLACEHOLDER — greens, grilled chicken, seasonal vegetables.", price: "5,500" },
      { id: "m9", name: "Avocado & Quinoa Bowl", description: "PLACEHOLDER — quinoa, avocado, roasted vegetables.", price: "5,000" }
    ]
  },
  {
    id: "bowls",
    name: "Smoothie Bowls",
    items: [
      { id: "m10", name: "Acai Berry Bowl", description: "PLACEHOLDER — acai blend topped with granola and fresh fruit.", price: "4,000", image: "/images/illustrations/berry-bowl.svg", specialty: true },
      { id: "m11", name: "Tropical Bowl", description: "PLACEHOLDER — mango-pineapple blend, coconut flakes.", price: "4,000" }
    ]
  },
  {
    id: "extras",
    name: "Extras & Add-ons",
    items: [
      { id: "m12", name: "Protein Boost", description: "PLACEHOLDER — add a scoop of protein to any smoothie.", price: "1,000" },
      { id: "m13", name: "Chia Seeds", description: "PLACEHOLDER — add chia seeds to any bowl or smoothie.", price: "500" }
    ]
  }
];

// Sample/placeholder promotional content — NOT confirmed real promotions.
export const specials = [
  {
    id: "s1",
    title: "Morning Fresh Combo",
    description: "PLACEHOLDER — a sample idea: any smoothie + any juice for a set combo price before 10am.",
    tag: "Sample idea",
    image: "/images/illustrations/smoothie-glass.svg"
  },
  {
    id: "s2",
    title: "Salad of the Week",
    description: "PLACEHOLDER — a rotating seasonal salad, confirm concept and pricing with the owner.",
    tag: "Sample idea",
    image: "/images/illustrations/salad-bowl.svg"
  },
  {
    id: "s3",
    title: "Bring Your Own Cup",
    description: "PLACEHOLDER — a sample sustainability idea: a small discount for guests who bring a reusable cup.",
    tag: "Sample idea",
    image: "/images/illustrations/juice-bottle.svg"
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
