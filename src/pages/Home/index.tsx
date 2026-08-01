import { AppLayout } from '../../components/layout'

function Home() {
  return (
    <AppLayout>
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="text-4xl font-bold text-foreground">
          Gerenciamento de Salas
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          Bem-vindo ao projeto.
        </p>
      </div>
    </AppLayout>
  )
}

export default Home
