export interface GeminiQueryRequest {
  query: string;
}

export interface GeminiQueryResponse {
  response: string;
  query?: string;
  error?: string;
}
