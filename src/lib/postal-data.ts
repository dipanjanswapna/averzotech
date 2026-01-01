'use client';

// This data is derived from the provided JSON object of Bangladesh postal codes.
const postalData: { [key: string]: { en: any; bn: any } } = {
  "1206": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Dhaka", "suboffice": "Dhaka Cantonment--TSO", "postcode": "1206" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "ঢাকা সেনানিবাস", "suboffice": "ঢাকা সেনানিবাস TSO", "postcode": "১২০৬" }
  },
  "1350": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Dhamrai", "suboffice": "Dhamrai", "postcode": "1350" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "ধামরাই", "suboffice": "ধামরাই", "postcode": "১৩৫০" }
  },
  "1209": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Dhanmondi", "suboffice": "Jigatala TSO", "postcode": "1209" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "ধানমন্ডি", "suboffice": "জিগাতলা TSO", "postcode": "১২০৯" }
  },
  "1213": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Gulshan", "suboffice": "Banani TSO", "postcode": "1213" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "গুলশান", "suboffice": "বনানী TSO", "postcode": "১২১৩" }
  },
  "1212": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Gulshan", "suboffice": "Gulshan Model Town", "postcode": "1212" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "গুলশান", "suboffice": "গুলশান মডেল টাউন", "postcode": "১২১২" }
  },
  "1236": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Jatrabari", "suboffice": "Dhania TSO", "postcode": "1236" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "যাত্রাবাড়ী", "suboffice": "ধনিয়া TSO", "postcode": "১২৩৬" }
  },
  "1331": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Joypara", "suboffice": "Palamganj", "postcode": "1331" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "জয়পাড়া", "suboffice": "পালামগঞ্জ", "postcode": "১৩৩১" }
  },
  "1332": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Joypara", "suboffice": "Narisha", "postcode": "1332" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "জয়পাড়া", "suboffice": "নারিশা", "postcode": "১৩৩২" }
  },
  "1312": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Keraniganj", "suboffice": "Ati", "postcode": "1312" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "কেরানীগঞ্জ", "suboffice": "আটি", "postcode": "১৩১২" }
  },
  "1311": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Keraniganj", "suboffice": "Dhaka Jute Mills", "postcode": "1311" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "কেরানীগঞ্জ", "suboffice": "ঢাকা পাট কল", "postcode": "১৩১১" }
  },
  "1313": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Keraniganj", "suboffice": "Kalatia", "postcode": "1313" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "কেরানীগঞ্জ", "suboffice": "কালাটিয়া", "postcode": "১৩১৩" }
  },
  "1310": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Keraniganj", "suboffice": "Keraniganj", "postcode": "1310" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "কেরানীগঞ্জ", "suboffice": "কেরানীগঞ্জ", "postcode": "১৩১০" }
  },
  "1219": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Khilgaon", "suboffice": "KhilgaonTSO", "postcode": "1219" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "খিলগাঁও", "suboffice": "খিলগাঁও TSO", "postcode": "১২১৯" }
  },
  "1229": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Khilkhet", "suboffice": "KhilkhetTSO", "postcode": "1229" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "খিলক্ষেত", "suboffice": "খিলক্ষেত TSO", "postcode": "১২২৯" }
  },
  "1211": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Lalbag", "suboffice": "Posta TSO", "postcode": "1211" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "লালবাগ", "suboffice": "পোস্তা TSO", "postcode": "১২১১" }
  },
  "1216": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Mirpur", "suboffice": "Mirpur TSO", "postcode": "1216" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "মিরপুর", "suboffice": "মিরপুর TSO", "postcode": "১২১৬" }
  },
  "1207": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Mohammadpur", "suboffice": "Mohammadpur Housing", "postcode": "1207" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "মোহাম্মদপুর", "suboffice": "মোহাম্মদপুর হাউজিং", "postcode": "১২০৭" }
  },
  "1225": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Mohammadpur", "suboffice": "Sangsad BhabanTSO", "postcode": "1225" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "মোহাম্মদপুর", "suboffice": "সংসদ ভবন TSO", "postcode": "১২২৫" }
  },
  "1222": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Motijheel", "suboffice": "BangabhabanTSO", "postcode": "1222" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "মতিঝিল", "suboffice": "বঙ্গভবন TSO", "postcode": "১২২২" }
  },
  "1223": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Motijheel", "suboffice": "DilkushaTSO", "postcode": "1223" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "মতিঝিল", "suboffice": "দিলকুশা TSO", "postcode": "১২২৩" }
  },
  "1323": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Nawabganj", "suboffice": "Agla", "postcode": "1323" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "নবাবগঞ্জ", "suboffice": "আগলা", "postcode": "১৩২৩" }
  },
  "1325": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Nawabganj", "suboffice": "Churain", "postcode": "1325" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "নবাবগঞ্জ", "suboffice": "চুরাইন", "postcode": "১৩২৫" }
  },
  "1322": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Nawabganj", "suboffice": "Daudpur", "postcode": "1322" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "নবাবগঞ্জ", "suboffice": "দাউদপুর", "postcode": "১৩২২" }
  },
  "1321": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Nawabganj", "suboffice": "Hasnabad", "postcode": "1321" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "নবাবগঞ্জ", "suboffice": "হাসনাবাদ", "postcode": "১৩২১" }
  },
  "1324": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Nawabganj", "suboffice": "Khalpar", "postcode": "1324" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "নবাবগঞ্জ", "suboffice": "খালপাড়", "postcode": "১৩২৪" }
  },
  "1320": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Nawabganj", "suboffice": "Nawabganj", "postcode": "1320" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "নবাবগঞ্জ", "suboffice": "নবাবগঞ্জ", "postcode": "১৩২০" }
  },
  "1205": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Kalabagan (Old New market)", "suboffice": "Kalabagan", "postcode": "1205" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "নতুন বাজার", "suboffice": "নিউমার্কেট TSO", "postcode": "১২০৫" }
  },
  "1000": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Palton", "suboffice": "Dhaka GPO", "postcode": "1000" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "পল্টন", "suboffice": "ঢাকা জিপিও", "postcode": "১০০০" }
  },
  "1217": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Ramna", "suboffice": "Shantinagr TSO", "postcode": "1217" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "রমনা", "suboffice": "শান্তিনগর TSO", "postcode": "১২১৭" }
  },
  "1214": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Sabujbag", "suboffice": "Basabo TSO", "postcode": "1214" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "সবুজবাগ", "suboffice": "বাসাবো TSO", "postcode": "১২১৪" }
  },
  "1348": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Savar", "suboffice": "Amin Bazar", "postcode": "1348" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "সাভার", "suboffice": "আমিন বাজার", "postcode": "১৩৪৮" }
  },
  "1341": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Savar", "suboffice": "Dairy Farm", "postcode": "1341" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "সাভার", "suboffice": "গব্যশালা", "postcode": "১৩৪১" }
  },
  "1349": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Savar", "suboffice": "EPZ", "postcode": "1349" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "সাভার", "suboffice": "ইপিজেড", "postcode": "১৩৪৯" }
  },
  "1342": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Savar", "suboffice": "Jahangirnagar University", "postcode": "1342" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "সাভার", "suboffice": "জাহাঙ্গীরনগর বিশ্ববিদ্যালয়", "postcode": "১৩৪২" }
  },
  "1346": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Savar", "suboffice": "Kashem Cotton Mills", "postcode": "1346" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "সাভার", "suboffice": "কাশেম কটন মিলস", "postcode": "১৩৪৬" }
  },
  "1347": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Savar", "suboffice": "Rajphulbaria", "postcode": "1347" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "সাভার", "suboffice": "রাজফুললবাড়ীয়া", "postcode": "১৩৪৭" }
  },
  "1340": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Savar", "suboffice": "Savar", "postcode": "1340" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "সাভার", "suboffice": "সাভার", "postcode": "১৩৪০" }
  },
  "1344": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Savar", "suboffice": "Savar Canttonment", "postcode": "1344" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "সাভার", "suboffice": "সাভার সেনানিবাস", "postcode": "১৩৪৪" }
  },
  "1343": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Savar", "suboffice": "Saver P.A.T.C", "postcode": "1343" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "সাভার", "suboffice": "সাভার বিপিএটিসি", "postcode": "১৩৪৩" }
  },
  "1345": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Savar", "suboffice": "Shimulia", "postcode": "1345" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "সাভার", "suboffice": "শিমুলিয়া", "postcode": "১৩৪৫" }
  },
  "1100": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Sutrapur", "suboffice": "Dhaka Sadar HO", "postcode": "1100" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "সুত্রাপুর", "suboffice": "ঢাকা সদর HO", "postcode": "১১০০" }
  },
  "1204": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Sutrapur", "suboffice": "Gandaria TSO", "postcode": "1204" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "সুত্রাপুর", "suboffice": "গেণ্ডারিয়া TSO", "postcode": "১২০৪" }
  },
  "1203": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Sutrapur", "suboffice": "Wari TSO", "postcode": "1203" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "সুত্রাপুর", "suboffice": "ওয়ারী TSO", "postcode": "১২০৩" }
  },
  "1215": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Tejgaon", "suboffice": "Tejgaon TSO", "postcode": "1215" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "তেজগাঁও", "suboffice": "তেজগাঁও TSO", "postcode": "১২১৫" }
  },
  "1208": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Tejgaon Industrial Area", "suboffice": "Dhaka Politechnic", "postcode": "1208" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "তেজগাঁও শিল্প এলাকা", "suboffice": "ঢাকা পলিটেকনিক", "postcode": "১২০৮" }
  },
  "1230": {
    "en": { "division": "Dhaka", "district": "Dhaka", "thana": "Uttara", "suboffice": "Uttara Model TownTSO", "postcode": "1230" },
    "bn": { "division": "ঢাকা", "district": "ঢাকা", "thana": "উত্তরা", "suboffice": "উত্তরা মডেল টাউন TSO", "postcode": "১২৩০" }
  },
  "7870": {
    "en": { "division": "Dhaka", "district": "Faridpur", "thana": "Alfadanga", "suboffice": "Alfadanga", "postcode": "7870" },
    "bn": { "division": "ঢাকা", "district": "ফরিদপুর", "thana": "আলফাডাঙ্গা", "suboffice": "আলফাডাঙ্গা", "postcode": "৭৮৭০" }
  },
  "7830": {
    "en": { "division": "Dhaka", "district": "Faridpur", "thana": "Bhanga", "suboffice": "Bhanga", "postcode": "7830" },
    "bn": { "division": "ঢাকা", "district": "ফরিদপুর", "thana": "ভাঙ্গা", "suboffice": "ভাঙ্গা", "postcode": "৭৮৩০" }
  },
  "7860": {
    "en": { "division": "Dhaka", "district": "Faridpur", "thana": "Boalmari", "suboffice": "Boalmari", "postcode": "7860" },
    "bn": { "division": "ঢাকা", "district": "ফরিদপুর", "thana": "বোয়ালমারী", "suboffice": "বোয়ালমারী", "postcode": "৭৮৬০" }
  },
  "7861": {
    "en": { "division": "Dhaka", "district": "Faridpur", "thana": "Boalmari", "suboffice": "Rupatpat", "postcode": "7861" },
    "bn": { "division": "ঢাকা", "district": "ফরিদপুর", "thana": "বোয়ালমারী", "suboffice": "রুপাতপাত", "postcode": "৭৮৬১" }
  },
  "7810": {
    "en": { "division": "Dhaka", "district": "Faridpur", "thana": "Charbhadrasan", "suboffice": "Charbadrashan", "postcode": "7810" },
    "bn": { "division": "ঢাকা", "district": "ফরিদপুর", "thana": "চরভদ্রাসন", "suboffice": "চরভদ্রাসন", "postcode": "৭৮১০" }
  },
  "7802": {
    "en": { "division": "Dhaka", "district": "Faridpur", "thana": "Faridpur Sadar", "suboffice": "Ambikapur", "postcode": "7802" },
    "bn": { "division": "ঢাকা", "district": "ফরিদপুর", "thana": "ফরিদপুর সদর", "suboffice": "অম্বিকাপুর", "postcode": "৭৮০২" }
  },
  "7803": {
    "en": { "division": "Dhaka", "district": "Faridpur", "thana": "Faridpur Sadar", "suboffice": "Baitulaman Politecni", "postcode": "7803" },
    "bn": { "division": "ঢাকা", "district": "ফরিদপুর", "thana": "ফরিদপুর সদর", "suboffice": "বাইতুলমান পলিটেকনিক", "postcode": "৭৮০৩" }
  },
  "7800": {
    "en": { "division": "Dhaka", "district": "Faridpur", "thana": "Faridpur Sadar", "suboffice": "Faridpursadar", "postcode": "7800" },
    "bn": { "division": "ঢাকা", "district": "ফরিদপুর", "thana": "ফরিদপুর সদর", "suboffice": "ফরিদপুর সদর", "postcode": "৭৮০০" }
  },
  "7801": {
    "en": { "division": "Dhaka", "district": "Faridpur", "thana": "Faridpur Sadar", "suboffice": "Kanaipur", "postcode": "7801" },
    "bn": { "division": "ঢাকা", "district": "ফরিদপুর", "thana": "ফরিদপুর সদর", "suboffice": "কানাইপুর", "postcode": "৭৮০১" }
  },
  "7851": {
    "en": { "division": "Dhaka", "district": "Faridpur", "thana": "Madukhali", "suboffice": "Kamarkali", "postcode": "7851" },
    "bn": { "division": "ঢাকা", "district": "ফরিদপুর", "thana": "মদুখালি", "suboffice": "কামারখালি", "postcode": "৭৮৫১" }
  },
  "7850": {
    "en": { "division": "Dhaka", "district": "Faridpur", "thana": "Madukhali", "suboffice": "Madukhali", "postcode": "7850" },
    "bn": { "division": "ঢাকা", "district": "ফরিদপুর", "thana": "মদুখালি", "suboffice": "মদুখালি", "postcode": "৭৮৫০" }
  },
  "7840": {
    "en": { "division": "Dhaka", "district": "Faridpur", "thana": "Nagarkanda", "suboffice": "Nagarkanda", "postcode": "7840" },
    "bn": { "division": "ঢাকা", "district": "ফরিদপুর", "thana": "নগরকান্দা", "suboffice": "নগরকান্দা", "postcode": "৭৮৪০" }
  },
  "7841": {
    "en": { "division": "Dhaka", "district": "Faridpur", "thana": "Nagarkanda", "suboffice": "Talma", "postcode": "7841" },
    "bn": { "division": "ঢাকা", "district": "ফরিদপুর", "thana": "নগরকান্দা", "suboffice": "তালমা", "postcode": "৭৮৪১" }
  },
  "7822": {
    "en": { "division": "Dhaka", "district": "Faridpur", "thana": "Sadarpur", "suboffice": "Bishwa jaker Manjil", "postcode": "7822" },
    "bn": { "division": "ঢাকা", "district": "ফরিদপুর", "thana": "সদরপুর", "suboffice": "বিশ্বরোড জাকের মঞ্জিল", "postcode": "৭৮২২" }
  },
  "7821": {
    "en": { "division": "Dhaka", "district": "Faridpur", "thana": "Sadarpur", "suboffice": "Hat Krishapur", "postcode": "7821" },
    "bn": { "division": "ঢাকা", "district": "ফরিদপুর", "thana": "সদরপুর", "suboffice": "হাট ক্রিশাপুর", "postcode": "৭৮২১" }
  },
  "7820": {
    "en": { "division": "Dhaka", "district": "Faridpur", "thana": "Sadarpur", "suboffice": "Sadarpur", "postcode": "7820" },
    "bn": { "division": "ঢাকা", "district": "ফরিদপুর", "thana": "সদরপুর", "suboffice": "সদরপুর", "postcode": "৭৮২০" }
  },
  "7804": {
    "en": { "division": "Dhaka", "district": "Faridpur", "thana": "Shriangan", "suboffice": "Shriangan", "postcode": "7804" },
    "bn": { "division": "ঢাকা", "district": "ফরিদপুর", "thana": "শ্রী-অঙ্গন", "suboffice": "শ্রী-অঙ্গন", "postcode": "৭৮০৪" }
  },
  "1703": {
    "en": { "division": "Dhaka", "district": "Gazipur", "thana": "Gazipur Sadar", "suboffice": "B.O.F", "postcode": "1703" },
    "bn": { "division": "ঢাকা", "district": "গাজীপুর", "thana": "গাজীপুর সদর", "suboffice": "B.O.F", "postcode": "১৭০৩" }
  },
  "1701": {
    "en": { "division": "Dhaka", "district": "Gazipur", "thana": "Gazipur Sadar", "suboffice": "B.R.R", "postcode": "1701" },
    "bn": { "division": "ঢাকা", "district": "গাজীপুর", "thana": "গাজীপুর সদর", "suboffice": "B.R.R", "postcode": "১৭০১" }
  },
  "1702": {
    "en": { "division": "Dhaka", "district": "Gazipur", "thana": "Gazipur Sadar", "suboffice": "Chandna", "postcode": "1702" },
    "bn": { "division": "ঢাকা", "district": "গাজীপুর", "thana": "গাজীপুর সদর", "suboffice": "চান্দনা", "postcode": "১৭০২" }
  },
  "1700": {
    "en": { "division": "Dhaka", "district": "Gazipur", "thana": "Gazipur Sadar", "suboffice": "Gazipur Sadar", "postcode": "1700" },
    "bn": { "division": "ঢাকা", "district": "গাজীপুর", "thana": "গাজীপুর সদর", "suboffice": "গাজীপুর সদর", "postcode": "১৭০০" }
  },
  "1704": {
    "en": { "division": "Dhaka", "district": "Gazipur", "thana": "Gazipur Sadar", "suboffice": "National University", "postcode": "1704" },
    "bn": { "division": "ঢাকা", "district": "গাজীপুর", "thana": "গাজীপুর সদর", "suboffice": "জাতীয় বিশ্ববিদ্যালয়", "postcode": "১৭০৪" }
  },
  "1750": {
    "en": { "division": "Dhaka", "district": "Gazipur", "thana": "Kaliakaar", "suboffice": "Kaliakaar", "postcode": "1750" },
    "bn": { "division": "ঢাকা", "district": "গাজীপুর", "thana": "কালিয়াকৈর", "suboffice": "কালিয়াকৈর", "postcode": "১৭৫০" }
  },
  "1751": {
    "en": { "division": "Dhaka", "district": "Gazipur", "thana": "Kaliakaar", "suboffice": "Safipur", "postcode": "1751" },
    "bn": { "division": "ঢাকা", "district": "গাজীপুর", "thana": "কালিয়াকৈর", "suboffice": "সফিপুর", "postcode": "১৭৫১" }
  },
  "1720": {
    "en": { "division": "Dhaka", "district": "Gazipur", "thana": "Kaliganj", "suboffice": "Kaliganj", "postcode": "1720" },
    "bn": { "division": "ঢাকা", "district": "গাজীপুর", "thana": "কালীগঞ্জ", "suboffice": "কালীগঞ্জ", "postcode": "১৭২০" }
  },
  "1721": {
    "en": { "division": "Dhaka", "district": "Gazipur", "thana": "Kaliganj", "suboffice": "Pubail", "postcode": "1721" },
    "bn": { "division": "ঢাকা", "district": "গাজীপুর", "thana": "কালীগঞ্জ", "suboffice": "পুবাইল", "postcode": "১৭২১" }
  },
  "1722": {
    "en": { "division": "Dhaka", "district": "Gazipur", "thana": "Kaliganj", "suboffice": "Santanpara", "postcode": "1722" },
    "bn": { "division": "ঢাকা", "district": "গাজীপুর", "thana": "কালীগঞ্জ", "suboffice": "সান্তানপাড়া", "postcode": "১৭২২" }
  },
  "1723": {
    "en": { "division": "Dhaka", "district": "Gazipur", "thana": "Kaliganj", "suboffice": "Vaoal Jamalpur", "postcode": "1723" },
    "bn": { "division": "ঢাকা", "district": "গাজীপুর", "thana": "কালীগঞ্জ", "suboffice": "ভাওয়াল জামালপুর", "postcode": "১৭২৩" }
  },
  "1730": {
    "en": { "division": "Dhaka", "district": "Gazipur", "thana": "Kapashia", "suboffice": "kapashia", "postcode": "1730" },
    "bn": { "division": "ঢাকা", "district": "গাজীপুর", "thana": "কাপাসিয়া", "suboffice": "কাপাসিয়া", "postcode": "১৭৩০" }
  },
  "1712": {
    "en": { "division": "Dhaka", "district": "Gazipur", "thana": "Monnunagar", "suboffice": "Ershad Nagar", "postcode": "1712" },
    "bn": { "division": "ঢাকা", "district": "গাজীপুর", "thana": "মন্নুনগর", "suboffice": "এরশাদ নগর", "postcode": "১৭১২" }
  },
  "1710": {
    "en": { "division": "Dhaka", "district": "Gazipur", "thana": "Monnunagar", "suboffice": "Monnunagar", "postcode": "1710" },
    "bn": { "division": "ঢাকা", "district": "গাজীপুর", "thana": "মন্নুনগর", "suboffice": "মন্নুনগর", "postcode": "১৭১০" }
  },
  "1711": {
    "en": { "division": "Dhaka", "district": "Gazipur", "thana": "Turag", "suboffice": "Nishat Nagar", "postcode": "1711" },
    "bn": { "division": "ঢাকা", "district": "গাজীপুর", "thana": "মন্নুনগর", "suboffice": "নিশাত নগর", "postcode": "১৭১১" }
  },
  "1743": {
    "en": { "division": "Dhaka", "district": "Gazipur", "thana": "Sreepur", "suboffice": "Barmi", "postcode": "1743" },
    "bn": { "division": "ঢাকা", "district": "গাজীপুর", "thana": "শ্রীপুর", "suboffice": "বারমি", "postcode": "১৭৪৩" }
  },
  "1747": {
    "en": { "division": "Dhaka", "district": "Gazipur", "thana": "Sreepur", "suboffice": "Bashamur", "postcode": "1747" },
    "bn": { "division": "ঢাকা", "district": "গাজীপুর", "thana": "শ্রীপুর", "suboffice": "বাশামুর", "postcode": "১৭৪৭" }
  },
  "1748": {
    "en": { "division": "Dhaka", "district": "Gazipur", "thana": "Sreepur", "suboffice": "Boubi", "postcode": "1748" },
    "bn": { "division": "ঢাকা", "district": "গাজীপুর", "thana": "শ্রীপুর", "suboffice": "বউবি", "postcode": "১৭৪৮" }
  },
  "1745": {
    "en": { "division": "Dhaka", "district": "Gazipur", "thana": "Sreepur", "suboffice": "Kawraid", "postcode": "1745" },
    "bn": { "division": "ঢাকা", "district": "গাজীপুর", "thana": "শ্রীপুর", "suboffice": "কাওরাইড", "postcode": "১৭৪৫" }
  },
  "1744": {
    "en": { "division": "Dhaka", "district": "Gazipur", "thana": "Sreepur", "suboffice": "Satkhamair", "postcode": "1744" },
    "bn": { "division": "ঢাকা", "district": "গাজীপুর", "thana": "শ্রীপুর", "suboffice": "সাতখামার", "postcode": "১৭৪৪" }
  },
  "1740": {
    "en": { "division": "Dhaka", "district": "Gazipur", "thana": "Sripur", "suboffice": "Tengra", "postcode": "1740" },
    "bn": { "division": "ঢাকা", "district": "গাজীপুর", "thana": "শ্রীপুর", "suboffice": "শ্রীপুর", "postcode": "১৭৪০" }
  },
  "1741": {
    "en": { "division": "Dhaka", "district": "Gazipur", "thana": "Sripur", "suboffice": "Rajendrapur", "postcode": "1741" },
    "bn": { "division": "ঢাকা", "district": "গাজীপুর", "thana": "শ্রীপুর", "suboffice": "রাজেন্দ্রপুর", "postcode": "১৭৪১" }
  },
  "1742": {
    "en": { "division": "Dhaka", "district": "Gazipur", "thana": "Sripur", "suboffice": "Rajendrapur Canttome", "postcode": "1742" },
    "bn": { "division": "ঢাকা", "district": "গাজীপুর", "thana": "শ্রীপুর", "suboffice": "রাজেন্দ্রপুর সেনানিবাস", "postcode": "১৭৪২" }
  },
  "8102": {
    "en": { "division": "Dhaka", "district": "Gopalganj", "thana": "Gopalganj Sadar", "suboffice": "Barfa", "postcode": "8102" },
    "bn": { "division": "ঢাকা", "district": "গোপালগঞ্জ", "thana": "গোপালগঞ্জ সদর", "suboffice": "বারফা", "postcode": "৮১০২" }
  },
  "8013": {
    "en": { "division": "Dhaka", "district": "Gopalganj", "thana": "Gopalganj Sadar", "suboffice": "Chandradighalia", "postcode": "8013" },
    "bn": { "division": "ঢাকা", "district": "গোপালগঞ্জ", "thana": "গোপালগঞ্জ সদর", "suboffice": "চন্দ্রাদিঘীনালা", "postcode": "৮০১৩" }
  },
  "8100": {
    "en": { "division": "Dhaka", "district": "Gopalganj", "thana": "Gopalganj Sadar", "suboffice": "Gopalganj Sadar", "postcode": "8100" },
    "bn": { "division": "ঢাকা", "district": "গোপালগঞ্জ", "thana": "গোপালগঞ্জ সদর", "suboffice": "গোপালগঞ্জ সদর", "postcode": "৮১০০" }
  },
  "8101": {
    "en": { "division": "Dhaka", "district": "Gopalganj", "thana": "Gopalganj Sadar", "suboffice": "Ulpur", "postcode": "8101" },
    "bn": { "division": "ঢাকা", "district": "গোপালগঞ্জ", "thana": "গোপালগঞ্জ সদর", "suboffice": "উলপুর", "postcode": "৮১০১" }
  },
  "8133": {
    "en": { "division": "Dhaka", "district": "Gopalganj", "thana": "Kashiani", "suboffice": "Jonapur", "postcode": "8133" },
    "bn": { "division": "ঢাকা", "district": "গোপালগঞ্জ", "thana": "কাশিয়ানী", "suboffice": "জনাপুর", "postcode": "৮১৩৩" }
  },
  "8130": {
    "en": { "division": "Dhaka", "district": "Gopalganj", "thana": "Kashiani", "suboffice": "Kashiani", "postcode": "8130" },
    "bn": { "division": "ঢাকা", "district": "গোপালগঞ্জ", "thana": "কাশিয়ানী", "suboffice": "কাশিয়ানী", "postcode": "৮১৩০" }
  },
  "8131": {
    "en": { "division": "Dhaka", "district": "Gopalganj", "thana": "Kashiani", "suboffice": "Ramdia College", "postcode": "8131" },
    "bn": { "division": "ঢাকা", "district": "গোপালগঞ্জ", "thana": "কাশিয়ানী", "suboffice": "রামদিয়া কলেজ", "postcode": "৮১৩১" }
  },
  "8132": {
    "en": { "division": "Dhaka", "district": "Gopalganj", "thana": "Kashiani", "suboffice": "Ratoil", "postcode": "8132" },
    "bn": { "division": "ঢাকা", "district": "গোপালগঞ্জ", "thana": "কাশিয়ানী", "suboffice": "রাতোইল", "postcode": "৮১৩২" }
  },
  "8110": {
    "en": { "division": "Dhaka", "district": "Gopalganj", "thana": "Kotalipara", "suboffice": "Kotalipara", "postcode": "8110" },
    "bn": { "division": "ঢাকা", "district": "গোপালগঞ্জ", "thana": "কোটালীপাড়া", "suboffice": "কোটালীপাড়া", "postcode": "৮১১০" }
  },
  "8141": {
    "en": { "division": "Dhaka", "district": "Gopalganj", "thana": "Maksudpur", "suboffice": "Batkiamari", "postcode": "8141" },
    "bn": { "division": "ঢাকা", "district": "গোপালগঞ্জ", "thana": "মাকসুদপুর", "suboffice": "বাটিকামারী", "postcode": "৮১৪১" }
  },
  "8142": {
    "en": { "division": "Dhaka", "district": "Gopalganj", "thana": "Maksudpur", "suboffice": "Khandarpara", "postcode": "8142" },
    "bn": { "division": "ঢাকা", "district": "গোপালগঞ্জ", "thana": "মাকসুদপুর", "suboffice": "খানদারপাড়া", "postcode": "৮১৪২" }
  },
  "8140": {
    "en": { "division": "Dhaka", "district": "Gopalganj", "thana": "Muksudpur", "suboffice": "Muksudpur", "postcode": "8140" },
    "bn": { "division": "ঢাকা", "district": "গোপালগঞ্জ", "thana": "মাকসুদপুর", "suboffice": "মাকসুদপুর", "postcode": "৮১৪০" }
  },
  "8121": {
    "en": { "division": "Dhaka", "district": "Gopalganj", "thana": "Tungipara", "suboffice": "Patgati", "postcode": "8121" },
    "bn": { "division": "ঢাকা", "district": "গোপালগঞ্জ", "thana": "টুঙ্গিপাড়া", "suboffice": "পাটগাটি", "postcode": "৮১২১" }
  },
  "8120": {
    "en": { "division": "Dhaka", "district": "Gopalganj", "thana": "Tungipara", "suboffice": "Tungipara", "postcode": "8120" },
    "bn": { "division": "ঢাকা", "district": "গোপালগঞ্জ", "thana": "টুঙ্গিপাড়া", "suboffice": "টুঙ্গিপাড়া", "postcode": "৮১২০" }
  },
  "2336": {
    "en": { "division": "Dhaka", "district": "Kishoreganj", "thana": "Bajitpur", "suboffice": "Bajitpur", "postcode": "2336" },
    "bn": { "division": "ঢাকা", "district": "কিশোরগঞ্জ", "thana": "বাজিতপুর", "suboffice": "বাজিতপুর", "postcode": "২৩৩৬" }
  },
  "2338": {
    "en": { "division": "Dhaka", "district": "Kishoreganj", "thana": "Kuliarchar", "suboffice": "Laksmipur", "postcode": "2338" },
    "bn": { "division": "ঢাকা", "district": "কিশোরগঞ্জ", "thana": "বাজিতপুর", "suboffice": "লক্ষ্মীপুর", "postcode": "২৩৩৮" }
  },
  "2337": {
    "en": { "division": "Dhaka", "district": "Kishoreganj", "thana": "Bajitpur", "suboffice": "Sararchar", "postcode": "2337" },
    "bn": { "division": "ঢাকা", "district": "কিশোরগঞ্জ", "thana": "বাজিতপুর", "suboffice": "সরারচর", "postcode": "২৩৩৭" }
  },
  "2350": {
    "en": { "division": "Dhaka", "district": "Kishoreganj", "thana": "Bhairob", "suboffice": "Bhairab", "postcode": "2350" },
    "bn": { "division": "ঢাকা", "district": "কিশোরগঞ্জ", "thana": "ভৈরব", "suboffice": "ভৈরব", "postcode": "২৩৫০" }
  },
  "2320": {
    "en": { "division": "Dhaka", "district": "Kishoreganj", "thana": "Hossenpur", "suboffice": "Hossenpur", "postcode": "2320" },
    "bn": { "division": "ঢাকা", "district": "কিশোরগঞ্জ", "thana": "হোসেনপুর", "suboffice": "হোসেনপুর", "postcode": "২৩২০" }
  },
  "2390": {
    "en": { "division": "Dhaka", "district": "Kishoreganj", "thana": "Itna", "suboffice": "Itna", "postcode": "2390" },
    "bn": { "division": "ঢাকা", "district": "কিশোরগঞ্জ", "thana": "ইটনা", "suboffice": "ইটনা", "postcode": "২৩৯০" }
  },
  "2310": {
    "en": { "division": "Dhaka", "district": "Kishoreganj", "thana": "Karimganj", "suboffice": "Karimganj", "postcode": "2310" },
    "bn": { "division": "ঢাকা", "district": "কিশোরগঞ্জ", "thana": "করিমগঞ্জ", "suboffice": "করিমগঞ্জ", "postcode": "২৩১০" }
  },
  "2331": {
    "en": { "division": "Dhaka", "district": "Kishoreganj", "thana": "Katiadi", "suboffice": "Gochhihata", "postcode": "2331" },
    "bn": { "division": "ঢাকা", "district": "কিশোরগঞ্জ", "thana": "কটিয়াদি", "suboffice": "গচিহাটা", "postcode": "২৩৩১" }
  },
  "2330": {
    "en": { "division": "Dhaka", "district": "Kishoreganj", "thana": "Katiadi", "suboffice": "Katiadi", "postcode": "2330" },
    "bn": { "division": "ঢাকা", "district": "কিশোরগঞ্জ", "thana": "কটিয়াদি", "suboffice": "কটিয়াদি", "postcode": "২৩৩০" }
  },
  "2301": {
    "en": { "division": "Dhaka", "district": "Kishoreganj", "thana": "Kishoreganj Sadar", "suboffice": "Kishoreganj S.Mills", "postcode": "2301" },
    "bn": { "division": "ঢাকা", "district": "কিশোরগঞ্জ", "thana": "কিশোরগঞ্জ সদর", "suboffice": "কিশোরগঞ্জ এস.মিলস", "postcode": "২৩০১" }
  },
  "2300": {
    "en": { "division": "Dhaka", "district": "Kishoreganj", "thana": "Kishoreganj Sadar", "suboffice": "Kishoreganj Sadar", "postcode": "2300" },
    "bn": { "division": "ঢাকা", "district": "কিশোরগঞ্জ", "thana": "কিশোরগঞ্জ সদর", "suboffice": "কিশোরগঞ্জ সদর", "postcode": "২৩০০" }
  },
  "2302": {
    "en": { "division": "Dhaka", "district": "Kishoreganj", "thana": "Kishoreganj Sadar", "suboffice": "Maizhati", "postcode": "2302" },
    "bn": { "division": "ঢাকা", "district": "কিশোরগঞ্জ", "thana": "কিশোরগঞ্জ সদর", "suboffice": "মাইজহাটি", "postcode": "২৩০২" }
  },
  "2303": {
    "en": { "division": "Dhaka", "district": "Kishoreganj", "thana": "Kishoreganj Sadar", "suboffice": "Nilganj", "postcode": "2303" },
    "bn": { "division": "ঢাকা", "district": "কিশোরগঞ্জ", "thana": "কিশোরগঞ্জ সদর", "suboffice": "নীলগঞ্জ", "postcode": "২৩০৩" }
  },
  "2341": {
    "en": { "division": "Dhaka", "district": "Kishoreganj", "thana": "Kuliarchar", "suboffice": "Chhoysuti", "postcode": "2341" },
    "bn": { "division": "ঢাকা", "district": "কিশোরগঞ্জ", "thana": "কুলিয়ারচর", "suboffice": "ছয়সুটি", "postcode": "২৩৪১" }
  },
  "2340": {
    "en": { "division": "Dhaka", "district": "Kishoreganj", "thana": "Kuliarchar", "suboffice": "Kuliarchar", "postcode": "2340" },
    "bn": { "division": "ঢাকা", "district": "কিশোরগঞ্জ", "thana": "কুলিয়ারচর", "suboffice": "কুলিয়ারচর", "postcode": "২৩৪০" }
  },
  "2371": {
    "en": { "division": "Dhaka", "district": "Kishoreganj", "thana": "Mithamoin", "suboffice": "Abdullahpur", "postcode": "2371" },
    "bn": { "division": "ঢাকা", "district": "কিশোরগঞ্জ", "thana": "মিঠামইন", "suboffice": "আব্দুল্লাহপুর", "postcode": "২৩৭১" }
  },
  "2370": {
    "en": { "division": "Dhaka", "district": "Kishoreganj", "thana": "Mithamoin", "suboffice": "MIthamoin", "postcode": "2370" },
    "bn": { "division": "ঢাকা", "district": "কিশোরগঞ্জ", "thana": "মিঠামইন", "suboffice": "মিঠামইন", "postcode": "২৩৭০" }
  },
  "2360": {
    "en": { "division": "Dhaka", "district": "Kishoreganj", "thana": "Nikli", "suboffice": "Nikli", "postcode": "2360" },
    "bn": { "division": "ঢাকা", "district": "কিশোরগঞ্জ", "thana": "নিকলী", "suboffice": "নিকলী", "postcode": "২৩৬০" }
  },
  "2380": {
    "en": { "division": "Dhaka", "district": "Kishoreganj", "thana": "Ostagram", "suboffice": "Ostagram", "postcode": "2380" },
    "bn": { "division": "ঢাকা", "district": "কিশোরগঞ্জ", "thana": "অস্টগ্রাম", "suboffice": "অস্টগ্রাম", "postcode": "২৩৮০" }
  },
  "2326": {
    "en": { "division": "Dhaka", "district": "Kishoreganj", "thana": "Pakundia", "suboffice": "Pakundia", "postcode": "2326" },
    "bn": { "division": "ঢাকা", "district": "কিশোরগঞ্জ", "thana": "পাকুন্দিয়া", "suboffice": "পাকুন্দিয়া", "postcode": "২৩২৬" }
  },
  "2316": {
    "en": { "division": "Dhaka", "district": "Kishoreganj", "thana": "Tarial", "suboffice": "Tarial", "postcode": "2316" },
    "bn": { "division": "ঢাকা", "district": "কিশোরগঞ্জ", "thana": "তারাইল", "suboffice": "তারাইল", "postcode": "২৩১৬" }
  },
  "7932": {
    "en": { "division": "Dhaka", "district": "Madaripur", "thana": "Barhamganj", "suboffice": "Bahadurpur", "postcode": "7932" },
    "bn": { "division": "ঢাকা", "district": "মাদারীপুর", "thana": "বারহামগঞ্জ", "suboffice": "বাহাদুরপুর", "postcode": "৭৯৩২" }
  },
  "7930": {
    "en": { "division": "Dhaka", "district": "Madaripur", "thana": "Barhamganj", "suboffice": "Barhamganj", "postcode": "7930" },
    "bn": { "division": "ঢাকা", "district": "মাদারীপুর", "thana": "বারহামগঞ্জ", "suboffice": "বারহামগঞ্জ", "postcode": "৭৯৩০" }
  },
  "7931": {
    "en": { "division": "Dhaka", "district": "Madaripur", "thana": "Barhamganj", "suboffice": "Nilaksmibandar", "postcode": "7931" },
    "bn": { "division": "ঢাকা", "district": "মাদারীপুর", "thana": "বারহামগঞ্জ", "suboffice": "নিলাকসমিবান্দার", "postcode": "৭৯৩১" }
  },
  "7933": {
    "en": { "division": "Dhaka", "district": "Madaripur", "thana": "Barhamganj", "suboffice": "Umedpur", "postcode": "7933" },
    "bn": { "division": "ঢাকা", "district": "মাদারীপুর", "thana": "বারহামগঞ্জ", "suboffice": "উমেদপুর", "postcode": "৭৯৩৩" }
  },
  "7920": {
    "en": { "division": "Dhaka", "district": "Madaripur", "thana": "kalkini", "suboffice": "Kalkini", "postcode": "7920" },
    "bn": { "division": "ঢাকা", "district": "মাদারীপুর", "thana": "কালকিনি", "suboffice": "কালকিনি", "postcode": "৭৯২০" }
  },
  "7921": {
    "en": { "division": "Dhaka", "district": "Madaripur", "thana": "kalkini", "suboffice": "Sahabrampur", "postcode": "7921" },
    "bn": { "division": "ঢাকা", "district": "মাদারীপুর", "thana": "কালকিনি", "suboffice": "সাহাবরামপুর", "postcode": "৭৯২১" }
  },
  "7901": {
    "en": { "division": "Dhaka", "district": "Madaripur", "thana": "Madaripur Sadar", "suboffice": "Charmugria", "postcode": "7901" },
    "bn": { "division": "ঢাকা", "district": "মাদারীপুর", "thana": "মাদারীপুর সদর", "suboffice": "চরমুগরিয়া", "postcode": "৭৯০১" }
  },
  "7903": {
    "en": { "division": "Dhaka", "district": "Madaripur", "thana": "Madaripur Sadar", "suboffice": "Habiganj", "postcode": "7903" },
    "bn": { "division": "ঢাকা", "district": "মাদারীপুর", "thana": "মাদারীপুর সদর", "suboffice": "হবিগঞ্জ", "postcode": "৭৯০৩" }
  },
  "7902": {
    "en": { "division": "Dhaka", "district": "Madaripur", "thana": "Madaripur Sadar", "suboffice": "Kulpaddi", "postcode": "7902" },
    "bn": { "division": "ঢাকা", "district": "মাদারীপুর", "thana": "মাদারীপুর সদর", "suboffice": "কুলপাদ্দি", "postcode": "৭৯০২" }
  },
  "7900": {
    "en": { "division": "Dhaka", "district": "Madaripur", "thana": "Madaripur Sadar", "suboffice": "Madaripur Sadar", "postcode": "7900" },
    "bn": { "division": "ঢাকা", "district": "মাদারীপুর", "thana": "মাদারীপুর সদর", "suboffice": "মাদারীপুর সদর", "postcode": "৭৯০০" }
  },
  "7904": {
    "en": { "division": "Dhaka", "district": "Madaripur", "thana": "Madaripur Sadar", "suboffice": "Mustafapur", "postcode": "7904" },
    "bn": { "division": "ঢাকা", "district": "মাদারীপুর", "thana": "মাদারীপুর সদর", "suboffice": "মুস্তফাপুর", "postcode": "৭৯০৪" }
  },
  "7911": {
    "en": { "division": "Dhaka", "district": "Madaripur", "thana": "Rajoir", "suboffice": "Khalia", "postcode": "7911" },
    "bn": { "division": "ঢাকা", "district": "মাদারীপুর", "thana": "রাজৈর", "suboffice": "খালিয়া", "postcode": "৭৯১১" }
  },
  "7910": {
    "en": { "division": "Dhaka", "district": "Madaripur", "thana": "Rajoir", "suboffice": "Rajoir", "postcode": "7910" },
    "bn": { "division": "ঢাকা", "district": "মাদারীপুর", "thana": "রাজৈর", "suboffice": "রাজৈর", "postcode": "৭৯১০" }
  },
  "1860": {
    "en": { "division": "Dhaka", "district": "Manikganj", "thana": "Doulatpur", "suboffice": "Doulatpur", "postcode": "1860" },
    "bn": { "division": "ঢাকা", "district": "মানিকগঞ্জ", "thana": "দৌলতপুর", "suboffice": "দৌলতপুর", "postcode": "১৮৬০" }
  },
  "1840": {
    "en": { "division": "Dhaka", "district": "Manikganj", "thana": "Ghior", "suboffice": "Ghior", "postcode": "1840" },
    "bn": { "division": "ঢাকা", "district": "মানিকগঞ্জ", "thana": "ঘিওর", "suboffice": "ঘিওর", "postcode": "১৮৪০" }
  },
  "1831": {
    "en": { "division": "Dhaka", "district": "Manikganj", "thana": "Lechhraganj", "suboffice": "Jhitka", "postcode": "1831" },
    "bn": { "division": "ঢাকা", "district": "মানিকগঞ্জ", "thana": "লেছড়াগঞ্জ", "suboffice": "ঝিটকা", "postcode": "১৮৩১" }
  },
  "1830": {
    "en": { "division": "Dhaka", "district": "Manikganj", "thana": "Lechhraganj", "suboffice": "Lechhraganj", "postcode": "1830" },
    "bn": { "division": "ঢাকা", "district": "মানিকগঞ্জ", "thana": "বারহামগঞ্জ", "suboffice": "বারহামগঞ্জ", "postcode": "১৮৩০" }
  },
  "1804": {
    "en": { "division": "Dhaka", "district": "Manikganj", "thana": "Manikganj Sadar", "suboffice": "Barangail", "postcode": "1804" },
    "bn": { "division": "ঢাকা", "district": "মানিকগঞ্জ", "thana": "মানিকগঞ্জ সদর", "suboffice": "বরংগাইল", "postcode": "১৮০৪" }
  },
  "1802": {
    "en": { "division": "Dhaka", "district": "Manikganj", "thana": "Manikganj Sadar", "suboffice": "Gorpara", "postcode": "1802" },
    "bn": { "division": "ঢাকা", "district": "মানিকগঞ্জ", "thana": "মানিকগঞ্জ সদর", "suboffice": "গড়পাড়া", "postcode": "১৮০২" }
  },
  "1803": {
    "en": { "division": "Dhaka", "district": "Manikganj", "thana": "Manikganj Sadar", "suboffice": "Mahadebpur", "postcode": "1803" },
    "bn": { "division": "ঢাকা", "district": "মানিকগঞ্জ", "thana": "মানিকগঞ্জ সদর", "suboffice": "মহাদেবপুর", "postcode": "১৮০৩" }
  },
  "1801": {
    "en": { "division": "Dhaka", "district": "Manikganj", "thana": "Manikganj Sadar", "suboffice": "Manikganj Bazar", "postcode": "1801" },
    "bn": { "division": "ঢাকা", "district": "মানিকগঞ্জ", "thana": "মানিকগঞ্জ সদর", "suboffice": "মানিকগঞ্জ বাজার", "postcode": "১৮০১" }
  },
  "1800": {
    "en": { "division": "Dhaka", "district": "Manikganj", "thana": "Manikganj Sadar", "suboffice": "Manikganj Sadar", "postcode": "1800" },
    "bn": { "division": "ঢাকা", "district": "মানিকগঞ্জ", "thana": "মানিকগঞ্জ সদর", "suboffice": "মানিকগঞ্জ সদর", "postcode": "১৮০০" }
  },
  "1811": {
    "en": { "division": "Dhaka", "district": "Manikganj", "thana": "Saturia", "suboffice": "Baliati", "postcode": "1811" },
    "bn": { "division": "ঢাকা", "district": "মানিকগঞ্জ", "thana": "সাটুরিয়া", "suboffice": "বালিয়াটি", "postcode": "১৮১১" }
  },
  "1810": {
    "en": { "division": "Dhaka", "district": "Manikganj", "thana": "Saturia", "suboffice": "Saturia", "postcode": "1810" },
    "bn": { "division": "ঢাকা", "district": "মানিকগঞ্জ", "thana": "সাটুরিয়া", "suboffice": "সাটুরিয়া", "postcode": "১৮১০" }
  },
  "1851": {
    "en": { "division": "Dhaka", "district": "Manikganj", "thana": "Shibloya", "suboffice": "Aricha", "postcode": "1851" },
    "bn": { "division": "ঢাকা", "district": "মানিকগঞ্জ", "thana": "শিবালয়", "suboffice": "আরিচা", "postcode": "১৮৫১" }
  },
  "1850": {
    "en": { "division": "Dhaka", "district": "Manikganj", "thana": "Shibloya", "suboffice": "Shibaloy", "postcode": "1850" },
    "bn": { "division": "ঢাকা", "district": "মানিকগঞ্জ", "thana": "শিবালয়", "suboffice": "শিবালয়", "postcode": "১৮৫০" }
  },
  "1852": {
    "en": { "division": "Dhaka", "district": "Manikganj", "thana": "Shibloya", "suboffice": "Tewta", "postcode": "1852" },
    "bn": { "division": "ঢাকা", "district": "মানিকগঞ্জ", "thana": "শিবালয়", "suboffice": "তেওতা", "postcode": "১৮৫২" }
  },
  "1853": {
    "en": { "division": "Dhaka", "district": "Manikganj", "thana": "Shibloya", "suboffice": "Uthli", "postcode": "1853" },
    "bn": { "division": "ঢাকা", "district": "মানিকগঞ্জ", "thana": "শিবালয়", "suboffice": "উঠলি", "postcode": "১৮৫৩" }
  },
  "1821": {
    "en": { "division": "Dhaka", "district": "Manikganj", "thana": "Singari", "suboffice": "Baira", "postcode": "1821" },
    "bn": { "division": "ঢাকা", "district": "মানিকগঞ্জ", "thana": "সিংগাইর", "suboffice": "বায়রা", "postcode": "১৮২১" }
  },
  "1822": {
    "en": { "division": "Dhaka", "district": "Manikganj", "thana": "Singari", "suboffice": "joymantop", "postcode": "1822" },
    "bn": { "division": "ঢাকা", "district": "মানিকগঞ্জ", "thana": "সিংগাইর", "suboffice": "জয়মন্তব", "postcode": "১৮২২" }
  },
  "1820": {
    "en": { "division": "Dhaka", "district": "Manikganj", "thana": "Singari", "suboffice": "Singair", "postcode": "1820" },
    "bn": { "division": "ঢাকা", "district": "মানিকগঞ্জ", "thana": "সিংগাইর", "suboffice": "সিংগাইর", "postcode": "১৮২০" }
  },
  "1510": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Gajaria", "suboffice": "Gajaria", "postcode": "1510" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "গজারিয়া", "suboffice": "গজারিয়া", "postcode": "১৫১০" }
  },
  "1511": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Gajaria", "suboffice": "Hossendi", "postcode": "1511" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "গজারিয়া", "suboffice": "হোসেন্দি", "postcode": "১৫১১" }
  },
  "1512": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Gajaria", "suboffice": "Rasulpur", "postcode": "1512" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "গজারিয়া", "suboffice": "রসুলপুর", "postcode": "১৫১২" }
  },
  "1334": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Lohajong", "suboffice": "Gouragonj", "postcode": "1334" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "লৌহজং", "suboffice": "গৌড়গঞ্জ", "postcode": "১৫৩৪" }
  },
  "1534": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Lohajong", "suboffice": "Gouragonj", "postcode": "1534" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "লৌহজং", "suboffice": "গৌড়গঞ্জ", "postcode": "১৫৩৪" }
  },
  "1532": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Lohajong", "suboffice": "Haldia SO", "postcode": "1532" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "লৌহজং", "suboffice": "হলদিয়া তাই", "postcode": "১৫৩২" }
  },
  "1333": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Lohajong", "suboffice": "Haridia", "postcode": "1333" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "লৌহজং", "suboffice": "হারিদিয়া", "postcode": "১৩৩৩" }
  },
  "1533": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Lohajong", "suboffice": "Haridia DESO", "postcode": "1533" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "লৌহজং", "suboffice": "হারিদিয়া DESO", "postcode": "১৫৩৩" }
  },
  "1531": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Lohajong", "suboffice": "Korhati", "postcode": "1531" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "লৌহজং", "suboffice": "করহাতি", "postcode": "১৫৩১" }
  },
  "1530": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Lohajong", "suboffice": "Lohajang", "postcode": "1530" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "লৌহজং", "suboffice": "লৌহজং", "postcode": "১৫৩০" }
  },
  "1335": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Lohajong", "suboffice": "Madini Mandal", "postcode": "1335" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "লৌহজং", "suboffice": "মেদিনী মণ্ডল", "postcode": "১৩৩৫" }
  },
  "1535": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Lohajong", "suboffice": "Medini Mandal EDSO", "postcode": "1535" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "লৌহজং", "suboffice": "মেদিনী মন্ডল EDSO", "postcode": "১৫৩৫" }
  },
  "1503": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Munshiganj Sadar", "suboffice": "Kathakhali", "postcode": "1503" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "মুন্সীগঞ্জ সদর", "suboffice": "কাঠাখালি", "postcode": "১৫০৩" }
  },
  "1502": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Munshiganj Sadar", "suboffice": "Mirkadim", "postcode": "1502" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "মুন্সীগঞ্জ সদর", "suboffice": "মিরকাদিম", "postcode": "১৫০২" }
  },
  "1500": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Munshiganj Sadar", "suboffice": "Munshiganj Sadar", "postcode": "1500" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "মুন্সীগঞ্জ সদর", "suboffice": "মুন্সীগঞ্জ সদর", "postcode": "১৫০০" }
  },
  "1501": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Munshiganj Sadar", "suboffice": "Rikabibazar", "postcode": "1501" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "মুন্সীগঞ্জ সদর", "suboffice": "রিকাবিবাজার", "postcode": "১৫০১" }
  },
  "1542": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Sirajdikhan", "suboffice": "Ichapur", "postcode": "1542" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "সিরাজদিখান", "suboffice": "ইছাপুর", "postcode": "১৫৪২" }
  },
  "1541": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Sirajdikhan", "suboffice": "Kola", "postcode": "1541" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "সিরাজদিখান", "suboffice": "কোলা", "postcode": "১৫৪১" }
  },
  "1543": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Sirajdikhan", "suboffice": "Malkha Nagar", "postcode": "1543" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "সিরাজদিখান", "suboffice": "মালখানগর", "postcode": "১৫৪৩" }
  },
  "1544": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Sirajdikhan", "suboffice": "Shekher Nagar", "postcode": "1544" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "সিরাজদিখান", "suboffice": "শেখের নগর", "postcode": "১৫৪৪" }
  },
  "1540": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Sirajdikhan", "suboffice": "Sirajdikhan", "postcode": "1540" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "সিরাজদিখান", "suboffice": "সিরাজদিখান", "postcode": "১৫৪০" }
  },
  "1557": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Sreenagar", "suboffice": "Baghra", "postcode": "1557" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "শ্রীনগর", "suboffice": "বাঘড়া", "postcode": "১৫৫৭" }
  },
  "1551": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Sreenagar", "suboffice": "Rarikhal", "postcode": "1551" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "শ্রীনগর", "suboffice": "বারিখাল", "postcode": "১৫৫১" }
  },
  "1558": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Sreenagar", "suboffice": "Bhaggyakul", "postcode": "1558" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "শ্রীনগর", "suboffice": "ভাগ্যকুল", "postcode": "১৫৫৮" }
  },
  "1553": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Sreenagar", "suboffice": "Hashara", "postcode": "1553" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "শ্রীনগর", "suboffice": "হাশারা", "postcode": "১৫৫৩" }
  },
  "1554": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Sreenagar", "suboffice": "Kolapara", "postcode": "1554" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "শ্রীনগর", "suboffice": "কলাপাড়া", "postcode": "১৫৫৪" }
  },
  "1555": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Sreenagar", "suboffice": "Kumarbhog", "postcode": "1555" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "শ্রীনগর", "suboffice": "কুমারভগ", "postcode": "১৫৫৫" }
  },
  "1552": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Sreenagar", "suboffice": "Maijpara", "postcode": "1552" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "শ্রীনগর", "suboffice": "মাজপাড়া", "postcode": "১৫৫২" }
  },
  "1550": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Sreenagar", "suboffice": "Sreenagar", "postcode": "1550" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "শ্রীনগর", "suboffice": "শ্রীনগর", "postcode": "১৫৫০" }
  },
  "1556": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Sreenagar", "suboffice": "Vaggyakul SO", "postcode": "1556" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "শ্রীনগর", "suboffice": "ভাগ্যকুল তাই", "postcode": "১৫৫৬" }
  },
  "1523": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Tangibari", "suboffice": "Bajrajugini", "postcode": "1523" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "টাংগিবাড়ি", "suboffice": "বিজরাজুগিনি", "postcode": "১৫২৩" }
  },
  "1522": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Tangibari", "suboffice": "Baligao", "postcode": "1522" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "টাংগিবাড়ি", "suboffice": "বালিগাও", "postcode": "১৫২২" }
  },
  "1521": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Tangibari", "suboffice": "Betkahat", "postcode": "1521" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "টাংগিবাড়ি", "suboffice": "বেটকারহাট", "postcode": "১৫২১" }
  },
  "1525": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Tangibari", "suboffice": "Dighirpar", "postcode": "1525" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "টাংগিবাড়ি", "suboffice": "দিঘিরপাড়", "postcode": "১৫২৫" }
  },
  "1524": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Tangibari", "suboffice": "Hasail", "postcode": "1524" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "টাংগিবাড়ি", "suboffice": "হাসাইল", "postcode": "১৫২৪" }
  },
  "1527": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Tangibari", "suboffice": "Pura", "postcode": "1527" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "টাংগিবাড়ি", "suboffice": "পুরা", "postcode": "১৫২৭" }
  },
  "1526": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Tangibari", "suboffice": "Pura EDSO", "postcode": "1526" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "টাংগিবাড়ি", "suboffice": "পুরা EDSO", "postcode": "১৫২৬" }
  },
  "1520": {
    "en": { "division": "Dhaka", "district": "Munshiganj", "thana": "Tangibari", "suboffice": "Tangibari", "postcode": "1520" },
    "bn": { "division": "ঢাকা", "district": "মুন্সিগঞ্জ", "thana": "টাংগিবাড়ি", "suboffice": "টাংগিবাড়ি", "postcode": "১৫২০" }
  },
  "1450": {
    "en": { "division": "Dhaka", "district": "Narayanganj", "thana": "Araihazar", "suboffice": "Araihazar", "postcode": "1450" },
    "bn": { "division": "ঢাকা", "district": "নারায়ণগঞ্জ", "thana": "আড়াইহাজার", "suboffice": "আড়াইহাজার", "postcode": "১৪৫০" }
  },
  "1460": {
    "en": { "division": "Dhaka", "district": "Narayanganj", "thana": "Rupganj", "suboffice": "Rupganj", "postcode": "1460" },
    "bn": { "division": "ঢাকা", "district": "নারায়ণগঞ্জ", "thana": "রূপগঞ্জ", "suboffice": "রূপগঞ্জ", "postcode": "১৪৬০" }
  },
  "1451": {
    "en": { "division": "Dhaka", "district": "Narayanganj", "thana": "Araihazar", "suboffice": "Gopaldi", "postcode": "1451" },
    "bn": { "division": "ঢাকা", "district": "নারায়ণগঞ্জ", "thana": "আড়াইহাজার", "suboffice": "গোপালদি", "postcode": "১৪৫১" }
  },
  "1440": {
    "en": { "division": "Dhaka", "district": "Narayanganj", "thana": "Baidder Bazar", "suboffice": "Baidder Bazar", "postcode": "1440" },
    "bn": { "division": "ঢাকা", "district": "নারায়ণগঞ্জ", "thana": "বাইদ্দের বাজার", "suboffice": "বাইদ্দের বাজার", "postcode": "১৪৪০" }
  },
  "1441": {
    "en": { "division": "Dhaka", "district": "Narayanganj", "thana": "Baidder Bazar", "suboffice": "Bara Nagar", "postcode": "1441" },
    "bn": { "division": "ঢাকা", "district": "নারায়ণগঞ্জ", "thana": "বাইদ্দের বাজার", "suboffice": "বারো নগর", "postcode": "১৪৪১" }
  },
  "1442": {
    "en": { "division": "Dhaka", "district": "Narayanganj", "thana": "Baidder Bazar", "suboffice": "Barodi", "postcode": "1442" },
    "bn": { "division": "ঢাকা", "district": "নারায়ণগঞ্জ", "thana": "বাইদ্দের বাজার", "suboffice": "বারোদি", "postcode": "১৪৪২" }
  },
  "1410": {
    "en": { "division": "Dhaka", "district": "Narayanganj", "thana": "Bandar", "suboffice": "Bandar", "postcode": "1410" },
    "bn": { "division": "ঢাকা", "district": "নারায়ণগঞ্জ", "thana": "বন্দর", "suboffice": "বন্দর", "postcode": "১৪১০" }
  },
  "1413": {
    "en": { "division": "Dhaka", "district": "Narayanganj", "thana": "Bandar", "suboffice": "BIDS", "postcode": "1413" },
    "bn": { "division": "ঢাকা", "district": "নারায়ণগঞ্জ", "thana": "বন্দর", "suboffice": "বিআইডিএস", "postcode": "১৪১৩" }
  },
  "1411": {
    "en": { "division": "Dhaka", "district": "Narayanganj", "thana": "Bandar", "suboffice": "D.C Mills", "postcode": "1411" },
    "bn": { "division": "ঢাকা", "district": "নারায়ণগঞ্জ", "thana": "বন্দর", "suboffice": "ডি.সি মিলস", "postcode": "১৪১১" }
  },
  "1414": {
    "en": { "division": "Dhaka", "district": "Narayanganj", "thana": "Bandar", "suboffice": "Madanganj", "postcode": "1414" },
    "bn": { "division": "ঢাকা", "district": "নারায়ণগঞ্জ", "thana": "বন্দর", "suboffice": "মদনগঞ্জ", "postcode": "১৪১৪" }
  },
  "1412": {
    "en": { "division": "Dhaka", "district": "Narayanganj", "thana": "Bandar", "suboffice": "Nabiganj", "postcode": "1412" },
    "bn": { "division": "ঢাকা", "district": "নারায়ণগঞ্জ", "thana": "বন্দর", "suboffice": "নবীগঞ্জ", "postcode": "১৪১২" }
  },
  "1421": {
    "en": { "division": "Dhaka", "district": "Narayanganj", "thana": "Fatullah", "suboffice": "Fatulla Bazar", "postcode": "1421" },
    "bn": { "division": "ঢাকা", "district": "নারায়ণগঞ্জ", "thana": "ফতুল্লা", "suboffice": "ফতুল্লা বাজার", "postcode": "১৪২১" }
  },
  "1420": {
    "en": { "division": "Dhaka", "district": "Narayanganj", "thana": "Fatullah", "suboffice": "Fatullah", "postcode": "1420" },
    "bn": { "division": "ঢাকা", "district": "নারায়ণগঞ্জ", "thana": "ফতুল্লা", "suboffice": "ফতুল্লা", "postcode": "১৪২০" }
  },
  "1400": {
    "en": { "division": "Dhaka", "district": "Narayanganj", "thana": "Narayanganj Sadar", "suboffice": "Narayanganj Sadar", "postcode": "1400" },
    "bn": { "division": "ঢাকা", "district": "নারায়ণগঞ্জ", "thana": "নারায়ণগঞ্জ সদর", "suboffice": "নারায়ণগঞ্জ সদর", "postcode": "১৪০০" }
  },
  "1462": {
    "en": { "division": "Dhaka", "district": "Narayanganj", "thana": "Rupganj", "suboffice": "Bhulta", "postcode": "1462" },
    "bn": { "division": "ঢাকা", "district": "নারায়ণগঞ্জ", "thana": "রূপগঞ্জ", "suboffice": "ভুলতা", "postcode": "১৪৬২" }
  },
  "1461": {
    "en": { "division": "Dhaka", "district": "Narayanganj", "thana": "Rupganj", "suboffice": "Kanchan", "postcode": "1461" },
    "bn": { "division": "ঢাকা", "district": "নারায়ণগঞ্জ", "thana": "রূপগঞ্জ", "suboffice": "কাঞ্চন", "postcode": "১৪৬১" }
  },
  "1464": {
    "en": { "division": "Dhaka", "district": "Narayanganj", "thana": "Rupganj", "suboffice": "Murapara", "postcode": "1464" },
    "bn": { "division": "ঢাকা", "district": "নারায়ণগঞ্জ", "thana": "রূপগঞ্জ", "suboffice": "মুরাপাড়া", "postcode": "১৪৬৪" }
  },
  "1463": {
    "en": { "division": "Dhaka", "district": "Narayanganj", "thana": "Rupganj", "suboffice": "Nagri", "postcode": "1463" },
    "bn": { "division": "ঢাকা", "district": "নারায়ণগঞ্জ", "thana": "রূপগঞ্জ", "suboffice": "নগরি", "postcode": "১৪৬৩" }
  },
  "1431": {
    "en": { "division": "Dhaka", "district": "Narayanganj", "thana": "Siddirganj", "suboffice": "Adamjeenagar", "postcode": "1431" },
    "bn": { "division": "ঢাকা", "district": "নারায়ণগঞ্জ", "thana": "সিদ্ধিরগঞ্জ", "suboffice": "আদামজীনগর", "postcode": "১৪৩১" }
  },
  "1432": {
    "en": { "division": "Dhaka", "district": "Narayanganj", "thana": "Siddirganj", "suboffice": "LN Mills", "postcode": "1432" },
    "bn": { "division": "ঢাকা", "district": "নারায়ণগঞ্জ", "thana": "সিদ্ধিরগঞ্জ", "suboffice": "LN মিলস", "postcode": "১৪৩২" }
  },
  "1430": {
    "en": { "division": "Dhaka", "district": "Narayanganj", "thana": "Siddirganj", "suboffice": "Siddirganj", "postcode": "1430" },
    "bn": { "division": "ঢাকা", "district": "নারায়ণগঞ্জ", "thana": "সিদ্ধিরগঞ্জ", "suboffice": "সিদ্ধিরগঞ্জ", "postcode": "১৪৩০" }
  },
  "1640": {
    "en": { "division": "Dhaka", "district": "Narsingdi", "thana": "Belabo", "suboffice": "Belabo", "postcode": "1640" },
    "bn": { "division": "ঢাকা", "district": "নরসিংদী", "thana": "বেলাব", "suboffice": "বেলাব", "postcode": "১৬৪০" }
  },
  "1651": {
    "en": { "division": "Dhaka", "district": "Narsingdi", "thana": "Monohordi", "suboffice": "Hatirdia", "postcode": "1651" },
    "bn": { "division": "ঢাকা", "district": "নরসিংদী", "thana": "মনোহরদি", "suboffice": "হাতিরদিয়া", "postcode": "১৬৫১" }
  },
  "1652": {
    "en": { "division": "Dhaka", "district": "Narsingdi", "thana": "Monohordi", "suboffice": "Katabaria", "postcode": "1652" },
    "bn": { "division": "ঢাকা", "district": "নরসিংদী", "thana": "মনোহরদি", "suboffice": "কাটাবাড়িয়া", "postcode": "১৬৫২" }
  },
  "1650": {
    "en": { "division": "Dhaka", "district": "Narsingdi", "thana": "Monohordi", "suboffice": "Monohordi", "postcode": "1650" },
    "bn": { "division": "ঢাকা", "district": "নরসিংদী", "thana": "মনোহরদি", "suboffice": "মনোহরদি", "postcode": "১৬৫০" }
  },
  "1605": {
    "en": { "division": "Dhaka", "district": "Narsingdi", "thana": "Narsingdi Sadar", "suboffice": "Karimpur", "postcode": "1605" },
    "bn": { "division": "ঢাকা", "district": "নরসিংদী", "thana": "নরসিংদী সদর", "suboffice": "করিমপুর", "postcode": "১৬০৫" }
  },
  "1604": {
    "en": { "division": "Dhaka", "district": "Narsingdi", "thana": "Madhabdi", "suboffice": "Madhabdi", "postcode": "1604" },
    "bn": { "division": "ঢাকা", "district": "নরসিংদী", "thana": "নরসিংদী সদর", "suboffice": "মাধবদী", "postcode": "১৬০৪" }
  },
  "1602": {
    "en": { "division": "Dhaka", "district": "Narsingdi", "thana": "Narsingdi Sadar", "suboffice": "Narsingdi College", "postcode": "1602" },
    "bn": { "division": "ঢাকা", "district": "নরসিংদী", "thana": "নরসিংদী সদর", "suboffice": "নরসিংদী কলেজ", "postcode": "১৬০২" }
  },
  "1600": {
    "en": { "division": "Dhaka", "district": "Narsingdi", "thana": "Narsingdi Sadar", "suboffice": "Narsingdi Sadar", "postcode": "1600" },
    "bn": { "division": "ঢাকা", "district": "নরসিংদী", "thana": "নরসিংদী সদর", "suboffice": "নরসিংদী সদর", "postcode": "১৬০০" }
  },
  "1603": {
    "en": { "division": "Dhaka", "district": "Narsingdi", "thana": "Narsingdi Sadar", "suboffice": "Panchdona", "postcode": "1603" },
    "bn": { "division": "ঢাকা", "district": "নরসিংদী", "thana": "নরসিংদী সদর", "suboffice": "পাঁচদোনা", "postcode": "১৬০৩" }
  },
  "1601": {
    "en": { "division": "Dhaka", "district": "Narsingdi", "thana": "Narsingdi Sadar", "suboffice": "UMC Jute Mills", "postcode": "1601" },
    "bn": { "division": "ঢাকা", "district": "নরসিংদী", "thana": "নরসিংদী সদর", "suboffice": "UMC জুট মিলস", "postcode": "১৬০১" }
  },
  "1612": {
    "en": { "division": "Dhaka", "district": "Narsingdi", "thana": "Palash", "suboffice": "Char Sindhur", "postcode": "1612" },
    "bn": { "division": "ঢাকা", "district": "নরসিংদী", "thana": "পলাশ", "suboffice": "চরসিন্ধুর", "postcode": "১৬১২" }
  },
  "1613": {
    "en": { "division": "Dhaka", "district": "Narsingdi", "thana": "Palash", "suboffice": "Ghorashal", "postcode": "1613" },
    "bn": { "division": "ঢাকা", "district": "নরসিংদী", "thana": "পলাশ", "suboffice": "ঘোড়াশাল", "postcode": "১৬১৩" }
  },
  "1611": {
    "en": { "division": "Dhaka", "district": "Narsingdi", "thana": "Palash", "suboffice": "Sarkarkhana", "postcode": "1611" },
    "bn": { "division": "ঢাকা", "district": "নরসিংদী", "thana": "পলাশ", "suboffice": "ঘোড়াশাল ইউরিয়া ফ্যাক্টুরি", "postcode": "১৬১১" }
  },
  "1610": {
    "en": { "division": "Dhaka", "district": "Narsingdi", "thana": "Palash", "suboffice": "Palash", "postcode": "1610" },
    "bn": { "division": "ঢাকা", "district": "নরসিংদী", "thana": "পলাশ", "suboffice": "পলাশ", "postcode": "১৬১০" }
  },
  "1631": {
    "en": { "division": "Dhaka", "district": "Narsingdi", "thana": "Raypura", "suboffice": "Bazar Hasnabad", "postcode": "1631" },
    "bn": { "division": "ঢাকা", "district": "নরসিংদী", "thana": "রায়পুর", "suboffice": "বাজার হাসনাবাদ", "postcode": "১৬৩১" }
  },
  "1632": {
    "en": { "division": "Dhaka", "district": "Narsingdi", "thana": "Raypura", "suboffice": "Radhaganj bazar", "postcode": "1632" },
    "bn": { "division": "ঢাকা", "district": "নরসিংদী", "thana": "রায়পুর", "suboffice": "রাধাগঞ্জ বাজার", "postcode": "১৬৩২" }
  },
  "1630": {
    "en": { "division": "Dhaka", "district": "Narsingdi", "thana": "Raypura", "suboffice": "Raypura", "postcode": "1630" },
    "bn": { "division": "ঢাকা", "district": "নরসিংদী", "thana": "রায়পুর", "suboffice": "রায়পুর", "postcode": "১৬৩০" }
  },
  "1620": {
    "en": { "division": "Dhaka", "district": "Narsingdi", "thana": "Shibpur", "suboffice": "Shibpur", "postcode": "1620" },
    "bn": { "division": "ঢাকা", "district": "নরসিংদী", "thana": "শিবপুর", "suboffice": "শিবপুর", "postcode": "১৬২০" }
  },
  "7730": {
    "en": { "division": "Dhaka", "district": "Rajbari", "thana": "Baliakandi", "suboffice": "Baliakandi", "postcode": "7730" },
    "bn": { "division": "ঢাকা", "district": "রাজবাড়ী", "thana": "বালিয়াকান্দি", "suboffice": "বালিয়াকান্দি", "postcode": "৭৭৩০" }
  },
  "7731": {
    "en": { "division": "Dhaka", "district": "Rajbari", "thana": "Baliakandi", "suboffice": "Nalia", "postcode": "7731" },
    "bn": { "division": "ঢাকা", "district": "রাজবাড়ী", "thana": "বালিয়াকান্দি", "suboffice": "নালিয়া থেকে", "postcode": "৭৭৩১" }
  },
  "7723": {
    "en": { "division": "Dhaka", "district": "Rajbari", "thana": "Pangsha", "suboffice": "Mrigibazar", "postcode": "7723" },
    "bn": { "division": "ঢাকা", "district": "রাজবাড়ী", "thana": "পাংশা", "suboffice": "মৃগিবাজার", "postcode": "৭৭২৩" }
  },
  "7720": {
    "en": { "division": "Dhaka", "district": "Rajbari", "thana": "Pangsha", "suboffice": "Pangsha", "postcode": "7720" },
    "bn": { "division": "ঢাকা", "district": "রাজবাড়ী", "thana": "পাংশা", "suboffice": "পাংশা", "postcode": "৭৭۲۰" }
  },
  "7721": {
    "en": { "division": "Dhaka", "district": "Rajbari", "thana": "Pangsha", "suboffice": "Ramkol", "postcode": "7721" },
    "bn": { "division": "ঢাকা", "district": "রাজবাড়ী", "thana": "পাংশা", "suboffice": "রামকল", "postcode": "৭৭২১" }
  },
  "7722": {
    "en": { "division": "Dhaka", "district": "Rajbari", "thana": "Pangsha", "suboffice": "Ratandia", "postcode": "7722" },
    "bn": { "division": "ঢাকা", "district": "রাজবাড়ী", "thana": "পাংশা", "suboffice": "রতনদিয়া", "postcode": "৭৭২২" }
  },
  "7710": {
    "en": { "division": "Dhaka", "district": "Rajbari", "thana": "Rajbari Sadar", "suboffice": "Goalanda", "postcode": "7710" },
    "bn": { "division": "ঢাকা", "district": "রাজবাড়ী", "thana": "রাজবাড়ী সদর", "suboffice": "গোয়ালন্দ", "postcode": "৭৭১০" }
  },
  "7711": {
    "en": { "division": "Dhaka", "district": "Rajbari", "thana": "Rajbari Sadar", "suboffice": "Khankhanapur", "postcode": "7711" },
    "bn": { "division": "ঢাকা", "district": "রাজবাড়ী", "thana": "রাজবাড়ী সদর", "suboffice": "খনখনাপুর", "postcode": "৭৭১১" }
  },
  "7700": {
    "en": { "division": "Dhaka", "district": "Rajbari", "thana": "Rajbari Sadar", "suboffice": "Rajbari Sadar", "postcode": "7700" },
    "bn": { "division": "ঢাকা", "district": "রাজবাড়ী", "thana": "রাজবাড়ী সদর", "suboffice": "রাজবাড়ী সদর", "postcode": "৭৭০০" }
  },
  "8030": {
    "en": { "division": "Dhaka", "district": "Shariatpur", "thana": "Bhedorganj", "suboffice": "Bhedorganj", "postcode": "8030" },
    "bn": { "division": "ঢাকা", "district": "শরীয়তপুর", "thana": "ভেদোরগঞ্জ", "suboffice": "ভেদোরগঞ্জ", "postcode": "৮০৩০" }
  },
  "8040": {
    "en": { "division": "Dhaka", "district": "Shariatpur", "thana": "Damudhya", "suboffice": "Damudhya", "postcode": "8040" },
    "bn": { "division": "ঢাকা", "district": "শরীয়তপুর", "thana": "দামুধ্যা", "suboffice": "দামুধ্যা", "postcode": "৮০৪০" }
  },
  "8050": {
    "en": { "division": "Dhaka", "district": "Shariatpur", "thana": "Gosairhat", "suboffice": "Gosairhat", "postcode": "8050" },
    "bn": { "division": "ঢাকা", "district": "শরীয়তপুর", "thana": "গোসাইরহাট", "suboffice": "গোসাইরহাট", "postcode": "৮০৫০" }
  },
  "8010": {
    "en": { "division": "Dhaka", "district": "Shariatpur", "thana": "Jajira", "suboffice": "Jajira", "postcode": "8010" },
    "bn": { "division": "ঢাকা", "district": "শরীয়তপুর", "thana": "জাজিরা", "suboffice": "জাজিরা", "postcode": "৮০১০" }
  },
  "8021": {
    "en": { "division": "Dhaka", "district": "Shariatpur", "thana": "Naria", "suboffice": "Bhozeshwar", "postcode": "8021" },
    "bn": { "division": "ঢাকা", "district": "শরীয়তপুর", "thana": "নড়িয়া", "suboffice": "ভোজেশ্বর", "postcode": "৮০২১" }
  },
  "8022": {
    "en": { "division": "Dhaka", "district": "Shariatpur", "thana": "Naria", "suboffice": "Gharisar", "postcode": "8022" },
    "bn": { "division": "ঢাকা", "district": "শরীয়তপুর", "thana": "নড়িয়া", "suboffice": "ঘারিসার", "postcode": "৮০২২" }
  },
  "8024": {
    "en": { "division": "Dhaka", "district": "Shariatpur", "thana": "Naria", "suboffice": "Kartikpur", "postcode": "8024" },
    "bn": { "division": "ঢাকা", "district": "শরীয়তপুর", "thana": "নড়িয়া", "suboffice": "কার্তিকপুর", "postcode": "৮০২৪" }
  },
  "8020": {
    "en": { "division": "Dhaka", "district": "Shariatpur", "thana": "Naria", "suboffice": "Naria", "postcode": "8020" },
    "bn": { "division": "ঢাকা", "district": "শরীয়তপুর", "thana": "নড়িয়া", "suboffice": "নড়িয়া", "postcode": "৮০২০" }
  },
  "8023": {
    "en": { "division": "Dhaka", "district": "Shariatpur", "thana": "Naria", "suboffice": "Upshi", "postcode": "8023" },
    "bn": { "division": "ঢাকা", "district": "শরীয়তপুর", "thana": "নড়িয়া", "suboffice": "উপশি", "postcode": "৮০২৩" }
  },
  "8001": {
    "en": { "division": "Dhaka", "district": "Shariatpur", "thana": "Shariatpur Sadar", "suboffice": "Angaria", "postcode": "8001" },
    "bn": { "division": "ঢাকা", "district": "শরীয়তপুর", "thana": "শরীয়তপুর সদর", "suboffice": "আঙ্গারিয়া", "postcode": "৮০০১" }
  },
  "8002": {
    "en": { "division": "Dhaka", "district": "Shariatpur", "thana": "Shariatpur Sadar", "suboffice": "Chikandi", "postcode": "8002" },
    "bn": { "division": "ঢাকা", "district": "শরীয়তপুর", "thana": "শরীয়তপুর সদর", "suboffice": "চিকান্দি", "postcode": "৮০০২" }
  },
  "8000": {
    "en": { "division": "Dhaka", "district": "Shariatpur", "thana": "Shariatpur Sadar", "suboffice": "Shariatpur Sadar", "postcode": "8000" },
    "bn": { "division": "ঢাকা", "district": "শরীয়তপুর", "thana": "শরীয়তপুর সদর", "suboffice": "শরীয়তপুর সদর", "postcode": "৮০০০" }
  },
  "1920": {
    "en": { "division": "Dhaka", "district": "Tangail", "thana": "Basail", "suboffice": "Basail", "postcode": "1920" },
    "bn": { "division": "ঢাকা", "district": "টাঙ্গাইল", "thana": "বাসাইল", "suboffice": "বাসাইল", "postcode": "১৯২০" }
  },
  "1960": {
    "en": { "division": "Dhaka", "district": "Tangail", "thana": "Bhuapur", "suboffice": "Bhuapur", "postcode": "1960" },
    "bn": { "division": "ঢাকা", "district": "টাঙ্গাইল", "thana": "ভূঞাপুর", "suboffice": "ভূঞাপুর", "postcode": "১৯৬০" }
  },
  "1910": {
    "en": { "division": "Dhaka", "district": "Tangail", "thana": "Delduar", "suboffice": "Delduar", "postcode": "1910" },
    "bn": { "division": "ঢাকা", "district": "টাঙ্গাইল", "thana": "দেলদুয়ার", "suboffice": "দেলদুয়ার", "postcode": "১৯১০" }
  },
  "1913": {
    "en": { "division": "Dhaka", "district": "Tangail", "thana": "Delduar", "suboffice": "Elasin", "postcode": "1913" },
    "bn": { "division": "ঢাকা", "district": "টাঙ্গাইল", "thana": "দেলদুয়ার", "suboffice": "ইলাসিন", "postcode": "১৯১৩" }
  },
  "1914": {
    "en": { "division": "Dhaka", "district": "Tangail", "thana": "Delduar", "suboffice": "Hinga Nagar", "postcode": "1914" },
    "bn": { "division": "ঢাকা", "district": "টাঙ্গাইল", "thana": "দেলদুয়ার", "suboffice": "হিংগা নগর", "postcode": "১৯১৪" }
  },
  "1911": {
    "en": { "division": "Dhaka", "district": "Tangail", "thana": "Delduar", "suboffice": "Jangalia", "postcode": "1911" },
    "bn": { "division": "ঢাকা", "district": "টাঙ্গাইল", "thana": "দেলদুয়ার", "suboffice": "জাঙ্গালিয়া", "postcode": "১৯১১" }
  },
  "1915": {
    "en": { "division": "Dhaka", "district": "Tangail", "thana": "Delduar", "suboffice": "Lowhati", "postcode": "1915" },
    "bn": { "division": "ঢাকা", "district": "টাঙ্গাইল", "thana": "দেলদুয়ার", "suboffice": "লউহাটি", "postcode": "১৯১৫" }
  },
  "1912": {
    "en": { "division": "Dhaka", "district": "Tangail", "thana": "Delduar", "suboffice": "Patharail", "postcode": "1912" },
    "bn": { "division": "ঢাকা", "district": "টাঙ্গাইল", "thana": "দেলদুয়ার", "suboffice": "পাঠারাইল", "postcode": "১৯১২" }
  },
  "1982": {
    "en": { "division": "Dhaka", "district": "Tangail", "thana": "Ghatail", "suboffice": "D. Pakutia", "postcode": "1982" },
    "bn": { "division": "ঢাকা", "district": "টাঙ্গাইল", "thana": "ঘাটাইল", "suboffice": "ডি পাকুটিয়া", "postcode": "১৯৮২" }
  },
  "1983": {
    "en": { "division": "Dhaka", "district": "Tangail", "thana": "Ghatail", "suboffice": "Dhalapara", "postcode": "1983" },
    "bn": { "division": "ঢাকা", "district": "টাঙ্গাইল", "thana": "ঘাটাইল", "suboffice": "ধলাপাড়া", "postcode": "১৯৮৩" }
  },
  "1980": {
    "en": { "division": "Dhaka", "district": "Tangail", "thana": "Ghatail", "suboffice": "Ghatial", "postcode": "1980" },
    "bn": { "division": "ঢাকা", "district": "টাঙ্গাইল", "thana": "ঘাটাইল", "suboffice": "ঘাটাইল", "postcode": "১৯৮০" }
  },
  "1984": {
    "en": { "division": "Dhaka", "district": "Tangail", "thana": "Ghatail", "suboffice": "Lohani", "postcode": "1984" },
    "bn": { "division": "ঢাকা", "district": "টাঙ্গাইল", "thana": "ঘাটাইল", "suboffice": "লোহানী", "postcode": "১৯৮৪" }
  },
  "1981": {
    "en": { "division": "Dhaka", "district": "Tangail", "thana": "Ghatail", "suboffice": "Zahidganj", "postcode": "1981" },
    "bn": { "division": "ঢাকা", "district": "টাঙ্গাইল", "thana": "ঘাটাইল", "suboffice": "জাহিদগঞ্জ", "postcode": "১৯৮১" }
  },
  "1990": {
    "en": { "division": "Dhaka", "district": "Tangail", "thana": "Gopalpur", "suboffice": "Gopalpur", "postcode": "1990" },
    "bn": { "division": "ঢাকা", "district": "টাঙ্গাইল", "thana": "গোপালপুর", "suboffice": "গোপালপুর", "postcode": "১৯৯০" }
  },
  "1992": {
    "en": { "division": "Dhaka", "district": "Tangail", "thana": "Gopalpur", "suboffice": "Hemnagar", "postcode": "1992" },
    "bn": { "division": "ঢাকা", "district": "টাঙ্গাইল", "thana": "গোপালপুর", "suboffice": "হেমনগর", "postcode": "১৯৯২" }
  },
  "1991": {
    "en": { "division": "Dhaka", "district": "Tangail", "thana": "Gopalpur", "suboffice": "Chatutia", "postcode": "1991" },
    "bn": { "division": "ঢাকা", "district": "টাঙ্গাইল", "thana": "গোপালপুর", "suboffice": "চাতুতিয়া", "postcode": "১৯৯১" }
  },
  "1973": {
    "en": { "division": "Dhaka", "district": "Tangail", "thana": "Kalihati", "suboffice": "Ballabazar", "postcode": "1973" },
    "bn": { "division": "ঢাকা", "district": "টাঙ্গাইল", "thana": "কালিহাতী", "suboffice": "বাল্লাবাজার", "postcode": "১৯৭৩" }
  },
  "1974": {
    "en": { "division": "Dhaka", "district": "Tangail", "thana": "Kalihati", "suboffice": "Elinga", "postcode": "1974" },
    "bn": { "division": "ঢাকা", "district": "টাঙ্গাইল", "thana": "কালিহাতী", "suboffice": "ইলিংগা", "postcode": "১৯৭৪" }
  },
  "1970": {
    "en": { "division": "Dhaka", "district": "Tangail", "thana": "Kalihati", "suboffice": "Kalihati", "postcode": "1970" },
    "bn": { "division": "ঢাকা", "district": "টাঙ্গাইল", "thana": "কালিহাতী", "suboffice": "কালিহাতী", "postcode": "১৯৭০" }
  },
  "1977": {
    "en": { "division": "Dhaka", "district": "Tangail", "thana": "Kalihati", "suboffice": "Nagarbari", "postcode": "1977" },
    "bn": { "division": "ঢাকা", "district": "টাঙ্গাইল", "thana": "কালিহাতী", "suboffice": "নগরবাড়ী", "postcode": "১৯৭৭" }
  },
  "1976": {
    "en": { "division": "Dhaka", "district": "Tangail", "thana": "Kalihati", "suboffice": "Nagarbari SO", "postcode": "1976" },
    "bn": { "division": "ঢাকা", "district": "টাঙ্গাইল", "thana": "কালিহাতী", "suboffice": "নগরবাড়ী তাই", "postcode": "১৯৭৬" }
  },
  "1972": {
    "en": { "division": "Dhaka", "district": "Tangail", "thana": "Kalihati", "suboffice": "Nagbari", "postcode": "1972" },
    "bn": { "division": "ঢাকা", "district": "টাঙ্গাইল", "thana": "কালিহাতী", "suboffice": "নাগবাড়ি", "postcode": "১৯৭২" }
  },
  "1975": {
    "en": { "division": "Dhaka", "district": "Tangail", "thana": "Kalihati", "suboffice": "Palisha", "postcode": "1975" },
    "bn": { "division": "ঢাকা", "district": "টাঙ্গাইল", "thana": "কালিহাতী", "suboffice": "পালিশা", "postcode": "১৯৭৫" }
  },
  "1971": {
    "en": { "division": "Dhaka", "district": "Tangail", "thana": "Kalihati", "suboffice": "Rajafair", "postcode": "1971" },
    "bn": { "division": "ঢাকা", "district": "টাঙ্গাইল", "thana": "কালিহাতী", "suboffice": "রাজাফাইর", "postcode": "১৯৭১" }
  },
  "1930": {
    "en": { "division": "Dhaka", "district": "Tangail", "thana": "Kashkaolia", "suboffice": "Kashkawlia", "postcode": "1930" },
    "bn": { "division": "ঢাকা", "district": "টাঙ্গাইল", "thana": "কাশকাওলিয়া", "suboffice": "কাশকাওলিয়া", "postcode": "১৯৩০" }
  },
  "1997": {
    "en": { "division": "Dhaka", "district": "Tangail", "thana": "Madhupur", "suboffice":