import type { CSSProperties } from 'react'

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    margin: 0,
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    textAlign: 'center',
    padding: '24px',
    boxSizing: 'border-box',
  },
  badge: {
    fontSize: '14px',
    fontWeight: 600,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: '#2563eb',
  },
  title: {
    fontSize: '40px',
    fontWeight: 700,
    margin: 0,
  },
  subtitle: {
    fontSize: '18px',
    color: '#475569',
    maxWidth: '480px',
    margin: 0,
  },
}

function Home() {
  return (
    <main style={styles.page}>
      <span style={styles.badge}>Skedway</span>
      <h1 style={styles.title}>Gerenciamento de Salas</h1>
      <p style={styles.subtitle}>Bem-vindo ao projeto.</p>
    </main>
  )
}

export default Home
