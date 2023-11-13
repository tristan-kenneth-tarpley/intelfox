const errorCodes = [
  { code: 200, name: 'OK' },
  { code: 400, name: 'Bad Request' },
  { code: 401, name: 'Unauthorized' },
  { code: 403, name: 'Forbidden' },
  { code: 410, name: 'Gone' },
  { code: 500, name: 'Internal Server Error' },
] as const;

const errorNamesByCode = errorCodes.reduce((acc, { code, name }) => {
  acc[code] = name;
  return acc;
}, {} as Record<number, string>);

const codes = errorCodes.map((x) => x.code);

type Code = typeof codes[number];

const makeRequestError = ({
  code,
  message,
  extra,
}: {
  code: Code,
  message: string,
  extra?: any,
}) => {
  return {
    code,
    name: errorNamesByCode[code],
    message,
    ...extra,
  };
};

export default makeRequestError;
