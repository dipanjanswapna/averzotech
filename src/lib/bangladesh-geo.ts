
export const bangladeshGeoData = {
  "Dhaka": {
    "Dhaka": {
      "Mohammadpur": [
        { "area": "Salimullah Road(Mohammadpur)", "postCode": "1207" },
        { "area": "Adabor(Mohammadpur)", "postCode": "1207" },
        { "area": "Rayer Bazar(Mohammadpur)", "postCode": "1209" },
        { "area": "Dhaka Uddyan(Mohammadpur)", "postCode": "1207" },
        { "area": "Shekhertek(Mohammadpur)", "postCode": "1207" },
        { "area": "Dhaka uddan(Mohammadpur)", "postCode": "" },
        { "area": "Nobodoy(Mohammadpur)", "postCode": "" },
        { "area": "Chad Uddan(Mohammadpur)", "postCode": "" },
        { "area": "Mohammadia Housing(Mohammadpur)", "postCode": "" },
        { "area": "Tajmahal Road(Mohammadpur)", "postCode": "" },
        { "area": "Nurjahan Road(Mohammadpur)", "postCode": "" },
        { "area": "Rajia Sultana Road(Mohammadpur)", "postCode": "" },
        { "area": "Kaderabad Housing(Mohammadpur)", "postCode": "" },
        { "area": "Eastern Housing (Mohammadpur)", "postCode": "" },
        { "area": "Sadek Khan Road(Mohammadpur)", "postCode": "" },
        { "area": "Sher e Bangla Road(Mohammadpur)", "postCode": "" },
        { "area": "Katasur(Mohammadpur)", "postCode": "" },
        { "area": "Garden City(Mohammadpur)", "postCode": "" },
        { "area": "Boddhovumi(Mohammadpur)", "postCode": "" },
        { "area": "Modhu Bazar(Mohammadpur)", "postCode": "" },
        { "area": "Baroikhali (Mohammadpur)", "postCode": "" }
      ],
      "Dhanmondi": [
        { "area": "Dhanmondi - Road 3", "postCode": "1209" },
        { "area": "Sukrabad(Dhanmondi)", "postCode": "1215" },
        { "area": "Jigatola(Dhanmondi)", "postCode": "1209" },
        { "area": "Tallabag(Dhanmondi)", "postCode": "1209" },
        { "area": "Sobhanbag(Dhanmondi)", "postCode": "1215" },
        { "area": "Jhigatola(Dhanmondi)", "postCode": "" },
        { "area": "Shukrabad(Dhanmondi)", "postCode": "" },
        { "area": "Dhanmondi - Rd 1", "postCode": "" },
        { "area": "Dhanmondi - Rd 2", "postCode": "" },
        { "area": "Dhanmondi - Road 4", "postCode": "" },
        { "area": "Dhanmondi - Road 4A", "postCode": "" },
        { "area": "Dhanmondi - Rd 6", "postCode": "" },
        { "area": "Dhanmondi - Rd 3A", "postCode": "" },
        { "area": "Dhanmondi - Rd 6A", "postCode": "" },
        { "area": "Dhanmondi - Rd 8", "postCode": "" },
        { "area": "Dhanmondi - Rd 8A", "postCode": "" },
        { "area": "Dhanmondi - Rd 9", "postCode": "" },
        { "area": "Dhanmondi - Road 9/A", "postCode": "" },
        { "area": "Dhanmondi - Rd 10", "postCode": "" },
        { "area": "Dhanmondi - Rd 12", "postCode": "" },
        { "area": "Dhanmondi - Rd 12A", "postCode": "" },
        { "area": "Dhanmondi - Rd 15", "postCode": "" },
        { "area": "Dhanmondi - Rd 15 A", "postCode": "" },
        { "area": "Dhanmondi - Rd 27", "postCode": "" },
        { "area": "Dhanmondi - Rd 28", "postCode": "" },
        { "area": "Dhanmondi - Rd 29", "postCode": "" },
        { "area": "Jigatala post office(Dhanmondi)", "postCode": "" }
      ]
    }
  }
};

export const divisions = Object.keys(bangladeshGeoData);

export const getDistrictsByDivision = (division: string) => {
    if (bangladeshGeoData[division as keyof typeof bangladeshGeoData]) {
        return Object.keys(bangladeshGeoData[division as keyof typeof bangladeshGeoData]);
    }
    return [];
};

export const getUpazilasByDistrict = (division: string, district: string) => {
    const divisionData = bangladeshGeoData[division as keyof typeof bangladeshGeoData];
    if (divisionData) {
        const districtData = divisionData[district as keyof typeof divisionData];
        if (districtData) {
            return Object.keys(districtData);
        }
    }
    return [];
};

export const getAreasByUpazila = (division: string, district: string, upazila: string) => {
    const divisionData = bangladeshGeoData[division as keyof typeof bangladeshGeoData];
    if (divisionData) {
        const districtData = divisionData[district as keyof typeof divisionData];
        if (districtData) {
            const upazilaData = districtData[upazila as keyof typeof districtData];
            if (upazilaData) {
                return upazilaData.map(a => a.area);
            }
        }
    }
    return [];
};
