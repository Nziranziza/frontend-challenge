import './style.css';

export const Button = ({ children, ...props}: React.ButtonHTMLAttributes<any>) => {
  return <button {...props}>{children}</button>
}