import { CLOUD_RUN } from './constants.js'

const CITIES = [
  { code: 'MAA', city: 'Chennai', display: 'Chennai (MAA)' },
  { code: 'DEL', city: 'New Delhi', display: 'New Delhi (DEL)' },
  { code: 'BOM', city: 'Mumbai', display: 'Mumbai (BOM)' },
  { code: 'BLR', city: 'Bengaluru', display: 'Bengaluru (BLR)' },
  { code: 'HYD', city: 'Hyderabad', display: 'Hyderabad (HYD)' },
  { code: 'CCU', city: 'Kolkata', display: 'Kolkata (CCU)' },
  { code: 'PNQ', city: 'Pune', display: 'Pune (PNQ)' },
  { code: 'COK', city: 'Kochi', display: 'Kochi (COK)' },
  { code: 'GOI', city: 'Goa', display: 'Goa (GOI)' },
  { code: 'AMD', city: 'Ahmedabad', display: 'Ahmedabad (AMD)' },
]

export function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export function formatMoney(n, currency = 'INR') {
  const num = Number(n || 0)
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(num)
  } catch {
    return `₹${num.toLocaleString('en-IN')}`
  }
}

export function searchCities(q) {
  const s = String(q || '').trim().toLowerCase()
  if (!s) return CITIES.slice(0, 8)
  return CITIES.filter(
    (c) => c.city.toLowerCase().includes(s) || c.code.toLowerCase().includes(s)
  ).slice(0, 8)
}

export async function searchAirports(q) {
  if (!q || String(q).trim().length < 2) return []
  try {
    const res = await fetch(`${CLOUD_RUN}/api/airports?q=${encodeURIComponent(q.trim())}`, {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return searchCities(q)
    const data = await res.json()
    const list = data.airports || data.results || data || []
    return Array.isArray(list) && list.length ? list : searchCities(q)
  } catch {
    return searchCities(q)
  }
}

export async function searchFlights(body) {
  const res = await fetch(`${CLOUD_RUN}/api/flights/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Flight search failed (${res.status})`)
  }
  return res.json()
}
