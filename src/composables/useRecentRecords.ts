import { ref, reactive, onMounted } from 'vue'

// 雷同片段类型定义
export interface SimilarSegment {
  id: number
  similarity: string
  similarityValue: number
  leftContent: string
  rightContent: string
  leftPage: string
  rightPage: string
  level: 'high' | 'medium' | 'low'
}

// 属性对比详情类型
export interface PropertyDetail {
  name: string
  leftValue: string
  rightValue: string
  status: 'match' | 'mismatch' | 'warning'
}

// 定义最近记录类型
export interface RecentRecord {
  id: number
  filename: string
  timestamp: string
  similarity: string
  leftFileName: string
  rightFileName: string
  similarSegments?: SimilarSegment[]
  propertyDetails?: PropertyDetail[]
}

// 导出最近记录组合式函数
export function useRecentRecords(recordType: 'fileCompare' | 'propertyCheck') {
  // 响应式最近记录状态
  const showRecentRecords = ref(false)

  // 响应式最近对比记录数组
  const recentRecords = reactive<RecentRecord[]>([])

  // 生成存储键名
  const storageKey = `${recordType}RecentRecords`

  // 加载最近记录
  const loadRecentRecords = () => {
    const savedRecords = localStorage.getItem(storageKey)
    if (savedRecords) {
      try {
        const parsed = JSON.parse(savedRecords) as RecentRecord[]
        recentRecords.length = 0
        parsed.forEach(record => {
          recentRecords.push(record)
        })
        showRecentRecords.value = parsed.length > 0
      } catch (error) {
        console.error('加载最近记录失败:', error)
        recentRecords.length = 0
        showRecentRecords.value = false
      }
    }
  }

  // 保存最近记录
  const saveRecentRecords = () => {
    localStorage.setItem(storageKey, JSON.stringify(recentRecords))
    showRecentRecords.value = recentRecords.length > 0
  }

  // 添加新记录
  const addRecentRecord = (record: Omit<RecentRecord, 'id'>) => {
    // 生成唯一ID
    const newId = Math.max(0, ...recentRecords.map(r => r.id)) + 1
    // 创建新记录
    const newRecord: RecentRecord = {
      id: newId,
      ...record
    }
    // 添加到列表开头
    recentRecords.unshift(newRecord)
    // 限制最大记录数量为10
    if (recentRecords.length > 10) {
      recentRecords.pop()
    }
    // 保存记录
    saveRecentRecords()
    // 显示记录
    showRecentRecords.value = true
  }

  // 删除单条记录
  const deleteRecord = (id: number) => {
    const index = recentRecords.findIndex(record => record.id === id)
    if (index !== -1) {
      recentRecords.splice(index, 1)
      saveRecentRecords()
    }
  }

  // 一键清除记录
  const clearAllRecords = () => {
    recentRecords.length = 0
    showRecentRecords.value = false
    localStorage.removeItem(storageKey)
  }

  // 初始化时加载最近记录
  onMounted(() => {
    loadRecentRecords()
  })

  return {
    showRecentRecords,
    recentRecords,
    loadRecentRecords,
    saveRecentRecords,
    addRecentRecord,
    deleteRecord,
    clearAllRecords
  }
}
