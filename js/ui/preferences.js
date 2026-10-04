import { readJSON, writeJSON } from '../core/save-store.js';
export const DEFAULT_PREFERENCES = { speed:30, fontSize:20, reducedMotion:false };
export function normalizePreferences(value, reducedMotion = false) {
    return {
        speed: [0,15,30,60].includes(value?.speed) ? value.speed : 30,
        fontSize: [18,20,24].includes(value?.fontSize) ? value.fontSize : 20,
        reducedMotion: typeof value?.reducedMotion === 'boolean' ? value.reducedMotion : reducedMotion
    };
}
export function readPreferences(provider, reducedMotion = false) {
    const result = readJSON('nw_preferences', provider);
    return { ...result, value:normalizePreferences(result.value, reducedMotion) };
}
export function savePreferences(value, provider) {
    return writeJSON('nw_preferences', normalizePreferences(value), provider);
}
