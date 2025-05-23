// Define regex patterns outside component to avoid recreation on each render
const WEATHER_REGEX = /@@<WEATHER_DATA>([\s\S]*?)<\/WEATHER_DATA>/
const AGRI_PRICE_REGEX = /@@<AGRI_PRICE_DATA>([\s\S]*?)<\/AGRI_PRICE_DATA>/
const FARMING_TECHNIQUE_REGEX = /@@<FARMING_TECHNIQUE>([\s\S]*?)<\/FARMING_TECHNIQUE>/
const ARGI_NEWS_REGEX = /@@<ARGI_NEWS>([\s\S]*?)<\/ARGI_NEWS>/
const PLANT_DOCTOR_REGEX = /@@<PLANT_DOCTOR>([\s\S]*?)<\/PLANT_DOCTOR>/
const STATUS_REGEX = /@@<STATUS>([\s\S]*?)<\/STATUS>/
const LOADING_REGEX = /@@<loading>(.*?)<\/loading>/

export { WEATHER_REGEX, AGRI_PRICE_REGEX, FARMING_TECHNIQUE_REGEX, ARGI_NEWS_REGEX, PLANT_DOCTOR_REGEX, STATUS_REGEX, LOADING_REGEX }
