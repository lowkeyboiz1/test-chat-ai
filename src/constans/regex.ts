// Define regex patterns outside component to avoid recreation on each render
const WEATHER_REGEX = /@@<WEATHER_DATA>([\s\S]*?)<\/WEATHER_DATA>/
const AGRI_PRICE_REGEX = /@@<AGRI_PRICE_DATA>([\s\S]*?)<\/AGRI_PRICE_DATA>/
const FARMING_TECHNIQUE_REGEX = /@@<FARMING_TECHNIQUE>([\s\S]*?)<\/FARMING_TECHNIQUE>/

export { WEATHER_REGEX, AGRI_PRICE_REGEX, FARMING_TECHNIQUE_REGEX }
