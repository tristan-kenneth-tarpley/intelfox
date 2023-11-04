const errorCodes = [
  { code: 200, name: 'OK' },
  { code: 400, name: 'Bad Request' },
  { code: 401, name: 'Unauthorized' },
  { code: 403, name: 'Forbidden' },
  { code: 410, name: 'Gone' },
  { code: 500, name: 'Internal Server Error' },
] as const;

const codes = errorCodes.map((x) => x.code);
const names = errorCodes.map((x) => x.name);

type Code = typeof codes[number];
type Name = typeof names[number];

const makeActionError = ({
  code,
  name,
  message,
}: {
  code: Code,
  name: Name,
  message: string,
}) => {
  return {
    code,
    name,
    message,
  };
};

export default makeActionError;
