<script setup lang="ts">
import { ref } from 'vue'
import { 
  RiExchangeLine, 
  RiFileWordLine, 
  RiCheckDoubleLine, 
  RiCloseCircleLine, 
  RiAlertLine,
  RiFileExcelLine,
  RiArrowLeftSLine,
  RiArrowRightSLine
} from '@remixicon/vue'
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType } from 'docx'
import { useFileParser } from '../composables/useFileParser'
import { useSettings } from '../composables/useSettings'
import { useRecentRecords } from '../composables/useRecentRecords'
import FileUpload from './FileUpload.vue'
import RecentRecords from './RecentRecords.vue'

// 文件信息类型定义
interface FileInfo {
  file: File | null;
  name: string;
  size: string;
  type: string;
}

// 使用文件解析组合式函数
const { parseFile } = useFileParser()

// 使用设置组合式函数
const { settings } = useSettings()

// 响应式数据
const leftFileInfo = ref<FileInfo>({ file: null, name: '', size: '', type: '' });
const rightFileInfo = ref<FileInfo>({ file: null, name: '', size: '', type: '' });

// 使用最近记录组合式函数 - 传入propertyCheck类型
const { 
  showRecentRecords, 
  recentRecords, 
  addRecentRecord, 
  clearAllRecords,
  deleteRecord
} = useRecentRecords('propertyCheck')

// 查看历史对比记录
const viewHistoricalRecord = (record: any) => {
  // 更新文件信息
  leftFileInfo.value = {
    file: null,
    name: record.leftFileName,
    size: '未知',
    type: getFileType(record.leftFileName)
  };
  
  rightFileInfo.value = {
    file: null,
    name: record.rightFileName,
    size: '未知',
    type: getFileType(record.rightFileName)
  };
  
  // 恢复保存的属性详情数据
  if (record.propertyDetails && record.propertyDetails.length > 0) {
    propertyDetails.value = record.propertyDetails;
  } else {
    // 如果没有保存属性详情，生成默认数据
    propertyDetails.value = [
      {
        name: '文件名称',
        leftValue: record.leftFileName,
        rightValue: record.rightFileName,
        status: record.leftFileName === record.rightFileName ? 'match' : 'mismatch'
      },
      {
        name: '文件大小',
        leftValue: '未知',
        rightValue: '未知',
        status: 'mismatch'
      },
      {
        name: '文件类型',
        leftValue: getFileType(record.leftFileName),
        rightValue: getFileType(record.rightFileName),
        status: getFileType(record.leftFileName) === getFileType(record.rightFileName) ? 'match' : 'warning'
      },
      {
        name: '作者',
        leftValue: '未知',
        rightValue: '未知',
        status: 'mismatch'
      },
      {
        name: '最后一次保存者',
        leftValue: '未知',
        rightValue: '未知',
        status: 'mismatch'
      },
      {
        name: '页码范围',
        leftValue: 'N/A',
        rightValue: 'N/A',
        status: 'mismatch'
      },
      {
        name: '程序名称',
        leftValue: '未知',
        rightValue: '未知',
        status: 'mismatch'
      },
      {
        name: '公司',
        leftValue: '未知',
        rightValue: '未知',
        status: 'mismatch'
      },
      {
        name: '文本内容长度',
        leftValue: '0',
        rightValue: '0',
        status: 'match'
      },
      {
        name: '文本相似度',
        leftValue: record.similarity,
        rightValue: record.similarity,
        status: parseInt(record.similarity) >= settings.textSimilarityThreshold ? 'match' : parseInt(record.similarity) >= 50 ? 'warning' : 'mismatch'
      }
    ];
  }
  
  // 统计属性状态
  matchingProperties.value = propertyDetails.value.filter(p => p.status === 'match').length;
  nonMatchingProperties.value = propertyDetails.value.filter(p => p.status === 'mismatch').length;
  warningProperties.value = propertyDetails.value.filter(p => p.status === 'warning').length;
  
  // 显示结果界面
  showResults.value = true;
};

// 解析结果
const leftFileContent = ref('')
const leftFileProperties = ref<any>({})
const rightFileContent = ref('')
const rightFileProperties = ref<any>({})
const isParsing = ref(false)
const parseError = ref('')

// 属性检查结果
const showResults = ref(false)
const matchingProperties = ref(0)
const nonMatchingProperties = ref(0)
const warningProperties = ref(0)

// 属性差异详情
  const propertyDetails = ref([
    {
      name: '文件名称',
      leftValue: '',
      rightValue: '',
      status: 'match'
    },
    {
      name: '文件大小',
      leftValue: '',
      rightValue: '',
      status: 'match'
    },
    {
      name: '文件类型',
      leftValue: '',
      rightValue: '',
      status: 'match'
    },
    {
      name: '作者',
      leftValue: '',
      rightValue: '',
      status: 'match'
    },
    {
      name: '最后一次保存者',
      leftValue: '',
      rightValue: '',
      status: 'match'
    },
    {
      name: '页码范围',
      leftValue: '',
      rightValue: '',
      status: 'match'
    },
    {
      name: '程序名称',
      leftValue: '',
      rightValue: '',
      status: 'match'
    },
    {
      name: '公司',
      leftValue: '',
      rightValue: '',
      status: 'match'
    },
    {
      name: '文本内容长度',
      leftValue: '0',
      rightValue: '0',
      status: 'match'
    },
    {
      name: '文本相似度',
      leftValue: '0%',
      rightValue: '0%',
      status: 'match'
    }
  ])

// 格式化文件大小
const formatFileSize = (size: number): string => {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
};

// 获取文件类型
const getFileType = (name: string): string => {
  const ext = name.split('.').pop()?.toLowerCase() || '';
  const typeMap: Record<string, string> = {
    'doc': 'Word文档',
    'docx': 'Word文档',
    'pdf': 'PDF文档',
    'txt': '文本文件',
    'ppt': 'PPT演示',
    'pptx': 'PPT演示',
    'xls': 'Excel表格',
    'xlsx': 'Excel表格'
  };
  return typeMap[ext] || '未知类型';
};

// 文件上传处理
const handleFileUpload = (event: Event, side: 'left' | 'right') => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    const fileInfo = {
      file: file,
      name: file.name,
      size: formatFileSize(file.size),
      type: getFileType(file.name)
    };
    
    if (side === 'left') {
      leftFileInfo.value = fileInfo;
    } else {
      rightFileInfo.value = fileInfo;
    }
  }
}

// 拖拽处理
const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}

const handleDrop = (event: DragEvent, side: 'left' | 'right') => {
  event.preventDefault()
  if (event.dataTransfer && event.dataTransfer.files[0]) {
    const file = event.dataTransfer.files[0]
    const fileInfo = {
      file: file,
      name: file.name,
      size: formatFileSize(file.size),
      type: getFileType(file.name)
    };
    
    if (side === 'left') {
      leftFileInfo.value = fileInfo;
    } else {
      rightFileInfo.value = fileInfo;
    }
  }
}

// 文本预处理（根据设置调整）
const preprocessText = (text: string): string => {
  // 检查text是否为undefined或null
  if (!text) {
    return '';
  }
  
  let processed = text;
  
  // 忽略大小写
  if (settings.ignoreCase) {
    processed = processed.toLowerCase();
  }
  
  // 忽略标点符号
  if (settings.ignorePunctuation) {
    processed = processed.replace(/[\p{P}\p{S}]/gu, '');
  }
  
  // 忽略空格差异
  if (settings.ignoreWhitespace) {
    processed = processed.replace(/\s+/g, ' ').trim();
  }
  
  return processed;
};

// 简单的文本相似度计算（基于最长公共子串）
const calculateTextSimilarity = (text1: string, text2: string): number => {
  if (!text1 || !text2) return 0;
  
  const preprocessed1 = preprocessText(text1);
  const preprocessed2 = preprocessText(text2);
  
  const m = preprocessed1.length;
  const n = preprocessed2.length;
  
  // 初始化dp数组，使用any类型避免类型检查
  const dp: any = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  
  let maxLength = 0;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (preprocessed1[i - 1] === preprocessed2[j - 1]) {
        const prevValue: number = dp[i - 1][j - 1];
        const currentValue: number = prevValue + 1;
        dp[i][j] = currentValue;
        maxLength = Math.max(maxLength, currentValue);
      } else {
        dp[i][j] = 0;
      }
    }
  }
  
  // 计算相似度百分比
  const minLength = Math.min(preprocessed1.length, preprocessed2.length);
  if (minLength === 0) return 0;
  
  return Math.round((maxLength / minLength) * 100);
};

// 执行属性检查
const handleCheck = async () => {
  if (!leftFileInfo.value.file || !rightFileInfo.value.file) return;
  
  isParsing.value = true;
  parseError.value = '';
  
  try {
    // 解析左侧文件
    const leftResult = await parseFile(leftFileInfo.value.file);
    if (leftResult.error) {
      throw new Error(leftResult.error);
    }
    leftFileContent.value = leftResult.content;
    leftFileProperties.value = leftResult.properties;
    
    // 解析右侧文件
    const rightResult = await parseFile(rightFileInfo.value.file);
    if (rightResult.error) {
      throw new Error(rightResult.error);
    }
    rightFileContent.value = rightResult.content;
    rightFileProperties.value = rightResult.properties;
    
    // 计算相似度
    const similarity = calculateTextSimilarity(leftFileContent.value, rightFileContent.value);
    const similarityStatus = similarity >= settings.textSimilarityThreshold ? 'match' : similarity >= 50 ? 'warning' : 'mismatch';
    
    // 更新属性详情
    propertyDetails.value = [
      {
        name: '文件名称',
        leftValue: leftFileProperties.value.文件名 || leftFileInfo.value.name,
        rightValue: rightFileProperties.value.文件名 || rightFileInfo.value.name,
        status: (leftFileProperties.value.文件名 || leftFileInfo.value.name) === (rightFileProperties.value.文件名 || rightFileInfo.value.name) ? 'match' : 'mismatch'
      },
      {
        name: '文件大小',
        leftValue: leftFileProperties.value.文件大小 || leftFileInfo.value.size,
        rightValue: rightFileProperties.value.文件大小 || rightFileInfo.value.size,
        status: (leftFileProperties.value.文件大小 || leftFileInfo.value.size) === (rightFileProperties.value.文件大小 || rightFileInfo.value.size) ? 'match' : 'mismatch'
      },
      {
        name: '文件类型',
        leftValue: leftFileProperties.value.文件类型 || leftFileInfo.value.type,
        rightValue: rightFileProperties.value.文件类型 || rightFileInfo.value.type,
        status: (leftFileProperties.value.文件类型 || leftFileInfo.value.type) === (rightFileProperties.value.文件类型 || rightFileInfo.value.type) ? 'match' : 'warning'
      },
      {
        name: '作者',
        leftValue: leftFileProperties.value.作者 || '未知',
        rightValue: rightFileProperties.value.作者 || '未知',
        status: (leftFileProperties.value.作者 || '未知') === (rightFileProperties.value.作者 || '未知') ? 'match' : 'mismatch'
      },
      {
        name: '最后一次保存者',
        leftValue: leftFileProperties.value.最后一次保存者 || '未知',
        rightValue: rightFileProperties.value.最后一次保存者 || '未知',
        status: (leftFileProperties.value.最后一次保存者 || '未知') === (rightFileProperties.value.最后一次保存者 || '未知') ? 'match' : 'mismatch'
      },
      {
            name: '页码范围',
            leftValue: leftFileProperties.value.页码范围 || 'N/A',
            rightValue: rightFileProperties.value.页码范围 || 'N/A',
            status: (leftFileProperties.value.页码范围 || 'N/A') === (rightFileProperties.value.页码范围 || 'N/A') ? 'match' : 'mismatch'
          },
      {
        name: '程序名称',
        leftValue: leftFileProperties.value.程序名称 || '未知',
        rightValue: rightFileProperties.value.程序名称 || '未知',
        status: (leftFileProperties.value.程序名称 || '未知') === (rightFileProperties.value.程序名称 || '未知') ? 'match' : 'warning'
      },
      {
        name: '公司',
        leftValue: leftFileProperties.value.公司 || '未知',
        rightValue: rightFileProperties.value.公司 || '未知',
        status: (leftFileProperties.value.公司 || '未知') === (rightFileProperties.value.公司 || '未知') ? 'match' : 'mismatch'
      },
      {
        name: '文本内容长度',
        leftValue: leftFileProperties.value.文本内容长度 || leftFileContent.value.length.toString(),
        rightValue: rightFileProperties.value.文本内容长度 || rightFileContent.value.length.toString(),
        status: (leftFileProperties.value.文本内容长度 || leftFileContent.value.length.toString()) === (rightFileProperties.value.文本内容长度 || rightFileContent.value.length.toString()) ? 'match' : 'mismatch'
      },
      {
        name: '文本相似度',
        leftValue: `${similarity}%`,
        rightValue: `${similarity}%`,
        status: similarityStatus
      }
    ];
    
    // 统计属性状态
    matchingProperties.value = propertyDetails.value.filter(p => p.status === 'match').length;
    nonMatchingProperties.value = propertyDetails.value.filter(p => p.status === 'mismatch').length;
    warningProperties.value = propertyDetails.value.filter(p => p.status === 'warning').length;
    
    // 添加真实的对比记录
    addRecentRecord({
      filename: `${leftFileInfo.value.name} vs ${rightFileInfo.value.name}`,
      timestamp: new Date().toLocaleString(),
      similarity: `${similarity}%`,
      leftFileName: leftFileInfo.value.name,
      rightFileName: rightFileInfo.value.name,
      propertyDetails: propertyDetails.value
    });
    
    // 显示结果
    showResults.value = true;
  } catch (error) {
    parseError.value = (error as Error).message;
  } finally {
    isParsing.value = false;
  }
}

// 导出属性报告为Word格式
const handleExportReport = async () => {
  try {
    // 生成Word文档
    const doc = generateWordReport()
    
    // 生成Blob对象
    const blob = await Packer.toBlob(doc)
    
    // 创建下载链接
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = '属性对比报告.docx'
    
    // 触发下载
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('导出报告失败:', error)
    alert('导出报告失败，请重试')
  }
}

// 返回文件上传界面
const handleBack = () => {
  showResults.value = false
}

// 生成Word报告内容
const generateWordReport = () => {
  // 确保只有当有属性数据时才生成报告
  if (propertyDetails.value.length === 0) {
    alert('没有可导出的属性对比数据')
    return new Document()
  }
  
  // 创建文档
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // 添加标题
          new Paragraph({
            children: [
              new TextRun({
                text: '属性对比报告',
                bold: true,
                size: 24,
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
            }
          }),
          
          // 添加属性统计
          new Paragraph({
            children: [
              new TextRun({
                text: '属性统计：',
                bold: true,
                size: 20,
              })
            ],
            spacing: {
              after: 100,
            }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `匹配属性：${matchingProperties.value}项`,
                size: 16,
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `不匹配属性：${nonMatchingProperties.value}项`,
                size: 16,
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `警告属性：${warningProperties.value}项`,
                size: 16,
              })
            ],
            spacing: {
              after: 200,
            }
          }),
          
          // 添加文件信息
          new Paragraph({
            children: [
              new TextRun({
                text: '文件信息：',
                bold: true,
                size: 20,
              })
            ],
            spacing: {
              after: 100,
            }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `左侧文件：${leftFileInfo.value.name}`,
                size: 16,
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `右侧文件：${rightFileInfo.value.name}`,
                size: 16,
              })
            ],
            spacing: {
              after: 200,
            }
          }),
          
          // 添加属性详情表格
          new Paragraph({
            children: [
              new TextRun({
                text: '属性差异详情：',
                bold: true,
                size: 20,
              })
            ],
            spacing: {
              after: 100,
            }
          }),
          
          // 创建表格
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              // 表格标题行
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: '对比类型', bold: true, alignment: AlignmentType.CENTER })],
                    shading: {
                      fill: '#f0f0f0',
                    }
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: leftFileInfo.value.name, bold: true, alignment: AlignmentType.CENTER })],
                    shading: {
                      fill: '#f0f0f0',
                    }
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: rightFileInfo.value.name, bold: true, alignment: AlignmentType.CENTER })],
                    shading: {
                      fill: '#f0f0f0',
                    }
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: '是否匹配', bold: true, alignment: AlignmentType.CENTER })],
                    shading: {
                      fill: '#f0f0f0',
                    }
                  }),
                ],
              }),
              // 表格数据行
              ...propertyDetails.value.map((property) => {
                return new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ text: property.name, alignment: AlignmentType.CENTER })]
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: property.leftValue, alignment: AlignmentType.CENTER })]
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: property.rightValue, alignment: AlignmentType.CENTER })]
                    }),
                    new TableCell({
                      children: [new Paragraph({ 
                        text: property.status === 'match' ? '匹配' : property.status === 'mismatch' ? '不匹配' : '警告', 
                        alignment: AlignmentType.CENTER 
                      })]
                    }),
                  ],
                });
              }),
            ],
          }),
        ],
      }
    ],
  });
  
  return doc
}
</script>

<template>
  <div class="property-check-container">
    <!-- 移除了上传文件进行属性检查标题 -->

    <!-- 文件上传区域 -->
    <div v-if="!showResults" class="upload-section">
      <!-- 左侧文件上传 -->
      <FileUpload
        side="left"
        :file-info="leftFileInfo"
        :on-file-change="handleFileUpload"
        :on-drag-over="handleDragOver"
        :on-drop="handleDrop"
      />

      <!-- 检查按钮 -->
      <div class="check-btn-container">
        <button class="check-btn" @click="handleCheck" :disabled="isParsing">
          <RiExchangeLine class="check-icon" :class="{ 'rotating': isParsing }" />
        </button>
      </div>

      <!-- 右侧文件上传 -->
      <FileUpload
        side="right"
        :file-info="rightFileInfo"
        :on-file-change="handleFileUpload"
        :on-drag-over="handleDragOver"
        :on-drop="handleDrop"
      />
    </div>

    <!-- 解析错误显示 -->
    <div v-if="parseError" class="error-message">
      {{ parseError }}
    </div>

    <!-- 最近对比记录 -->
    <RecentRecords
      v-if="showRecentRecords && !showResults"
      :recent-records="recentRecords"
      :on-clear-all="clearAllRecords"
      :on-view-record="viewHistoricalRecord"
      :on-delete-record="deleteRecord"
    />

    <!-- 属性检查结果 -->
    <div v-if="showResults" class="results-section">
      <!-- 属性统计 -->
      <div class="property-stats">
        <div class="stat-item match">
          <div class="stat-icon-container match">
            <RiCheckDoubleLine class="stat-icon" />
          </div>
          <div class="stat-content">
            <span class="stat-label">匹配属性</span>
            <span class="stat-value match">{{ matchingProperties }}项</span>
          </div>
        </div>
        <div class="stat-item mismatch">
          <div class="stat-icon-container mismatch">
            <RiCloseCircleLine class="stat-icon" />
          </div>
          <div class="stat-content">
            <span class="stat-label">不匹配属性</span>
            <span class="stat-value mismatch">{{ nonMatchingProperties }}项</span>
          </div>
        </div>
        <div class="stat-item warning">
          <div class="stat-icon-container warning">
            <RiAlertLine class="stat-icon" />
          </div>
          <div class="stat-content">
            <span class="stat-label">警告属性</span>
            <span class="stat-value warning">{{ warningProperties }}项</span>
          </div>
        </div>
        <div class="export-section">
          <button class="action-btn export-btn" @click="handleExportReport">
            <RiFileExcelLine class="btn-icon" />
            导出报告
          </button>
          <button class="action-btn issue-tracking-btn" @click="handleBack">
            <RiArrowLeftSLine class="btn-icon" />
            返回
          </button>
        </div>
      </div>

      <!-- 属性差异详情 -->
        <div class="property-details-section">
          <div class="section-header">
            <h3 class="section-title">属性对比详情</h3>
          </div>
          
          <!-- 整合后的属性表格 -->
          <div class="property-table">
            <div class="table-header">
              <div class="table-col prop-name">对比类型</div>
              <div class="table-col prop-value-left">文件名称</div>
              <div class="table-col prop-value-right">文件名称</div>
              <div class="table-col prop-status">是否匹配</div>
            </div>
            <div class="table-body">
              <div 
                v-for="(property, index) in propertyDetails" 
                :key="index"
                class="table-row"
                :class="`status-${property.status}`"
              >
                <div class="table-col prop-name">{{ property.name }}</div>
                <div class="table-col prop-value-left">{{ property.leftValue }}</div>
                <div class="table-col prop-value-right">{{ property.rightValue }}</div>
                <div class="table-col prop-status">
                  <span :class="`status-tag status-${property.status}`">
                    {{ property.status === 'match' ? '匹配' : property.status === 'mismatch' ? '不匹配' : '警告' }}
                  </span>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.property-check-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: rgba(255, 255, 255, 0.7);
}

/* 属性检查结果 */
.results-section {
  flex: 1;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  border: 0.6667px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 结果显示时才显示滚动条 */
.results-section:has(> *:not(.no-results)) {
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(64, 158, 255, 0.5) transparent;
}

/* 自定义滚动条样式 */
.results-section::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.results-section::-webkit-scrollbar-track {
  background: transparent;
}

.results-section::-webkit-scrollbar-thumb {
  background-color: rgba(64, 158, 255, 0.5);
  border-radius: 3px;
}

.results-section::-webkit-scrollbar-thumb:hover {
  background-color: rgba(64, 158, 255, 0.8);
}

.page-title {
  font-size: 22px;
  line-height: 28px;
  font-weight: SemiBold;
  color: #1A1A1A;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 0.6667px solid rgba(255, 255, 255, 0.5);
  font-family: SourceHanSans;
}

/* 文件上传区域 */
.upload-section {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
  padding: 24px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  flex-wrap: nowrap;
  width: 100%;
  box-sizing: border-box;
}

.upload-box {
  flex: 1;
  min-width: 300px;
  height: 185.33px;
  border: 2px dashed #E5E7EB;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  padding: 32px;
  box-sizing: border-box;
}

.upload-box:hover {
  border-color: #3B82F6;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  transition: all 0.3s;
  position: relative;
}

/* 上传状态 */
.upload-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  transition: all 0.3s;
}

.upload-icon {
  font-size: 36px;
  color: #D1D5DB;
  transition: all 0.3s;
}

.upload-box:hover .upload-icon {
  color: #3B82F6;
}

.upload-text {
  font-size: 15px;
  color: #555555;
  font-family: SourceHanSans-Regular;
}

.file-input {
  display: none;
}

.select-btn {
  width: 122.33px;
  height: 37.33px;
  padding: 8px 16px;
  background-color: #3B82F6;
  color: white;
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  border: 0.6667px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0px 4px 16px rgba(31, 38, 135, 0.08);
  font-family: SourceHanSans-Medium;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 已上传文件信息 */
.file-info-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
  transition: all 0.3s;
  position: relative;
  padding: 20px;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
}

.file-name {
  font-size: 14px;
  color: #1A1A1A;
  font-weight: Medium;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 8px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  font-family: SourceHanSans-Medium;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #888888;
  font-family: SourceHanSans-Regular;
}

.file-type, .file-size {
  background-color: rgba(255, 255, 255, 0.5);
  padding: 4px 12px;
  border-radius: 10px;
}

/* 更换文件按钮 */
.replace-btn {
  position: absolute;
  bottom: 20px;
  opacity: 0;
  visibility: hidden;
  width: 122.33px;
  height: 37.33px;
  padding: 8px 16px;
  background-color: rgba(59, 130, 246, 0.8);
  color: white;
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  border: 0.6667px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0px 4px 16px rgba(31, 38, 135, 0.08);
  font-family: SourceHanSans-Medium;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.upload-box:hover .replace-btn {
  opacity: 1;
  visibility: visible;
}

.replace-btn:hover {
  background-color: #2563eb;
  box-shadow: 0 4px 8px rgba(64, 158, 255, 0.3);
}

/* 错误信息样式 */
.error-message {
  color: #EF4444;
  font-size: 14px;
  text-align: center;
  margin: 16px 0;
  padding: 12px;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(239, 68, 68, 0.3);
  font-family: SourceHanSans-Regular;
}

.select-btn:hover {
  background-color: #2563eb;
  box-shadow: 0 4px 8px rgba(64, 158, 255, 0.3);
}

.file-name {
  font-size: 13px;
  color: #555555;
  margin-top: 8px;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 6px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  font-family: SourceHanSans-Regular;
}

.check-btn-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(90deg, #3B82F6 0%, #4F46E5 100%);
  border-radius: 9999px;
  width: 64px;
  height: 64px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding: 0;
  z-index: 10;
  position: relative;
}

.check-btn {
  width: 64px;
  height: 64px;
  border: none;
  border-radius: 9999px;
  background: transparent;
  color: #FFFFFF;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.check-icon {
  color: #FFFFFF;
  font-size: 24px;
  transition: all 0.3s ease;
}

.check-icon.rotating {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.check-btn:hover {
  transform: rotate(90deg);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.3);
}

/* 最近对比记录 */
.recent-records {
  background-color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-top: 24px;
}

.records-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.records-title {
  font-size: 16px;
  font-weight: 500;
  color: #1A1A1A;
  font-family: SourceHanSans-Medium;
}

.view-all {
  font-size: 14px;
  color: #3B82F6;
  font-family: SourceHanSans-Regular;
  cursor: pointer;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #F9FAFB;
  border-radius: 8px;
  padding: 12px;
  transition: all 0.3s ease;
}

.record-item:hover {
  background-color: rgba(239, 246, 255, 0.5);
}

.record-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.record-icon {
  font-size: 16px;
  color: #9CA3AF;
}

.record-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.record-filename {
  font-size: 14px;
  color: #333333;
  font-family: SourceHanSans-Regular;
}

.record-timestamp {
  font-size: 12px;
  color: #888888;
  font-family: SourceHanSans-Regular;
}

.record-actions {
  display: flex;
  gap: 8px;
}

.record-action-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #E5E7EB;
  border-radius: 9999px;
  background-color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #666666;
  font-size: 14px;
}

.record-action-btn:hover {
  background-color: #3B82F6;
  color: white;
  border-color: #3B82F6;
}

/* 属性检查结果 */
.results-section {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  border: 0.6667px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 8px 32px rgba(31, 38, 135, 0.05);
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}

/* 属性统计 */
.property-stats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  border: 0.6667px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  gap: 16px;
  box-sizing: border-box;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-direction: row;
  padding: 0;
  border-radius: 0;
  background-color: transparent;
}

/* 统计图标容器 */
.stat-icon-container {
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon-container.match {
  background-color: #DCFCE7;
}

.stat-icon-container.mismatch {
  background-color: #FEE2E2;
}

.stat-icon-container.warning {
  background-color: #FEF9C3;
}

.stat-icon {
  font-size: 16px;
}

.stat-icon-container.match .stat-icon {
  color: #10B981;
}

.stat-icon-container.mismatch .stat-icon {
  color: #EF4444;
}

.stat-icon-container.warning .stat-icon {
  color: #F59E0B;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #888888;
  font-family: SourceHanSans-Regular;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  font-family: SourceHanSans-SemiBold;
}

.stat-value.match {
  color: #10B981;
}

.stat-value.mismatch {
  color: #EF4444;
}

.stat-value.warning {
  color: #F59E0B;
}



.export-section {
  display: flex;
  gap: 12px;
}

/* 操作按钮 */
.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  font-family: SourceHanSans-Medium;
  cursor: pointer;
  transition: background-color;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
}

.export-btn {
  background-color: white;
  color: #1A1A1A;
  border: 1px solid #E5E7EB;
  width: auto;
  height: auto;
}



.export-btn:hover {
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 为属性检查添加与文件对比一致的按钮样式 */
.issue-tracking-btn {
  background-color: #2563EB;
  color: white;
}

.issue-tracking-btn .btn-icon {
  color: white;
  font-size: 16px;
}

/* 属性差异详情 */
.property-details-section {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  border: 0.6667px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding: 16px;
  flex: 1;
  box-sizing: border-box;
  margin-top: 0;
  overflow: visible;
}

/* 区域标题 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  line-height: 22px;
  font-weight: 500;
  color: #1A1A1A;
  font-family: SourceHanSans-Medium;
  margin: 0;
}

.view-options {
  display: flex;
  gap: 8px;
}

.view-btn {
  padding: 6px 12px;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
  background-color: white;
  color: #555555;
  font-size: 14px;
  font-family: SourceHanSans-Regular;
  cursor: pointer;
  transition: background-color;
}

.view-btn.active {
  background-color: #3B82F6;
  color: white;
  border-color: #3B82F6;
}

/* 属性分组 */
.property-group {
  margin-bottom: 24px;
}

.group-title {
  font-size: 16px;
  line-height: 22px;
  font-weight: 500;
  color: #1A1A1A;
  font-family: SourceHanSans-Medium;
  margin-bottom: 16px;
}

/* 表格控件 */
.property-table {
  background-color: white;
  border-radius: 20px;
  border: 0.6667px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 150px 1fr 1fr 100px;
  padding: 12px 16px;
  background-color: rgba(255, 255, 255, 0.7);
  border-bottom: 1px solid #F3F4F6;
  font-family: SourceHanSans-SemiBold;
  font-size: 14px;
  color: #888888;
}

.table-body {
  display: flex;
  flex-direction: column;
}

.table-row {
  display: grid;
  grid-template-columns: 150px 1fr 1fr 100px;
  padding: 16px;
  border-bottom: 1px solid #E5E7EB;
  height: 57px;
  box-sizing: border-box;
  transition: background-color;
  align-items: center;
}

.table-row:hover {
  background-color: rgba(249, 250, 251, 0.5);
  border-radius: 8px;
}

.table-col {
  font-size: 14px;
  font-family: SourceHanSans-Regular;
}

.prop-name {
  color: #555555;
  font-weight: 500;
}

.prop-value-left,
.prop-value-right {
  color: #333333;
}

/* 状态标签 */
.status-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  font-family: SourceHanSans-Medium;
  white-space: nowrap;
}

.status-match {
  background-color: #DCFCE7;
  color: #15803D;
}

.status-mismatch {
  background-color: #FEE2E2;
  color: #B91C1C;
}

.status-warning {
  background-color: #FEF9C3;
  color: #A16207;
}

/* 移除分页控件样式 */

/* 文件信息栏 */
.file-info-bar {
  background: rgba(255, 255, 255, 0.7);
  border: 0.6667px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 20px;
  backdrop-filter: blur(4px);
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.file-info-title {
  font-size: 18px;
  font-weight: 600;
  color: #1A1A1A;
  font-family: SourceHanSans-SemiBold;
  margin-bottom: 16px;
}

.file-paths {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.file-path-container {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #F9FAFB;
  border-radius: 12px;
  padding: 12px;
  font-family: SourceHanSans-Regular;
}

.file-icon {
  color: #3B82F6;
  font-size: 16px;
}

.file-path {
  font-size: 14px;
  color: #333333;
  font-family: SourceHanSans-Regular;
}
</style>