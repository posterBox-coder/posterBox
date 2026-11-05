import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import { mockRequest } from '@/helpers/auth';

export type KycStatus = 'not_started' | 'pending' | 'verified';

export type KycIdDetails = {
  fullName: string;
  dateOfBirth: string;
  stateOfResidence: string;
  idType: string;
  idNumber: string;
  idImageUri: string | null;
};

type KycContextValue = {
  idDetails: KycIdDetails;
  selfieUri: string | null;
  status: KycStatus;
  submittedAt: string | null;
  isIdComplete: boolean;
  isSelfieComplete: boolean;
  saveIdDetails: (details: KycIdDetails) => void;
  saveSelfie: (uri: string) => void;
  submitForReview: () => Promise<void>;
  markVerified: () => void;
};

const emptyIdDetails: KycIdDetails = {
  fullName: '',
  dateOfBirth: '',
  stateOfResidence: '',
  idType: '',
  idNumber: '',
  idImageUri: null,
};

const KycContext = createContext<KycContextValue | null>(null);

export function KycProvider({ children }: PropsWithChildren) {
  const [idDetails, setIdDetails] = useState<KycIdDetails>(emptyIdDetails);
  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const [status, setStatus] = useState<KycStatus>('not_started');
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);

  const isIdComplete = Boolean(
    idDetails.fullName &&
      idDetails.dateOfBirth &&
      idDetails.stateOfResidence &&
      idDetails.idType &&
      idDetails.idNumber &&
      idDetails.idImageUri
  );
  const isSelfieComplete = Boolean(selfieUri);

  const saveIdDetails = useCallback((details: KycIdDetails) => {
    setIdDetails(details);
  }, []);

  const saveSelfie = useCallback((uri: string) => {
    setSelfieUri(uri);
  }, []);

  const submitForReview = useCallback(async () => {
    await mockRequest();
    setStatus('pending');
    setSubmittedAt(
      new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    );
  }, []);

  const markVerified = useCallback(() => {
    setStatus('verified');
  }, []);

  const value = useMemo(
    () => ({
      idDetails,
      selfieUri,
      status,
      submittedAt,
      isIdComplete,
      isSelfieComplete,
      saveIdDetails,
      saveSelfie,
      submitForReview,
      markVerified,
    }),
    [
      idDetails,
      selfieUri,
      status,
      submittedAt,
      isIdComplete,
      isSelfieComplete,
      saveIdDetails,
      saveSelfie,
      submitForReview,
      markVerified,
    ]
  );

  return <KycContext.Provider value={value}>{children}</KycContext.Provider>;
}

export function useKyc() {
  const context = useContext(KycContext);
  if (!context) {
    throw new Error('useKyc must be used within KycProvider');
  }
  return context;
}
