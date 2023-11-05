import isTruthy from './isTruthy';

const splitStringOnCommas = (string: string) => string.split(/,\s*|\s*,\s*/).filter(isTruthy);

export default splitStringOnCommas;
