import { CheckCircle } from 'lucide-react';

interface Props {
  highlights: { label: string; value: string }[];
}

export default function HighlightsGrid({ highlights }: Props) {
  return (
    <section id="highlights">
      <h2 className="text-3xl font-bold text-[#1e2333] mb-8 uppercase text-center border-b-2 border-amber-500 pb-2 inline-block mx-auto flex w-max">Highlights</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {highlights.map((highlight, idx) => highlight.value && (
          <div key={idx} className="flex items-start bg-gray-50 p-4 rounded shadow-sm border-l-4 border-amber-500">
            <CheckCircle className="text-green-500 mr-3 mt-1 shrink-0" size={20} />
            <div>
              <span className="font-bold text-[#1e2333] block">{highlight.label}</span>
              <span className="text-gray-600">{highlight.value}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
