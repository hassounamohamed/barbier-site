export const config = {
  name: "Habib Korbi",
  city: "Bembla",
  barber: "Barber HKK",
  since: 2023,
  phone: "+21654779103",
  whatsapp: "21654779103",
  instagram: "https://www.instagram.com/barber_hkk/",
  facebook: "https://www.facebook.com/med.habib.691810/",
  address: "Rue, quartier, Bembla",
  aboutImage: "https://scontent.ftun14-1.fna.fbcdn.net/v/t39.30808-6/647441273_906806815318856_8533906821845705437_n.jpg?stp=dst-jpg_tt6&cstp=mx960x958&ctp=s960x958&_nc_cat=106&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=K9cvYhE0vWYQ7kNvwGEooBp&_nc_oc=AdrtDBBP8U0Y0C4FIR_wq1q_Ez6A_WnXJo0QpfI0MPqi1Sr4CJ8q-hl1-1d6U1VfczA&_nc_zt=23&_nc_ht=scontent.ftun14-1.fna&_nc_gid=UI8a-Ofg3ArbgLoXuS6K8w&_nc_ss=7b2a8&oh=00_AQOM0yeA33SppJiB9ukoBbzywMzeuiXRLvOmEhM9QumiTA&oe=6AC6F739",
  // 0 = dimanche ... 6 = samedi ; null = fermé
  hours: [null, [9, 20], [9, 20], [9, 20], [9, 20], [9, 20], [9, 21]] as ([number, number] | null)[],

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
    { src: "/gallery/pic1.jpg", c1: "#c0283b", c2: "#1f4478", alt: "Coupe classique" },
    { src :"/gallery/pic3.png", c2: "#0e1628", alt: "Coupe moderne" },
    { src: "/gallery/pic4.png", c1: "#0e1628", c2: "#c0283b", alt: "Barbe" },
    { src: "/gallery/pic5.png", c1: "#c0283b", c2: "#0e1628", alt: "Rasage" },
    { src: "/gallery/pic6.png", c1: "#1f4478", c2: "#c0283b", alt: "Dégradé" },
    { src: "/gallery/pic2.jpg", c2: "#1f4478", alt: "Coupe moderne" },
  ] as { c1: string; c2: string; alt: string; src?: string }[],

};