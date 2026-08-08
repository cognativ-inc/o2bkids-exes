# Full-Stack Engineer — Coding Exercises

Welcome! This is a small self-contained TypeScript project with **five exercises** that increase in
difficulty. Each exercise is a single file with a function to implement and a set of tests that are
already written for you. Your job is to make the tests pass.

No database and no network are involved — everything runs in memory.

## Setup (one time)

You need [Node.js](https://nodejs.org) (v18+) installed. Then, from this folder:

```bash
npm install
```

## How to work

Each exercise has a **starter** file you edit:

- `exercise1.starter.ts` — Ledger balance (warm-up)
- `exercise2.starter.ts` — Tuition pricing (proration + discounts)
- `exercise3.starter.ts` — Idempotent scheduled billing
- `exercise4.starter.ts` — Payment allocation waterfall (ordering + partial-state rules)
- `exercise5.starter.ts` — Classroom transfer saga (idempotency + rollback/compensation, the hardest one)

Open a starter file, read the comment at the top, and implement the function marked `// TODO`.
Then run that exercise to see the test output:

```bash
npm run ex1     # runs exercise1.starter.ts
npm run ex2     # runs exercise2.starter.ts
npm run ex3     # runs exercise3.starter.ts
npm run ex4     # runs exercise4.starter.ts
npm run ex5     # runs exercise5.starter.ts
```

You'll see something like:

```
=== Exercise 1 — Ledger Balance ===
  ✓ empty ledger is 0
  ✗ charges add, credits subtract
      Expected ... 

2 passed, 1 failed
```

Iterate until everything is green. To run all five at once:

```bash
npm test
```

## Notes

- Work top to bottom — they get harder. It's fine if you don't finish; we care about how you think.
- You may add your own tests, helper functions, and comments. Talk through your reasoning as you go.
- The tests describe the required behavior precisely — read them as the spec.
- You can use any editor and look things up; just narrate what you're doing.

Good luck, and have fun!

## For interviewers: reference solutions

Each exercise has a matching `exerciseN.solution.ts` file with a full reference implementation.
These are **gitignored** (`*.solution.ts`) so they never end up in a candidate's clone or fork —
keep them out of anything you hand off. Run them the same way:

```bash
npm run sol1    # ... sol2, sol3, sol4, sol5
npm run solutions   # runs all five solutions
```
