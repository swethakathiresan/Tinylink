import './globals.css';
import Header from '../components/Header';

export const metadata = {
  title: 'TinyLink',
  description: 'TinyLink - URL shortener',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Header />
        <main className="max-w-5xl mx-auto p-4">{children}</main>
        <footer className="max-w-5xl mx-auto p-4 text-sm text-muted-foreground">
          <div className="text-center">TinyLink — built with ❤️</div>
        </footer>
      </body>
    </html>
  );
}
