'use client';
import { useState } from 'react';

interface FloorPlan {
  id: number;
  title: string;
  desc: string;
  image: string;
}

interface Props {
  floorPlans: FloorPlan[];
}

export default function FloorPlans({ floorPlans }: Props) {
  const [activeFloorPlan, setActiveFloorPlan] = useState(floorPlans[0]?.id || 1);

  if (floorPlans.length === 0) return null;

  return (
    <section id="floorplan">
      <h2 className="text-3xl font-bold text-[#1e2333] mb-8 uppercase text-center border-b-2 border-amber-500 pb-2 inline-block mx-auto flex w-max">Floor Plan</h2>
      <div className="bg-[#1e2333] p-1 rounded-t-lg flex flex-wrap justify-center">
        {floorPlans.map((fp) => (
          <button 
            key={fp.id}
            onClick={() => setActiveFloorPlan(fp.id)}
            className={`px-8 py-4 font-bold text-lg transition-colors w-full sm:w-auto ${activeFloorPlan === fp.id ? 'bg-amber-500 text-white' : 'text-gray-300 hover:text-white'}`}
          >
            {fp.title}
          </button>
        ))}
      </div>
      <div className="border border-gray-200 p-8 flex justify-center bg-gray-50">
        {floorPlans.map((fp) => activeFloorPlan === fp.id && (
          <div key={fp.id} className="text-center w-full max-w-2xl">
            <img src={fp.image} alt={fp.title} className="w-full h-auto max-h-[600px] object-contain mb-6 shadow-md border border-gray-300 bg-white" />
            <h3 className="text-2xl font-bold text-[#1e2333] mb-2">{fp.title}</h3>
            <p className="text-gray-600 text-lg">{fp.desc}</p>
            <button className="mt-6 bg-[#1e2333] text-white px-8 py-3 rounded hover:bg-gray-800 font-bold uppercase tracking-wider">
              Price Info
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
