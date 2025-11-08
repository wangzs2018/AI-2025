


import { createRouter, createWebHistory } from 'vue-router';
import Students from '../views/Students.vue';
import Courses from '../views/Courses.vue';
import Grades from '../views/Grades.vue';
import Reports from '../views/Reports.vue';
import Login from '../views/Login.vue';

const routes = [
	{ path: '/login', component: Login },
	{ path: '/students', component: Students },
	{ path: '/courses', component: Courses },
	{ path: '/grades', component: Grades },
	{ path: '/reports', component: Reports },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
