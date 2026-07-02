export default function VideoPlayer({ videoId, title, isShort = false }: { videoId: string; title?: string; isShort?: boolean }) {
  return (
    <div className={`w-full rounded-xl overflow-hidden shadow-2xl border border-brand-light/30 ${
      isShort ? 'aspect-[9/16] max-w-[340px] mx-auto' : 'aspect-video'
    }`}>
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
        title={title || "YouTube video player"}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
