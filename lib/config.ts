export const config = {
  name: "Habib Korbi",
  city: "Bembla",
  barber: "Barber HKK",
  since: 2023,
  phone: "+21654779103",
  whatsapp: "21654779103",
  instagram: "https://www.instagram.com/barber_hkk/",
  facebook: "https://www.facebook.com/med.habib.691810/",
  maps: "https://maps.app.goo.gl/W58X2o6uAj43M6729",
  mapsEmbed: "https://www.google.com/maps?q=35.6944754,10.7879057&output=embed",
  address: "Rue, quartier, Bembla",
  aboutImage: "/gallery/pic0.jpeg",
  // 0 = dimanche ... 6 = samedi ; null = fermé
   hours: [
    [9, 21],   // Dimanche
    null,      // Lundi (fermé)
    [14, 20],  // Mardi
    [14, 20],  // Mercredi
    [14, 20],  // Jeudi
    [14, 20],  // Vendredi
    [9, 21],   // Samedi
  ] as ([number, number] | null)[],

  stats: [
    { n: 3, key: "years", suffix: "" },
    { n: 5000, key: "clients", suffix: "+" },
    { n: 5, key: "stars", suffix: "" },
  ],

  services: [
    { id: "cut", icon: "scissors", },
    { id: "fade", icon: "pole", },
    { id: "beard", icon: "beard", },
    { id: "razor", icon: "razor", },
    { id: "combo", icon: "star", },
    { id: "kid", icon: "kid", },
  ] as { id: string; icon: string }[],

  // Pour une vraie photo: ajoute  src: "/gallery/1.webp"  (fichier f public/gallery/)
  gallery: [
    { src: "/gallery/pic1.jpeg", c1: "#c0283b", c2: "#1f4478", alt: "Coupe classique" },
    { src :"/gallery/pic3.png", c2: "#0e1628", alt: "Coupe moderne" },
    { src: "/gallery/pic4.png", c1: "#0e1628", c2: "#c0283b", alt: "Barbe" },
    { src: "/gallery/pic5.png", c1: "#c0283b", c2: "#0e1628", alt: "Rasage" },
    { src: "/gallery/pic6.png", c1: "#1f4478", c2: "#c0283b", alt: "Dégradé" },
    { src: "/gallery/pic2.jpg", c2: "#1f4478", alt: "Coupe moderne" },
  ] as { c1: string; c2: string; alt: string; src?: string }[],

};