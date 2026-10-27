let OPEN_F1_SESSIONS_URL =
  'https://api.openf1.org/v1/sessions?session_type=Race&year=' + new Date().getFullYear();

export async function getOpenF1Sessions() {
  const response = await fetch(OPEN_F1_SESSIONS_URL)

  if (!response.ok) {
	throw new Error(`OpenF1 request failed: ${response.status} ${response.statusText}`)
  }

	const sessions = await response.json()

	if (!Array.isArray(sessions)) {
	throw new Error('OpenF1 returned an invalid sessions response')
  }

	return sessions.map((session) => ({
	session_key: session.session_key,
	session_name: session.session_name,
	date_start: session.date_start,
	circuit_short_name: session.circuit_short_name,
	country_name: session.country_name,
	location: session.location,
  }))
}
