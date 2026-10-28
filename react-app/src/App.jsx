import './App.css'
import { useEffect, useState } from 'react'
import {
  getOpenF1ChampionshipDrivers,
  getOpenF1Drivers,
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

    Promise.all([
      getOpenF1ChampionshipDrivers(selectedSessionKey),
      getOpenF1Drivers(selectedSessionKey),
    ])
      .then(([championshipDrivers, driverDetails]) => {
        const driverNames = new Map(
          driverDetails.map((driver) => [
            String(driver.driver_number),
            driver.full_name,
          ]),
        )

        const driverStandings = championshipDrivers.map((driver) => ({
          driver_number: driver.driver_number,
          full_name:
            driverNames.get(String(driver.driver_number)) ??
            `Driver ${driver.driver_number}`,
          points_start: driver.points_start,
        }))

        if (isMounted) {
          setDrivers(driverStandings)
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
          {drivers && drivers.length === 0 && (
            <p className="status">No championship drivers were found.</p>
          )}
          {drivers && drivers.length > 0 && (
            <table className="standings-table">
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>Points at start</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver) => (
                  <tr key={driver.driver_number}>
                    <td>{driver.full_name}</td>
                    <td>{driver.points_start}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </main>
  )
}

export default App
