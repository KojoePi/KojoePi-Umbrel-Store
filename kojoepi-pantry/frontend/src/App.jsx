import { useEffect, useState } from 'react'

const API = '/api'

export default function App() {
  const [products, setProducts] = useState([])
  const [expiring, setExpiring] = useState([])

  const [form, setForm] = useState({
    name: '',
    amount: 1,
    expiration: '',
    location: ''
  })

  async function load() {
    const p = await fetch(`${API}/products`).then(r => r.json())
    const e = await fetch(`${API}/expiring`).then(r => r.json())

    setProducts(p)
    setExpiring(e)
  }

  useEffect(() => {
    load()
  }, [])

  async function addProduct(e) {
    e.preventDefault()

    await fetch(`${API}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })

    setForm({
      name: '',
      amount: 1,
      expiration: '',
      location: ''
    })

    load()
  }

  async function remove(id) {
    await fetch(`${API}/products/${id}`, {
      method: 'DELETE'
    })

    load()
  }

  return (
    <div className="container">
      <h1>Speisekammer</h1>

      <form onSubmit={addProduct} className="card">
        <input
          placeholder="Produkt"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="number"
          placeholder="Anzahl"
          value={form.amount}
          onChange={e => setForm({ ...form, amount: e.target.value })}
        />

        <input
          type="date"
          value={form.expiration}
          onChange={e => setForm({ ...form, expiration: e.target.value })}
        />

        <input
          placeholder="Lagerort"
          value={form.location}
          onChange={e => setForm({ ...form, location: e.target.value })}
        />

        <button>Speichern</button>
      </form>
}