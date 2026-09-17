# Phone contract for admin forms

## Country source

The selected tenant country is stored in the `tenant-country` cookie and passed to the panel through `CurrencyProvider`. The admin API receives it as `X-Tenant-Id`. The frontend accepts only the supported country codes `sa`, `jo`, and `sy`; `src/data/countries.ts` defines each calling code and a mobile national-number pattern. `libphonenumber-js/min` supplies numbering-plan validation. The countries API also returns `dial_code`, which should agree with the configured code. An unknown country fails validation instead of defaulting to Saudi Arabia.

## Input and output

User creation, operating-company editing, test-account creation, and shipment driver editing accept national mobile digits, a national trunk prefix (`0`), or an explicit international number (`+` or `00`). An international number must belong to the selected tenant. These forms validate the number and send E.164, for example `+966512345678`, `+962791234567`, or `+963933123456`. Invalid and cross-country values show the same Arabic validation message (`PHONE_VALIDATION_MESSAGE`). A blank optional company or driver number remains blank. The company and shipment edit forms send phone fields only when changed.

Read views show a leading `+` when an existing value clearly starts with a supported calling code, even if that legacy number fails mobile validation. The users list and detail views also format valid local numbers using the selected tenant country. This is display formatting only; it does not change storage or make an invalid number valid. Ambiguous legacy local numbers without reliable country context are shown unchanged. Unchanged legacy company and driver values do not block edits to other fields; any newly entered phone must validate. Phone numbers are strings; the auth response temporarily allows `string | number` because older backend responses may still be numeric.

## Backend and existing records

The frontend is not the authority for storage or duplicate checks. The backend must verify the authenticated tenant, apply its own current numbering rules, normalize before persistence and duplicate lookups, and return one stable validation error for invalid or ambiguous numbers. It should store phones as strings with the leading `+` and return that form to clients.

Before migrating existing records, inventory values by tenant and classify explicit E.164, national forms with a known tenant, invalid values, and duplicates after normalization. Preview the proposed changes, resolve collisions and ambiguous records manually, then run an idempotent migration with a backup and rollback plan. Do not infer a Saudi code from a number without reliable tenant metadata. Verify user and operating-company create/edit workflows in staging for `sa`, `jo`, and `sy` after backend support is confirmed.
