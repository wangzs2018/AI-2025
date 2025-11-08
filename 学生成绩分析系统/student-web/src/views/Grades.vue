<template>
  <div>
    <h2>成绩管理</h2>
    <el-table :data="grades" style="width: 100%">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="studentId" label="学生ID" />
      <el-table-column prop="courseId" label="课程ID" />
      <el-table-column prop="term" label="学期" />
      <el-table-column prop="scoreRaw" label="原始分" />
      <el-table-column prop="scoreFinal" label="最终分" />
      <el-table-column prop="gradePoint" label="绩点" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="mini" @click="editGrade(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="removeGrade(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="showAdd = true">新增成绩</el-button>
    <el-dialog v-model="showAdd" title="新增/编辑成绩">
      <el-form :model="form">
        <el-form-item label="学生ID"><el-input v-model="form.studentId" type="number" /></el-form-item>
        <el-form-item label="课程ID"><el-input v-model="form.courseId" type="number" /></el-form-item>
        <el-form-item label="学期"><el-input v-model="form.term" /></el-form-item>
        <el-form-item label="原始分"><el-input v-model="form.scoreRaw" type="number" /></el-form-item>
        <el-form-item label="最终分"><el-input v-model="form.scoreFinal" type="number" /></el-form-item>
        <el-form-item label="绩点"><el-input v-model="form.gradePoint" type="number" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAdd = false">取消</el-button>
        <el-button type="primary" @click="saveGrade">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getGrades, createGrade, updateGrade, deleteGrade } from '../api/grade';
const grades = ref([]);
const showAdd = ref(false);
const form = ref<any>({});
const editingId = ref<number|null>(null);

function load() {
  getGrades().then(res => {
    grades.value = res.data;
  });
}
function saveGrade() {
  if (editingId.value) {
    updateGrade(editingId.value, form.value).then(() => {
      showAdd.value = false; editingId.value = null; load();
    });
  } else {
    createGrade(form.value).then(() => {
      showAdd.value = false; load();
    });
  }
}
function editGrade(row: any) {
  form.value = { ...row };
  editingId.value = row.id;
  showAdd.value = true;
}
function removeGrade(id: number) {
  deleteGrade(id).then(() => load());
}
onMounted(load);
</script>
