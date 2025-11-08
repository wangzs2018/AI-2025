<template>
  <div>
    <h2>成绩报表导出</h2>
    <el-button type="primary" @click="download">导出成绩CSV</el-button>
  </div>
</template>
<script setup lang="ts">
import { exportGrades } from '../api/report';
function download() {
  exportGrades().then(res => {
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'grades.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}
</script>
