

import { postalData as bangladeshPostalData } from './bangladesh-postal-data';
import { sundarbanBranches } from './sundarban-data';
import { getDeliveryInfoByPincode as redxDeliveryInfo } from './delivery';

export const postalData = bangladeshPostalData;

const processedData: { [division: string]: { [district: string]: { [thana: string]: { postOffice: string; postCode: string }[] } } } = {};
const allDivisions: string[] = [];
const allDistricts: { [division: string]: string[] } = {};
const allThanas: { [district: string]: string[] } = {};

for (const code in postalData) {
    const entry = postalData[code].en;
    if (!entry) continue;

    const division = entry.division.trim();
    const district = entry.district.trim();
    const thana = entry.thana.trim();
    const postOffice = entry.suboffice.trim();
    const postCode = entry.postcode.trim();

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
    processedData[division][district][thana].push({ postOffice, postCode });
}

export const getDivisions = () => allDivisions.sort();

export const getDistricts = (division: string) => {
    return allDistricts[division]?.sort() || [];
}

export const getThanas = (division: string, district: string) => {
    return allThanas[district]?.sort() || [];
}

export const getPostOffices = (division: string, district: string, thana: string) => {
    return processedData[division]?.[district]?.[thana] || [];
}

export const getSundarbanDistricts = () => {
    return [...new Set(sundarbanBranches.map(b => b.district))].sort();
}

export const getSundarbanThanas = (district: string) => {
    return [...new Set(sundarbanBranches.filter(b => b.district === district).map(b => b.office))].sort();
}

export const getDeliveryInfoByPincode = redxDeliveryInfo;
