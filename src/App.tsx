import { useState, useEffect, useCallback } from 'react';
import { TEMPLATES } from './data/templates';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { PhotoEditor } from './components/editor/PhotoEditor';
import { ParticipantGallery } from './components/history/ParticipantGallery';
import { CreatorProfilePage } from './components/home/CreatorProfilePage';
import { fetchParticipants, Participant } from './lib/supabase';

export function App() {
  const activeTemplate = TEMPLATES[0];

  const [currentView, setCurrentView] = useState<'home' | 'editor'>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#editor') {
      return 'editor';
    }
    return 'home';
  });

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);

  // Sync hash routing on popstate / hashchange
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#editor') {
        setCurrentView('editor');
      } else {
        setCurrentView('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToEditor = () => {
    window.location.hash = '#editor';
    setCurrentView('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    window.location.hash = '';
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadParticipants = useCallback(async () => {
    setIsLoadingParticipants(true);
    try {
      const data = await fetchParticipants();
      setParticipants(data);
    } catch {
      // Handled gracefully in fetchParticipants
    } finally {
      setIsLoadingParticipants(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    fetchParticipants().then((data) => {
      if (!ignore) {
        setParticipants(data);
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  // 1. Tampilan Awal: Profil Kreator Twibbonize
  if (currentView === 'home') {
    return (
      <CreatorProfilePage
        template={activeTemplate}
        onSelectTemplate={navigateToEditor}
        participantCount={participants.length}
      />
    );
  }

  // 2. Tampilan Studio Editor Twibbon
  return (
    <div className="min-h-screen flex flex-col bg-[#141517] text-white font-sans selection:bg-blue-600 selection:text-white antialiased">
      {/* Navbar with Twibbon Title & Kembali ke Profil */}
      <Navbar
        twibbonTitle={activeTemplate.name}
        onBackToHome={navigateToHome}
      />

      {/* Main Content: Dedicated Twibbon Studio */}
      <main className="flex-grow flex flex-col items-center">
        <PhotoEditor
          key={activeTemplate.id}
          template={activeTemplate}
          onParticipantAdded={loadParticipants}
        />

        {/* Supabase Public Participant Gallery */}
        <ParticipantGallery
          participants={participants}
          isLoading={isLoadingParticipants}
          onRefresh={loadParticipants}
        />
      </main>

      {/* Apple-style Footer */}
      <Footer />
    </div>
  );
}

export default App;
