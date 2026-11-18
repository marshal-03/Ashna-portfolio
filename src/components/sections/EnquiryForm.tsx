'use client'

import { useState, type FormEvent } from 'react'
import { profile } from '@/data/portfolio'
import s from './Contact.module.css'

const EVENT_TYPES = [
  'Corporate event',
  'Product launch',
  'Wedding',
  'Conference / summit',
  'Exhibition / stall',
  'Other',
]

/**
 * Short project enquiry. There's no server: sending opens the visitor's email app (or WhatsApp,
 * when a number is set) with the details already written in.
 */
export default function EnquiryForm() {
  const [sent, setSent] = useState(false)

  const compose = (form: HTMLFormElement) => {
    const data = new FormData(form)
    const get = (k: string) => String(data.get(k) ?? '').trim()
    const lines = [
      `Hi Ashna, I'm ${get('name')}.`,
      `Event: ${get('type')}${get('date') ? ` on ${get('date')}` : ''}`,
      '',
      get('message'),
    ]
    return { subject: `Project enquiry — ${get('type')}`, body: lines.join('\n') }
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { subject, body } = compose(e.currentTarget)
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  const onWhatsApp = (e: React.MouseEvent<HTMLButtonElement>) => {
    const form = e.currentTarget.form
    if (!form || !form.reportValidity()) return
    const { body } = compose(form)
    window.open(`https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(body)}`, '_blank')
    setSent(true)
  }

  return (
    <form className={s.form} onSubmit={onSubmit}>
      <label>
        <span>Your name</span>
        <input name="name" required autoComplete="name" />
      </label>
      <label>
        <span>Event type</span>
        <select name="type" defaultValue={EVENT_TYPES[0]}>
          {EVENT_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label>
        <span>Event date (optional)</span>
        <input name="date" type="date" />
      </label>
      <label className={s.form__wide}>
        <span>What do you need?</span>
        <textarea
          name="message"
          required
          rows={4}
          placeholder="Stage backdrop, entry arch, registration desk, invitations…"
        />
      </label>
      <div className={`${s.form__wide} ${s.form__actions}`}>
        <button type="submit" className="btn">
          Send by email
        </button>
        {profile.whatsapp ? (
          <button type="button" className={`btn ${s.whatsapp}`} onClick={onWhatsApp}>
            Send on WhatsApp
          </button>
        ) : null}
        {sent && (
          <p className={s.form__note}>Your message is ready in your email or WhatsApp app.</p>
        )}
      </div>
    </form>
  )
}
