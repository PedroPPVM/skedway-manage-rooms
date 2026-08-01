import { ThemeToggle } from '../../components/ui/ThemeToggle'

function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-6 text-center">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <span className="text-sm font-semibold tracking-widest text-primary uppercase">
        Skedway
      </span>
      <h1 className="text-4xl font-bold text-foreground">
        Gerenciamento de Salas
      </h1>
      <p className="max-w-md text-lg text-muted-foreground">
        Bem-vindo ao projeto.
      </p>
    </main>
  )
}

export default Home
