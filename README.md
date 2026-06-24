# Full-Stack Engineer — Coding Exercises

Welcome! This is a small self-contained TypeScript project with **three exercises** that increase in
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
- `exercise3.starter.ts` — Idempotent scheduled billing (the main one)

Open a starter file, read the comment at the top, and implement the function marked `// TODO`.
Then run that exercise to see the test output:

```bash
npm run ex1     # runs exercise1.starter.ts
npm run ex2     # runs exercise2.starter.ts
npm run ex3     # runs exercise3.starter.ts
```

You'll see something like:

```
=== Exercise 1 — Ledger Balance ===
  ✓ empty ledger is 0
  ✗ charges add, credits subtract
      Expected ... 

2 passed, 1 failed
```

Iterate until everything is green. To run all three at once:

```bash
npm test
```

## Notes

- Work top to bottom — they get harder. It's fine if you don't finish exercise 3; we care about how
  you think.
- You may add your own tests, helper functions, and comments. Talk through your reasoning as you go.
- The tests describe the required behavior precisely — read them as the spec.
- You can use any editor and look things up; just narrate what you're doing.

Good luck, and have fun!
