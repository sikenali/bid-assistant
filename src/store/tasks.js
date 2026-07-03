const STORAGE_KEY = 'boomerang_tasks'

export function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export function addTask(task) {
  const tasks = loadTasks()
  const newTask = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    name: task.name,
    sourceType: task.sourceType,
    sourceUrl: task.sourceUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  tasks.unshift(newTask)
  saveTasks(tasks)
  return newTask
}

export function updateTask(id, updates) {
  const tasks = loadTasks()
  const idx = tasks.findIndex(t => t.id === id)
  if (idx === -1) return null
  tasks[idx] = { ...tasks[idx], ...updates, updatedAt: new Date().toISOString() }
  saveTasks(tasks)
  return tasks[idx]
}

export function deleteTask(id) {
  const tasks = loadTasks().filter(t => t.id !== id)
  saveTasks(tasks)
}

export function getTask(id) {
  return loadTasks().find(t => t.id === id) || null
}
