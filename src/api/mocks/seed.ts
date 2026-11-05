import { NIGERIAN_STATES } from '@/constants/kyc';
import type { Bank, User } from '@/types';

type StateName = (typeof NIGERIAN_STATES)[number];

/** A representative set of LGAs/cities per state plus the capital's coordinates for the map. */
export const STATE_DATA: Record<StateName, { lgas: string[]; lat: number; lng: number }> = {
  Abia: { lgas: ['Aba North', 'Aba South', 'Umuahia North', 'Umuahia South', 'Ohafia'], lat: 5.5249, lng: 7.4942 },
  Adamawa: { lgas: ['Yola North', 'Yola South', 'Mubi North', 'Numan'], lat: 9.2035, lng: 12.4954 },
  'Akwa Ibom': { lgas: ['Uyo', 'Eket', 'Ikot Ekpene', 'Oron', 'Itu'], lat: 5.0377, lng: 7.9128 },
  Anambra: { lgas: ['Awka South', 'Onitsha North', 'Onitsha South', 'Nnewi North', 'Idemili North'], lat: 6.2209, lng: 7.0722 },
  Bauchi: { lgas: ['Bauchi', 'Azare', 'Misau', 'Toro'], lat: 10.3158, lng: 9.8442 },
  Bayelsa: { lgas: ['Yenagoa', 'Brass', 'Ogbia', 'Sagbama'], lat: 4.9267, lng: 6.2676 },
  Benue: { lgas: ['Makurdi', 'Gboko', 'Otukpo', 'Katsina-Ala'], lat: 7.7337, lng: 8.5214 },
  Borno: { lgas: ['Maiduguri', 'Jere', 'Biu', 'Konduga'], lat: 11.8333, lng: 13.15 },
  'Cross River': { lgas: ['Calabar Municipal', 'Calabar South', 'Ikom', 'Ogoja'], lat: 4.9757, lng: 8.3417 },
  Delta: { lgas: ['Warri South', 'Uvwie', 'Oshimili South', 'Sapele', 'Ughelli North'], lat: 6.2059, lng: 6.6959 },
  Ebonyi: { lgas: ['Abakaliki', 'Afikpo North', 'Ezza North', 'Onicha'], lat: 6.3249, lng: 8.1137 },
  Edo: { lgas: ['Oredo', 'Egor', 'Ikpoba-Okha', 'Auchi', 'Ekpoma'], lat: 6.335, lng: 5.6037 },
  Ekiti: { lgas: ['Ado Ekiti', 'Ikere', 'Ijero', 'Oye'], lat: 7.6233, lng: 5.2209 },
  Enugu: { lgas: ['Enugu North', 'Enugu South', 'Nsukka', 'Udi', 'Awgu'], lat: 6.4584, lng: 7.5464 },
  FCT: { lgas: ['Abuja Municipal', 'Gwarimpa', 'Kubwa', 'Bwari', 'Gwagwalada'], lat: 9.0765, lng: 7.3986 },
  Gombe: { lgas: ['Gombe', 'Billiri', 'Kaltungo', 'Dukku'], lat: 10.2897, lng: 11.1673 },
  Imo: { lgas: ['Owerri Municipal', 'Owerri North', 'Orlu', 'Okigwe'], lat: 5.4836, lng: 7.0333 },
  Jigawa: { lgas: ['Dutse', 'Hadejia', 'Kazaure', 'Gumel'], lat: 11.7564, lng: 9.3388 },
  Kaduna: { lgas: ['Kaduna North', 'Kaduna South', 'Zaria', 'Kafanchan'], lat: 10.5105, lng: 7.4165 },
  Kano: { lgas: ['Kano Municipal', 'Nassarawa', 'Fagge', 'Tarauni', 'Gwale'], lat: 12.0022, lng: 8.592 },
  Katsina: { lgas: ['Katsina', 'Daura', 'Funtua', 'Malumfashi'], lat: 12.9908, lng: 7.6018 },
  Kebbi: { lgas: ['Birnin Kebbi', 'Argungu', 'Yauri', 'Zuru'], lat: 12.4539, lng: 4.1975 },
  Kogi: { lgas: ['Lokoja', 'Okene', 'Idah', 'Kabba'], lat: 7.8023, lng: 6.7333 },
  Kwara: { lgas: ['Ilorin West', 'Ilorin East', 'Ilorin South', 'Offa'], lat: 8.4966, lng: 4.5421 },
  Lagos: { lgas: ['Ikeja', 'Lekki', 'Surulere', 'Yaba', 'Ikorodu', 'Alimosho', 'Victoria Island'], lat: 6.6018, lng: 3.3515 },
  Nasarawa: { lgas: ['Lafia', 'Keffi', 'Karu', 'Akwanga'], lat: 8.4939, lng: 8.5153 },
  Niger: { lgas: ['Minna', 'Bida', 'Suleja', 'Kontagora'], lat: 9.6139, lng: 6.5569 },
  Ogun: { lgas: ['Abeokuta South', 'Ijebu Ode', 'Sagamu', 'Ota', 'Ifo'], lat: 7.1475, lng: 3.3619 },
  Ondo: { lgas: ['Akure South', 'Ondo West', 'Owo', 'Ikare'], lat: 7.2571, lng: 5.2058 },
  Osun: { lgas: ['Osogbo', 'Ile-Ife', 'Ilesa East', 'Ede North'], lat: 7.7827, lng: 4.5418 },
  Oyo: { lgas: ['Ibadan North', 'Ibadan South-West', 'Ogbomosho North', 'Oyo East'], lat: 7.3775, lng: 3.947 },
  Plateau: { lgas: ['Jos North', 'Jos South', 'Pankshin', 'Shendam'], lat: 9.8965, lng: 8.8583 },
  Rivers: { lgas: ['Port Harcourt', 'Obio-Akpor', 'Eleme', 'Bonny', 'Okrika'], lat: 4.8156, lng: 7.0498 },
  Sokoto: { lgas: ['Sokoto North', 'Sokoto South', 'Wamako', 'Tambuwal'], lat: 13.0059, lng: 5.2476 },
  Taraba: { lgas: ['Jalingo', 'Wukari', 'Takum', 'Bali'], lat: 8.8937, lng: 11.3596 },
  Yobe: { lgas: ['Damaturu', 'Potiskum', 'Gashua', 'Nguru'], lat: 11.7479, lng: 11.9608 },
  Zamfara: { lgas: ['Gusau', 'Kaura Namoda', 'Talata Mafara', 'Anka'], lat: 12.1704, lng: 6.6641 },
};

export const coordinatesFor = (state: string) => STATE_DATA[state as StateName] ?? STATE_DATA.Lagos;

export const BANKS: Bank[] = [
  { code: '044', name: 'Access Bank' },
  { code: '023', name: 'Citibank Nigeria' },
  { code: '050', name: 'Ecobank Nigeria' },
  { code: '070', name: 'Fidelity Bank' },
  { code: '011', name: 'First Bank of Nigeria' },
  { code: '214', name: 'First City Monument Bank' },
  { code: '058', name: 'Guaranty Trust Bank' },
  { code: '082', name: 'Keystone Bank' },
  { code: '50211', name: 'Kuda Microfinance Bank' },
  { code: '50515', name: 'Moniepoint Microfinance Bank' },
  { code: '999992', name: 'OPay' },
  { code: '999991', name: 'PalmPay' },
  { code: '076', name: 'Polaris Bank' },
  { code: '221', name: 'Stanbic IBTC Bank' },
  { code: '232', name: 'Sterling Bank' },
  { code: '032', name: 'Union Bank of Nigeria' },
  { code: '033', name: 'United Bank for Africa' },
  { code: '035', name: 'Wema Bank' },
  { code: '057', name: 'Zenith Bank' },
];

export const ME_ID = 'u_me';

export const SEED_USERS: User[] = [
  { id: ME_ID, fullName: 'Yunus Wahab', phone: '+2348031234567', email: 'yunus@posterbox.com.ng', rating: 4.8, isVerifiedTraveler: true },
  { id: 'u_tosin', fullName: 'Tosin Adewale', phone: '+2348021112233', rating: 4.9, isVerifiedTraveler: true },
  { id: 'u_wahab', fullName: 'Wahab Akande', phone: '+2348053334455', rating: 4.6, isVerifiedTraveler: true },
  { id: 'u_chioma', fullName: 'Chioma Okafor', phone: '+2348065556677', rating: 4.7, isVerifiedTraveler: true },
  { id: 'u_emeka', fullName: 'Emeka Nwosu', phone: '+2347037778899', rating: 4.4, isVerifiedTraveler: false },
  { id: 'u_thomas', fullName: 'Thomas MD.', phone: '+2348099990011', rating: 4.8, isVerifiedTraveler: true },
  { id: 'u_joshua', fullName: 'Joshua Ekanem', phone: '+2348081231234', isVerifiedTraveler: false },
  { id: 'u_blessing', fullName: 'Blessing Okon', phone: '+2349012223344', isVerifiedTraveler: false },
  { id: 'u_destiny', fullName: 'Destiny Agustus', phone: '+2348114445566', isVerifiedTraveler: false },
];

/** Spreads travelers around their departure city on the Find a Traveler map. */
export const TRAVELER_OFFSETS: Record<string, [number, number]> = {
  u_tosin: [0.004, -0.006],
  u_wahab: [-0.03, 0.025],
  u_chioma: [-0.045, -0.012],
  u_emeka: [0.02, 0.04],
  u_thomas: [0.03, -0.02],
};

/** Travelers used to fill a route when no seeded trip matches it. */
export const STANDBY_TRAVELER_IDS = ['u_tosin', 'u_wahab', 'u_chioma', 'u_emeka'];

export const CONTACTS = {
  me: { fullName: 'Yunus Wahab', phone: '+2348031234567', location: { state: 'Lagos', city: 'Ikeja', address: '12 Allen Avenue' } },
  anabel: { fullName: 'Anabel Etim', phone: '+2348087654321', location: { state: 'Akwa Ibom', city: 'Uyo', address: '5 Oron Road' } },
  ngozi: { fullName: 'Ngozi Eze', phone: '+2348023456789', location: { state: 'Enugu', city: 'Enugu North', address: '14 Ogui Road' } },
  joshua: { fullName: 'Joshua Ekanem', phone: '+2348081231234', location: { state: 'Lagos', city: 'Surulere', address: '22 Adeniran Ogunsanya St' } },
  gabe: { fullName: 'Gabe Joshua Bee', phone: '+2348145556677', location: { state: 'Akwa Ibom', city: 'Uyo', address: '9 Ikot Ekpene Road' } },
  blessing: { fullName: 'Blessing Okon', phone: '+2349012223344', location: { state: 'Lagos', city: 'Yaba', address: 'Plot A10, Street 8, Herbert Macaulay Way' } },
  ibinabo: { fullName: 'Ibinabo George', phone: '+2348039876543', location: { state: 'Rivers', city: 'Port Harcourt', address: '3 Aba Road' } },
  destiny: { fullName: 'Destiny Agustus', phone: '+2348114445566', location: { state: 'FCT', city: 'Gwarimpa', address: 'Plot 10, 3rd Avenue' } },
};
