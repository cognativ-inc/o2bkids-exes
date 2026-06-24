/**
 * Exercise 1 — Ledger Balance  (CANDIDATE STARTER)
 * Run the tests:  npx ts-node interview-exercises/exercise1.starter.ts
 *
 * In our system every family has a "ledger": a chronological list of items. Each item is either
 * a CHARGE (money the family owes us, e.g. tuition, a late fee) or a CREDIT (money in the family's
 * favor, e.g. a payment they made, or a discount).
 *
 * Implement getFamilyBalance so the tests below pass.
 *   - Charges increase the balance, credits decrease it.
 *   - Money is always integer cents — do not introduce floating point math.
 *   - An empty ledger has a balance of 0.
 *   - Positive = the family owes us. Negative = the family has a credit balance.
 *
 * BONUS (only if time): implement getBalanceAsOf(items, isoDate) — balance considering only items
 * created on or before isoDate (inclusive).
 */
import { test, eq, run } from './_harness';

type LedgerItemType = 'CHARGE' | 'CREDIT';

interface LedgerItem {
  id: string;
  type: LedgerItemType;
  amountCents: number; // always a positive integer, in cents
  createdAt: string; // ISO date string
}

export function getFamilyBalance(items: LedgerItem[]): number {
  // TODO: implement
  throw new Error('not implemented');
}

export function getBalanceAsOf(items: LedgerItem[], isoDate: string): number {
  // TODO (bonus): implement
  throw new Error('not implemented');
}

// ---------------------------------------------------------------------------
const sample: LedgerItem[] = [
  { id: '1', type: 'CHARGE', amountCents: 30000, createdAt: '2026-06-01' },
  { id: '2', type: 'CREDIT', amountCents: 10000, createdAt: '2026-06-05' },
  { id: '3', type: 'CHARGE', amountCents: 5000, createdAt: '2026-06-10' },
];

test('empty ledger is 0', () => eq(getFamilyBalance([]), 0));
test('charges add, credits subtract', () => eq(getFamilyBalance(sample), 25000));
test('credit-heavy ledger goes negative', () =>
  eq(
    getFamilyBalance([
      { id: 'a', type: 'CHARGE', amountCents: 1000, createdAt: '2026-06-01' },
      { id: 'b', type: 'CREDIT', amountCents: 4000, createdAt: '2026-06-02' },
    ]),
    -3000,
  ));
test('does not mutate input', () => {
  const copy = [...sample];
  getFamilyBalance(sample);
  eq(sample, copy);
});
// Bonus test — delete or skip if you don't get to it.
test('bonus: balance as of a date is inclusive', () =>
  eq(getBalanceAsOf(sample, '2026-06-05'), 20000));

run('Exercise 1 — Ledger Balance');
