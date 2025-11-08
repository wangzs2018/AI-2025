<template>
  <div class="login">
    <el-form :model="form" @submit.prevent="onLogin">
      <el-form-item label="用户名"><el-input v-model="form.username" /></el-form-item>
      <el-form-item label="密码"><el-input v-model="form.password" type="password" /></el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { login } from '../api/auth';
const form = ref({ username: '', password: '' });
function onLogin() {
  login(form.value).then(res => {
    localStorage.setItem('token', res.data.token);
    window.location.href = '/students';
  });
}
</script>
