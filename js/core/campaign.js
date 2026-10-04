import {createState} from './state.js';
export function createCampaignState(identity) {
 return {...createState(identity),currentNode:`campaign_${identity}_start`,ruleset:'campaign-v1',campaign:{decisions:0},resources:{kit:8,work:0,proof:0,care:0,chapterWork:0,chapterProof:0}};
}
