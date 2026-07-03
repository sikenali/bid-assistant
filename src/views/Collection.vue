<template>
  <div class="app-container">
    <!-- Top Navigation Bar -->
    <header class="navbar">
      <div class="navbar-brand">
        <div class="logo-icon">
          <i class="ri-bookmark-2-line"></i>
        </div>
        <span class="brand-name">猩文标聚</span>
        <span class="brand-sub">sikenali · 文档智能处理平台</span>
      </div>
      <div class="navbar-actions">
        <button class="btn-icon back-btn" @click="$router.push('/')" title="返回首页">
          <i class="ri-arrow-left-line"></i>
        </button>
        <button class="btn-icon settings-btn" title="设置">
          <i class="ri-settings-3-line"></i>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <router-link to="/" class="bc-link">首页</router-link>
        <span class="bc-sep">/</span>
        <span class="bc-current">文取猩</span>
      </nav>

      <!-- Header Section -->
      <section class="page-header">
        <div class="header-icon">
          <i class="ri-inbox-line"></i>
        </div>
        <div class="header-text">
          <h1 class="page-title">智能采集</h1>
          <p class="page-desc">从各类来源提取文档内容，让数据处理更高效</p>
        </div>
      </section>

      <!-- Actions Bar -->
      <section class="actions-bar">
        <button class="btn-primary" @click="showForm = true">
          <i class="ri-add-line"></i>
          新建采集任务
        </button>
        <button class="btn-secondary">
          <i class="ri-upload-2-line"></i>
          批量导入
        </button>
      </section>

      <!-- New Task Form -->
      <section v-if="showForm" class="form-panel">
        <div class="form-header">
          <h3 class="form-title">新建采集任务</h3>
          <button class="btn-close" @click="showForm = false">
            <i class="ri-close-line"></i>
          </button>
        </div>
        <form @submit.prevent="handleSubmit" class="form-body">
          <div class="form-row">
            <label class="form-label">任务名称</label>
            <input
              v-model="form.name"
              type="text"
              class="form-input"
              placeholder="请输入任务名称"
              required
            />
          </div>
          <div class="form-row">
            <label class="form-label">来源类型</label>
            <select v-model="form.sourceType" class="form-select" required>
              <option value="">请选择来源类型</option>
              <option value="url">URL采集</option>
              <option value="upload">文件上传</option>
              <option value="api">API对接</option>
              <option value="database">数据库导入</option>
            </select>
          </div>
          <div class="form-row">
            <label class="form-label">来源地址</label>
            <input
              v-model="form.sourceUrl"
              type="text"
              class="form-input"
              placeholder="请输入来源地址或文件路径"
              required
            />
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="showForm = false">取消</button>
            <button type="submit" class="btn-submit">创建任务</button>
          </div>
        </form>
      </section>

      <!-- Task List -->
      <section class="task-list">
        <div v-if="tasks.length === 0" class="empty-state">
          <i class="ri-inbox-line"></i>
          <p>暂无采集任务</p>
          <button class="btn-text" @click="showForm = true">立即创建</button>
        </div>
        <div v-else class="table-wrapper">
          <table class="task-table">
            <thead>
              <tr>
                <th class="th-name">任务名称</th>
                <th class="th-source">来源类型</th>
                <th class="th-url">来源地址</th>
                <th class="th-time">创建时间</th>
                <th class="th-action">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="task in tasks" :key="task.id" class="table-row">
                <td class="td-name">
                  <span class="task-name">{{ task.name }}</span>
                </td>
                <td class="td-source">
                  <span class="source-tag" :class="'source-' + task.sourceType">
                    {{ sourceTypeLabel(task.sourceType) }}
                  </span>
                </td>
                <td class="td-url">
                  <span class="url-text" :title="task.sourceUrl">{{ task.sourceUrl }}</span>
                </td>
                <td class="td-time">{{ formatDate(task.createdAt) }}</td>
                <td class="td-action">
                  <button class="btn-edit" @click="editTask(task)" title="编辑">
                    <i class="ri-edit-line"></i>
                  </button>
                  <button class="btn-delete" @click="deleteTaskFn(task.id)" title="删除">
                    <i class="ri-delete-bin-line"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  loadTasks,
  addTask,
  updateTask,
  deleteTask,
} from '../store/tasks.js'

const tasks = ref([])
const showForm = ref(false)
const editingId = ref(null)

const form = ref({
  name: '',
  sourceType: '',
  sourceUrl: '',
})

onMounted(() => {
  tasks.value = loadTasks()
})

function resetForm() {
  form.value = { name: '', sourceType: '', sourceUrl: '' }
  editingId.value = null
}

function handleSubmit() {
  if (editingId.value) {
    updateTask(editingId.value, form.value)
  } else {
    addTask(form.value)
  }
  tasks.value = loadTasks()
  resetForm()
  showForm.value = false
}

function editTask(task) {
  form.value = {
    name: task.name,
    sourceType: task.sourceType,
    sourceUrl: task.sourceUrl,
  }
  editingId.value = task.id
  showForm.value = true
}

function deleteTaskFn(id) {
  if (confirm('确定删除此任务？')) {
    deleteTask(id)
    tasks.value = loadTasks()
  }
}

function sourceTypeLabel(type) {
  const map = {
    url: 'URL采集',
    upload: '文件上传',
    api: 'API对接',
    database: '数据库导入',
  }
  return map[type] || type
}

function formatDate(iso) {
  const d = new Date(iso)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
</script>

<style scoped>
/* Navbar */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 40px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: var(--brand-red);
  border-radius: var(--radius-round);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 26px;
}

.brand-name {
  font-size: 24px;
  font-weight: 700;
  color: var(--brand-red);
  letter-spacing: 2px;
}

.brand-sub {
  font-size: 12px;
  color: var(--text-secondary);
  margin-left: -4px;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-round);
  background: var(--bg-white);
  border: 0.7px solid var(--border-light);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: rgba(91, 74, 58, 1);
  transition: box-shadow 0.2s;
}

.btn-icon:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 40px 80px 80px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 32px;
}

.bc-link {
  color: var(--text-secondary);
  transition: color 0.2s;
}

.bc-link:hover {
  color: var(--brand-red);
}

.bc-sep {
  color: var(--border-light);
}

.bc-current {
  color: var(--text-primary);
  font-weight: 500;
}

/* Page Header */
.page-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
}

.header-icon {
  width: 72px;
  height: 72px;
  background: rgba(253, 242, 238, 1);
  border-radius: var(--radius-round);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: var(--brand-red);
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
}

.page-desc {
  margin-top: 4px;
  font-size: 14px;
  color: var(--text-muted);
}

/* Actions Bar */
.actions-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--brand-red);
  color: #fff;
  font-size: 15px;
  font-weight: 500;
  border-radius: 8px;
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--bg-white);
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 500;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  transition: box-shadow 0.2s;
}

.btn-secondary:hover {
  box-shadow: var(--shadow-sm);
}

/* Form Panel */
.form-panel {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-md);
  padding: 24px;
  margin-bottom: 32px;
  animation: slideDown 0.25s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-12px); }
  to { opacity: 1; transform: translateY(0); }
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.form-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.btn-close {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.btn-close:hover {
  background: rgba(0,0,0,0.04);
}

.form-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.form-input,
.form-select {
  padding: 10px 14px;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  font-size: 14px;
  color: var(--text-primary);
  background: var(--bg-primary);
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus {
  border-color: var(--brand-red);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.btn-cancel {
  padding: 10px 20px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid var(--border-light);
  transition: background 0.2s;
}

.btn-cancel:hover {
  background: rgba(0,0,0,0.03);
}

.btn-submit {
  padding: 10px 20px;
  background: var(--brand-red);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  transition: opacity 0.2s;
}

.btn-submit:hover {
  opacity: 0.9;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: var(--text-secondary);
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
  color: var(--border-light);
}

.empty-state p {
  font-size: 16px;
  margin-bottom: 16px;
}

.btn-text {
  background: none;
  color: var(--brand-red);
  font-size: 14px;
  font-weight: 500;
  text-decoration: underline;
}

/* Table */
.table-wrapper {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.task-table {
  width: 100%;
  border-collapse: collapse;
}

.task-table th {
  padding: 14px 20px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  background: rgba(250, 247, 242, 1);
  border-bottom: 1px solid var(--border-light);
  letter-spacing: 0.5px;
}

.th-name { width: 25%; }
.th-source { width: 18%; }
.th-url { width: 35%; }
.th-time { width: 15%; }
.th-action { width: 7%; text-align: center; }

.table-row {
  transition: background 0.15s;
}

.table-row:hover {
  background: rgba(255, 248, 240, 0.3);
}

.task-table td {
  padding: 14px 20px;
  font-size: 14px;
  color: var(--text-primary);
  border-bottom: 1px solid rgba(232, 213, 192, 0.3);
}

.td-name {
  font-weight: 500;
}

.source-tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.source-url {
  background: rgba(196, 58, 49, 0.08);
  color: var(--brand-red);
}

.source-upload {
  background: rgba(200, 164, 92, 0.08);
  color: var(--brand-gold);
}

.source-api {
  background: rgba(91, 140, 90, 0.08);
  color: var(--brand-green);
}

.source-database {
  background: rgba(123, 158, 179, 0.08);
  color: var(--brand-blue);
}

.url-text {
  display: block;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-muted);
  font-size: 13px;
}

.td-time {
  color: var(--text-secondary);
  font-size: 13px;
}

.td-action {
  text-align: center;
}

.btn-edit,
.btn-delete {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: background 0.15s;
}

.btn-edit {
  background: transparent;
  color: var(--brand-blue);
}

.btn-edit:hover {
  background: rgba(123, 158, 179, 0.1);
}

.btn-delete {
  background: transparent;
  color: var(--brand-pink);
}

.btn-delete:hover {
  background: rgba(184, 84, 80, 0.1);
}
</style>
