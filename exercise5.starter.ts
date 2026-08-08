/**
 * Exercise 5 — Classroom Transfer Saga  (CANDIDATE STARTER)
 * Run the tests:  npx ts-node exercise5.starter.ts
 *
 * Moving a child from one classroom to another touches two different resources (the source and
 * destination classroom rosters) plus an audit log. The operation has to be safe against retries
 * AND against a failure partway through. Implement transferChild so the tests below pass.
 *
 * Business rules:
 *   1. IDEMPOTENT RETRY: if the child is already enrolled in the destination classroom (e.g.
 *      because a previous call already completed the transfer), do nothing further and return
 *      { status: 'ALREADY_TRANSFERRED' }.
 *   2. CAPACITY CHECK: before touching anything, check the destination classroom's capacity. If
 *      getEnrollmentCount(toClassroomId) >= getCapacity(toClassroomId), the transfer cannot
 *      happen. Do NOT remove the child from the source classroom. Return
 *      { status: 'CLASSROOM_FULL' }.
 *   3. TRANSFER: if there's room, remove the child from the source classroom, then add them to
 *      the destination classroom.
 *   4. COMPENSATION (rollback): if adding to the destination classroom fails (the store call
 *      rejects) AFTER the child was already removed from the source, you must add the child
 *      back to the source classroom so they are never left enrolled nowhere. After
 *      compensating, return { status: 'ROLLED_BACK', reason: string } where reason is the
 *      error's message.
 *   5. AUDIT LOG (best-effort): once the transfer itself succeeds, call logTransfer. If
 *      logTransfer fails, do NOT fail the whole operation because of it — the transfer already
 *      happened and matters more than the log entry. Still return { status: 'TRANSFERRED' }.
 *   6. On a clean success (no retry, no failures), return { status: 'TRANSFERRED' }.
 *
 * The store below is mocked (in-memory). Notes on its CONTRACT:
 *   - isEnrolled / getEnrollmentCount / getCapacity are read-only checks.
 *   - addEnrollment / removeEnrollment / logTransfer can each reject to simulate a failure.
 *
 * ES5 style: no async/await, no arrow functions, no template literals. Express async control
 * flow with Promise .then()/.catch() chains.
 *
 * In a comment, note what is still NOT safe under true concurrency (e.g. two transfers racing
 * for the last seat in the destination classroom) and how a real database would close that gap.
 */
import { test, eq, run } from './_harness';

interface ClassroomStore {
  isEnrolled(childId: string, classroomId: string): Promise<boolean>;
  getEnrollmentCount(classroomId: string): Promise<number>;
  getCapacity(classroomId: string): Promise<number>;
  addEnrollment(childId: string, classroomId: string): Promise<void>;
  removeEnrollment(childId: string, classroomId: string): Promise<void>;
  logTransfer(childId: string, fromClassroomId: string, toClassroomId: string): Promise<void>;
}

type TransferResult =
  | { status: 'TRANSFERRED' }
  | { status: 'ALREADY_TRANSFERRED' }
  | { status: 'CLASSROOM_FULL' }
  | { status: 'ROLLED_BACK'; reason: string };

export function transferChild(
  childId: string,
  fromClassroomId: string,
  toClassroomId: string,
  store: ClassroomStore,
): Promise<TransferResult> {
  // TODO: implement
  throw new Error('not implemented');
}

// ---------------------------------------------------------------------------
// Mocks modelling the dependency CONTRACT. (You may read these but don't need to change them.)
function makeStore(
  opts: {
    capacities?: Record<string, number>;
    failAdd?: Record<string, boolean>;
    failLog?: boolean;
  } = {},
) {
  const rosters = new Map<string, Set<string>>();
  const logs: string[] = [];
  function roster(classroomId: string): Set<string> {
    if (!rosters.has(classroomId)) rosters.set(classroomId, new Set());
    return rosters.get(classroomId)!;
  }
  const store: ClassroomStore = {
    async isEnrolled(childId, classroomId) {
      return roster(classroomId).has(childId);
    },
    async getEnrollmentCount(classroomId) {
      return roster(classroomId).size;
    },
    async getCapacity(classroomId) {
      return opts.capacities?.[classroomId] ?? Infinity;
    },
    async addEnrollment(childId, classroomId) {
      if (opts.failAdd?.[classroomId]) throw new Error(`cannot add to ${classroomId}`);
      roster(classroomId).add(childId);
    },
    async removeEnrollment(childId, classroomId) {
      roster(classroomId).delete(childId);
    },
    async logTransfer(childId, fromClassroomId, toClassroomId) {
      if (opts.failLog) throw new Error('log service down');
      logs.push(`${childId}:${fromClassroomId}->${toClassroomId}`);
    },
  };
  return { store, logs, roster };
}

test('happy path transfers the child and logs it', async () => {
  const { store, roster, logs } = makeStore({ capacities: { dest: 10 } });
  roster('src').add('kid1');
  const result = await transferChild('kid1', 'src', 'dest', store);
  eq(result, { status: 'TRANSFERRED' });
  eq(roster('src').has('kid1'), false);
  eq(roster('dest').has('kid1'), true);
  eq(logs, ['kid1:src->dest']);
});

test('retry after success is a no-op', async () => {
  const { store, roster } = makeStore({ capacities: { dest: 10 } });
  roster('dest').add('kid1'); // already transferred by a previous call
  const result = await transferChild('kid1', 'src', 'dest', store);
  eq(result, { status: 'ALREADY_TRANSFERRED' });
  eq(roster('src').has('kid1'), false);
});

test('destination full leaves source untouched', async () => {
  const { store, roster } = makeStore({ capacities: { dest: 1 } });
  roster('src').add('kid1');
  roster('dest').add('other-kid'); // fills capacity
  const result = await transferChild('kid1', 'src', 'dest', store);
  eq(result, { status: 'CLASSROOM_FULL' });
  eq(roster('src').has('kid1'), true);
  eq(roster('dest').has('kid1'), false);
});

test('failure adding to destination rolls back to source', async () => {
  const { store, roster } = makeStore({ capacities: { dest: 10 }, failAdd: { dest: true } });
  roster('src').add('kid1');
  const result = await transferChild('kid1', 'src', 'dest', store);
  eq((result as any).status, 'ROLLED_BACK');
  eq(roster('src').has('kid1'), true);
  eq(roster('dest').has('kid1'), false);
});

test('log failure does not fail the transfer', async () => {
  const { store, roster } = makeStore({ capacities: { dest: 10 }, failLog: true });
  roster('src').add('kid1');
  const result = await transferChild('kid1', 'src', 'dest', store);
  eq(result, { status: 'TRANSFERRED' });
  eq(roster('dest').has('kid1'), true);
});

run('Exercise 5 — Classroom Transfer Saga');
