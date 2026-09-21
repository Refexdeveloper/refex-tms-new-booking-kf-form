import { useEffect, useMemo, useState } from 'react'
import { kf } from '../sdk'
import { FIELDS, MODES, modeLabel } from './constants.js'
import { formatMoney, searchAirports, searchCities, searchFlights, todayIso, DEFAULT_FROM, DEFAULT_TO } from './api.js'

function initials(name) {
  return String(name || 'U')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function placeDisplay(p) {
  if (!p) return ''
  return p.display || `${p.city || ''}${p.code ? ` (${p.code})` : ''}`.trim()
}

function PlaceSuggest({ label, value, onChange, airport }) {
  const [q, setQ] = useState(placeDisplay(value))
  const [opts, setOpts] = useState([])

  useEffect(() => setQ(placeDisplay(value)), [value])

  useEffect(() => {
    let ignore = false
    const t = setTimeout(async () => {
      if (!q || q.length < 1) {
        setOpts([])
        return
      }
      const list = airport ? await searchAirports(q) : searchCities(q)
      if (!ignore) {
        setOpts(
          (list || []).slice(0, 8).map((o) => ({
            code: o.code || o.iata || '',
            city: o.city || o.name || '',
            name: o.name || o.city || '',
            country: o.country || 'IN',
            display: o.display || `${o.city || o.name || ''} (${o.code || o.iata || ''})`.trim(),
          }))
        )
      }
    }, 220)
    return () => {
      ignore = true
      clearTimeout(t)
    }
  }, [q, airport])

  return (
    <div className="nb-field">
      <label>{label}</label>
      <input
        value={q}
        placeholder={airport ? 'City / airport' : 'City'}
        onChange={(e) => {
          setQ(e.target.value)
          onChange(null)
        }}
      />
      {opts.length > 0 && !value && (
        <div className="nb-suggest">
          {opts.map((o, i) => (
            <button
              key={`${o.code}-${i}`}
              type="button"
              onClick={() => {
                onChange(o)
                setQ(o.display)
                setOpts([])
              }}
            >
              {o.display}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function NewBookingForm() {
  const user = kf?.user || {}
  const requester = {
    name: user.Name || user.name || 'Employee',
    email: user.Email || user.email || '',
    id: user._id || '',
  }

  const [mode, setMode] = useState('air')
  const [purpose, setPurpose] = useState('')
  const [domesticInternational, setDomesticInternational] = useState('Domestic')
  const [beneficiary, setBeneficiary] = useState('Self')
  const [travelType, setTravelType] = useState('oneWay')
  const [from, setFrom] = useState(DEFAULT_FROM)
  const [to, setTo] = useState(DEFAULT_TO)
  const [city, setCity] = useState(null)
  const [departureDate, setDepartureDate] = useState(todayIso())
  const [returnDate, setReturnDate] = useState('')
  const [checkinDate, setCheckinDate] = useState('')
  const [checkoutDate, setCheckoutDate] = useState('')
  const [pickup, setPickup] = useState('')
  const [drop, setDrop] = useState('')
  const [withCab, setWithCab] = useState(false)
  const [amount, setAmount] = useState('')
  const [remarks, setRemarks] = useState('')
  const [flights, setFlights] = useState([])
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [searching, setSearching] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')

  const isAir = mode === 'air' || mode === 'flightHotel'
  const isGround = mode === 'train' || mode === 'bus'
  const isHotel = mode === 'accommodation'
  const isCab = mode === 'cab'
  const withHotel = mode === 'flightHotel'

  const greeting = useMemo(() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good Morning'
    if (h < 17) return 'Good Afternoon'
    return 'Good Evening'
  }, [])

  function buildFieldPayload() {
    const fromTxt = placeDisplay(from)
    const toTxt = isHotel ? placeDisplay(city) : placeDisplay(to)
    const fare = Number(selectedFlight?.totalFare || amount || 0)
    return {
      [FIELDS.purpose]: purpose,
      [FIELDS.purposeAlt]: purpose,
      [FIELDS.domesticInternational]: domesticInternational,
      [FIELDS.modeOfTransport]: modeLabel(mode),
      [FIELDS.travelType]: isAir ? travelType : 'oneWay',
      [FIELDS.tripType]: isAir ? travelType : 'oneWay',
      [FIELDS.departureDate]: departureDate || checkinDate || '',
      [FIELDS.fsDepartureDate]: departureDate || checkinDate || '',
      [FIELDS.fromDate]: departureDate || checkinDate || '',
      [FIELDS.toDate]: returnDate || checkoutDate || '',
      [FIELDS.fsFromCity]: fromTxt,
      [FIELDS.fsToCity]: toTxt,
      [FIELDS.commonFrom]: fromTxt,
      [FIELDS.commonTo]: toTxt,
      [FIELDS.boardingFrom]: fromTxt,
      [FIELDS.destinationTo]: toTxt,
      [FIELDS.bookingAmount]: fare,
      [FIELDS.bookingAmountAlt]: fare,
      [FIELDS.accommodation]: withHotel || isHotel ? 'Yes' : 'No',
      [FIELDS.beneficiary]: beneficiary,
      [FIELDS.comments]: remarks,
      [FIELDS.city]: placeDisplay(city) || toTxt,
      [FIELDS.checkin]: checkinDate,
      [FIELDS.checkout]: checkoutDate,
      [FIELDS.pickup]: pickup,
      [FIELDS.drop]: drop,
      [FIELDS.requesterEmail]: requester.email,
      [FIELDS.empEmail]: requester.email,
      [FIELDS.employeeDetails]: requester.name,
    }
  }

  async function syncToKissflow() {
    if (!kf?.context?.updateField) {
      throw new Error('kf.context.updateField unavailable — open this Form inside Travel Management.')
    }
    await kf.context.updateField(buildFieldPayload())
  }

  async function hydrateFromKissflow() {
    if (!kf?.context?.getField) return
    try {
      const p = await kf.context.getField(FIELDS.purpose)
      if (p) setPurpose(String(p))
      const di = await kf.context.getField(FIELDS.domesticInternational)
      if (di) setDomesticInternational(String(di))
    } catch {
      /* form may be empty on create */
    }
  }

  useEffect(() => {
    hydrateFromKissflow()
  }, [])

  async function onSearchFlights() {
    if (!from?.code || !to?.code) {
      setError('Select From and To airports from suggestions.')
      return
    }
    if (travelType === 'roundTrip') {
      if (!returnDate) {
        setError('Return date is required for round trip.')
        return
      }
      if (returnDate <= departureDate) {
        setError('Return date must be after departure.')
        return
      }
    }
    setSearching(true)
    setError('')
    setOk('')
    setSelectedFlight(null)
    try {
      const { options } = await searchFlights({
        tripType: travelType === 'roundTrip' ? 'roundTrip' : 'oneWay',
        from,
        to,
        depDate: departureDate,
        arrDate: returnDate,
        fareClass: 'Economy',
        domesticInternational,
      })
      setFlights(options)
      setOk(options.length ? `${options.length} flights found` : 'No flights returned')
    } catch (e) {
      setError(e.message || 'Flight search failed')
      setFlights([])
    } finally {
      setSearching(false)
    }
  }

  async function onSave() {
    setError('')
    setOk('')
    if (!purpose.trim()) {
      setError('Purpose of travel is required.')
      return
    }
    if (isAir && !selectedFlight) {
      setError('Search and select a flight before submitting.')
      return
    }
    if (isGround && (!from || !to || !departureDate)) {
      setError('From, To and travel date are required.')
      return
    }
    if (isHotel && (!city || !checkinDate || !checkoutDate)) {
      setError('City, check-in and check-out are required.')
      return
    }
    if (isCab && (!pickup || !drop || !departureDate)) {
      setError('Pickup, drop and date are required.')
      return
    }
    setSaving(true)
    try {
      await syncToKissflow()
      // Best-effort native submit if Form context exposes it
      if (typeof kf?.context?.submit === 'function') {
        await kf.context.submit()
        setOk('Submitted — Travel Desk workflow started.')
      } else if (typeof kf?.context?.save === 'function') {
        await kf.context.save()
        setOk('Saved to Kissflow. Click Submit on the form footer to start workflow.')
      } else {
        setOk('Fields synced. Click Kissflow Submit to start Travel Desk → Manager workflow.')
      }
      if (kf?.client?.showInfo) kf.client.showInfo('Travel booking saved')
    } catch (e) {
      setError(e.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="nb-root">
      <header className="nb-hero">
        <div>
          <p className="nb-kicker">
            <i className="ri-file-list-3-line" /> Travel Request
          </p>
          <h1>
            {greeting}, {(requester.name || 'Traveller').split(' ')[0]}!
          </h1>
          <p>Replace Kissflow default fields — synced to Travel_Management_A02.</p>
        </div>
        <div className="nb-requester">
          <span className="nb-avatar">{initials(requester.name)}</span>
          <div>
            <strong>{requester.name}</strong>
            <div>{requester.email || 'Auto-filled from Kissflow user'}</div>
          </div>
          <span className="nb-pill">Auto-filled</span>
        </div>
      </header>

      <section className="nb-card">
        <h2>1. Travel mode</h2>
        <div className="nb-modes">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`nb-mode${mode === m.id ? ' active' : ''}`}
              style={{ '--accent': m.accent, '--soft': m.soft }}
              onClick={() => {
                setMode(m.id)
                setSelectedFlight(null)
                setFlights([])
                setError('')
                setOk('')
              }}
            >
              <i className={m.icon} />
              <strong>{m.label}</strong>
              <span>{m.sub}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="nb-card">
        <h2>2. Request & booking details</h2>
        <div className="nb-grid">
          <div className="nb-field nb-span-2">
            <label>Purpose of travel *</label>
            <input
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Client meeting, site visit, training…"
            />
          </div>
          <div className="nb-field">
            <label>Domestic / International</label>
            <select value={domesticInternational} onChange={(e) => setDomesticInternational(e.target.value)}>
              <option>Domestic</option>
              <option>International</option>
            </select>
          </div>
          <div className="nb-field">
            <label>Travelling for</label>
            <select value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)}>
              <option>Self</option>
              <option>Internal</option>
              <option>External</option>
            </select>
          </div>
        </div>

        {isAir && (
          <>
            <div className="nb-tabs">
              {['oneWay', 'roundTrip'].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={travelType === t ? 'on' : ''}
                  onClick={() => setTravelType(t)}
                >
                  {t === 'oneWay' ? 'One Way' : 'Round Trip'}
                </button>
              ))}
              <label className="nb-check">
                <input type="checkbox" checked={withCab} onChange={(e) => setWithCab(e.target.checked)} />
                + Cab add-on
              </label>
            </div>
            <div className="nb-grid">
              <PlaceSuggest label="From *" value={from} onChange={setFrom} airport />
              <PlaceSuggest label="To *" value={to} onChange={setTo} airport />
              <div className="nb-field">
                <label>Departure *</label>
                <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
              </div>
              {travelType === 'roundTrip' && (
                <div className="nb-field">
                  <label>Return *</label>
                  <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
                </div>
              )}
            </div>
            <button type="button" className="nb-btn primary" onClick={onSearchFlights} disabled={searching}>
              {searching ? 'Searching…' : 'Search flights'}
            </button>
            <div className="nb-flights">
              {flights.slice(0, 50).map((f, i) => {
                const selected =
                  selectedFlight &&
                  ((selectedFlight.uuid && selectedFlight.uuid === f.uuid) ||
                    (selectedFlight.flightNumber === f.flightNumber &&
                      selectedFlight.departureTime === f.departureTime))
                return (
                  <div key={f.uuid || i} className={`nb-flight${selected ? ' selected' : ''}`}>
                    <div>
                      <strong>
                        {f.airlineName || f.airlineCode} {f.flightNumber || ''}
                      </strong>
                      <div className="muted">
                        {f.sourceCityCode} {f.departureTime || ''} → {f.destinationCityCode}{' '}
                        {f.arrivalTime || ''}
                      </div>
                    </div>
                    <div className="nb-flight-side">
                      <strong>{formatMoney(f.totalFare, f.currencyCode)}</strong>
                      <button
                        type="button"
                        className="nb-btn"
                        onClick={async () => {
                          setSelectedFlight(f)
                          setAmount(String(f.totalFare || ''))
                          try {
                            await kf.context.updateField({
                              ...buildFieldPayload(),
                              [FIELDS.bookingAmount]: Number(f.totalFare || 0),
                              [FIELDS.bookingAmountAlt]: Number(f.totalFare || 0),
                            })
                            setOk('Flight selected and amount synced')
                          } catch (e) {
                            setOk('Flight selected (sync on Save)')
                          }
                        }}
                      >
                        {selected ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {isGround && (
          <div className="nb-grid">
            <PlaceSuggest label="From *" value={from} onChange={setFrom} />
            <PlaceSuggest label="To *" value={to} onChange={setTo} />
            <div className="nb-field">
              <label>Travel date *</label>
              <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
            </div>
            <div className="nb-field">
              <label>Est. amount (INR)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
          </div>
        )}

        {isHotel && (
          <div className="nb-grid">
            <PlaceSuggest label="City *" value={city} onChange={setCity} />
            <div className="nb-field">
              <label>Check-in *</label>
              <input type="date" value={checkinDate} onChange={(e) => setCheckinDate(e.target.value)} />
            </div>
            <div className="nb-field">
              <label>Check-out *</label>
              <input type="date" value={checkoutDate} onChange={(e) => setCheckoutDate(e.target.value)} />
            </div>
            <div className="nb-field">
              <label>Est. amount (INR)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
          </div>
        )}

        {isCab && (
          <div className="nb-grid">
            <div className="nb-field">
              <label>Pickup *</label>
              <input value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Airport / hotel" />
            </div>
            <div className="nb-field">
              <label>Drop *</label>
              <input value={drop} onChange={(e) => setDrop(e.target.value)} placeholder="Destination" />
            </div>
            <div className="nb-field">
              <label>Date *</label>
              <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
            </div>
            <div className="nb-field">
              <label>Est. amount (INR)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
          </div>
        )}

        <div className="nb-field">
          <label>Remarks</label>
          <textarea rows={3} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
        </div>

        {error && <p className="nb-err">{error}</p>}
        {ok && <p className="nb-ok">{ok}</p>}

        <div className="nb-actions">
          <button type="button" className="nb-btn primary" disabled={saving} onClick={onSave}>
            {saving ? 'Saving…' : 'Save to Kissflow & continue'}
          </button>
        </div>
      </section>
    </div>
  )
}
