import './style.css';
import cx from 'classnames';

type TextInputProps = {
  label?: string;
  error?: string | undefined | null | boolean;
}
export const TextInput = ({ label, error, ...props }: React.InputHTMLAttributes<any> & TextInputProps) => {
  return <div className={cx('input', {
    'has-error': error
  })}>
    <label>{label}</label>
    <input {...props} />
    {error && <span className="error">{error}</span>}
  </div>
}