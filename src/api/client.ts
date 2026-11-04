import axios, { isAxiosError, type AxiosResponse } from 'axios';

import { API_BASE_URL } from '@/config/env';

export class ApiError extends Error {
  code: string;
  fieldErrors?: Record<string, string>;

  constructor(code: string, message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

type ErrorBody = { code?: string; message?: string; fieldErrors?: Record<string, string> };

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }
  if (isAxiosError<ErrorBody>(error)) {
    if (!error.response) {
      return new ApiError('NETWORK_ERROR', 'Check your internet connection and try again.');
    }
    const body = error.response.data;
    return new ApiError(
      body?.code ?? `HTTP_${error.response.status}`,
      body?.message ?? 'Something went wrong. Please try again.',
      body?.fieldErrors
    );
  }
  return new ApiError('UNKNOWN', error instanceof Error ? error.message : 'Something went wrong.');
}

apiClient.interceptors.response.use(undefined, (error) => Promise.reject(toApiError(error)));

export const errorMessage = (error: unknown) => toApiError(error).message;

export const unwrap = <T>(request: Promise<AxiosResponse<T>>) => request.then((response) => response.data);
