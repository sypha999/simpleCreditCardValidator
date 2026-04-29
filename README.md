# Verve Card Validator

A lightweight JavaScript utility for validating **Verve card numbers** using pattern matching and the **Luhn algorithm**.

---

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
    - [Step 1 — Verve Pattern Check](#step-1--verve-pattern-check)
    - [Step 2 — Luhn Algorithm Check (Optional)](#step-2--luhn-algorithm-check-optional)
- [Function Reference](#function-reference)
    - [validateCard(number, doExtraCheck)](#validatecardnumber-doextracheck)
    - [luhnCheck(cardNumber)](#luhncheckcardnumber)
- [Usage Examples](#usage-examples)
- [Validation Logic Explained](#validation-logic-explained)
- [Verve Card Number Format](#verve-card-number-format)
- [Limitations](#limitations)
- [Dependencies](#dependencies)

---

## Overview

This module validates whether a given card number is a legitimate **Verve card** — a card scheme widely used in Nigeria and across Africa. Validation is performed in two stages:

1. **Pattern matching** — checks that the card number starts with a known Verve prefix and has the correct length.
2. **Luhn check** *(optional)* — applies the industry-standard Luhn algorithm to verify the number is mathematically well-formed.

---

## Project Structure

```
📦 project/
 ┣ 📄 index.js        ← Main entry point; contains validateCard()
 ┗ 📄 helper.js       ← Contains the luhnCheck() utility function
```

---

## Running the Application

Open the project on any Intelli J Idea and run the `index.js` file, or use the terminal to navigate to the project directory and execute with:
`node index.js`


---

## How It Works

### Step 1 — Verve Pattern Check

The function first tests the card number against a regular expression that encodes the known rules for Verve card numbers:

```
/^(5060|5061|5078|5079|6500)[0-9]{12,15}$/
```

This regex enforces two things:

- The card must **start with** one of the recognised Verve prefixes: `5060`, `5061`, `5078`, `5079`, or `6500`.
- After the prefix, there must be **between 12 and 15 additional digits**, making the total card length **16 to 19 digits** — consistent with the Verve card specification.

If the pattern matches, the card is considered a structurally valid Verve card.

---

### Step 2 — Luhn Algorithm Check (Optional)

If `doExtraCheck` is passed as `true`, the result of the pattern check is **replaced** by the result of the Luhn algorithm.

The Luhn algorithm (also known as the "modulus 10" algorithm) works as follows:

1. Starting from the **rightmost digit**, keep it as-is.
2. Moving left, **double every second digit**.
3. If doubling a digit produces a value **greater than 9**, subtract 9 from it.
4. **Sum all digits** together.
5. If the total sum is **divisible by 10**, the card number passes the Luhn check.

This is the same algorithm used by payment networks worldwide to detect mistyped or fabricated card numbers.

> ⚠️ **Important:** When `doExtraCheck` is `true`, the Luhn check **completely replaces** the pattern check result — it does not run in addition to it. A card could pass the Luhn check but not be a Verve card, and vice versa.

---

## Function Reference

### `validateCard(number, doExtraCheck)`

Defined in `index.js`. The main validation function.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `number` | `number` \| `string` | Yes | The card number to validate |
| `doExtraCheck` | `boolean` | Yes | If `true`, runs the Luhn algorithm instead of (not in addition to) the pattern check |

**Returns:** `string`
- `"Verve card is valid"` — if the card passes the active validation check.
- `"Invalid card number"` — if the card fails the active validation check.

**Example:**
```javascript
validateCard("5060123456789012", false); // Pattern check only
validateCard("5060123456789012", true);  // Luhn check only
```

---

### `luhnCheck(cardNumber)`

Defined in `helper.js`. A utility function that runs the Luhn algorithm against a card number.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `cardNumber` | `string` \| `number` | Yes | The card number to validate |

**Returns:** `boolean`
- `true` — the number passes the Luhn check.
- `false` — the number fails the Luhn check.

---

## Usage Examples

```javascript
import { validateCard } from "./index.js";

// Pattern check only — checks prefix and length
validateCard("5060123456789012", false);
// → "Verve card is valid"

// Luhn check only — checks mathematical validity
validateCard("5060123456789012", true);
// → "Verve card is valid" or "Invalid card number" depending on Luhn result

// Invalid prefix — not a Verve card
validateCard("4111111111111111", false);
// → "Invalid card number"

// Number passed as a numeric literal (note: large integers lose precision in JS)
console.log(validateCard(506112345678234567, true));
// → Result may be unreliable — see Limitations below
```

---

## Validation Logic Explained

```
Input: card number + doExtraCheck flag
         │
         ▼
  Does number match Verve regex?
  (correct prefix + correct length)
         │
    ┌────┴────┐
   YES        NO
    │          │
    ▼          ▼
isValidVerveCard = true    isValidVerveCard = false
         │
         ▼
  Is doExtraCheck true?
    ┌────┴────┐
   YES        NO
    │          │
    ▼          ▼
  Run luhnCheck()     Use pattern result as-is
  overwrite result
         │
         ▼
  Return message based on final boolean
```

---

## Verve Card Number Format

| Property | Value |
|---|---|
| **Issuer** | Interswitch (Nigeria) |
| **Valid Prefixes** | `5060`, `5061`, `5078`, `5079`, `6500` |
| **Total Card Length** | 16 – 19 digits |
| **Used In** | Nigeria, Ghana, Sierra Leone, and other African markets |

---

## Limitations

**Numeric precision loss for large card numbers.**
In the current code, the card number is passed as a JavaScript `number` literal:

```javascript
console.log(validateCard(506112345678234567, true))
```

JavaScript's `number` type is a 64-bit float and can only safely represent integers up to `Number.MAX_SAFE_INTEGER` (`9007199254740991` — 16 digits). Card numbers of 17–19 digits will lose precision when stored as a `number`, producing an incorrect value before validation even begins.

**Fix — always pass card numbers as strings:**

```javascript
// ❌ Avoid — large integers lose precision
validateCard(506112345678234567, true)

// ✅ Correct — pass as a string to preserve all digits
validateCard("506112345678234567", true)
```

**The Luhn check overrides the pattern check.**
When `doExtraCheck` is `true`, the Verve prefix/length check is completely discarded. A non-Verve card that happens to pass the Luhn algorithm will return `"Verve card is valid"`, which is misleading. Consider combining both checks:

```javascript
// Suggested improvement
if (vervePattern.test(number)) {
    isValidVerveCard = doExtraCheck ? luhnCheck(number) : true;
}
```

---

## Dependencies

This project has **no external dependencies**. It uses only native JavaScript (ES Modules).

| File | Purpose |
|---|---|
| `helper.js` | Exports the `luhnCheck()` function |
| `index.js` | Imports `luhnCheck` and exports `validateCard()` |

Requires an environment that supports **ES Module syntax** (`import`/`export`), such as Node.js 14+ with `"type": "module"` in `package.json`, or a modern browser.