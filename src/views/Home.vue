<template>
  <div class="app-container">
    <!-- Top Navigation Bar -->
    <header class="navbar">
      <div class="navbar-brand">
        <div class="logo-icon">
          <i class="ri-target-line"></i>
        </div>
        <span class="brand-name">猩文标聚</span>
        <span class="brand-sub">文档智能处理平台</span>
      </div>
      <div class="navbar-actions">
        <button class="btn-icon credit-btn" title="信用资质" @click="showCreditModal = true">
          <i class="ri-shield-check-line"></i>
        </button>
        <button class="btn-icon settings-btn" title="投标网站" @click="showSettingsModal = true">
          <i class="ri-links-line"></i>
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
          <div class="card-body">
            <div class="card-icon" :style="{ background: card.iconBg }">
              <i :class="card.icon" :style="{ color: card.color }"></i>
            </div>
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-desc">{{ card.desc }}</p>
            <div class="card-accent" :style="{ background: card.color }"></div>
          </div>
          <div class="shelf-base" :style="hoverIndex === index ? { background: card.color } : { background: card.shelfColor }" @mouseenter="hoverIndex = index" @mouseleave="hoverIndex = null"></div>
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
    </main>

    <!-- Footer Bar -->
    <footer class="app-footer">
      <span>© 2026 猩文标聚</span>
    </footer>

    <!-- Bidding Sites Modal -->
    <BiddingSitesModal v-model:visible="showSettingsModal" />
    
    <!-- Credit Qualification Modal -->
    <CreditQualificationModal v-model:visible="showCreditModal" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BiddingSitesModal from '@/components/BiddingSitesModal.vue'
import CreditQualificationModal from '@/components/CreditQualificationModal.vue'

const showSettingsModal = ref(false)
const showCreditModal = ref(false)
const hoverIndex = ref(null)

const cards = [
  {
    title: '文取猩',
    desc: '智能采集',
    icon: 'ri-inbox-line',
    color: 'var(--brand-red)',
    iconBg: 'rgba(253, 242, 238, 1)',
    shelfColor: 'var(--border-gold)',
    url: 'https://example.com/collection'
  },
  {
    title: '文制猩',
    desc: '智能生成',
    icon: 'ri-pencil-line',
    color: 'var(--brand-gold)',
    iconBg: 'rgba(253, 248, 232, 1)',
    shelfColor: 'var(--border-gold)',
    url: 'https://example.com/generate'
  },
  {
    title: '文检猩',
    desc: '智能校验',
    icon: 'ri-checkbox-circle-line',
    color: 'var(--brand-green)',
    iconBg: 'rgba(237, 245, 237, 1)',
    shelfColor: 'var(--border-gold)',
    url: 'https://example.com/verify'
  },
  {
    title: '文版猩',
    desc: '智能排版',
    icon: 'ri-layout-masonry-line',
    color: 'var(--brand-blue)',
    iconBg: 'rgba(237, 242, 247, 1)',
    shelfColor: 'var(--border-gold)',
    url: 'https://example.com/layout'
  },
  {
    title: '文比猩',
    desc: '智能比对',
    icon: 'ri-git-commit-line',
    color: 'var(--brand-pink)',
    iconBg: 'rgba(250, 238, 238, 1)',
    shelfColor: 'var(--border-gold)',
    url: 'https://example.com/compare'
  },
]

function handleCardClick(card) {
  window.open(card.url, '_blank')
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
  perspective: 800px;
}

.shelf-item:hover {
  transform: translateY(-8px);
}

.shelf-item:hover .card-body {
  box-shadow: 0 16px 40px rgba(196, 58, 49, 0.12),
              0 4px 12px rgba(0, 0, 0, 0.06);
  border-color: var(--brand-red);
  transform: translateY(-2px);
}

.shelf-item:hover .card-icon {
  transform: scale(1.1) rotate(-2deg);
}

.shelf-item:hover .card-accent {
  width: 32px;
}

.shelf-item:hover .shelf-base {
  width: 214px;
  box-shadow: 0 6px 16px rgba(196, 58, 49, 0.15);
}

.card-body {
  width: 180px;
  height: 220px;
  background: linear-gradient(180deg, rgba(255, 248, 240, 1) 0%, rgba(255, 253, 248, 1) 100%);
  border: 0.7px solid var(--border-light);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-md);
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              border-color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.card-icon {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-round);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.card-accent {
  margin-top: 8px;
  width: 9px;
  height: 8px;
  border-radius: 4px;
  transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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

.shelf-base {
  margin-top: 4px;
  width: 201px;
  height: 10px;
  background: var(--border-gold);
  border-radius: 3px;
  box-shadow: var(--shadow-lg);
  transition: width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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

/* Footer Bar */
.app-footer {
  width: 100%;
  padding: 16px 40px;
  background: rgba(245, 240, 232, 1);
  text-align: center;
  font-size: 12px;
  color: rgba(184, 168, 138, 1);
  letter-spacing: 1px;
}

/* Navbar Actions */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  border: 0.7px solid rgba(232, 213, 192, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: rgba(91, 74, 58, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              box-shadow 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              border-color 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              color 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.btn-icon::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(196, 58, 49, 0.08), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.btn-icon:hover {
  box-shadow: 0 6px 20px rgba(196, 58, 49, 0.12),
              0 2px 8px rgba(0, 0, 0, 0.06);
  border-color: rgba(196, 58, 49, 0.25);
  color: rgba(196, 58, 49, 1);
  transform: translateY(-2px);
}

.btn-icon:hover::before {
  opacity: 1;
}

.btn-icon:active {
  transform: translateY(0) scale(0.95);
  box-shadow: 0 2px 8px rgba(196, 58, 49, 0.08);
}

.credit-btn {
  color: rgba(91, 74, 58, 1);
}

.credit-btn:hover {
  color: rgba(196, 58, 49, 1);
}

.settings-btn {
  color: rgba(91, 74, 58, 1);
}

.settings-btn:hover {
  color: rgba(196, 58, 49, 1);
}
</style>
