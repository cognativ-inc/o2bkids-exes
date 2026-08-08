/**
 * Exercise 4 — Payment Allocation Waterfall  (CANDIDATE STARTER)
 * Run the tests:  npx ts-node exercise4.starter.ts
 *
 * A family often has several outstanding charges on their ledger at once (unpaid tuition, a
 * late fee, a supply fee...). When they make a single payment, we need to decide how much of it
 * goes toward each charge. Implement allocatePayment so the tests below pass.
 *
 * Business rules:
 *   1. Only charges with status 'OPEN' are eligible to receive money. 'PAID' and 'VOID' charges
 *      are left completely untouched.
 *   2. Allocate the payment to open charges in order of dueDate ascending (oldest due first).
 *      If two charges share the same dueDate, break the tie by charge id ascending (plain
 *      string comparison).
 *   3. A charge can receive at most its remaining balance: amountCents - paidCents.
 *   4. When a charge's paidCents reaches its amountCents, its status becomes 'PAID'. Charges
 *      that still have a remaining balance stay 'OPEN'.
 *   5. If the payment is larger than the total remaining balance across all open charges, the
 *      leftover is NOT lost — return it as unallocatedCents. (It becomes a ledger credit
 *      elsewhere in the system; you don't need to create that here.)
 *   6. Return a NEW array of charges (do not mutate the input), in the SAME ORDER as the input
 *      array, with only paidCents/status updated where money was applied. Also return the list
 *      of individual allocations that were made — only include charges that actually received
 *      a nonzero amount — plus unallocatedCents.
 *   7. Invariant that must always hold: sum(allocations[].amountCents) + unallocatedCents ===
 *      paymentCents.
 *
 * The tests below encode these rules. Make them pass.
 */
import { test, eq, run } from './_harness';

type ChargeStatus = 'OPEN' | 'PAID' | 'VOID';

interface Charge {
  id: string;
  dueDate: string; // ISO date
  amountCents: number;
  paidCents: number;
  status: ChargeStatus;
}

interface Allocation {
  chargeId: string;
  amountCents: number;
}

interface AllocationResult {
  charges: Charge[];
  allocations: Allocation[];
  unallocatedCents: number;
}

// ES5 style: var, classic for loop, no arrow functions, no array destructuring.
export function allocatePayment(charges: Charge[], paymentCents: number): AllocationResult {
  // TODO: implement
  throw new Error('not implemented');
}

// ---------------------------------------------------------------------------
test('single open charge, payment fully covers it', () =>
  eq(
    allocatePayment(
      [{ id: 'c1', dueDate: '2026-06-01', amountCents: 10000, paidCents: 0, status: 'OPEN' }],
      10000,
    ),
    {
      charges: [{ id: 'c1', dueDate: '2026-06-01', amountCents: 10000, paidCents: 10000, status: 'PAID' }],
      allocations: [{ chargeId: 'c1', amountCents: 10000 }],
      unallocatedCents: 0,
    },
  ));

test('splits across charges, earliest dueDate first', () =>
  eq(
    allocatePayment(
      [
        { id: 'b', dueDate: '2026-06-10', amountCents: 5000, paidCents: 0, status: 'OPEN' },
        { id: 'a', dueDate: '2026-06-01', amountCents: 5000, paidCents: 0, status: 'OPEN' },
      ],
      7000,
    ),
    {
      charges: [
        { id: 'b', dueDate: '2026-06-10', amountCents: 5000, paidCents: 2000, status: 'OPEN' },
        { id: 'a', dueDate: '2026-06-01', amountCents: 5000, paidCents: 5000, status: 'PAID' },
      ],
      allocations: [
        { chargeId: 'a', amountCents: 5000 },
        { chargeId: 'b', amountCents: 2000 },
      ],
      unallocatedCents: 0,
    },
  ));

test('respects an already-partially-paid charge', () =>
  eq(
    allocatePayment(
      [{ id: 'c1', dueDate: '2026-06-01', amountCents: 10000, paidCents: 4000, status: 'OPEN' }],
      6000,
    ),
    {
      charges: [{ id: 'c1', dueDate: '2026-06-01', amountCents: 10000, paidCents: 10000, status: 'PAID' }],
      allocations: [{ chargeId: 'c1', amountCents: 6000 }],
      unallocatedCents: 0,
    },
  ));

test('overpayment becomes unallocatedCents', () =>
  eq(
    allocatePayment(
      [{ id: 'c1', dueDate: '2026-06-01', amountCents: 5000, paidCents: 0, status: 'OPEN' }],
      8000,
    ),
    {
      charges: [{ id: 'c1', dueDate: '2026-06-01', amountCents: 5000, paidCents: 5000, status: 'PAID' }],
      allocations: [{ chargeId: 'c1', amountCents: 5000 }],
      unallocatedCents: 3000,
    },
  ));

test('VOID and PAID charges are skipped entirely', () =>
  eq(
    allocatePayment(
      [
        { id: 'v1', dueDate: '2026-06-01', amountCents: 1000, paidCents: 0, status: 'VOID' },
        { id: 'p1', dueDate: '2026-06-01', amountCents: 1000, paidCents: 1000, status: 'PAID' },
        { id: 'o1', dueDate: '2026-06-02', amountCents: 2000, paidCents: 0, status: 'OPEN' },
      ],
      2000,
    ),
    {
      charges: [
        { id: 'v1', dueDate: '2026-06-01', amountCents: 1000, paidCents: 0, status: 'VOID' },
        { id: 'p1', dueDate: '2026-06-01', amountCents: 1000, paidCents: 1000, status: 'PAID' },
        { id: 'o1', dueDate: '2026-06-02', amountCents: 2000, paidCents: 2000, status: 'PAID' },
      ],
      allocations: [{ chargeId: 'o1', amountCents: 2000 }],
      unallocatedCents: 0,
    },
  ));

test('ties on dueDate break by id ascending', () =>
  eq(
    allocatePayment(
      [
        { id: 'z', dueDate: '2026-06-01', amountCents: 1000, paidCents: 0, status: 'OPEN' },
        { id: 'a', dueDate: '2026-06-01', amountCents: 1000, paidCents: 0, status: 'OPEN' },
      ],
      1500,
    ),
    {
      charges: [
        { id: 'z', dueDate: '2026-06-01', amountCents: 1000, paidCents: 500, status: 'OPEN' },
        { id: 'a', dueDate: '2026-06-01', amountCents: 1000, paidCents: 1000, status: 'PAID' },
      ],
      allocations: [
        { chargeId: 'a', amountCents: 1000 },
        { chargeId: 'z', amountCents: 500 },
      ],
      unallocatedCents: 0,
    },
  ));

test('zero payment allocates nothing', () =>
  eq(
    allocatePayment(
      [{ id: 'c1', dueDate: '2026-06-01', amountCents: 1000, paidCents: 0, status: 'OPEN' }],
      0,
    ),
    {
      charges: [{ id: 'c1', dueDate: '2026-06-01', amountCents: 1000, paidCents: 0, status: 'OPEN' }],
      allocations: [],
      unallocatedCents: 0,
    },
  ));

test('does not mutate input', () => {
  const input: Charge[] = [
    { id: 'c1', dueDate: '2026-06-01', amountCents: 1000, paidCents: 0, status: 'OPEN' },
  ];
  const before = JSON.parse(JSON.stringify(input));
  allocatePayment(input, 500);
  eq(input, before);
});

run('Exercise 4 — Payment Allocation Waterfall');
