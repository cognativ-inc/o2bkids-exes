/**
 * Exercise 3 — Idempotent Scheduled Billing  (CANDIDATE STARTER)
 * Run the tests:  npx ts-node interview-exercises/exercise3.starter.ts
 *
 * Every night a background job bills each family for the current period. For each family it must:
 *   1. Create a ledger CHARGE for the amount due (if not already created for this period).
 *   2. Charge the family's saved card via a payment gateway.
 *   3. Record the payment as a CREDIT on the ledger.
 *
 * The job CAN run more than once for the same period — retries, an operator re-running it, two
 * workers picking up the same family, or a crash halfway through. It MUST be safe: a family must be
 * charged AT MOST ONCE per billing period, and the ledger must not get duplicate rows.
 *
 * The gateway and store below are mocked (in-memory). Notes on their CONTRACT:
 *   - gateway.charge() with the SAME idempotencyKey does NOT move money twice — it returns the
 *     original result. Without a stable key, every call is a fresh charge.
 *   - gateway.charge() can THROW to simulate a transient network failure (handle with retry).
 *   - A DECLINED result is a real business outcome, not a crash — handle it distinctly.
 *
 * Implement billFamily so the tests pass. In comments, note what is still NOT safe under true
 * concurrency and how a real database would close that gap.
 */
import { test, eq, run } from './_harness';

interface ChargeRequest {
  familyId: string;
  period: string;
  amountCents: number;
  idempotencyKey: string;
}
interface GatewayResult {
  transactionId: string;
  status: 'APPROVED' | 'DECLINED';
}
interface PaymentGateway {
  charge(req: ChargeRequest): Promise<GatewayResult>;
}
interface LedgerStore {
  hasCharge(familyId: string, period: string): Promise<boolean>;
  addCharge(familyId: string, period: string, amountCents: number): Promise<void>;
  addPaymentCredit(familyId: string, period: string, txnId: string): Promise<void>;
  markPeriodPaid(familyId: string, period: string): Promise<void>;
  isPeriodPaid(familyId: string, period: string): Promise<boolean>;
}

export async function billFamily(
  family: { id: string; amountCents: number },
  period: string,
  gateway: PaymentGateway,
  store: LedgerStore,
): Promise<void> {
  // TODO: implement
  throw new Error('not implemented');
}

// ---------------------------------------------------------------------------
// Mocks modelling the dependency CONTRACTS. (You may read these but don't need to change them.)
function makeGateway(opts: { failTimes?: number; decline?: boolean } = {}): PaymentGateway {
  const seen = new Map<string, GatewayResult>();
  let failsLeft = opts.failTimes ?? 0;
  let counter = 0;
  return {
    async charge(req) {
      if (failsLeft > 0) {
        failsLeft--;
        throw new Error('network error');
      }
      const existing = seen.get(req.idempotencyKey);
      if (existing) return existing; // idempotency: no second money movement
      const result: GatewayResult = {
        transactionId: `txn_${++counter}`,
        status: opts.decline ? 'DECLINED' : 'APPROVED',
      };
      seen.set(req.idempotencyKey, result);
      return result;
    },
  };
}

function makeStore() {
  const charges = new Set<string>();
  const credits: string[] = [];
  const paid = new Set<string>();
  const k = (f: string, p: string) => `${f}:${p}`;
  const store: LedgerStore = {
    async hasCharge(f, p) {
      return charges.has(k(f, p));
    },
    async addCharge(f, p) {
      charges.add(k(f, p));
    },
    async addPaymentCredit(f, p, txn) {
      credits.push(`${k(f, p)}:${txn}`);
    },
    async markPeriodPaid(f, p) {
      paid.add(k(f, p));
    },
    async isPeriodPaid(f, p) {
      return paid.has(k(f, p));
    },
  };
  return { store, charges, credits, paid };
}

test('double run -> exactly one charge and one credit', async () => {
  const gw = makeGateway();
  const { store, charges, credits } = makeStore();
  const fam = { id: 'f1', amountCents: 30000 };
  await billFamily(fam, '2026-06', gw, store);
  await billFamily(fam, '2026-06', gw, store);
  eq(charges.size, 1);
  eq(credits.length, 1);
});

test('transient failures are retried then succeed once', async () => {
  const gw = makeGateway({ failTimes: 2 });
  const { store, credits } = makeStore();
  await billFamily({ id: 'f2', amountCents: 10000 }, '2026-06', gw, store);
  eq(credits.length, 1);
});

test('declined: charge stays, no credit, period not paid', async () => {
  const gw = makeGateway({ decline: true });
  const { store, charges, credits, paid } = makeStore();
  await billFamily({ id: 'f3', amountCents: 10000 }, '2026-06', gw, store);
  eq(charges.size, 1);
  eq(credits.length, 0);
  eq(paid.size, 0);
});

run('Exercise 3 — Idempotent Scheduled Billing');
