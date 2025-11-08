import http from './http';

export function getStudents() {
  return http.get('/api/v1/students');
}

export function getStudent(id: number) {
  return http.get(`/api/v1/students/${id}`);
}

export function createStudent(data: any) {
  return http.post('/api/v1/students', data);
}

export function updateStudent(id: number, data: any) {
  return http.put(`/api/v1/students/${id}`, data);
}

export function deleteStudent(id: number) {
  return http.delete(`/api/v1/students/${id}`);
}
