<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="visible" class="modal-overlay" @click.self="close">
        <div class="settings-panel">
          <!-- Panel Header -->
          <div class="panel-header">
            <div class="header-left">
              <div class="header-icon">
                <i class="ri-shield-check-line"></i>
              </div>
              <div class="header-text">
                <h2 class="panel-title">信用资质查询平台</h2>
                <p class="panel-subtitle">查询企业信用、处罚记录、资质证书等招投标必备信息</p>
              </div>
            </div>
            <button class="close-btn" @click="close">
              <i class="ri-close-line"></i>
            </button>
          </div>

          <!-- Website Grid -->
          <div class="website-grid">
            <div
              v-for="(site, index) in creditSites"
              :key="index"
              class="site-card"
            >
              <div class="site-card-top">
                <div class="site-logo" :style="{ backgroundImage: site.logo ? `url(${site.logo})` : '' }"></div>
                <div class="site-info">
                  <h3 class="site-name">{{ site.name }}</h3>
                  <p class="site-desc">{{ site.desc }}</p>
                </div>
              </div>
              <div class="site-card-bottom">
                <span class="site-url-tooltip" :title="site.url">
                  <i class="ri-global-line site-url-icon"></i>
                  <span class="site-url-text">{{ site.url }}</span>
                </span>
                <button class="copy-btn" @click="copyUrl(site.url)" title="复制网址">
                  <i class="ri-file-copy-line"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Panel Footer -->
          <div class="panel-footer">
            <span class="footer-hint">
              <i class="ri-information-line"></i>
              悬停卡片可预览详情，点击右下角复制图标即可复制网站地址
            </span>
            <span class="footer-count">共 {{ creditSites.length }} 个信用资质平台</span>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible'])

function close() {
  emit('update:visible', false)
}

const creditSites = [
  { name: '信用中国', desc: '信用信息总门户', url: 'www.creditchina.gov.cn', logo: '' },
  { name: '守信荣誉查询', desc: '诚实守信相关荣誉', url: 'www.creditchina.gov.cn/xinyongfuwu/shouxinhongmingdan/', logo: '' },
  { name: '失信黑名单查询', desc: '严重失信主体名单', url: 'www.creditchina.gov.cn/xinyongfuwu/shixinheimingdan/', logo: '' },
  { name: '经营异常名录', desc: '活动异常名录查询', url: 'www.creditchina.gov.cn/xinyongfuwu/zhongdianguanzhushixinmingdan/', logo: '' },
  { name: '失信被执行人', desc: '法院失信被执行', url: 'zxgk.court.gov.cn/shixin/', logo: '' },
  { name: '重大税收违法', desc: '税收违法失信主体', url: 'www.creditchina.gov.cn/xinyongfuwu/zhongdashuishouweifaanjian/', logo: '' },
  { name: '社会组织失信名单', desc: '社会组织严重违法', url: 'www.creditchina.gov.cn/xinyongfuwu/shzz/', logo: '' },
  { name: '纳税信用A级名单', desc: 'A级纳税人公布', url: 'www.chinatax.gov.cn/chinatax/n810346/c102299/', logo: '' },
  { name: '企业信用评级', desc: '中国企业信用评级', url: 'www.cecpsp.org.cn/', logo: '' },
  { name: '中国裁判文书网', desc: '裁判文书查询', url: 'wenshu.court.gov.cn/', logo: '' },
  { name: '管理体系认证查询', desc: '认证结果查询', url: 'cx.cnca.cn/', logo: '' },
  { name: '小微企业名录', desc: '工信部企业查询', url: 'xwqy.gsxt.gov.cn/', logo: '' },
  { name: '国家职业资格证书', desc: '职业资格查询', url: 'zscx.osta.org.cn/', logo: '' },
  { name: '中国专利信息网', desc: '专利信息查询', url: 'www.patent.com.cn/', logo: '' },
  { name: '中国版权保护中心', desc: '版权登记查询', url: 'www.ccopyright.com.cn/', logo: '' },
  { name: '食品安全标准查询', desc: '国家标准查询', url: 'www.nhc.gov.cn/sps/spaqgjbz/', logo: '' },
  { name: '电信业务经营许可', desc: '工信部许可查询', url: 'tsm.miit.gov.cn/', logo: '' },
  { name: '国家税务总局', desc: '税务信息查询', url: 'www.chinatax.gov.cn/', logo: '' },
  { name: '注册会计师信息查询', desc: '中注协会员查询', url: 'cmis.cicpa.org.cn/', logo: '' },
  { name: '检验检测报告查询', desc: '质检报告查询', url: 'cx.cnca.cn/CertECloud/qts/', logo: '' },
  { name: '中国建造师网', desc: '建造师信息查询', url: 'www.coc.gov.cn/', logo: '' },
  { name: '注册安全工程师', desc: '安全工程师查询', url: 'rmocse.chinasafety.ac.cn/', logo: '' },
  { name: '全国特种设备公示', desc: '特种设备查询', url: 'cnse.e-cqs.cn/', logo: '' },
  { name: '建筑工程施工许可', desc: '电子证照查询', url: 'jzsc.mohurd.gov.cn/data/elePermit', logo: '' },
  { name: '人民银行企业征信', desc: '企业信用报告', url: 'www.pbccrc.org.cn/zxzx/qyzx/', logo: '' },
]

async function copyUrl(url) {
  const fullUrl = `http://${url}`
  try {
    await navigator.clipboard.writeText(fullUrl)
    showToast(`已复制: ${fullUrl}`)
  } catch (err) {
    const textarea = document.createElement('textarea')
    textarea.value = fullUrl
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    showToast(`已复制: ${fullUrl}`)
  }
}

function showToast(message) {
  const toast = document.createElement('div')
  toast.className = 'copy-toast'
  toast.textContent = message
  document.body.appendChild(toast)
  setTimeout(() => {
    toast.classList.add('show')
  }, 10)
  setTimeout(() => {
    toast.classList.remove('show')
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast)
      }
    }, 300)
  }, 2000)
}
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Settings Panel */
.settings-panel {
  width: 1120px;
  max-height: 90vh;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
  padding: 36px 40px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

/* Panel Header */
.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: rgba(253, 242, 238, 1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: rgba(196, 58, 49, 1);
  flex-shrink: 0;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.panel-title {
  font-size: 22px;
  font-weight: 700;
  color: rgba(61, 50, 38, 1);
  margin: 0;
  line-height: 28px;
}

.panel-subtitle {
  font-size: 13px;
  color: rgba(139, 115, 85, 1);
  margin: 0;
  line-height: 18px;
}

.close-btn {
  width: 40px;
  height: 40px;
  background: rgba(245, 240, 232, 1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: rgba(91, 74, 58, 1);
  cursor: pointer;
  border: none;
  flex-shrink: 0;
}

.close-btn:hover {
  background: rgba(245, 240, 232, 0.8);
}

/* Website Grid */
.website-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 32px;
}

/* Site Card */
.site-card {
  width: 100%;
  min-width: 0;
  height: 140px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(255, 253, 248, 1) 100%);
  border: 0.7px solid rgba(232, 213, 192, 1);
  border-radius: 12px;
  padding: 12px 8px 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              border-color 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: default;
  position: relative;
  overflow: hidden;
}

.site-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(196, 58, 49, 0.4), transparent);
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.site-card:hover {
  box-shadow: 0 8px 24px rgba(196, 58, 49, 0.1),
              0 2px 8px rgba(0, 0, 0, 0.04);
  transform: translateY(-3px);
  border-color: rgba(232, 213, 192, 0.8);
}

.site-card:hover::before {
  opacity: 1;
}

.site-card-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-width: 0;
}

.site-logo {
  width: 36px;
  height: 36px;
  background: rgba(245, 240, 232, 1);
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
}

.site-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 6px;
  gap: 1px;
  min-width: 0;
  overflow: hidden;
}

.site-name {
  font-size: 11px;
  font-weight: 500;
  color: rgba(61, 50, 38, 1);
  margin: 0;
  text-align: center;
  line-height: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.site-desc {
  font-size: 9px;
  color: rgba(139, 115, 85, 1);
  margin: 0;
  text-align: center;
  line-height: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.site-card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 6px;
  margin-top: 4px;
  border-top: 1px solid rgba(245, 240, 232, 1);
  min-width: 0;
}

/* URL Tooltip */
.site-url-tooltip {
  display: flex;
  align-items: center;
  gap: 5px;
  flex: 1;
  min-width: 0;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(245, 240, 232, 0);
  transition: background 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
}

.site-card:hover .site-url-tooltip {
  background: rgba(245, 240, 232, 0.8);
}

.site-url-icon {
  font-size: 13px;
  color: rgba(196, 58, 49, 0.6);
  line-height: 1;
  flex-shrink: 0;
  transition: color 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.site-card:hover .site-url-icon {
  color: rgba(196, 58, 49, 1);
}

.site-url-text {
  font-size: 9px;
  color: rgba(123, 158, 179, 1);
  line-height: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.25s;
}

.site-card:hover .site-url-text {
  color: rgba(123, 158, 179, 0.9);
}

.copy-btn {
  width: 24px;
  height: 24px;
  background: rgba(253, 242, 238, 1);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: rgba(196, 58, 49, 1);
  cursor: pointer;
  border: none;
  flex-shrink: 0;
  transition: background 0.2s, transform 0.15s;
}

.copy-btn:hover {
  background: rgba(196, 58, 49, 0.1);
  transform: scale(1.1);
}

.copy-btn:active {
  transform: scale(0.95);
}

/* Panel Footer */
.panel-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid rgba(245, 240, 232, 1);
}

.footer-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(139, 115, 85, 1);
}

.footer-hint i {
  font-size: 14px;
  color: rgba(123, 158, 179, 1);
}

.footer-count {
  font-size: 12px;
  color: rgba(196, 58, 49, 1);
}

/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Copy Toast */
.copy-toast {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: rgba(61, 50, 38, 0.9);
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 2000;
}

.copy-toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
</style>
