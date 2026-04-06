import { ref, set, push } from 'firebase/database';
import { db } from './src/lib/firebase';

const sampleExperts = [
  {
    prenom: "Aslan",
    nom: "Bazarov",
    profession: "Avocat / Droit d'Asile",
    isLegalDefender: true,
    ville: "Strasbourg",
    pays: "France",
    village: "Shali",
    teip: "Shaloy",
    lat: 48.5734,
    lng: 7.7521,
    isLive: true,
    message: "Prêt à aider juridiquement mes frères."
  },
  {
    prenom: "Zelim",
    nom: "Umarov",
    profession: "Ingénieur Software / React",
    ville: "Berlin",
    pays: "Allemagne",
    village: "Gekhi",
    teip: "Gekhoy",
    lat: 52.5200,
    lng: 13.4050,
    isLive: false,
    openToMentorship: true,
    message: "Je peux coacher les jeunes vers l'IT."
  },
  {
    prenom: "Amina",
    nom: "Isaeva",
    profession: "Traductrice assermentée",
    isTranslator: true,
    ville: "Vienne",
    pays: "Autriche",
    village: "Vedeno",
    teip: "Beltoy",
    lat: 48.2082,
    lng: 16.3738,
    isLive: true,
    message: "Traduction Arabe/Allemand/Français."
  },
  {
    prenom: "Beslan",
    nom: "Tsaro",
    profession: "Notaire",
    ville: "Nice",
    pays: "France",
    village: "Gudermes",
    teip: "Gordaloy",
    lat: 43.7102,
    lng: 7.2620,
    isLive: false,
    message: "Besoin d'un document légal ? Contactez-moi."
  },
  {
    prenom: "Mansour",
    nom: "Gakaev",
    profession: "Coach Sportif / MMA",
    ville: "Varsovie",
    pays: "Pologne",
    village: "Argun",
    teip: "Elistanzhoy",
    lat: 52.2297,
    lng: 21.0122,
    isLive: true,
    message: "Entraînement gratuit pour les frères."
  },
  {
    prenom: "Raisa",
    nom: "Kadyrova",
    profession: "Médecin Généraliste",
    ville: "Lyon",
    pays: "France",
    village: "Grozny",
    teip: "Shaloy",
    lat: 45.7640,
    lng: 4.8357,
    isLive: false,
    message: "Conseils santé et orientation."
  },
  {
    prenom: "Khamzat",
    nom: "Djabrailov",
    profession: "Politologue",
    ville: "Bruxelles",
    pays: "Belgique",
    village: "Urus-Martan",
    teip: "Chonkoy",
    lat: 50.8503,
    lng: 4.3517,
    isLive: true,
    message: "Défense des intérêts de la communauté."
  },
  {
    prenom: "Ismail",
    nom: "Naurbiev",
    profession: "Architecte",
    ville: "Munich",
    pays: "Allemagne",
    village: "Sernovodsk",
    teip: "Orstkhoy",
    lat: 48.1351,
    lng: 11.5820,
    isLive: false,
    message: "Urbanisme et vision pour demain."
  },
  {
    prenom: "Liana",
    nom: "Tutaeva",
    profession: "Designer Marketing",
    ville: "Paris",
    pays: "France",
    village: "Achkhoy-Martan",
    teip: "Tsetshoy",
    lat: 48.8566,
    lng: 2.3522,
    isLive: true,
    message: "Je booste vos projets communautaires."
  },
  {
    prenom: "Adam",
    nom: "Khadjiev",
    profession: "Expert Cyber-SÉCURITÉ",
    ville: "Zurich",
    pays: "Suisse",
    village: "Bamut",
    teip: "Akkiy",
    lat: 47.3769,
    lng: 8.5417,
    isLive: true,
    message: "Protégeons nos données souveraines."
  }
];

export async function seedExperts() {
  const membersRef = ref(db, 'members');
  // First clear existing if any or just add
  for (const expert of sampleExperts) {
    const newMemberRef = push(membersRef);
    await set(newMemberRef, expert);
    console.log(`Expert ${expert.prenom} added!`);
  }
}
