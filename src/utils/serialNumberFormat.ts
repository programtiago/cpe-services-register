interface SerialNumberFormat {
    prefix: string[];
    length: number[];
}

export const CPE_SN_FORMATS: {[key: string]: SerialNumberFormat } = {
    'CPE A': { prefix: ['CA', 'ca'], length: [13]},
    'CPE B': { prefix: ['CB', 'cb'], length: [13]},
    'CPE C': { prefix: ['CC', 'cc'], length: [13]}
}