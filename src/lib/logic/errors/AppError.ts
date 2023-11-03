import assert from 'assert';
import IntelFoxError from './IntelFoxError';

interface ErrorConfig {
  status: number;
  message: string;
  alert?: boolean;
  publicErrorCode?: string;
  externalReference?: string;
}

export type ErrorKeys = keyof typeof ERROR_SCHEMA;

// Map from app error enum values to http status codes:
const ERROR_SCHEMA = {
  // Generic Errors:
  BadArgument: { status: 400, message: 'Invalid argument provided' },
  BadRequest: { status: 400, message: 'Request is malformed' },
  BadMethod: { status: 405, message: 'Request is not allowed' },
  OpenAIModerationError: {
    status: 400,
    message: 'OpenAI moderation error',
    publicErrorCode: 'bad_request',
    externalReference: '',
  },
  OpenAITokenLimitError: {
    status: 400,
    message: 'OpenAI token limit reached',
    publicErrorCode: 'bad_request',
    externalReference: '',
  },
  OpenAIRateLimitError: {
    status: 429,
    message: 'OpenAI rate limit reached',
    publicErrorCode: 'internal_error',
    externalReference: '',
  },
  OpenAIError: {
    status: 500,
    message: 'OpenAI error',
    publicErrorCode: 'internal_error',
    externalReference: '',
  },
} as const;

export default class AppError extends IntelFoxError {
  // Simple field to detect if this is an app error:
  isAppError: true;

  publicErrorCode: string = '';

  externalReference: string = '';

  constructor(enumCode: ErrorKeys, extras?: string | { [key: string | 'message']: any }) {
    assert(
      Object.hasOwn(ERROR_SCHEMA, enumCode),
      `Invalid error enum: ${enumCode}`,
    );

    // Extra messages are pushed to the end of the main message:
    const extraMsg: string = typeof extras === 'string' ? '' : extras?.message ?? '';

    const {
      status,
      message: defaultMsg,
      alert,
      publicErrorCode,
      externalReference,
    } = ERROR_SCHEMA[enumCode] as ErrorConfig;

    const message = extraMsg ? `${defaultMsg}: ${extraMsg}` : defaultMsg;

    super(message, `${enumCode}Error`, status);

    this.publicErrorCode = publicErrorCode ?? '';
    this.externalReference = externalReference || '';

    this.isAppError = true;

    // By default, skip alerts because `alert` will be `undefined` unless it's
    // explicitly set to `true`.
    this.skipAlert = alert !== true;
  }
}
