<template>
  <div class="app-container">
    <!-- Top Navigation Bar -->
    <header class="navbar">
      <div class="navbar-brand">
        <div class="logo-icon">
          <i class="ri-bookmark-2-fill"></i>
        </div>
        <span class="brand-name">猩文标聚</span>
        <span class="brand-sub">sikenali · 文档智能处理平台</span>
      </div>
      <div class="navbar-actions">
        <button class="btn-icon settings-btn" title="设置">
          <i class="ri-settings-3-line"></i>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Title Section -->
      <section class="hero-section">
        <div class="decoration-line"></div>
        <h1 class="hero-title">文房五宝 · 智驭文档</h1>
        <p class="hero-subtitle">取、制、检、版、比，五步成章，回旋有术</p>
      </section>

      <!-- Five Cards Shelf -->
      <section class="cards-shelf">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="shelf-item"
          @click="handleCardClick(card)"
        >
          <div class="card-body" :style="{ background: card.bgGradient, borderColor: card.stroke }">
            <div class="card-icon" :style="{ background: card.iconBg }">
              <i class="ri-custom-icon" :style="{ color: card.color, fontSize: '36px' }">&#x{{ card.iconUnicode.slice(2) }};</i>
            </div>
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-desc">{{ card.desc }}</p>
            <div class="card-accent" :style="{ background: card.color }"></div>
          </div>
          <div class="shelf-base" :style="{ background: card.shelfColor }"></div>
        </div>
      </section>

      <!-- Bottom Decoration -->
      <section class="footer-decoration">
        <div class="scroll-decor">
          <div class="scroll-line"></div>
          <div class="scroll-diamond" :style="{ background: 'var(--brand-red)' }"></div>
          <div class="scroll-line"></div>
        </div>
        <p class="footer-slogan">回旋有术 · 文档无忧</p>
      </section>

      <!-- Footer -->
      <footer class="app-footer">
        <span>© 2026 猩文标聚 sikenali</span>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const cards = [
  {
    title: '文取猩',
    desc: '智能采集',
    iconUnicode: '\uec56',
    color: 'rgba(196,58,49,1)',
    iconBg: 'rgba(253,242,238,1)',
    stroke: 'rgba(232,213,192,1)',
    bgGradient: 'linear-gradient(180deg, rgba(255,248,240,1) 0%, rgba(255,253,248,1) 100%)',
    shelfColor: 'rgba(212,196,168,1)',
    url: '/collection'
  },
  {
    title: '文制猩',
    desc: '智能生成',
    iconUnicode: '\uecf6',
    color: 'rgba(200,164,92,1)',
    iconBg: 'rgba(253,248,232,1)',
    stroke: 'rgba(224,216,184,1)',
    bgGradient: 'linear-gradient(180deg, rgba(255,253,245,1) 0%, rgba(255,254,248,1) 100%)',
    shelfColor: 'rgba(212,196,168,1)',
    url: 'https://example.com/generate'
  },
  {
    title: '文检猩',
    desc: '智能校验',
    iconUnicode: '\ueb79',
    color: 'rgba(91,140,90,1)',
    iconBg: 'rgba(237,245,237,1)',
    stroke: 'rgba(200,220,200,1)',
    bgGradient: 'linear-gradient(180deg, rgba(245,250,245,1) 0%, rgba(248,252,248,1) 100%)',
    shelfColor: 'rgba(212,196,168,1)',
    url: 'https://example.com/verify'
  },
  {
    title: '文版猩',
    desc: '智能排版',
    iconUnicode: '\ueea5',
    color: 'rgba(123,158,179,1)',
    iconBg: 'rgba(237,242,247,1)',
    stroke: 'rgba(200,212,224,1)',
    bgGradient: 'linear-gradient(180deg, rgba(245,248,251,1) 0%, rgba(248,250,252,1) 100%)',
    shelfColor: 'rgba(212,196,168,1)',
    url: 'https://example.com/layout'
  },
  {
    title: '文比猩',
    desc: '智能比对',
    iconUnicode: '\ue8f7',
    color: 'rgba(184,84,80,1)',
    iconBg: 'rgba(250,238,238,1)',
    stroke: 'rgba(232,208,208,1)',
    bgGradient: 'linear-gradient(180deg, rgba(253,245,245,1) 0%, rgba(255,248,248,1) 100%)',
    shelfColor: 'rgba(212,196,168,1)',
    url: 'https://example.com/compare'
  },
]

function handleCardClick(card) {
  router.push(card.url)
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

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
  align-items: center;
  padding: 60px 40px 80px;
}

/* Hero Section */
.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.decoration-line {
  width: 61px;
  height: 3px;
  background: var(--brand-gold);
  border-radius: 2px;
}

.hero-title {
  margin-top: 20px;
  font-size: 36px;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 4px;
}

.hero-subtitle {
  margin-top: 12px;
  font-size: 16px;
  font-weight: 400;
  color: var(--text-secondary);
  letter-spacing: 1px;
}

/* Cards Shelf */
.cards-shelf {
  margin-top: 56px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 32px;
  width: 1200px;
  max-width: 100%;
}

.shelf-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.shelf-item:hover {
  transform: translateY(-4px);
}

.card-body {
  width: 180px;
  height: 220px;
  border: 0.7px solid var(--border-light);
  border-radius: var(--radius-card);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.card-icon {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-round);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'remixicon';
  font-size: 36px;
  line-height: 1;
}

.card-icon::before {
  content: attr(data-icon);
}

.card-title {
  margin-top: 20px;
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
}

.card-desc {
  margin-top: 8px;
  font-size: 13px;
  color: var(--text-muted);
}

.card-accent {
  margin-top: 8px;
  width: 9px;
  height: 8px;
  border-radius: 4px;
}

.shelf-base {
  margin-top: 4px;
  width: 201px;
  height: 10px;
  background: var(--border-gold);
  border-radius: 3px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

/* Footer Decoration */
.footer-decoration {
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.scroll-decor {
  display: flex;
  align-items: center;
  gap: 16px;
}

.scroll-line {
  width: 41px;
  height: 2px;
  background: var(--brand-gold);
  border-radius: 1px;
}

.scroll-diamond {
  width: 9px;
  height: 8px;
  border-radius: 4px;
}

.footer-slogan {
  margin-top: 16px;
  font-size: 13px;
  color: var(--text-light);
  letter-spacing: 2px;
}

/* Footer */
.app-footer {
  width: 100%;
  padding: 16px 40px;
  text-align: center;
  font-size: 12px;
  color: var(--text-light);
  letter-spacing: 1px;
}
</style>
