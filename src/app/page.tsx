'use client';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Home from '@/components/Home';

export default function Page() {


  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Home />
      </main>
      <Footer />
    </div>
  );
}
