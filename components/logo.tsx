import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const sizeMap = {
  small: 154,   // ~h-38 (192 * 0.8)
  medium: 205,  // ~h-51 (256 * 0.8)
  large: 256,   // h-64 (320 * 0.8)
};

export function Logo({ size = 'medium', className }: LogoProps) {
  const heightClass = size === 'small' ? 'h-[154px]' : size === 'large' ? 'h-[256px]' : 'h-[205px]';
  const pixelSize = sizeMap[size];

  return (
    <Link href="/">
      <Image
        src="/Untitled_design_(7).png"
        alt="Ridecast"
        width={pixelSize}
        height={pixelSize}
        className={`${heightClass} w-auto ${className || ''}`}
      />
    </Link>
  );
}
