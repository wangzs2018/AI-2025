<template>
  <div>
    <h2>课程管理</h2>
    <el-table :data="courses" style="width: 100%">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="courseCode" label="课程代码" />
      <el-table-column prop="name" label="课程名称" />
      <el-table-column prop="credit" label="学分" />
      <el-table-column prop="dept" label="开课院系" />
      <el-table-column prop="term" label="学期" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="mini" @click="editCourse(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="removeCourse(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="showAdd = true">新增课程</el-button>
    <el-dialog v-model="showAdd" title="新增/编辑课程">
      <el-form :model="form">
        <el-form-item label="课程代码"><el-input v-model="form.courseCode" /></el-form-item>
        <el-form-item label="课程名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="学分"><el-input v-model="form.credit" type="number" /></el-form-item>
        <el-form-item label="开课院系"><el-input v-model="form.dept" /></el-form-item>
        <el-form-item label="学期"><el-input v-model="form.term" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAdd = false">取消</el-button>
        <el-button type="primary" @click="saveCourse">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../api/course';
const courses = ref([]);
const showAdd = ref(false);
const form = ref<any>({});
const editingId = ref<number|null>(null);

function load() {
  getCourses().then(res => {
    courses.value = res.data;
  });
}
function saveCourse() {
  if (editingId.value) {
    updateCourse(editingId.value, form.value).then(() => {
      showAdd.value = false; editingId.value = null; load();
    });
  } else {
    createCourse(form.value).then(() => {
      showAdd.value = false; load();
    });
  }
}
function editCourse(row: any) {
  form.value = { ...row };
  editingId.value = row.id;
  showAdd.value = true;
}
function removeCourse(id: number) {
  deleteCourse(id).then(() => load());
}
onMounted(load);
</script>
