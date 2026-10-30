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

	return sessions
	.filter((session) => new Date(session.date_start) <= new Date())
	.filter((session) => !session.is_cancelled)
	.map((session) => ({
	session_key: session.session_key,
	session_name: session.session_name,
	date_start: session.date_start,
	circuit_short_name: session.circuit_short_name,
	country_name: session.country_name,
	location: session.location,
	}))
}

export async function getOpenF1ChampionshipDrivers(sessionKey) {
  if (sessionKey === undefined || sessionKey === null || sessionKey === '') {
	throw new Error('A session key is required')
  }

  const response = await fetch(
	`https://api.openf1.org/v1/championship_drivers?session_key=${encodeURIComponent(sessionKey)}`,
  )

  if (!response.ok) {
	throw new Error(`OpenF1 request failed: ${response.status} ${response.statusText}`)
  }

  const drivers = await response.json()

  if (!Array.isArray(drivers)) {
	throw new Error('OpenF1 returned an invalid championship drivers response')
  }

  return drivers
}

export async function getOpenF1Drivers() {

  const response = await fetch(
	`https://api.openf1.org/v1/drivers`,
  )

  if (!response.ok) {
	throw new Error(`OpenF1 request failed: ${response.status} ${response.statusText}`)
  }

  const drivers = await response.json()

  if (!Array.isArray(drivers)) {
	throw new Error('OpenF1 returned an invalid drivers response')
  }

  return drivers.map((driver) => ({
	driver_number: driver.driver_number,
	full_name: driver.full_name,
  }))
}

export async function getOpenF1ChampionshipTeams(sessionKey) {
  if (sessionKey === undefined || sessionKey === null || sessionKey === '') {
	throw new Error('A session key is required')
  }

  const response = await fetch(
	`https://api.openf1.org/v1/championship_teams?session_key=${encodeURIComponent(sessionKey)}`,
  )

  if (!response.ok) {
	throw new Error(`OpenF1 request failed: ${response.status} ${response.statusText}`)
  }

  const teams = await response.json()

  if (!Array.isArray(teams)) {
	throw new Error('OpenF1 returned an invalid championship teams response')
  }

  return teams.map((team) => ({
	team_name: team.team_name,
	points_current: team.points_current,
  }))
}
