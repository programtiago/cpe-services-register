//function generic utility to guarantee that the value received will be treated always as an array
// since panel-class from snackbar.config accepts an array
//source - https://stackoverflow.com/questions/61969174/angular-material-snackbar-configuration-with-custom-panelclass-configuration-for
export const coerceToArray = <T>(value: T | T[]): T[] => (
    Array.isArray(value)
    ? value
    : [value]
)