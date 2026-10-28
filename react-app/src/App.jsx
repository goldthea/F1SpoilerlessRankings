import './App.css'
import { useEffect, useState } from 'react'
import {
  getOpenF1ChampionshipDrivers,
  getOpenF1Sessions,
} from './services/openF1Service'

function App() {
  const [sessions, setSessions] = useState(null)
  const [selectedSessionKey, setSelectedSessionKey] = useState('')
  const [sessionError, setSessionError] = useState(null)
  const [drivers, setDrivers] = useState(null)
  const [driverError, setDriverError] = useState(null)

  useEffect(() => {
    let isMounted = true

    getOpenF1Sessions()
      .then((data) => {
        if (isMounted) {
          setSessions(data)
          setSelectedSessionKey(data.length > 0 ? String(data[0].session_key) : '')
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setSessionError(requestError.message)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!selectedSessionKey) {
      return undefined
    }

    let isMounted = true
    setDrivers(null)
    setDriverError(null)

    getOpenF1ChampionshipDrivers(selectedSessionKey)
      .then((data) => {
        if (isMounted) {
          setDrivers(data)
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setDriverError(requestError.message)
        }
      })

    return () => {
      isMounted = false
    }
  }, [selectedSessionKey])

  return (
    <main className="page">
      <h1>F1 spoilerless rankings</h1>
      {sessionError && (
        <p className="error">Unable to load session data: {sessionError}</p>
      )}
      {!sessionError && !sessions && <p className="status">Loading sessions...</p>}
      {sessions && sessions.length === 0 && (
        <p className="status">No sessions were found.</p>
      )}
      {sessions && sessions.length > 0 && (
        <>
          <div className="selectors">
            <label>
              Session
              <select
                value={selectedSessionKey}
                onChange={(event) => setSelectedSessionKey(event.target.value)}
              >
                {sessions.map((session) => (
                  <option key={session.session_key} value={session.session_key}>
                    {session.country_name} - {session.location} - {session.session_name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <h2>Championship drivers</h2>
          {driverError && (
            <p className="error">Unable to load drivers: {driverError}</p>
          )}
          {!driverError && !drivers && (
            <p className="status">Loading drivers...</p>
          )}
          {drivers && (
            <pre className="data-output">{JSON.stringify(drivers, null, 2)}</pre>
          )}
        </>
      )}
    </main>
  )
}

export default App
