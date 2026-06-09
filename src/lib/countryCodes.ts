/**
 * Comprehensive country code mapping for flagcdn.com
 * Covers all 48 qualified teams for the 2026 FIFA World Cup
 * plus additional countries that may appear in the data.
 */
export const COUNTRY_CODES: Record<string, string> = {
  // Group A
  "Mexico": "mx",
  "South Africa": "za",
  "France": "fr",
  "Colombia": "co",

  // Group B
  "USA": "us",
  "Bolivia": "bo",
  "England": "gb-eng",
  "Japan": "jp",

  // Group C
  "Brazil": "br",
  "Morocco": "ma",
  "Argentina": "ar",
  "Cameroon": "cm",

  // Group D
  "Canada": "ca",
  "Australia": "au",
  "Germany": "de",
  "Uruguay": "uy",

  // Group E
  "Denmark": "dk",
  "Netherlands": "nl",
  "Nigeria": "ng",
  "Spain": "es",

  // Group F
  "Belgium": "be",
  "Ecuador": "ec",
  "Portugal": "pt",
  "South Korea": "kr",

  // Group G
  "Croatia": "hr",
  "Ghana": "gh",
  "Italy": "it",
  "Côte d'Ivoire": "ci",
  "Ivory Coast": "ci",

  // Group H
  "Iran": "ir",
  "Peru": "pe",
  "Serbia": "rs",
  "Switzerland": "ch",

  // Group I
  "Chile": "cl",
  "Poland": "pl",
  "Saudi Arabia": "sa",
  "Tunisia": "tn",

  // Group J
  "Algeria": "dz",
  "Paraguay": "py",
  "Qatar": "qa",
  "Wales": "gb-wls",

  // Group K
  "Egypt": "eg",
  "Senegal": "sn",
  "Sweden": "se",
  "Ukraine": "ua",

  // Group L
  "Austria": "at",
  "China PR": "cn",
  "China": "cn",
  "Congo DR": "cd",
  "DR Congo": "cd",
  "Turkey": "tr",
  "Türkiye": "tr",

  // Additional / aliases
  "United States": "us",
  "Korea Republic": "kr",
  "Costa Rica": "cr",
  "Scotland": "gb-sct",
  "Republic of Ireland": "ie",
  "Northern Ireland": "gb-nir",
  "Czech Republic": "cz",
  "Czechia": "cz",
  "Bosnia and Herzegovina": "ba",
  "North Macedonia": "mk",
  "New Zealand": "nz",
  "Jamaica": "jm",
  "Honduras": "hn",
  "Panama": "pa",
  "Venezuela": "ve",
  "Uzbekistan": "uz",
  "Indonesia": "id",
  "Bahrain": "bh",
  "Iraq": "iq",
  "Oman": "om",
  "Palestine": "ps",
  "Jordan": "jo",
  "Syria": "sy",
  "Lebanon": "lb",
  "UAE": "ae",
  "United Arab Emirates": "ae",
  "Romania": "ro",
  "Hungary": "hu",
  "Slovakia": "sk",
  "Slovenia": "si",
  "Finland": "fi",
  "Norway": "no",
  "Iceland": "is",
  "Greece": "gr",
  "Georgia": "ge",
  "Albania": "al",
  "Montenegro": "me",
  "Bulgaria": "bg",
  "Cameroun": "cm",
  "Mali": "ml",
  "Congo": "cg",
  "Tanzania": "tz",
  "Kenya": "ke",
  "Zimbabwe": "zw",
  "Zambia": "zm",
  "Mozambique": "mz",
  "Angola": "ao",
  "Cape Verde": "cv",
  "Burkina Faso": "bf",
  "Guinea": "gn",
  "Togo": "tg",
  "Benin": "bj",
};

export function getFlagCode(teamName: string): string {
  return COUNTRY_CODES[teamName] || 'xx';
}

export function getFlagUrl(teamName: string, width = 48, height = 36): string {
  const code = getFlagCode(teamName);
  if (code === 'xx') return '';
  return `https://flagcdn.com/${width}x${height}/${code}.png`;
}
