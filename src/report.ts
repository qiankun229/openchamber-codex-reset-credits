export const BUG_REPORT_URL = 'https://github.com/sofianbll/openchamber-codex-reset-credits/issues/new?template=bug_report.md';

const ERROR_CODES = new Set([
  'SIGN_IN_REQUIRED', 'ACCOUNT_ID_MISSING', 'NOT_GRANTED', 'NO_SERVICE', 'DISABLED', 'DENIED',
  'SERVICE_FAILED', 'HOST_UNAVAILABLE', 'HOST_TIMEOUT', 'HOST_REJECTED', 'DISCONNECTED',
  'BAD_PATH', 'NO_INTEGRATION', 'RESPONSE_TOO_LARGE', 'UNSUPPORTED',
  'SQLITE_MISSING', 'SQLITE_UNAVAILABLE', 'DATABASE_UNAVAILABLE', 'DATABASE_SCHEMA',
  'RATE_LIMITED', 'NOT_SUPPORTED', 'ACCESS_DENIED', 'CODEX_UNREACHABLE', 'CODEX_ERROR',
  'INVALID_RESPONSE', 'CREDIT_UNAVAILABLE', 'ACCOUNT_NOT_FOUND', 'INVALID_REQUEST',
  'UNAUTHORIZED', 'NOT_FOUND', 'SERVICE_ERROR', 'REQUEST_FAILED', 'REDEMPTION_UNKNOWN', 'ALREADY_REQUESTED',
]);

export function reportErrorCode(value: unknown): string {
  return typeof value === 'string' && ERROR_CODES.has(value) ? value : 'unknown';
}

export function reportDiagnostic(input: { surface: unknown; view: unknown; language: unknown; error: unknown }): string {
  const surface = input.surface === 'status' ? 'status' : 'panel';
  const view = input.view === 'tickets' || input.view === 'mini' ? input.view : 'compact';
  const language = typeof input.language === 'string' && input.language.toLowerCase().startsWith('fr') ? 'fr' : 'en';
  return `surface: ${surface}\nview: ${view}\nlanguage: ${language}\nerror: ${reportErrorCode(input.error)}`;
}
