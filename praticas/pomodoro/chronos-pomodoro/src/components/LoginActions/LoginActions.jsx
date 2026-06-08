import styles from './LoginActions.module.css'

export function LoginActions({
  onRegister,
  onRecoverPassword,
}) {
  return (
    <div className={styles.actions}>
      <button type="button" onClick={onRegister}>
        Não tem conta? Cadastre-se
      </button>

      <button type="button" onClick={onRecoverPassword}>
        Esqueci minha senha
      </button>
    </div>
  )
}