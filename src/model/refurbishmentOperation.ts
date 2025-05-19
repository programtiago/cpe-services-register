import { Cpe } from "./cpe";
import { Service } from "./service";
import { User } from "./user";

export interface RefurbishmentOperation {
    id: number,
    cpe: Cpe,
    dateHourOperation: Date,
    user: User | null,
    servicesApplied: Service[]
}