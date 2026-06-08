import styles from './LoginInput.module.css'

export function LoginInput({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor={id}>{label}</label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}