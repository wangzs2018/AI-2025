import http from './http';

export function getGrades() {
  return http.get('/api/v1/grades');
}

export function getGrade(id: number) {
  return http.get(`/api/v1/grades/${id}`);
}

export function createGrade(data: any) {
  return http.post('/api/v1/grades', data);
}

export function updateGrade(id: number, data: any) {
  return http.put(`/api/v1/grades/${id}`, data);
}

export function deleteGrade(id: number) {
  return http.delete(`/api/v1/grades/${id}`);
}
