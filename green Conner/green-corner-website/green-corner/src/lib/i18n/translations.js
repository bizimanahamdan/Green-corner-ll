// Covers the site's own chrome — nav, buttons, section headers, footer, form
// labels. Content typed into the admin dashboard (business description, menu
// items, specials, reviews) stays in whatever language it was entered in;
// translating free-form owner content automatically isn't in scope here.

export const translations = {
  en: {
    nav: { menu: "Menu", about: "About", gallery: "Gallery", specials: "Specials", reviews: "Reviews", location: "Location", orderAhead: "Order Ahead" },
    openStatus: { openNow: "Open now", closes: "closes", closed: "Closed", opens: "opens" },
    common: {
      viewMenu: "View Menu",
      getDirections: "Get Directions",
      orderAhead: "Order Ahead",
      call: "Call",
      whatsapp: "WhatsApp",
      readMore: "Read more",
      loading: "Loading…"
    },
    home: {
      whySection: "Why visit",
      whyHeading: "What makes The Green Corner different",
      featuredSection: "Fan favorites",
      featuredHeading: "Featured on the Menu",
      fullMenu: "Full menu →",
      gallerySection: "A closer look",
      galleryHeading: "From the counter",
      fullGallery: "Full gallery →",
      findUsSection: "Find us",
      orderNote: "Stop by, or order ahead and pick up when it's ready."
    },
    footer: {
      explore: "Explore",
      visit: "Visit",
      order: "Order",
      orderNote: "Order ahead or send us a message and we'll confirm by phone or WhatsApp.",
      rights: "All rights reserved."
    },
    pages: {
      menuEyebrow: "Our Menu",
      menuTitle: "Fresh smoothies, salads & juices",
      aboutEyebrow: "About",
      aboutTitle: "The Green Corner story",
      galleryEyebrow: "Gallery",
      galleryTitle: "A look at The Green Corner",
      specialsEyebrow: "Specials",
      specialsTitle: "Combos, promotions & featured picks",
      reviewsEyebrow: "Reviews",
      reviewsTitle: "What customers say",
      locationEyebrow: "Location & Hours",
      locationTitle: "Find The Green Corner",
      contactEyebrow: "Contact",
      contactTitle: "Order ahead or send a message"
    },
    contact: {
      orderAheadHeading: "Order Ahead",
      sendMessageHeading: "Send a Message",
      name: "Name",
      phone: "Phone",
      date: "Pickup date",
      time: "Pickup time",
      people: "Number of items",
      orderDetails: "What would you like to order? (item names, any special requests)",
      orderDetailsPlaceholder: "e.g. 2x Green Corner Classic, 1x House Green Salad — no onions",
      message: "Message (optional)",
      submitOrder: "Send Order Request",
      submitMessage: "Send Message",
      sending: "Sending…"
    },
    whatsappModal: {
      heading: "How can we help?",
      quickOrderLabel: "Quick Order",
      quickOrderMessage: "Hello Green Corner! I'd like to place an order for pickup. Please help me with today's menu.",
      cateringLabel: "Catering / Large Order",
      cateringMessage: "Hello Green Corner! I'd like to make a larger order for an event. Please let me know your available options.",
      pickupLabel: "Pickup / Availability",
      pickupMessage: "Hello Green Corner! I'd like to check what's available for pickup today.",
      close: "Close"
    }
  },
  rw: {
    nav: { menu: "Ibiribwa", about: "Abo turi bo", gallery: "Amafoto", specials: "Ibihariwe", reviews: "Ibitekerezo", location: "Aho tuherereye", orderAhead: "Gutumiza" },
    openStatus: { openNow: "Turafunguye", closes: "tuzafunga saa", closed: "Tufunze", opens: "tuzafungura saa" },
    common: {
      viewMenu: "Reba Ibiribwa",
      getDirections: "Menya Aho Tuherereye",
      orderAhead: "Gutumiza",
      call: "Hamagara",
      whatsapp: "WhatsApp",
      readMore: "Soma Byinshi",
      loading: "Turimo gutegura…"
    },
    home: {
      whySection: "Impamvu",
      whyHeading: "Icyatandukanya The Green Corner",
      featuredSection: "Ibikunzwe",
      featuredHeading: "Ibiribwa Byihariye",
      fullMenu: "Ibiribwa byose →",
      gallerySection: "Reba neza",
      galleryHeading: "Mu kazi kacu",
      fullGallery: "Amafoto yose →",
      findUsSection: "Aho tuherereye",
      orderNote: "Ndeka udukatuze, cyangwa utumize mbere maze ubufate igihe biteguye."
    },
    footer: {
      explore: "Reba",
      visit: "Sura",
      order: "Tumiza",
      orderNote: "Tumiza mbere cyangwa utwandikire, tuzahamagara cyangwa tukwandikire kuri WhatsApp.",
      rights: "Uburenganzira bwose burafitwe."
    },
    pages: {
      menuEyebrow: "Ibiribwa Byacu",
      menuTitle: "Amasashi, saladi n'imibumbe mishya",
      aboutEyebrow: "Abo turi bo",
      aboutTitle: "Inkuru ya The Green Corner",
      galleryEyebrow: "Amafoto",
      galleryTitle: "Reba The Green Corner",
      specialsEyebrow: "Ibihariwe",
      specialsTitle: "Ibihariwe n'ibyatoranyijwe",
      reviewsEyebrow: "Ibitekerezo",
      reviewsTitle: "Icyo abakiriya bavuga",
      locationEyebrow: "Aho tuherereye & Amasaha",
      locationTitle: "Menya Aho The Green Corner Iherereye",
      contactEyebrow: "Twandikire",
      contactTitle: "Tumiza mbere cyangwa utwandikire"
    },
    contact: {
      orderAheadHeading: "Gutumiza Mbere",
      sendMessageHeading: "Twandikire Ubutumwa",
      name: "Amazina",
      phone: "Telefone",
      date: "Itariki uzabikura",
      time: "Isaha uzabikura",
      people: "Umubare w'ibintu",
      orderDetails: "Ni ibiki ushaka gutumiza? (amazina y'ibiribwa, icyo wifuza cyihariye)",
      orderDetailsPlaceholder: "urugero: 2x Green Corner Classic, 1x House Green Salad — nta gitunguru",
      message: "Ubutumwa (si ngombwa)",
      submitOrder: "Ohereza Ubusabe",
      submitMessage: "Ohereza Ubutumwa",
      sending: "Turimo kohereza…"
    },
    whatsappModal: {
      heading: "Twagufasha gute?",
      quickOrderLabel: "Gutumiza vuba",
      quickOrderMessage: "Muraho Green Corner! Ndashaka gutumiza kugira nzafate ibyo natumije. Mumfashe kumenya ibiri kuri menu uyu munsi.",
      cateringLabel: "Itumizwa rinini / Ibirori",
      cateringMessage: "Muraho Green Corner! Ndashaka gutumiza umubare munini w'ibiryo ku bw'igikorwa runaka. Mumbwire uburyo mufite bwo kunyunganira.",
      pickupLabel: "Kureba ibiriho",
      pickupMessage: "Muraho Green Corner! Ndashaka kumenya ibiriho uyu munsi kugira nzabifate.",
      close: "Funga"
    }
  }
};
