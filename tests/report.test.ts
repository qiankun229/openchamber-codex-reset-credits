import { expect, test } from 'bun:test';
import { BUG_REPORT_URL, reportDiagnostic, reportErrorCode } from '../src/report.ts';

test('report diagnostics include only approved fields, never arbitrary errors or account data', () => {
  const input = {
    surface: 'panel', view: 'tickets', language: 'fr', error: 'SYNTHETIC_SECRET_TOKEN',
    label: 'Synthetic private account', id: 'synthetic-private-id', credits: [{ id: 'synthetic-credit' }],
    fetchedAt: '2026-10-28T10:00:00Z', path: '/synthetic/private/opencode.db',
    message: 'Synthetic private response', token: 'synthetic-secret-token', snapshot: { accounts: ['synthetic-account'] },
  };
  expect(reportDiagnostic(input)).toBe('surface: panel\nview: tickets\nlanguage: fr\nerror: unknown');
});

test('report diagnostics normalize the UI locale and never interpolate invalid context values', () => {
  expect(reportDiagnostic({ surface: 'status', view: 'mini', language: 'fr-FR', error: 'SQLITE_UNAVAILABLE' }))
    .toBe('surface: status\nview: mini\nlanguage: fr\nerror: SQLITE_UNAVAILABLE');
  expect(reportDiagnostic({ surface: '/synthetic/private', view: 'synthetic-secret', language: { token: 'synthetic' }, error: { code: 'DATABASE_SCHEMA' } }))
    .toBe('surface: panel\nview: compact\nlanguage: en\nerror: unknown');
});

test('report error codes use an exact allowlist, not a code-shaped regex', () => {
  for (const code of ['SQLITE_MISSING', 'DATABASE_UNAVAILABLE', 'DATABASE_SCHEMA', 'HOST_UNAVAILABLE', 'NOT_GRANTED', 'REDEMPTION_UNKNOWN', 'ALREADY_REQUESTED']) {
    expect(reportErrorCode(code)).toBe(code);
  }
  for (const code of ['SYNTHETIC_TOKEN', 'DATABASE_SYNTHETIC_SECRET', 'SERVICE_SYNTHETIC_SECRET', 'SQLITE_UNAVAILABLE\nsynthetic-private', 'synthetic_unverified_code', null]) {
    expect(reportErrorCode(code)).toBe('unknown');
  }
  expect(BUG_REPORT_URL).toBe('https://github.com/sofianbll/openchamber-codex-reset-credits/issues/new?template=bug_report.md');
  expect([...new URL(BUG_REPORT_URL).searchParams.keys()]).toEqual(['template']);
});
