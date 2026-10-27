import './App.css'
import { useEffect, useState } from 'react'
import { getOpenF1Sessions } from './services/openF1Service'

function App() {
  const [sessions, setSessions] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    getOpenF1Sessions()
      .then((data) => {
        if (isMounted) {
          setSessions(data)
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(requestError.message)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main className="page">
      <h1>F1 spoilerless rankings</h1>
      {error && <p className="error">Unable to load session data: {error}</p>}
      {!error && !sessions && <p className="status">Loading session data...</p>}
      {sessions && (
        <pre className="data-output">{JSON.stringify(sessions, null, 2)}</pre>
      )}
    </main>
  )
}

export default App
