'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type Availability = {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function AvailabilityManager() {
  const [rows, setRows] = useState<Availability[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null)

  const [showAddForm, setShowAddForm] = useState(false)
  const [dayOfWeek, setDayOfWeek] = useState('1')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('17:00')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    fetchAvailability()
  }, [])

  const fetchAvailability = async () => {
    const { data } = await supabase
      .from('availability')
      .select('*')
      .order('day_of_week')

    if (data) setRows(data)
    setLoading(false)
  }

  const inputStyle = {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #E0D9C9',
    backgroundColor: '#FFFFFF',
    color: '#1E2A3A',
    width: '100%',
  }

  const smallButton = {
    fontSize: '0.8rem',
    padding: '0.3rem 0.7rem',
    borderRadius: '4px',
    cursor: 'pointer',
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (startTime >= endTime) {
      setErrorMsg('Start time must be before end time.')
      return
    }

    const { error } = await supabase.from('availability').insert({
      day_of_week: Number(dayOfWeek),
      start_time: startTime,
      end_time: endTime,
    })

    if (error) {
      setErrorMsg(error.message)
      return
    }

    setShowAddForm(false)
    fetchAvailability()
  }

  const deleteRow = async (id: string) => {
    await supabase.from('availability').delete().eq('id', id)
    setRows((prev) => prev.filter((r) => r.id !== id))
    setConfirmingDelete(null)
  }

  const cardStyle = {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E0D9C9',
    borderRadius: '8px',
    padding: '1.25rem',
    marginBottom: '1rem',
  }

  if (loading) {
    return <p style={{ color: '#5C6B7A' }}>Loading availability...</p>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', color: '#1E2A3A' }}>Availability</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            ...smallButton,
            backgroundColor: '#3611d2',
            color: '#F5EDDC',
            border: 'none',
            fontWeight: 600,
          }}
        >
          {showAddForm ? 'Cancel' : '+ Add Hours'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} style={{ ...cardStyle, marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ color: '#1E2A3A', fontSize: '0.9rem' }}>Day of Week</label>
            <select style={inputStyle} value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)}>
              {DAY_NAMES.map((day, index) => (
                <option key={index} value={index}>{day}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: '#1E2A3A', fontSize: '0.9rem' }}>Start Time</label>
              <input style={inputStyle} type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: '#1E2A3A', fontSize: '0.9rem' }}>End Time</label>
              <input style={inputStyle} type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>
          {errorMsg && <p style={{ color: '#B33A3A', fontSize: '0.9rem' }}>{errorMsg}</p>}
          <button
            type="submit"
            style={{
              ...smallButton,
              backgroundColor: '#3611d2',
              color: '#F5EDDC',
              border: 'none',
              fontWeight: 600,
            }}
          >
            Save Hours
          </button>
        </form>
      )}

      {rows.length === 0 && <p style={{ color: '#5C6B7A' }}>No availability set yet.</p>}

      {rows.map((row) => (
        <div key={row.id} style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong style={{ color: '#3611d2' }}>{DAY_NAMES[row.day_of_week]}</strong>
            <span style={{ color: '#1E2A3A', marginLeft: '1rem' }}>
              {row.start_time.slice(0, 5)} - {row.end_time.slice(0, 5)}
            </span>
          </div>

          {confirmingDelete === row.id ? (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#B33A3A' }}>Delete?</span>
              <button
                onClick={() => deleteRow(row.id)}
                style={{ ...smallButton, backgroundColor: '#B33A3A', color: '#FFFFFF', border: 'none' }}
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmingDelete(null)}
                style={{ ...smallButton, backgroundColor: '#FFFFFF', color: '#5C6B7A', border: '1px solid #E0D9C9' }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmingDelete(row.id)}
              style={{ ...smallButton, backgroundColor: '#FFFFFF', color: '#5C6B7A', border: '1px solid #E0D9C9' }}
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  )
}