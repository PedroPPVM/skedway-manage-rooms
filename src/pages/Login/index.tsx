import { zodResolver } from '@hookform/resolvers/zod'
import type { TFunction } from 'i18next'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import {
  Button,
  Card,
  Input,
  LanguageSwitcher,
  ThemeToggle,
} from '../../components/ui'
import { useUser } from '../../contexts/user'

function createLoginSchema(t: TFunction) {
  return z.object({
    name: z.string().trim().min(2, t('login.validation.nameRequired')),
    email: z.email(t('login.validation.emailInvalid')),
  })
}

type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>

function Login() {
  const { t } = useTranslation()
  const { user, signIn } = useUser()
  const navigate = useNavigate()

  const schema = useMemo(() => createLoginSchema(t), [t])
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(schema) })

  if (user) return <Navigate to="/" replace />

  const onSubmit = handleSubmit((values) => {
    signIn(values)
    navigate('/', { replace: true })
  })

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-surface px-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-sm p-6">
        <div className="mb-6 flex flex-col gap-1 text-center">
          <span className="text-sm font-semibold tracking-widest text-primary uppercase">
            Skedway
          </span>
          <h1 className="text-xl font-bold text-foreground">
            {t('login.title')}
          </h1>
          <p className="text-sm text-muted-foreground">{t('login.subtitle')}</p>
        </div>

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <Input
            label={t('login.name')}
            placeholder={t('login.namePlaceholder')}
            autoComplete="name"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            type="email"
            label={t('login.email')}
            placeholder={t('login.emailPlaceholder')}
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Button type="submit" className="w-full">
            {t('login.submit')}
          </Button>
        </form>
      </Card>
    </main>
  )
}

export default Login
