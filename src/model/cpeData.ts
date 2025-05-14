export interface CpeData{
    sn: string,
    ean: string,
    mac: string,
    status?: StatusCpe, //received, dispatched, repaired
    testStatus: StatusTestCpe, //TEST_OK, TEST_NOK
    dateHourTest: Date | null //2025-04-22T12:10:54Z
    receptionId: string //reception Id from ERP
}