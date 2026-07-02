interface Props {
  gallery: string[];
}

export default function GallerySection({ gallery }: Props) {
  if (gallery.length === 0) return null;

  return (
    <section id="gallery">
      <h2 className="text-3xl font-bold text-[#1e2333] mb-8 uppercase text-center border-b-2 border-amber-500 pb-2 inline-block mx-auto flex w-max">Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {gallery.map((img, idx) => (
          <div key={idx} className="relative h-64 overflow-hidden shadow-md">
            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
          </div>
        ))}
      </div>
    </section>
  );
}
