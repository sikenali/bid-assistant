import { RiFileLine, RiCompassesLine, RiBarChartLine, RiDownloadCloudLine, RiCheckDoubleLine, RiCloseCircleLine, RiAlertLine, RiSettings3Line, RiSaveLine, RiArrowLeftLine } from '@remixicon/vue'

// Vue 3插件安装函数
export default {
  install(app) {
    // 全局图标大小配置
    app.config.globalProperties.$iconSize = {
      sm: 16,
      md: 24,
      lg: 36
    }
    
    // 注册所有图标组件
    app.component('RiFileLine', RiFileLine)
    app.component('RiCompassesLine', RiCompassesLine)
    app.component('RiBarChartLine', RiBarChartLine)
    app.component('RiDownloadCloudLine', RiDownloadCloudLine)
    app.component('RiCheckDoubleLine', RiCheckDoubleLine)
    app.component('RiCloseCircleLine', RiCloseCircleLine)
    app.component('RiAlertLine', RiAlertLine)
    app.component('RiSettings3Line', RiSettings3Line)
    app.component('RiSaveLine', RiSaveLine)
    app.component('RiArrowLeftLine', RiArrowLeftLine)
  }
}
