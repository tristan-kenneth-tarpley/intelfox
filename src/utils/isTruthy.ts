type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T; // from lodash

const isTruthy = <T>(value: T): value is Truthy<T> => !!value;

export default isTruthy;
