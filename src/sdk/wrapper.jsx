import KFSDK from '@kissflow/lowcode-client-sdk'
import React, { useEffect, useState } from 'react'

let kf

export function SDKWrapper({ children }) {
  const [ready, setReady] = useState(null)

  useEffect(() => {
    if (window.kf) {
      kf = window.kf
      setReady(kf)
      return
    }
    KFSDK.initialize()
      .then((sdk) => {
        window.kf = kf = sdk
        setReady(sdk)
      })
      .catch((err) => {
        console.error('KF SDK init failed', err)
        setReady({ isError: true })
      })
  }, [])

  if (!ready) return <div className="nb-loading">Loading Kissflow…</div>
  if (ready.isError) {
    return (
      <div className="nb-error-box">
        <h3>Open inside Kissflow</h3>
        <p>This Form component needs the Kissflow SDK. Upload the ZIP on component “New Booking”.</p>
      </div>
    )
  }
  return <>{children}</>
}

export { kf }
