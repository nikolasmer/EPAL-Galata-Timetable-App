
import React, { useState, useEffect, useCallback } from 'react';
import { fetchMetadata } from './services/timetableService';
import { TimetableMetadata, ToastMessage, ToastType } from './types';
import Spinner from './components/Spinner';
import Button from './components/Button';
import AdminModal from './components/AdminModal';
import LockIcon from './components/icons/LockIcon';
import RefreshIcon from './components/icons/RefreshIcon';
import Toast from './components/Toast';

const App: React.FC = () => {
  const [metadata, setMetadata] = useState<TimetableMetadata | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
  }, []);
  
  const removeToast = useCallback((id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const loadTimetableData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchMetadata();
      setMetadata(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      addToast(errorMessage, ToastType.Error);
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadTimetableData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUploadSuccess = (newMetadata: TimetableMetadata) => {
    setMetadata(newMetadata);
    addToast('Timetable updated successfully!', ToastType.Success);
  };
  
  const formatDate = (date: Date): string => {
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderContent = () => {
    if (isLoading && !metadata) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 text-slate-500">
          <Spinner className="w-12 h-12 text-blue-600" />
          <p className="mt-4 text-lg">Loading latest timetable...</p>
        </div>
      );
    }

    if (error && !metadata) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8 text-red-600">
          <p className="mb-4">{error}</p>
          <Button onClick={loadTimetableData}>Retry</Button>
        </div>
      );
    }
    
    if (metadata) {
      return (
         <>
          <a href={metadata.pdfUrl} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button className="w-full text-lg py-4 shadow-lg transform hover:scale-105">
              Download weekly PDF (Mon–Fri)
            </Button>
          </a>
          <p className="text-center text-sm text-slate-500 mt-6">
            Last updated: {formatDate(metadata.lastUpdated)}
          </p>
        </>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans relative">
       {/* Toast Container */}
      <div className="fixed top-5 right-5 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>

      <div className="w-full max-w-lg mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800">ΕΠΑΛ ΓΑΛΑΤΑ</h1>
          <h2 className="text-2xl font-semibold text-blue-600">TIMETABLE</h2>
        </header>

        <main className="bg-white p-8 rounded-xl shadow-md min-h-[250px] flex flex-col justify-center items-center relative">
          <button 
            onClick={loadTimetableData} 
            disabled={isLoading}
            className="absolute top-4 right-4 text-slate-400 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-wait"
            aria-label="Refresh timetable"
            >
            <RefreshIcon className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          {renderContent()}
        </main>

        <footer className="text-center mt-8">
           <button 
             onClick={() => setIsAdminModalOpen(true)}
             className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors"
           >
              <LockIcon className="w-4 h-4" />
              Admin Panel
            </button>
        </footer>
      </div>
      
      <AdminModal 
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default App;
