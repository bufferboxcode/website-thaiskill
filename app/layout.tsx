import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ThaiSkill — หน่วยธุรกิจของ กฟภ.',
  description: 'ThaiSkill Business Unit — Upskill · Reskill · Future Workforce',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  )
}
