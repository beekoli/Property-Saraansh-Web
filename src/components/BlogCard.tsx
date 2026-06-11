import Link from 'next/link';

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  thumbnail: string;
}

export default function BlogCard({ id, title, excerpt, category, author, date, readTime, thumbnail }: BlogCardProps) {
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-brand-pale flex flex-col h-full">
      <Link href={`/blog/${id}`} className="relative h-48 overflow-hidden block">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${thumbnail})` }}
        ></div>
        <div className="absolute top-4 left-4 bg-brand-primary text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full shadow">
          {category}
        </div>
      </Link>
      
      <div className="p-5 flex-grow flex flex-col">
        <Link href={`/blog/${id}`} className="block flex-grow">
          <h3 className="text-xl heading-playfair text-brand-ink mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors">{title}</h3>
          <p className="text-brand-dark/70 text-sm line-clamp-2 mb-4 leading-relaxed">
            {excerpt}
          </p>
        </Link>
        
        <div className="flex items-center justify-between border-t border-brand-pale pt-4 mt-auto">
          <div className="flex items-center">
            {/* Author Avatar Placeholder */}
            <div className="w-8 h-8 rounded-full bg-brand-pale border border-brand-light mr-2 flex items-center justify-center overflow-hidden">
               <svg className="w-4 h-4 text-brand-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-brand-ink">{author}</p>
              <p className="text-[10px] text-brand-light">{date}</p>
            </div>
          </div>
          <div className="bg-brand-pale text-brand-primary text-[10px] font-bold px-2 py-1 rounded">
            {readTime}
          </div>
        </div>
      </div>
    </div>
  );
}
