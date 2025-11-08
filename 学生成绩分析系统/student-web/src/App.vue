<template>
  <div id="app">
    <el-menu mode="horizontal" router>
      <el-menu-item index="/students">学生管理</el-menu-item>
      <el-menu-item index="/courses">课程管理</el-menu-item>
      <el-menu-item index="/grades">成绩管理</el-menu-item>
      <el-menu-item index="/reports">报表导出</el-menu-item>
    </el-menu>
    <router-view />
  </div>
</template>
<script setup lang="ts">
</script>
<style>
#app {
  font-family: Arial, sans-serif;
}
</style>
