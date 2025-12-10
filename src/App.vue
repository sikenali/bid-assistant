<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { RiExchangeLine, RiFileLine, RiSearchLine, RiSettings3Line } from '@remixicon/vue'

const route = useRoute()
const router = useRouter()

// 计算当前激活的菜单
const activeMenu = computed(() => {
  if (route.path === '/') return 'file-compare'
  if (route.path === '/property-check') return 'property-check'
  if (route.path === '/settings') return 'system-settings'
  return 'file-compare'
})

// 处理菜单点击事件，跳转到对应路由
const handleMenuClick = (menu: string) => {
  switch (menu) {
    case 'file-compare':
      router.push('/file-compare')
      break
    case 'property-check':
      router.push('/property-check')
      break
    case 'system-settings':
      router.push('/settings')
      break
  }
}
</script>

<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-left">
        <div class="logo">
          <div class="logo-icon-container">
            <RiExchangeLine class="logo-icon" />
          </div>
          <span class="logo-text">文件对对碰</span>
          <span class="logo-subtitle">专业文档对比工具</span>
        </div>
      </div>
      <div class="header-right">
        <!-- 移除了右上角图标 -->
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 左侧功能导航 -->
      <aside class="sidebar">
        <nav class="nav-menu">
          <!-- 移除了功能导航标题 -->
          <button 
            class="nav-item" 
            :class="{ active: activeMenu === 'file-compare' }"
            @click="handleMenuClick('file-compare')"
          >
            <span class="nav-icon"><RiFileLine /></span>
            <span class="nav-text">文件对比</span>
          </button>
          <button 
            class="nav-item" 
            :class="{ active: activeMenu === 'property-check' }"
            @click="handleMenuClick('property-check')"
          >
            <span class="nav-icon"><RiSearchLine /></span>
            <span class="nav-text">属性检查</span>
          </button>
          <button 
            class="nav-item" 
            :class="{ active: activeMenu === 'system-settings' }"
            @click="handleMenuClick('system-settings')"
          >
            <span class="nav-icon"><RiSettings3Line /></span>
            <span class="nav-text">系统设置</span>
          </button>
        </nav>
        <div class="version">V1.0.0</div>
      </aside>

      <!-- 右侧内容区域 -->
      <section class="content-area">
        <router-view />
      </section>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  width: 1440px;
  height: 800px;
  margin: 0 auto;
  font-family: SourceHanSans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: linear-gradient(180deg, rgba(239,246,255,1) 0%, rgba(224,231,255,1) 100%);
  overflow: hidden;
}

/* 顶部导航栏 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 24px;
  height: 70x;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
  margin: 8px;
  width: calc(100% - 16px);
  box-sizing: border-box;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon-container {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(90deg, #3B82F6 0%, #4F46E5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.logo-icon {
  font-size: 16px;
  color: white;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: #1A1A1A;
  font-family: SourceHanSans-SemiBold;
}

.logo-subtitle {
  font-size: 12px;
  color: #888888;
  margin-left: 8px;
  padding-left: 12px;
  border-left: 1px solid rgba(255, 255, 255, 0.5);
}

.header-right {
  display: flex;
  gap: 16px;
}

.header-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  color: #4B5563;
}

.header-btn:hover {
  background-color: #3B82F6;
  color: white;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

/* 主内容区域 */
.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
  margin: 0 8px 8px;
  gap: 16px;
  /* 确保子元素不超出边界 */
  box-sizing: border-box;
}

/* 左侧导航栏 */
.sidebar {
  width: 256px;
  height: 700px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  box-sizing: border-box;
  /* 修复圆角显示问题 */
  overflow: hidden;
  /* 单独设置滚动 */
  overflow-y: auto;
}

.nav-menu {
  padding: 0;
}

.nav-title {
  padding: 0 0 12px;
  font-size: 12px;
  color: #888888;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: SourceHanSans-SemiBold;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 44px;
  padding: 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 15px;
  color: #555555;
  transition: all 0.3s ease;
  text-align: left;
  border-radius: 12px;
  margin-bottom: 8px;
  font-family: SourceHanSans-Regular;
}

.nav-item:hover {
  background-color: rgba(249, 250, 251, 0.5);
  color: #3B82F6;
}

.nav-item.active {
  background-color: rgba(239, 246, 255, 0.5);
  border: 1px solid #DBEAFE;
  color: #1A1A1A;
  border-radius: 12px;
}

.nav-icon {
  font-size: 20px;
  color: #6B7280;
  width: 20px;
  height: 20px;
  display: inline-block;
  text-align: center;
}

.nav-item.active .nav-icon {
  color: #3B82F6;
}

.nav-text {
  flex: 1;
  font-weight: 500;
}

.version {
  margin-top: auto;
  margin-right: 20px;
  margin-bottom: 20px;
  margin-left: 20px;
  padding: 12px 20px;
  font-size: 12px;
  color: #888888;
  text-align: center;
  border-top: 0.6667px solid rgba(255, 255, 255, 0.5);
  font-family: SourceHanSans-Regular;
}

/* 右侧内容区域 */
.content-area {
  flex: 1;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  border: 0.6667px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 8px 32px rgba(31, 38, 135, 0.05);
  overflow: hidden;
  padding: 0;
  box-sizing: border-box;
  height: 700px;
  /* 确保内容区域不超出边界 */
  width: calc(100% - 16px);
}
</style>
