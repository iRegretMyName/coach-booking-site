'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type Service = {
  id: number
  name: string
  duration_minutes: number
  price: number
  description: string
}

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmingDelete, setConfirmingDelete] = useState<number | null>(null)

  const [showAddForm, setShowAddForm] = useState(false)
  const [name, setName] = useState('')
  const [duration, setDuration] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editDuration, setEditDuration] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [editDescription, setEditDescription] = useState('')

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    const { data } = await supabase.from('services').select('*').order('id')
    if (data) setServices(data)
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

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!name || !duration || !price) {
      setErrorMsg('Name, duration, and price are required.')
      return
    }

    const { error } = await supabase.from('services').insert({
      name,
      duration_minutes: Number(duration),
      price: Number(price),
      description,
    })

    if (error) {
      setErrorMsg(error.message)
      return
    }

    setName('')
    setDuration('')
    setPrice('')
    setDescription('')
    setShowAddForm(false)
    fetchServices()
  }

  const startEdit = (service: Service) => {
    setEditingId(service.id)
    setEditName(service.name)
    setEditDuration(String(service.duration_minutes))
    setEditPrice(String(service.price))
    setEditDescription(service.description || '')
  }

  const saveEdit = async (id: number) => {
    await supabase
      .from('services')
      .update({
        name: editName,
        duration_minutes: Number(editDuration),
        price: Number(editPrice),
        description: editDescription,
      })
      .eq('id', id)

    setEditingId(null)
    fetchServices()
  }

  const deleteService = async (id: number) => {
    await supabase.from('services').delete().eq('id', id)
    setServices((prev) => prev.filter((s) => s.id !== id))
    setConfirmingDelete(null)
  }

  const cardStyle = {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E0D9C9',
    borderRadius: '8px',
    padding: '1.25rem',
    marginBottom: '1rem',
  }

  const smallButton = {
    fontSize: '0.8rem',
    padding: '0.3rem 0.7rem',
    borderRadius: '4px',
    cursor: 'pointer',
  }

  if (loading) {
    return <p style={{ color: '#5C6B7A' }}>Loading services...</p>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', color: '#1E2A3A' }}>Services</h2>
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
          {showAddForm ? 'Cancel' : '+ Add Service'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} style={{ ...cardStyle, marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ color: '#1E2A3A', fontSize: '0.9rem' }}>Name</label>
            <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ color: '#1E2A3A', fontSize: '0.9rem' }}>Duration (minutes)</label>
              <input style={inputStyle} type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ color: '#1E2A3A', fontSize: '0.9rem' }}>Price ($)</label>
              <input style={inputStyle} type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ color: '#1E2A3A', fontSize: '0.9rem' }}>Description</label>
            <textarea style={inputStyle} value={description} onChange={(e) => setDescription(e.target.value)} />
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
            Save Service
          </button>
        </form>
      )}

      {services.length === 0 && <p style={{ color: '#5C6B7A' }}>No services yet.</p>}

      {services.map((service) => (
        <div key={service.id} style={cardStyle}>
          {editingId === service.id ? (
            <div>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ color: '#1E2A3A', fontSize: '0.9rem' }}>Name</label>
                <input style={inputStyle} value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#1E2A3A', fontSize: '0.9rem' }}>Duration (minutes)</label>
                  <input style={inputStyle} type="number" value={editDuration} onChange={(e) => setEditDuration(e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: '#1E2A3A', fontSize: '0.9rem' }}>Price ($)</label>
                  <input style={inputStyle} type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
                </div>
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ color: '#1E2A3A', fontSize: '0.9rem' }}>Description</label>
                <textarea style={inputStyle} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => saveEdit(service.id)}
                  style={{ ...smallButton, backgroundColor: '#3611d2', color: '#F5EDDC', border: 'none' }}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  style={{ ...smallButton, backgroundColor: '#FFFFFF', color: '#5C6B7A', border: '1px solid #E0D9C9' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ color: '#3611d2', fontSize: '1.05rem' }}>{service.name}</strong>
                <span style={{ color: '#1E2A3A', fontWeight: 600 }}>
                  {service.duration_minutes} min - ${service.price}
                </span>
              </div>
              {service.description && (
                <p style={{ color: '#5C6B7A', margin: '0.5rem 0' }}>{service.description}</p>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button
                  onClick={() => startEdit(service)}
                  style={{ ...smallButton, backgroundColor: '#FFFFFF', color: '#1E2A3A', border: '1px solid #E0D9C9' }}
                >
                  Edit
                </button>

                {confirmingDelete === service.id ? (
                  <>
                    <span style={{ fontSize: '0.8rem', color: '#B33A3A', alignSelf: 'center' }}>Delete this service?</span>
                    <button
                      onClick={() => deleteService(service.id)}
                      style={{ ...smallButton, backgroundColor: '#B33A3A', color: '#FFFFFF', border: 'none' }}
                    >
                      Yes, delete
                    </button>
                    <button
                      onClick={() => setConfirmingDelete(null)}
                      style={{ ...smallButton, backgroundColor: '#FFFFFF', color: '#5C6B7A', border: '1px solid #E0D9C9' }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setConfirmingDelete(service.id)}
                    style={{ ...smallButton, backgroundColor: '#FFFFFF', color: '#5C6B7A', border: '1px solid #E0D9C9' }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}