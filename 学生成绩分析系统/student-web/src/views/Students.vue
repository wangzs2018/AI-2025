<template>
  <div>
    <h2>学生管理</h2>
    <el-table :data="students" style="width: 100%">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="studentNo" label="学号" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="gender" label="性别" />
      <el-table-column prop="enrollYear" label="入学年份" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="mini" @click="editStudent(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="removeStudent(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="showAdd = true">新增学生</el-button>
    <el-dialog v-model="showAdd" title="新增/编辑学生">
      <el-form :model="form">
        <el-form-item label="学号"><el-input v-model="form.studentNo" /></el-form-item>
        <el-form-item label="姓名"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="性别"><el-select v-model="form.gender"><el-option label="男" value="男" /><el-option label="女" value="女" /></el-select></el-form-item>
        <el-form-item label="入学年份"><el-input v-model="form.enrollYear" type="number" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAdd = false">取消</el-button>
        <el-button type="primary" @click="saveStudent">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../api/student';
const students = ref([]);
const showAdd = ref(false);
const form = ref<any>({});
const editingId = ref<number|null>(null);

function load() {
  getStudents().then(res => {
    students.value = res.data;
  });
}
function saveStudent() {
  if (editingId.value) {
    updateStudent(editingId.value, form.value).then(() => {
      showAdd.value = false; editingId.value = null; load();
    });
  } else {
    createStudent(form.value).then(() => {
      showAdd.value = false; load();
    });
  }
}
function editStudent(row: any) {
  form.value = { ...row };
  editingId.value = row.id;
  showAdd.value = true;
}
function removeStudent(id: number) {
  deleteStudent(id).then(() => load());
}
onMounted(load);
</script>
