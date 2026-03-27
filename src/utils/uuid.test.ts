import isValidUUID from './uuid';

describe('isValidUUID', () => {
  it('returns true for a valid v4 UUID (lowercase)', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    expect(isValidUUID(uuid)).toBe(true);
  });

  it('returns true for a valid v1 UUID (variant 8)', () => {
    const uuid = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
    expect(isValidUUID(uuid)).toBe(true);
  });

  it('returns true for a valid v5 UUID (uppercase hex)', () => {
    const uuid = '4F12ED3B-8C3A-5E2A-B0C1-1234567890AB';
    expect(isValidUUID(uuid)).toBe(true);
  });

  it('returns false for UUID missing hyphens', () => {
    const uuid = '550e8400e29b41d4a716446655440000';
    expect(isValidUUID(uuid)).toBe(false);
  });

  it('returns false for UUID with invalid version digit (0)', () => {
    const uuid = '550e8400-e29b-01d4-a716-446655440000';
    expect(isValidUUID(uuid)).toBe(false);
  });

  it('returns false for UUID with invalid variant (7)', () => {
    const uuid = '550e8400-e29b-41d4-7716-446655440000';
    expect(isValidUUID(uuid)).toBe(false);
  });

  it('returns false for UUID that is too short', () => {
    const uuid = '550e8400-e29b-41d4-a716-44665544';
    expect(isValidUUID(uuid)).toBe(false);
  });

  it('returns false for UUID with non-hex characters', () => {
    const uuid = 'g50e8400-e29b-41d4-a716-446655440000'; // 'g' is not a hex char
    expect(isValidUUID(uuid)).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(isValidUUID('')).toBe(false);
  });

  it('returns false for a valid UUID with trailing whitespace', () => {
    const uuidWithTrailing = '550e8400-e29b-41d4-a716-446655440000 ';
    expect(isValidUUID(uuidWithTrailing)).toBe(false);
  });

  it('returns false for a valid UUID with leading whitespace', () => {
    const uuidWithLeading = ' 550e8400-e29b-41d4-a716-446655440000';
    expect(isValidUUID(uuidWithLeading)).toBe(false);
  });

  it('returns false for a valid UUID wrapped in curly braces', () => {
    const uuidWithBraces = '{550e8400-e29b-41d4-a716-446655440000}';
    expect(isValidUUID(uuidWithBraces)).toBe(false);
  });
});
