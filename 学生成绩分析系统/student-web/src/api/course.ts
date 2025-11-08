import http from './http';

export function getCourses() {
  return http.get('/api/v1/courses');
}

export function getCourse(id: number) {
  return http.get(`/api/v1/courses/${id}`);
}

export function createCourse(data: any) {
  return http.post('/api/v1/courses', data);
}

export function updateCourse(id: number, data: any) {
  return http.put(`/api/v1/courses/${id}`, data);
}

export function deleteCourse(id: number) {
  return http.delete(`/api/v1/courses/${id}`);
}
