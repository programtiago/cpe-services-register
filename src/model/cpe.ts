import { CpeData } from "./cpeData";
import { Service } from "./service";

export interface Cpe {
    id: number,
    sap: string, //article number
    design: string, //description article
    cpeData: CpeData[],
    allowedServices: Service[]
} 