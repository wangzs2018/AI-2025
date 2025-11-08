import http from './http';

export function login(data: { username: string; password: string }) {
  return http.post('/api/v1/auth/login', data);
}

export function refresh() {
  return http.post('/api/v1/auth/refresh');
}

export function logout() {
  return http.post('/api/v1/auth/logout');
}
