export interface Patient {
  id: string;
  name: string;
  email: string;
  sex: string;
  age: number;
  address: string;
  phoneNumber?: string;
}

export interface PatientFilterParams {
  Page: number;
  PageSize: number;
  SearchTerm?: string;
  Sex?: string;
  MinAge?: number;
  MaxAge?: number;
  Address?: string;
}

export interface PaginatedResponse<T> {
  items: T[]; // Adjust based on your actual backend wrapper layout (e.g., 'data' or 'items')
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}