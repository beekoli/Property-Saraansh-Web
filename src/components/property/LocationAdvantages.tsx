import { CheckCircle } from 'lucide-react';

interface Props {
  locationAdvantages: string;
}

export default function LocationAdvantages({ locationAdvantages }: Props) {
  return (
    <section id="location">
      <h2 className="text-3xl font-bold text-[#1e2333] mb-8 uppercase text-center border-b-2 border-amber-500 pb-2 inline-block mx-auto flex w-max">Location Advantages</h2>
      {locationAdvantages ? (
        <div className="prose max-w-none mx-auto" dangerouslySetInnerHTML={{ __html: locationAdvantages }} />
      ) : (
        <div className="grid md:grid-cols-2 gap-8 items-center bg-gray-50 p-8 border border-gray-200">
          <div className="w-full h-64 bg-gray-300 flex items-center justify-center text-gray-500">
            Map Placeholder
          </div>
          <div>
            <ul className="space-y-4 text-gray-600 text-lg">
              <li className="flex items-center"><CheckCircle className="text-amber-500 mr-2 shrink-0" size={20} /> 5 Mins from Jewar Airport</li>
              <li className="flex items-center"><CheckCircle className="text-amber-500 mr-2 shrink-0" size={20} /> 2 Mins from Yamuna Expressway</li>
              <li className="flex items-center"><CheckCircle className="text-amber-500 mr-2 shrink-0" size={20} /> Close to upcoming Film City</li>
              <li className="flex items-center"><CheckCircle className="text-amber-500 mr-2 shrink-0" size={20} /> Easy access to major hospitals and schools</li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
