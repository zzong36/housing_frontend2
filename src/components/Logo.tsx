interface LogoProps {
  src: string;
  alt?: string;
  size?: number; // px
}

export default function Logo({ src, alt = "Logo", size = 96 }: LogoProps) {
  return (
    <div className="logo-wrapper">
      <img
        src={src}
        alt={alt}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
        className="logo-img"
      />
    </div>
  );
}
