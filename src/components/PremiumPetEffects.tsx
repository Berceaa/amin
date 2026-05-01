type PremiumPetEffectsProps = {
  density?: 'light' | 'full';
};

const accents = [
  { icon: '🐾', left: '12%', top: '12%' },
  { icon: '🐶', left: '82%', top: '16%' },
  { icon: '🐱', left: '18%', top: '72%' },
];

export default function PremiumPetEffects({ density = 'full' }: PremiumPetEffectsProps) {
  const visibleAccents = density === 'light' ? accents.slice(0, 2) : accents;

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${density === 'light' ? 'opacity-70' : ''}`} aria-hidden="true">
      <div className="premium-blob premium-blob-1" />
      <div className="premium-blob premium-blob-2" />
      {visibleAccents.map((item, index) => (
        <span
          key={`${item.icon}-${index}`}
          className="pet-spark text-[1.15rem] md:text-[1.35rem]"
          style={{ left: item.left, top: item.top }}
        >
          {item.icon}
        </span>
      ))}
    </div>
  );
}
