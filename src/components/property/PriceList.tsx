interface Props {
  priceListDesc: string;
}

export default function PriceList({ priceListDesc }: Props) {
  return (
    <section id="price">
      <h2 className="text-3xl font-bold text-[#1e2333] mb-8 uppercase text-center border-b-2 border-amber-500 pb-2 inline-block mx-auto flex w-max">Price List</h2>
      {priceListDesc ? (
        <div className="prose max-w-none text-center mx-auto" dangerouslySetInnerHTML={{ __html: priceListDesc }} />
      ) : (
        <div className="text-center text-gray-600 bg-gray-50 p-8 border border-gray-200 shadow-sm">
          <p className="text-xl mb-4">Detailed pricing and payment plans available upon request.</p>
          <button className="bg-amber-500 text-white px-8 py-3 font-bold uppercase rounded shadow-lg hover:bg-amber-600">
            Request Price List
          </button>
        </div>
      )}
    </section>
  );
}
