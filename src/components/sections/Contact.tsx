import { useState, type FormEvent } from 'react'
import { profile } from '../../data/portfolio'

export function Contact() {
  const [copied, setCopied] = useState(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '')
    const email = String(data.get('email') ?? '')
    const message = String(data.get('message') ?? '')
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`)
    const body = encodeURIComponent(`${message}\n\n${name} · ${email}`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  }

  const copyEmail = async () => {
    await navigator.clipboard.writeText(profile.email)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <section className="section contact-section">
      <p className="lead">If the work on this map resonates, write to me. I read every note.</p>
      <form onSubmit={onSubmit}>
        <label>
          Name
          <input name="name" required autoComplete="name" />
        </label>
        <label>
          Email
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <label>
          Message
          <textarea name="message" required rows={5} />
        </label>
        <button type="submit">Send message</button>
      </form>
      <div className="contact-links">
        <button type="button" className="ghost" onClick={() => void copyEmail()}>
          {copied ? 'Email copied' : profile.email}
        </button>
        <a href={profile.links.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </div>
    </section>
  )
}
