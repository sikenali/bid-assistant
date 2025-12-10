<script setup lang="ts">
import { ref } from 'vue'
import { useSettings } from '../composables/useSettings'

// 使用设置组合式函数
const { 
  settings, 
  saveSettings: handleSaveSettings, 
  cancelSettings: handleCancelSettings 
} = useSettings()

// 当前选中的标签页
const activeTab = ref('general')
</script>

<template>
  <div class="system-settings-container">


    <!-- 标签页导航 -->
    <div class="tab-navigation">
      <button 
        class="tab-item" 
        :class="{ active: activeTab === 'general' }"
        @click="activeTab = 'general'"
      >
        常规设置
      </button>
      <button 
        class="tab-item" 
        :class="{ active: activeTab === 'advanced' }"
        @click="activeTab = 'advanced'"
      >
        高级设置
      </button>
    </div>

    <!-- 内容区域 -->
    <div class="settings-content">
      <!-- 常规设置 -->
      <div v-if="activeTab === 'general'" class="tab-content">
        <div class="section-header">
          <div>
            <h2 class="section-title">查重参数设置</h2>
            <p class="section-desc">调整文本查重的灵敏度和匹配规则</p>
          </div>
          <div class="settings-actions">
            <button class="cancel-btn" @click="handleCancelSettings">取消</button>
            <button class="save-btn" @click="handleSaveSettings">保存</button>
          </div>
        </div>

        <div class="setting-group">
          <!-- 最小查重字数 -->
          <div class="setting-item">
            <div class="setting-info">
              <label class="setting-label">最小查重字数</label>
              <p class="setting-description">连续匹配的最小字数，低于此值不标记为重复</p>
            </div>
            <div class="setting-control">
              <input 
                type="number" 
                v-model.number="settings.minDuplicateWords" 
                min="1" 
                max="100"
                class="input-field"
              />
            </div>
          </div>

          <!-- 文本相似度阈值 -->
          <div class="setting-item">
            <div class="setting-info">
              <label class="setting-label">文本相似度阈值</label>
              <p class="setting-description">文本片段相似度达到百分比即标记为重复</p>
            </div>
            <div class="setting-control">
              <input 
                type="number" 
                v-model.number="settings.textSimilarityThreshold" 
                min="1" 
                max="100"
                class="input-field"
              />
            </div>
          </div>

          <!-- 图片相似度阈值 -->
          <div class="setting-item">
            <div class="setting-info">
              <label class="setting-label">图片相似度阈值</label>
              <p class="setting-description">图片相似度达到百分比即标记为相似</p>
            </div>
            <div class="setting-control">
              <input 
                type="number" 
                v-model.number="settings.imageSimilarityThreshold" 
                min="1" 
                max="100"
                class="input-field"
              />
            </div>
          </div>

          <!-- 忽略标点符号 -->
          <div class="setting-item">
            <div class="setting-info">
              <label class="setting-label">忽略标点符号</label>
              <p class="setting-description">查重时是否忽略标点符号差异</p>
            </div>
            <div class="setting-control">
              <label class="switch-btn">
                <input type="checkbox" v-model="settings.ignorePunctuation" class="switch-input" />
                <span class="switch-slider"></span>
              </label>
            </div>
          </div>

          <!-- 忽略空格差异 -->
          <div class="setting-item">
            <div class="setting-info">
              <label class="setting-label">忽略空格差异</label>
              <p class="setting-description">查重时是否忽略空格数量和位置差异</p>
            </div>
            <div class="setting-control">
              <label class="switch-btn">
                <input type="checkbox" v-model="settings.ignoreWhitespace" class="switch-input" />
                <span class="switch-slider"></span>
              </label>
            </div>
          </div>

          <!-- 忽略大小写 -->
          <div class="setting-item">
            <div class="setting-info">
              <label class="setting-label">忽略大小写</label>
              <p class="setting-description">查重时是否忽略英文字母大小写差异</p>
            </div>
            <div class="setting-control">
              <label class="switch-btn">
                <input type="checkbox" v-model="settings.ignoreCase" class="switch-input" />
                <span class="switch-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 高级设置 -->
      <div v-else-if="activeTab === 'advanced'" class="tab-content">
        <div class="section-header">
          <div>
            <!-- AI模型配置 -->
            <h2 class="section-title">AI模型配置</h2>
            <p class="section-desc">选择适合您需求的AI模型</p>
          </div>
          <div class="settings-actions">
            <button class="cancel-btn" @click="handleCancelSettings">取消</button>
            <button class="save-btn" @click="handleSaveSettings">保存</button>
          </div>
        </div>

        <!-- API设置区域 -->
        <div class="api-settings">
          <p class="api-info">配置AI模型和API密钥以使用AI功能</p>
          
          <div class="api-setting-item">
            <label class="api-label">AI模型选择</label>
            <div class="model-radio-group">
              <label class="model-radio-item">
                <input 
                  type="radio" 
                  v-model="settings.selectedModel" 
                  value="gpt-3.5" 
                  class="model-radio-input" 
                />
                <span class="model-radio-label">GPT-3.5</span>
              </label>
              <label class="model-radio-item">
                <input 
                  type="radio" 
                  v-model="settings.selectedModel" 
                  value="gpt-4" 
                  class="model-radio-input" 
                />
                <span class="model-radio-label">GPT-4</span>
              </label>
              <label class="model-radio-item">
                <input 
                  type="radio" 
                  v-model="settings.selectedModel" 
                  value="gemini" 
                  class="model-radio-input" 
                />
                <span class="model-radio-label">Gemini</span>
              </label>
              <label class="model-radio-item">
                <input 
                  type="radio" 
                  v-model="settings.selectedModel" 
                  value="claude" 
                  class="model-radio-input" 
                />
                <span class="model-radio-label">Claude</span>
              </label>
            </div>
          </div>
          
          <div class="api-setting-item">
            <label class="api-label">API密钥</label>
            <input type="password" v-model="settings.apiKey" class="input-field" placeholder="请输入API密钥" />
          </div>
          
          <div class="api-setting-item">
            <label class="api-label">API端点</label>
            <input type="text" v-model="settings.apiEndpoint" class="input-field" placeholder="请输入API端点地址" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 系统设置容器 */
.system-settings-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 24px;
  box-sizing: border-box;
}

/* 标签页导航 */
.tab-navigation {
  display: flex;
  border-bottom: 1px solid #E5E7EB;
  margin-bottom: 24px;
}

.tab-item {
  padding: 12px 20px;
  font-size: 15px;
  font-family: SourceHanSans-Regular;
  color: #6B7280;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-item:hover {
  color: #2563EB;
}

.tab-item.active {
  color: #2563EB;
  font-family: SourceHanSans-Medium;
  border-bottom-color: #2563EB;
}

/* 内容区域 */
.settings-content {
  flex: 1;
  background-color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  overflow: visible;
}

/* 标签内容 */
.tab-content {
  width: 100%;
}

.section-title {
  font-size: 18px;
  font-weight: 500;
  color: #1A1A1A;
  margin-bottom: 8px;
  font-family: SourceHanSans-Medium;
}

.section-desc {
  font-size: 14px;
  color: #666666;
  margin-bottom: 24px;
  font-family: SourceHanSans-Regular;
}

/* 区域头部 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

/* 设置组 */
.setting-group {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 设置项 */
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.setting-info {
  flex: 1;
  margin-right: 24px;
}

.setting-label {
  font-size: 15px;
  font-weight: 500;
  color: #1A1A1A;
  margin-bottom: 2px;
  font-family: SourceHanSans-Medium;
  display: block;
}

.setting-description {
  font-size: 13px;
  color: #666666;
  margin-bottom: 12px;
  font-family: SourceHanSans-Regular;
  margin: 0;
}

/* 输入框 */
.input-field {
  width: 448px;
  height: 48px;
  padding: 16px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  color: #333333;
  background-color: white;
  font-family: SourceHanSans-Regular;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: #2563EB;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

/* 开关按钮 */
.switch-btn {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  cursor: pointer;
}

.switch-input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #E5E7EB;
  border-radius: 9999px;
  transition: all 0.3s ease;
}

.switch-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 17px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.switch-input:checked + .switch-slider {
  background-color: #3B82F6;
}

.switch-input:checked + .switch-slider:before {
  transform: translateX(24px);
}

/* 模型单选框样式 */
.model-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 8px;
}

.model-radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 12px 16px;
  background-color: white;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.model-radio-item:hover {
  border-color: #3B82F6;
  background-color: #EFF6FF;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

.model-radio-input {
  width: 18px;
  height: 18px;
  accent-color: #3B82F6;
  cursor: pointer;
}

.model-radio-label {
  font-size: 14px;
  color: #333333;
  font-family: SourceHanSans-Regular;
  cursor: pointer;
}

/* 选中状态 */
.model-radio-item:has(.model-radio-input:checked) {
  border-color: #3B82F6;
  background-color: #EFF6FF;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.model-radio-item:has(.model-radio-input:checked) .model-radio-label {
  color: #3B82F6;
  font-weight: 500;
}

/* API设置区域 */
.api-settings {
  background-color: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 24px;
}

.api-info {
  font-size: 14px;
  color: #666666;
  margin-bottom: 20px;
  font-family: SourceHanSans-Regular;
}

.api-setting-item {
  margin-bottom: 24px;
}

.api-setting-item:last-child {
  margin-bottom: 0;
}

.api-label {
  display: block;
  font-size: 14px;
  color: #1A1A1A;
  margin-bottom: 8px;
  font-family: SourceHanSans-Regular;
}

/* 操作按钮 */
.settings-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.save-btn {
  width: 92px;
  height: 38px;
  padding: 8px 24px;
  background-color: #3B82F6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  font-family: SourceHanSans-Medium;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn:hover {
  background-color: #2563EB;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.cancel-btn {
  width: 92px;
  height: 38px;
  padding: 8px 24px;
  background-color: transparent;
  color: #4B5563;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  font-family: SourceHanSans-Regular;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background-color: #F9FAFB;
  border-color: #D1D5DB;
}

/* 滚动条样式 */
.settings-content::-webkit-scrollbar {
  width: 6px;
}

.settings-content::-webkit-scrollbar-track {
  background: transparent;
}

.settings-content::-webkit-scrollbar-thumb {
  background-color: rgba(64, 158, 255, 0.5);
  border-radius: 3px;
}

.settings-content::-webkit-scrollbar-thumb:hover {
  background-color: rgba(64, 158, 255, 0.8);
}
</style>