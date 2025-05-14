import { CpeData } from "./cpeData";

export interface Cpe {
    id: number,
    sap: string, //article number
    design: string, //description article
    cpeData: CpeData[]
} 