
import { TimetableMetadata } from '../types';

// Mock database state
let mockData: TimetableMetadata = {
  pdfUrl: '/mock-timetable.pdf', // A placeholder URL
  lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000), // Set to yesterday
};

// Simulate network latency
const networkDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Fetches the current timetable metadata.
 * Simulates a network request to Firestore.
 */
export const fetchMetadata = async (): Promise<TimetableMetadata> => {
  console.log("Fetching metadata...");
  await networkDelay(800);
  // Simulate a potential failure
  if (Math.random() < 0.05) { // 5% chance of failure
    throw new Error("Failed to connect to the server. Please try again.");
  }
  return { ...mockData };
};

/**
 * Simulates uploading a new PDF and updating the metadata.
 * @param file The new PDF file to "upload".
 */
export const uploadPdfAndUpdateMetadata = async (file: File): Promise<TimetableMetadata> => {
  console.log(`Uploading file: ${file.name}...`);
  await networkDelay(1500);
  
  if (file.type !== 'application/pdf') {
      throw new Error("Invalid file type. Please upload a PDF.");
  }
  
  if (Math.random() < 0.1) { // 10% chance of upload failure
      throw new Error("Upload failed. Please check your connection and try again.");
  }

  // In a real app, this URL would come from Firebase Storage.
  const newPdfUrl = URL.createObjectURL(file);
  
  // Update mock data
  mockData = {
    pdfUrl: newPdfUrl,
    lastUpdated: new Date(),
  };
  
  console.log("Upload successful. Metadata updated.");
  return { ...mockData };
};
