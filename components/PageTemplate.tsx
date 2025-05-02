// components/PageTemplate.tsx
import Header from './Header';
import Footer from './Footer';

interface PageTemplateProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageTemplate({ 
  children,
  className = ''
}: PageTemplateProps) {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
