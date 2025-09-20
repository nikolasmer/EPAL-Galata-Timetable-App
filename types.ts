
export interface TimetableMetadata {
  pdfUrl: string;
  lastUpdated: Date;
}

export enum ToastType {
  Success = 'success',
  Error = 'error',
}

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}
