/**
 * Exercise 2 — Tuition Pricing  (CANDIDATE STARTER)
 * Run the tests:  npx ts-node interview-exercises/exercise2.starter.ts
 *
 * When a child enrolls in a program we charge a monthly tuition. Families often enroll partway
 * through a month, and many qualify for a discount. Implement priceEnrollment.
 *
 * Business rules:
 *   1. Prorate the monthly tuition by enrolledDays / daysInMonth, rounded to the nearest cent.
 *   2. Apply the discount to the PRORATED amount (not the full monthly tuition).
 *        PERCENT: discount = proratedCents * value/100
 *        FIXED:   discount = value (but never more than the prorated amount)
 *   3. The final total can never be negative.
 *   4. A child enrolled the full month is not prorated.
 *
 * The tests below encode these rules. Make them pass.
 */
import { test, eq, run } from './_harness';

interface PricingInput {
  monthlyTuitionCents: number;
  daysInMonth: number;
  enrolledDays: number;
  discount?: { type: 'PERCENT' | 'FIXED'; value: number };
}

interface PricingResult {
  proratedCents: number; // tuition after proration, BEFORE discount
  discountCents: number; // how much was discounted (>= 0)
  totalCents: number; // final amount charged (never below 0)
}

export function priceEnrollment(input: PricingInput): PricingResult {
  // TODO: implement
  throw new Error('not implemented');
}

// ---------------------------------------------------------------------------
test('full month, no discount', () =>
  eq(priceEnrollment({ monthlyTuitionCents: 30000, daysInMonth: 30, enrolledDays: 30 }), {
    proratedCents: 30000,
    discountCents: 0,
    totalCents: 30000,
  }));

test('half month prorates', () =>
  eq(priceEnrollment({ monthlyTuitionCents: 30000, daysInMonth: 30, enrolledDays: 15 }), {
    proratedCents: 15000,
    discountCents: 0,
    totalCents: 15000,
  }));

test('percent discount on prorated amount', () =>
  eq(
    priceEnrollment({
      monthlyTuitionCents: 30000,
      daysInMonth: 30,
      enrolledDays: 15,
      discount: { type: 'PERCENT', value: 10 },
    }),
    { proratedCents: 15000, discountCents: 1500, totalCents: 13500 },
  ));

test('fixed discount larger than owed is clamped; total never negative', () =>
  eq(
    priceEnrollment({
      monthlyTuitionCents: 30000,
      daysInMonth: 30,
      enrolledDays: 1,
      discount: { type: 'FIXED', value: 99999 },
    }),
    { proratedCents: 1000, discountCents: 1000, totalCents: 0 },
  ));

test('rounds to nearest cent', () =>
  eq(priceEnrollment({ monthlyTuitionCents: 10000, daysInMonth: 31, enrolledDays: 1 }), {
    proratedCents: 323, // 10000/31 = 322.58 -> 323
    discountCents: 0,
    totalCents: 323,
  }));

run('Exercise 2 — Tuition Pricing');
