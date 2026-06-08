import { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'

import { LoginInput } from '../LoginInput/LoginInput'
import { LoginActions } from '../LoginActions/LoginActions'

import styles from './LoginForm.module.css'

export function LoginForm() {
  const { dispatch } = useContext(AuthContext)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [viewMode, setViewMode] = useState('login')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const userInputRef = useRef(null)

  useEffect(() => {
    userInputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!message) return

    const timer = setTimeout(() => {
      setMessage('')
    }, 3000)

    return () => clearTimeout(timer)
  }, [message])

  function handleSubmit(event) {
    event.preventDefault()

    setIsSubmitting(true)

    setTimeout(() => {
      dispatch({
        type: 'LOGIN',
        payload: username,
      })

      setMessage('Login enviado com sucesso (simulação)')
      setIsSubmitting(false)
    }, 1000)
  }

  function handleRegister() {
    setViewMode('register')
    setMessage('Tela de cadastro (simulação)')
  }

  function handleRecoverPassword() {
    setViewMode('recover')
    setMessage('Tela de recuperação de senha (simulação)')
  }

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <h1>Chronos</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div ref={userInputRef}>
          <LoginInput
            id="usuario"
            label="Usuário"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Digite seu usuário"
          />
        </div>

        <LoginInput
          id="senha"
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite sua senha"
        />

        <button
          className={styles.loginButton}
          type="submit"
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>

        {message && (
          <p className={styles.message}>
            {message}
          </p>
        )}

        {viewMode === 'register' && (
          <span className={styles.modeText}>
            Cadastro em desenvolvimento
          </span>
        )}

        {viewMode === 'recover' && (
          <span className={styles.modeText}>
            Recuperação de senha em desenvolvimento
          </span>
        )}

        <LoginActions
          onRegister={handleRegister}
          onRecoverPassword={handleRecoverPassword}
        />
      </form>
    </div>
  )
}