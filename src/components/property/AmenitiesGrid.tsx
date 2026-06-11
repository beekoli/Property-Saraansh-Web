interface Amenity {
  id: number;
  name: string;
  icon: string;
}

interface Props {
  amenities: Amenity[];
}

export default function AmenitiesGrid({ amenities }: Props) {
  if (amenities.length === 0) return null;

  return (
    <section id="amenities">
      <h2 className="text-3xl font-bold text-[#1e2333] mb-8 uppercase text-center border-b-2 border-amber-500 pb-2 inline-block mx-auto flex w-max">Amenities</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {amenities.map((amenity) => (
          <div key={amenity.id} className="flex flex-col items-center justify-center p-6 border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all bg-white">
            <img src={amenity.icon} alt={amenity.name} className="w-16 h-16 mb-4 object-contain" />
            <h4 className="font-bold text-center text-[#1e2333] uppercase text-sm tracking-wider">{amenity.name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
}
