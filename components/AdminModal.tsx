
import React, { useState, useCallback, useRef } from 'react';
import { ADMIN_PASSWORD } from '../constants';
import { TimetableMetadata } from '../types';
import { uploadPdfAndUpdateMetadata } from '../services/timetableService';
import Button from './Button';
import CloseIcon from './icons/CloseIcon';
import UploadIcon from './icons/UploadIcon';
import Spinner from './Spinner';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newMetadata: TimetableMetadata) => void;
}

const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, onUploadSuccess }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = useCallback(() => {
    setPassword('');
    setIsAuthenticated(false);
    setError(null);
    setIsLoading(false);
    setSelectedFile(null);
  }, []);

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError("Incorrect password.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a PDF file to upload.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const newMetadata = await uploadPdfAndUpdateMetadata(selectedFile);
      onUploadSuccess(newMetadata);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={handleClose}>
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between p-4 border-b rounded-t">
          <h3 className="text-xl font-semibold text-gray-900">
            {isAuthenticated ? 'Upload New Timetable' : 'Admin Access'}
          </h3>
          <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" onClick={handleClose}>
            <CloseIcon className="w-4 h-4" />
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {!isAuthenticated ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
               <Button type="submit" className="w-full">Login</Button>
            </form>
          ) : (
            <div className="space-y-4">
                <div 
                    className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <UploadIcon className="w-10 h-10 text-gray-500 mb-3" />
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">PDF file only</p>
                    <input ref={fileInputRef} id="file-upload" type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} />
                </div>
                {selectedFile && <p className="text-sm text-center text-gray-700">Selected file: <span className="font-medium">{selectedFile.name}</span></p>}
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                <Button onClick={handleUpload} isLoading={isLoading} disabled={!selectedFile} className="w-full">
                    {isLoading ? 'Uploading...' : 'Upload & Update'}
                </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminModal;
