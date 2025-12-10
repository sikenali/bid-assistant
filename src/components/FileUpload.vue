<script setup lang="ts">
import { RiUploadCloud2Line, RiFileWordLine, RiFilePptLine, RiFileExcelLine, RiRefreshLine, RiCloseLine } from '@remixicon/vue';
import { FiFileText } from 'vue-icons-plus/fi';
import { FaFilePdf } from 'vue-icons-plus/fa';

interface Props {
  side: 'left' | 'right';
  fileInfo: {
    file: File | null;
    name: string;
    size: string;
    type: string;
  };
  onFileChange: (event: Event, side: 'left' | 'right') => void;
  onDragOver: (event: DragEvent) => void;
  onDrop: (event: DragEvent, side: 'left' | 'right') => void;
  onClearFile: (side: 'left' | 'right') => void;
}

const props = defineProps<Props>();
</script>

<template>
  <div 
    class="file-upload"
    @dragover="onDragOver"
    @drop="(e) => onDrop(e, props.side)"
  >
    <div class="file-upload-content">
      <input 
        type="file" 
        :id="`${props.side}-file`" 
        class="file-input" 
        @change="(e) => onFileChange(e, props.side)"
        accept=".doc,.docx,.pdf,.txt,.ppt,.pptx,.xls,.xlsx"
      />
      
      <!-- 未上传状态 -->
      <div v-if="!fileInfo.name" class="upload-status">
        <RiUploadCloud2Line class="upload-icon" />
        <div class="upload-text">拖放文件此处或点击上传</div>
        <label :for="`${props.side}-file`" class="select-btn">选择文件</label>
        <!-- 支持的文件类型 -->
        <div class="supported-formats">
          <div class="format-tag">
            <RiFileWordLine class="format-icon" /> Word
          </div>
          <div class="format-tag">
            <RiFilePptLine class="format-icon" /> PPT
          </div>
          <div class="format-tag">
            <RiFileExcelLine class="format-icon" /> Excel
          </div>
          <div class="format-tag">
            <FaFilePdf class="format-icon" /> PDF
          </div>
          <div class="format-tag">
            <FiFileText class="format-icon" /> TXT
          </div>
        </div>
      </div>
      
      <!-- 已上传状态 -->
      <div v-else class="file-info">
        <div class="file-name">{{ fileInfo.name }}</div>
        <div class="file-meta">
          <span class="file-type">{{ fileInfo.type }}</span>
          <span class="file-size">{{ fileInfo.size }}</span>
        </div>
        <div class="file-actions">
          <label :for="`${props.side}-file`" class="action-icon-btn replace-icon" title="更换文件">
            <RiRefreshLine class="icon" />
          </label>
          <button class="action-icon-btn clear-icon" @click="onClearFile(props.side)" title="清除文件">
            <RiCloseLine class="icon" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-upload {
  flex: 1;
  width: 448px;
  height: 228px;
  border: 2px dashed #E5E7EB;
  border-radius: 12px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  padding: 32px;
  box-sizing: border-box;
}

.file-upload:hover {
  border-color: #3B82F6;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.file-upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  transition: all 0.3s ease;
  position: relative;
}

/* 上传状态 */
.upload-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.upload-icon {
  font-size: 36px;
  color: #D1D5DB;
  transition: all 0.3s ease;
}

.file-upload:hover .upload-icon {
  color: #3B82F6;
}

.upload-text {
  font-size: 15px;
  color: #555555;
  font-family: SourceHanSans-Regular;
  transition: all 0.3s ease;
}

.file-input {
  display: none;
}

.select-btn {
  padding: 12px 24px;
  background-color: #3B82F6;
  color: white;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  font-family: SourceHanSans-Medium;
  display: flex;
  align-items: center;
  justify-content: center;
}

.select-btn:hover {
  background-color: #2563eb;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 已上传文件信息 */
.file-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
  transition: all 0.3s ease;
  position: relative;
  padding: 20px;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
}

.file-name {
  font-size: 14px;
  color: #1A1A1A;
  font-weight: 500;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px 20px;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-family: SourceHanSans-Medium;
  max-width: 100%;
  overflow: visible;
  text-overflow: clip;
  white-space: normal;
  transition: all 0.3s ease;
  text-align: center;
  line-height: 1.4;
  min-height: auto;
}

.file-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #888888;
  font-family: SourceHanSans-Regular;
}

.file-type, .file-size {
  background-color: rgba(255, 255, 255, 0.7);
  padding: 4px 12px;
  border-radius: 10px;
  transition: all 0.3s ease;
}

/* 支持的文件类型 */
.supported-formats {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.format-tag {
  display: flex;
  align-items: center;
  gap: 3px;
  background-color: #F3F4F6;
  border-radius: 9999px;
  padding: 3px 8px;
  font-size: 8px;
  color: #666666;
  font-family: SourceHanSans-Regular;
}
 
.format-tag svg {
  font-size: 4px !important;
  color: #9CA3AF !important;
}

.format-icon {
  font-size: 4px !important;
  color: #9CA3AF !important;
}

/* 文件操作按钮 */
.file-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.action-icon-btn {
  width: 36px;
  height: 36px;
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  background-color: rgba(59, 130, 246, 0.1);
  color: #3B82F6;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon-btn:hover {
  background-color: rgba(59, 130, 246, 0.2);
  border-color: #3B82F6;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.action-icon-btn .icon {
  font-size: 18px;
}

.replace-icon {
  background-color: rgba(59, 130, 246, 0.1);
}

.clear-icon {
  background-color: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #EF4444;
}

.clear-icon:hover {
  background-color: rgba(239, 68, 68, 0.2);
  border-color: #EF4444;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
}
</style>
