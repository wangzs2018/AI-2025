import http from './http';

export function exportGrades() {
  return http.get('/api/v1/reports/export', { responseType: 'blob' });
}
