export default class IntelFoxError extends Error {
  code?: number;

  skipAlert?: boolean;

  statusCode: number;

  meta?: any;

  raw?: Array<string>;

  constructor(message: string, name: string, statusCode: number) {
    super(message);
    this.message = message;
    this.name = name;
    this.statusCode = statusCode;
  }
}
