import Link from 'next/link'
import s from './not-found.module.css'

export default function NotFound() {
  return (
    <section className={`container ${s['not-found']}`}>
      <h1>404</h1>
      <p>This page doesn’t exist.</p>
      <Link href="/">Back home</Link>
    </section>
  )
}
