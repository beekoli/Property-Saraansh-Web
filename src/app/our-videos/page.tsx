import VideoPlayer from '@/components/VideoPlayer';

export default function OurVideos() {
  const videos = [
    { id: "dQw4w9WgXcQ", title: "Top 5 Commercial Projects in Sector 150" },
    { id: "dQw4w9WgXcQ", title: "Real Estate Market Crash? Truth about Noida" },
    { id: "dQw4w9WgXcQ", title: "M3M The Cullinan - Full Project Tour" },
    { id: "dQw4w9WgXcQ", title: "Why you should NOT buy in Greater Noida West" },
  ];

  return (
    <div className="bg-[#0A1A1C] min-h-screen pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif text-[#E5C099] mb-4">Our Videos</h1>
          <p className="text-[#A0B2B4] max-w-2xl mx-auto">
            Deep-dive reviews, market analysis, and site visits. Subscribe to our YouTube channel for the latest real estate updates in Noida.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {videos.map((video, idx) => (
            <div key={idx} className="bg-[#06282B] rounded-xl p-4 border border-[#1A3E42] hover:border-[#E5C099] transition-colors">
              <VideoPlayer videoId={video.id} title={video.title} />
              <h3 className="text-xl font-serif text-white mt-6 mb-2">{video.title}</h3>
              <p className="text-[#A0B2B4] text-sm">Posted 2 weeks ago • 15K views</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <a href="#" className="btn-primary inline-flex items-center">
            Subscribe to Channel
            <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
