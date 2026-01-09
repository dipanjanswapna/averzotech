

import { postalData as bangladeshPostalData } from './bangladesh-postal-data';
import { sundarbanBranches } from './sundarban-data';
import { getDeliveryInfoByPincode as redxDeliveryInfo } from './delivery';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

export const postalData = bangladeshPostalData;

let processedData: { [division: string]: { [district: string]: { [thana: string]: { postOffice: string; postCode: string }[] } } } = {};
let allDivisions: string[] = [];
let allDistricts: { [division: string]: string[] } = {};
let allThanas: { [district: string]: string[] } = {};

const { firestore } = initializeFirebase();

async function loadAndProcessData() {
  if (allDivisions.length > 0) return; // Already processed

  try {
    const divisionsSnapshot = await getDocs(collection(firestore, 'divisions'));
    const districtsSnapshot = await getDocs(collection(firestore, 'districts'));
    const upazilasSnapshot = await getDocs(collection(firestore, 'upazilas'));
    // const unionsSnapshot = await getDocs(collection(firestore, 'unions'));

    const divisions = divisionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const districts = districtsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const upazilas = upazilasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    allDivisions = divisions.map(d => d.name_en).sort();

    for (const division of divisions) {
        allDistricts[division.id] = [];
        processedData[division.id] = {};
    }

    for (const district of districts) {
        if(allDistricts[district.division_id]) {
            allDistricts[district.division_id].push(district.name_en);
            processedData[district.division_id][district.id] = {};
            allThanas[district.id] = [];
        }
    }

    for(const upazila of upazilas) {
        const district = districts.find(d => d.id === upazila.district_id);
        if(district && processedData[district.division_id]?.[district.id]) {
            allThanas[district.id].push(upazila.name_en);
        }
    }

  } catch (error) {
    console.error("Failed to load address data from Firestore:", error);
    // Fallback to postalData if firestore fails
    for (const code in postalData) {
        const entry = postalData[code].en;
        if (!entry) continue;

        const division = entry.division.trim();
        const district = entry.district.trim();
        const thana = entry.thana.trim();

        if (!division || !district || !thana) continue;

        if (!processedData[division]) {
            processedData[division] = {};
            allDivisions.push(division);
            allDistricts[division] = [];
        }
        if (!processedData[division][district]) {
            processedData[division][district] = {};
            if (!allDistricts[division].includes(district)) {
                allDistricts[division].push(district);
            }
            allThanas[district] = [];
        }
        if (!processedData[division][district][thana]) {
            processedData[division][district][thana] = [];
             if (!allThanas[district].includes(thana)) {
                allThanas[district].push(thana);
            }
        }
    }
  }
}

// Ensure data is loaded on server start or first call
loadAndProcessData();

export const getDivisions = () => allDivisions;
export const getDistricts = (division: string) => allDistricts[division]?.sort() || [];
export const getThanas = (division: string, district: string) => allThanas[district]?.sort() || [];

export const getPostOffices = (division: string, district: string, thana: string) => {
    // This is still using the old data structure, as post offices aren't in the new one.
    // This can be adapted if post offices are added to Firestore.
    const postalThana = Object.values(postalData).find(p => p.en.thana === thana);
    if (postalThana) {
        return [{ postOffice: postalThana.en.suboffice, postCode: postalThana.en.postcode }];
    }
    return [];
}


export const getSundarbanDistricts = () => {
    return [...new Set(sundarbanBranches.map(b => b.district))].sort();
}

export const getSundarbanThanas = (district: string) => {
    const thanas = sundarbanBranches
        .filter(b => b.district.toLowerCase() === district.toLowerCase())
        .map(b => b.office.trim());
    return [...new Set(thanas)].sort();
}

export const getDeliveryInfoByPincode = redxDeliveryInfo;
