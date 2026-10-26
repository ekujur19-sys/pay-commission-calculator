/* City data shared by the salary calculator (index.html) and the HRA and TA city finder (city-finder.js).
   Edit the lists here only; both pages pick up the change. */

/* HRA city classification (7th CPC, Ministry of Finance list). Cities not listed are class Z. */
const CITIES = {
  X: ["Ahmedabad","Bengaluru (Bangalore)","Chennai","Delhi","New Delhi","Hyderabad","Secunderabad","Kolkata","Howrah","Mumbai","Navi Mumbai","Thane","Pune",
      "Noida","Greater Noida","Ghaziabad","Gurugram (Gurgaon)","Faridabad"],
  Y: ["Agra","Ajmer","Aligarh","Amravati","Amritsar","Anand","Asansol","Aurangabad","Bareilly","Belagavi (Belgaum)","Bhavnagar","Bhilai","Bhiwandi","Bhopal",
      "Bhubaneswar","Bikaner","Bilaspur","Bokaro Steel City","Chandigarh","Coimbatore","Cuttack","Dehradun","Dhanbad","Durg","Durgapur","Erode","Firozabad",
      "Gandhinagar","Gorakhpur","Guntur","Guwahati","Gwalior","Hamirpur","Hubballi-Dharwad","Indore","Jabalpur","Jaipur","Jalandhar","Jalgaon","Jammu","Jamnagar",
      "Jamshedpur","Jhansi","Jodhpur","Kakinada","Kalaburagi (Gulbarga)","Kannur","Kanpur","Karnal","Kochi (Ernakulam)","Kolhapur","Kollam","Kota","Kottayam",
      "Kozhikode","Kurnool","Lucknow","Ludhiana","Madurai","Malappuram","Malegaon","Mangaluru (Mangalore)","Mathura","Meerut","Moradabad","Mysuru (Mysore)",
      "Nagpur","Nanded","Nashik","Nellore","Palakkad","Patna","Puducherry","Prayagraj (Allahabad)","Purulia","Raipur","Rajahmundry","Rajkot","Ranchi","Ratlam",
      "Rourkela","Saharanpur","Salem","Sangli","Shimla","Siliguri","Solapur","Srinagar","Surat","Thanjavur","Thiruvananthapuram","Thrissur","Tiruchirappalli",
      "Tirunelveli","Tiruppur","Tiruvannamalai","Ujjain","Vadodara","Varanasi","Vasai-Virar","Vellore","Vijayapura (Bijapur)","Vijayawada","Visakhapatnam","Warangal"]
};

/* Transport allowance: the 19 higher-rate cities (DoE OM No. 21/5/2017-E.II(B), 7 July 2017), plus parts of those
   urban areas that the HRA list names separately. Not the same as the HRA classes. */
const TA_HIGH = new Set(["ahmedabad","bengaluru (bangalore)","chennai","coimbatore","delhi","new delhi","ghaziabad","mumbai","navi mumbai",
  "thane","hyderabad","secunderabad","indore","jaipur","kanpur","kochi (ernakulam)","kolkata","howrah","kozhikode","lucknow","nagpur","patna","pune","surat"]);

/* 50% HRA exemption limit in the old tax regime (Income-tax Rules, 2026, from 1 April 2026); other cities 40% */
const HRA_50_CITIES = ["delhi", "new delhi", "mumbai", "kolkata", "chennai", "bengaluru (bangalore)", "hyderabad", "pune", "ahmedabad"];

const cityClass = {};
Object.entries(CITIES).forEach(([cls, list]) => list.forEach(c => cityClass[c.toLowerCase()] = cls));
const CITY_NAMES = [...CITIES.X, ...CITIES.Y].sort();

/* "pune", "Bangalore", "Bengaluru (Bangalore)" → { name, cls }; null if the city is not on the X or Y list */
const findCity = q => {
  q = String(q || "").trim().toLowerCase(); if (!q) return null;
  const key = Object.keys(cityClass).find(k => k === q || k.split(" (")[0] === q || k.includes("(" + q + ")"));
  return key ? { name: CITY_NAMES.find(c => c.toLowerCase() === key), cls: cityClass[key] } : null;
};
