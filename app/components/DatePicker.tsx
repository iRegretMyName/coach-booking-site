'use client'

import { useState } from 'react'

type DatePickerProps = {
  value: string
  onChange: (date: string) => void
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function DatePicker({ value, onChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const today = new Date()
  const initialDate = value ? new Date(value + 'T00:00:00') : today

  const [viewYear, setViewYear] = useState(initialDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth())

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay()

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  const handleSelectDay = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    const formatted = `${viewYear}-${mm}-${dd}`
    onChange(formatted)
    setIsOpen(false)
  }

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      viewMonth === today.getMonth() &&
      viewYear === today.getFullYear()
    )
  }

  const isSelected = (day: number) => {
    if (!value) return false
    const [y, m, d] = value.split('-').map(Number)
    return day === d && viewMonth === m - 1 && viewYear === y
  }

  const blanks = Array.from({ length: firstDayOfMonth })
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          readOnly
          value={value}
          placeholder="Select a date"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #E0D9C9',
            backgroundColor: '#FFFFFF',
            color: '#29251f',
            width: '100%',
            cursor: 'pointer',
          }}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: '4px',
            border: '1px solid #E0D9C9',
            backgroundColor: '#FFFFFF',
            color: '#29251f',
            cursor: 'pointer',
          }}
        >
          📅
        </button>
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '110%',
            left: 0,
            zIndex: 10,
            backgroundColor: '#FFFFFF',
            border: '1px solid #E0D9C9',
            borderRadius: '8px',
            padding: '1rem',
            width: '280px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <button
              type="button"
              onClick={goPrevMonth}
              style={{ background: 'none', border: 'none', color: '#29251f', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              ‹
            </button>
            <span style={{ fontWeight: 'bold', color: '#29251f' }}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={goNextMonth}
              style={{ background: 'none', border: 'none', color: '#29251f', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              ›
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '0.5rem' }}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} style={{ textAlign: 'center', fontSize: '0.8rem', color: '#5C6B7A' }}>
                {d}
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {blanks.map((_, i) => (
              <div key={`blank-${i}`} />
            ))}
            {days.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => handleSelectDay(day)}
                style={{
                  padding: '0.4rem 0',
                  borderRadius: '4px',
                  border: isToday(day) ? '1px solid #405447' : 'none',
                  backgroundColor: isSelected(day) ? '#405447' : 'transparent',
                  color: isSelected(day) ? '#f6f1e8' : '#29251f',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
