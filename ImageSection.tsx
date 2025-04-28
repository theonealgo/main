// components/ImageSection.tsx
import Image from 'next/image';
import Link from 'next/link';

interface FeatureImage {
  img: string;
  alt: string;
  width: number;
  height: number;
  description: string;
}

interface ImageSectionProps {
  logoSrc?: string;
  videoSrc?: string;
  featureImages?: FeatureImage[];
  title?: string;
  subtitle?: string;
}

const ImageSection: React.FC<ImageSectionProps> = ({
  logoSrc,
  videoSrc,
  featureImages,
  title,
  subtitle,
}) => {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Hero Section with Logo */}
      {logoSrc && (
        <section className="relative min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/images/bground.jpg')" }}>
          <div className="absolute inset-0 video-fallback">
            {videoSrc && (
              <video
                autoPlay
                muted
                loop
                className="w-full h-full object-cover opacity-30"
                src={`/images/videos/${videoSrc}`}
              />
            )}
          </div>
          <div className="relative z-10 text-left px-4 max-w-6xl">
            <div className="flex items-center mb-12">
              <Link href="/">
                <Image
                  src={`/images/${logoSrc}`}
                  alt="Logo"
                  width={184}
                  height={184}
                  className="mr-8 cursor-pointer"
                />
              </Link>
            </div>
            {title && (
              <h1 className="text-5xl md:text-7xl font-bold gradient-text">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Feature Images Section */}
      {featureImages && (
        <section className="py-20 bg-gray-900">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            {featureImages.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700"
              >
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.alt}</h3>
                <Image
                  src={`/images/${feature.img}`}
                  alt={feature.alt}
                  width={feature.width}
                  height={feature.height}
                  className="w-full h-auto rounded"
                />
                <p className="text-gray-300 mt-4">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ImageSection;