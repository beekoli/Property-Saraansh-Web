interface Props {
  contentHtml: string;
}

export default function AboutSection({ contentHtml }: Props) {
  return (
    <section id="about" className="text-center max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-[#1e2333] mb-6 uppercase border-b-2 border-amber-500 pb-2 inline-block">About Project</h2>
      <div className="prose prose-lg mx-auto text-gray-600 leading-relaxed text-justify md:text-center" dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </section>
  );
}
