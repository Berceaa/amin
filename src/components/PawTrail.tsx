import paw from '../assets/paw.png';
import paw2 from '../assets/paw-2.png';
import paw3 from '../assets/paw-3.png';

type PawTrailProps = {
  className?: string;
  size?: 'sm' | 'md';
};

const pawImages = [paw, paw2, paw3, paw2];

export default function PawTrail({ className = '', size = 'md' }: PawTrailProps) {
  const sizeClass = size === 'sm' ? 'h-6 w-6 md:h-7 md:w-7' : 'h-8 w-8 md:h-10 md:w-10';

  return (
    <div className={`pointer-events-none flex items-center gap-2 select-none ${className}`} aria-hidden="true">
      {pawImages.map((image, index) => (
        <img
          key={`${image}-${index}`}
          src={image}
          alt=""
          className={`paw-step ${sizeClass} paw-delay-${index + 1} ${index % 2 === 0 ? '-rotate-12' : 'rotate-12'} opacity-50`}
        />
      ))}
    </div>
  );
}
