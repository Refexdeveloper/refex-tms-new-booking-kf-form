# New Booking — Kissflow **Form** component

Upload this ZIP on the Kissflow custom component you created as type **Form** (“New Booking”).

Uses [@kissflow/lowcode-client-sdk](https://developers.kissflow.com/gettingstarted/) and writes process fields with [`kf.context.updateField`](https://developers.kissflow.com/form/updatefield/).

## Enable in Kissflow

1. App → Custom components → open **New Booking** (type Form)
2. Upload `refex-tms-new-booking-kf-form.zip`
3. Publish
4. Place the Form component on the Travel Management create popup / form canvas

## What it covers

- Flight / Train / Bus / Flight+Hotel / Hotel / Cab
- Auto requester from `kf.user`
- Live flight search (Cloud Run Travolution proxy)
- Save → syncs `Purpose_of_Travel`, `Travel_Type`, `FS_From_City`, `FS_Booking_Amount_1`, etc.

## Build

```bash
npm install
npm run zip
```

## Note

- **Form** (this repo) = entire booking form UI + `updateField`
- **Form field** (`refex-tms-travel-booking-kf-component`) = single custom field + `actions.updateValue`

For your screenshot selection (**Form**), use **this** ZIP.
