export default function VideoPlayer({ videoId, title }: { videoId: string; title?: string }) {
  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-[#1A3E42]">
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
