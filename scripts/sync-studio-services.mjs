import { readFileSync } from 'node:fs'

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split(/\r?\n/).filter(Boolean).map((line) => line.split(/=(.*)/s).slice(0, 2)))
const services = [
  ['Nervous System Regulation', 'A personalised one-to-one counselling session for mapping patterns and building practical safety.', 75, 2500],
  ['Weekly Live Knowledge Session', 'A live beginner-friendly group class on nervous system regulation and daily life.', 60, 799],
  ['Core Transformation', 'A deeper body rewire and nervous system healing program.', 120, 6999],
  ['Power of Sound & Mantra', 'A four-week mantra healing program exploring sound, vibration and spiritual practice.', 60, 4999],
  ['Relationship Healing', 'Deep counselling for relationship, couple and family patterns.', 90, 3500],
  ['Environment Regulation', 'A live audit of the surroundings that shape your nervous system.', 60, 2000],
  ['The Bridge', 'A six-week mentorship for bringing spiritual growth into daily life.', 60, 25000],
  ['The Presence Room', 'An ongoing daily presence and nervous system regulation membership.', 60, 999],
].map(([name, description, duration_minutes, price], index) => ({ id: index + 1, name, description, duration_minutes, price }))

const response = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/services?on_conflict=id`, {
  method: 'POST',
  headers: { apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY, Authorization: `Bearer ${env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=representation' },
  body: JSON.stringify(services),
})
if (!response.ok) throw new Error(await response.text())
console.log(`Synced ${(await response.json()).length} current Instayog services.`)
