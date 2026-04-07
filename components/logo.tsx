
interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <img
      src="/logo.png"
      alt="Logo"
      width={40}
      height={40}
    />
  );
};

export default Logo;
