import type { Metadata } from 'next';
import { Playfair_Display, Cormorant_Garamond } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import './dubai-tokens.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Serving Dubai | Dole's Music",
  description: "Premium mixing, mastering, and sound design delivered remotely to Dubai's artists, brands, and storytellers — studio-quality results, anywhere you are.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable}`}>
      <body style={{ margin: 0, padding: 0, background: '#0A0A0A' }}>
        <Script id="microsoft-clarity" strategy="afterInteractive">{`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window, document, "clarity", "script", "wr3huogmiy");`}</Script>
        <Script id="disable-devtools" strategy="afterInteractive">{`
          (function(){
            document.addEventListener('contextmenu',function(e){e.preventDefault();});
            document.addEventListener('keydown',function(e){
              if(e.key==='F12')e.preventDefault();
              if(e.ctrlKey&&e.shiftKey&&(e.key==='I'||e.key==='J'||e.key==='C'))e.preventDefault();
              if(e.ctrlKey&&e.key==='u')e.preventDefault();
              if(e.metaKey&&e.altKey&&(e.key==='i'||e.key==='j'||e.key==='c'))e.preventDefault();
            });
          })();
        `}</Script>
        {children}
      </body>
    </html>
  );
}
