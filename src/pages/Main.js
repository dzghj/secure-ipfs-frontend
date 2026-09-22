import React from "react";
import { useNavigate } from "react-router-dom";

const translations = {
  en: {
    documents: [
      { emoji: "📜", title: "Will & Testament", type: "Legal · Blockchain Anchored" },
      { emoji: "🏠", title: "Property Title", type: "Real Estate · Encrypted" },
      { emoji: "💉", title: "Health Records", type: "Medical · Encrypted" },
      { emoji: "🪪", title: "Driver's Licence", type: "Identity · Encrypted" },
    ],
    features: [
      {
        icon: "🧠",
        title: "Run by AI Brain",
        desc: "An autonomous AI agent watches every upload, node, and continuity check around the clock — detecting and healing issues before they ever reach you.",
      },
      {
        icon: "⛓️",
        title: "Blockchain Anchored",
        desc: "Every document is hashed and recorded on-chain. Tamper-proof, timestamped, and permanently verifiable.",
      },
      {
        icon: "🔐",
        title: "End-to-End Encrypted",
        desc: "Military-grade AES-256 encryption. Files are secured before leaving your device.",
      },
      {
        icon: "🌐",
        title: "Decentralized Storage",
        desc: "Stored on IPFS — no single point of failure. Your documents persist across distributed networks.",
      },
      {
        icon: "✨",
        title: "Zero Knowledge",
        desc: "We never have access to your files or encryption keys. Only you and your legal contacts can unlock them.",
      },
      {
        icon: "👥",
        title: "Legal Contact Access",
        desc: "Designate trusted executors and family members. Access is released automatically via your continuity switch.",
      },
      {
        icon: "☑️",
        title: "PIPEDA Compliant",
        desc: "Enterprise-grade security and full compliance with global privacy regulations.",
      },
      {
        icon: "💬",
        title: "24/7 AI Support",
        desc: "Have a question any time, day or night? Click the AI chat bubble in the bottom corner of your dashboard for instant support.",
      },
    ],
    securityPoints: [
      { title: "Immutable Blockchain Record", desc: "Document hashes stored on-chain — cannot be altered or deleted" },
      { title: "AES-256 Encryption", desc: "Industry standard encryption applied before upload" },
      { title: "Zero Knowledge Architecture", desc: "We cannot access your data even if legally requested" },
      { title: "PIPEDA & CCPA Compliant", desc: "Full compliance with international privacy laws" },
    ],
    chainSteps: [
      { step: "01", title: "Upload Your Document", desc: "Drag and drop your will, title deed, or legal file into your vault." },
      { step: "02", title: "Encrypted & Hashed", desc: "Your file is AES-256 encrypted. A unique cryptographic hash is generated." },
      { step: "03", title: "Anchored On-Chain", desc: "The hash is written to the blockchain — creating a permanent, tamper-proof record." },
      { step: "04", title: "Stored on IPFS", desc: "The encrypted file is distributed across IPFS nodes. No central server to attack." },
      { step: "05", title: "Legal Contact Access Released", desc: "When your continuity switch triggers, designated legal contacts gain access automatically." },
    ],
    hero: {
      badge1: "Blockchain-Secured Legal Documents",
      badge2: "Run by AI Brain — Monitored 24/7",
      titleLine1: "Your Legacy, Secured,",
      titleLine2: "On the Chain Forever",
      paragraph:
        "LegacyChain protects your legal and estate documents with blockchain immutability, AES-256 encryption, and IPFS decentralized storage. Your wishes — preserved exactly as you intended.",
      ctaPrimary: "Secure My Legacy",
      ctaSecondary: "See How It Works",
      stat1Label: "AES Encryption",
      stat2Label: "Data Sold",
      stat3Label: "Decentralized",
      stat4Label: "Access Anywhere",
      mockupTitle: "My Chain Vault",
      mockupSubtitle: "4 documents · blockchain verified",
      mockupFooter: "Blockchain Anchored • AES-256 • IPFS Distributed",
    },
    how: {
      heading: "How LegacyChain Works",
      sub: "From upload to on-chain proof — in seconds.",
    },
    featuresHeading: "Why Choose LegacyChain?",
    security: {
      heading: "Enterprise-Grade Security",
      cardHeading: "Immutable by Design",
      cardParagraph:
        "Once your document hash is written to the blockchain, no one — not even us — can alter, delete, or dispute its existence.",
      verifiedBadge: "✓ Blockchain Verified",
      verifiedSub: "Immutable · Timestamped · Trustless",
    },
    cta: {
      heading: "Protect Your Legacy Today",
      paragraph: "Your legacy deserves more than a filing cabinet. Anchor it on the blockchain — forever.",
      button: "Create Your Chain Vault",
    },
  },
  zh: {
    documents: [
      { emoji: "📜", title: "遗嘱文件", type: "法律 · 区块链锚定" },
      { emoji: "🏠", title: "房产证", type: "不动产 · 已加密" },
      { emoji: "💉", title: "健康记录", type: "医疗 · 已加密" },
      { emoji: "🪪", title: "驾驶执照", type: "身份证明 · 已加密" },
    ],
    features: [
      {
        icon: "🧠",
        title: "由AI大脑驱动",
        desc: "自主AI代理全天候监控每一次上传、每个节点与生命状态检查——在问题影响到您之前就主动发现并修复。",
      },
      {
        icon: "⛓️",
        title: "区块链锚定",
        desc: "每份文件都会生成哈希并记录上链,防篡改、加盖时间戳且永久可验证。",
      },
      {
        icon: "🔐",
        title: "端到端加密",
        desc: "军用级AES-256加密,文件在离开您的设备前就已完成加密。",
      },
      {
        icon: "🌐",
        title: "去中心化存储",
        desc: "存储于IPFS——没有单点故障,您的文件分布保存在去中心化网络中。",
      },
      {
        icon: "✨",
        title: "零知识架构",
        desc: "我们永远无法访问您的文件或加密密钥,只有您和您的法定联系人才能解锁它们。",
      },
      {
        icon: "👥",
        title: "法定联系人权限",
        desc: "指定值得信赖的执行人与家庭成员。当您的生命状态开关触发时,访问权限会自动释放。",
      },
      {
        icon: "☑️",
        title: "符合PIPEDA规定",
        desc: "企业级安全保障,完全符合全球隐私法规。",
      },
      {
        icon: "💬",
        title: "24/7 AI客服支持",
        desc: "随时有疑问?点击控制台右下角的AI聊天气泡,即刻获得支持,全天候在线。",
      },
    ],
    securityPoints: [
      { title: "不可篡改的区块链记录", desc: "文件哈希上链存储——无法被更改或删除" },
      { title: "AES-256加密", desc: "上传前即应用行业标准加密" },
      { title: "零知识架构", desc: "即使被依法要求,我们也无法访问您的数据" },
      { title: "符合PIPEDA与CCPA规定", desc: "完全符合国际隐私法律" },
    ],
    chainSteps: [
      { step: "01", title: "上传您的文件", desc: "将遗嘱、产权证或其他法律文件拖放至您的保险库。" },
      { step: "02", title: "加密与哈希处理", desc: "文件经过AES-256加密,并生成唯一的加密哈希值。" },
      { step: "03", title: "锚定上链", desc: "哈希值被写入区块链——创建永久、防篡改的记录。" },
      { step: "04", title: "存储至IPFS", desc: "加密文件分布存储在IPFS节点中,没有可被攻击的中心服务器。" },
      { step: "05", title: "法定联系人权限释放", desc: "当您的生命状态开关触发时,指定的法定联系人将自动获得访问权限。" },
    ],
    hero: {
      badge1: "区块链加密法律文件",
      badge2: "AI大脑驱动 — 24/7全天候监控",
      titleLine1: "守护您的传承,",
      titleLine2: "永远上链留存",
      paragraph:
        "LegacyChain 通过区块链不可篡改性、AES-256加密和IPFS去中心化存储,保护您的法律与遗产文件。您的心愿——原样永存。",
      ctaPrimary: "立即守护我的传承",
      ctaSecondary: "了解运作方式",
      stat1Label: "AES加密",
      stat2Label: "数据出售",
      stat3Label: "去中心化",
      stat4Label: "随时访问",
      mockupTitle: "我的链上保险库",
      mockupSubtitle: "4份文件 · 区块链已验证",
      mockupFooter: "区块链锚定 • AES-256 • IPFS分布式存储",
    },
    how: {
      heading: "LegacyChain 如何运作",
      sub: "从上传到链上存证——仅需几秒。",
    },
    featuresHeading: "为什么选择 LegacyChain?",
    security: {
      heading: "企业级安全保障",
      cardHeading: "从设计上不可篡改",
      cardParagraph: "一旦文件哈希写入区块链,任何人——包括我们自己——都无法更改、删除或质疑其存在。",
      verifiedBadge: "✓ 区块链已验证",
      verifiedSub: "不可篡改 · 已加时间戳 · 无需信任",
    },
    cta: {
      heading: "立即守护您的传承",
      paragraph: "您的传承不该只锁在文件柜里。将它永久锚定上链。",
      button: "创建我的链上保险库",
    },
  },
};

export default function Main() {
  const navigate = useNavigate();
  const [lang, setLang] = React.useState(() => localStorage.getItem("lang") || "en");

  React.useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-dark-bg text-white">

      {/* ========== HERO ========== */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">

        {/* Language selector */}
        <div className="flex justify-end mb-6">
          <div className="inline-flex items-center bg-dark-card border border-dark-border rounded-full p-1 text-sm">
            <button
              onClick={() => setLang("en")}
              className={`px-4 py-1.5 rounded-full font-medium transition ${
                lang === "en" ? "bg-primary text-dark-bg" : "text-gray-400 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("zh")}
              className={`px-4 py-1.5 rounded-full font-medium transition ${
                lang === "zh" ? "bg-primary text-dark-bg" : "text-gray-400 hover:text-white"
              }`}
            >
              中文
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div>
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="inline-flex items-center gap-2 bg-primary bg-opacity-10 border border-primary border-opacity-30 rounded-full px-4 py-2 text-sm text-primary font-medium">
                <span>⛓️</span> {t.hero.badge1}
              </div>
              <div className="inline-flex items-center gap-2 bg-primary bg-opacity-10 border border-primary border-opacity-30 rounded-full px-4 py-2 text-sm text-primary font-medium">
                <span>🧠</span> {t.hero.badge2}
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              {t.hero.titleLine1}<br />
              <span className="text-primary">{t.hero.titleLine2}</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              {t.hero.paragraph}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-4 bg-primary text-dark-bg hover:bg-primary-dark rounded-lg font-semibold transition text-lg flex items-center justify-center gap-2"
              >
                <span>⛓️</span> {t.hero.ctaPrimary}
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-4 border-2 border-primary text-primary hover:bg-primary hover:text-dark-bg rounded-lg font-semibold transition text-lg flex items-center justify-center gap-2"
              >
                <span>▶</span> {t.hero.ctaSecondary}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">256-bit</div>
                <div className="text-xs text-gray-400 uppercase">{t.hero.stat1Label}</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">0</div>
                <div className="text-xs text-gray-400 uppercase">{t.hero.stat2Label}</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">IPFS</div>
                <div className="text-xs text-gray-400 uppercase">{t.hero.stat3Label}</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-xs text-gray-400 uppercase">{t.hero.stat4Label}</div>
              </div>
            </div>
          </div>

          {/* Right - Mockup */}
          <div className="relative">
            <div className="bg-gradient-to-br from-dark-card to-dark-bg border border-dark-border rounded-2xl p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-dark-border">
                <div>
                  <div className="font-semibold">{t.hero.mockupTitle}</div>
                  <div className="text-sm text-gray-400">{t.hero.mockupSubtitle}</div>
                </div>
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-dark-bg font-bold text-sm">
                  JM
                </div>
              </div>

              <div className="space-y-3">
                {t.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="bg-dark-card bg-opacity-60 border border-dark-border rounded-lg p-4 hover:border-primary transition cursor-pointer flex items-start gap-3"
                  >
                    <div className="text-2xl">{doc.emoji}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{doc.title}</div>
                      <div className="text-xs text-gray-400">{doc.type}</div>
                    </div>
                    <div className="text-primary text-xs font-mono">⛓️</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-primary to-primary-dark rounded-lg text-dark-bg text-center font-semibold text-sm">
                ⛓️ {t.hero.mockupFooter}
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-primary text-dark-bg w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg">
              ⛓️
            </div>
          </div>
        </div>
      </section>

      {/* ========== HOW THE CHAIN WORKS ========== */}
      <section className="py-20 border-y border-dark-border bg-dark-card bg-opacity-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-3">{t.how.heading}</h2>
            <p className="text-gray-400 text-lg">{t.how.sub}</p>
          </div>
          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {t.chainSteps.map((s) => (
                <div key={s.step} className="flex flex-col items-center text-center relative">
                  <div className="w-16 h-16 rounded-full bg-primary bg-opacity-15 border-2 border-primary flex items-center justify-center text-primary font-bold text-lg mb-4 z-10">
                    {s.step}
                  </div>
                  <h4 className="font-semibold text-sm mb-2">{s.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">{t.featuresHeading}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-primary transition"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECURITY ========== */}
      <section id="security" className="py-20 bg-dark-card bg-opacity-30 border-y border-dark-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">{t.security.heading}</h2>
              <div className="space-y-6">
                {t.securityPoints.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="text-primary text-2xl flex-shrink-0">✓</div>
                    <div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-dark-card to-dark-bg border border-dark-border rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">⛓️</div>
              <h3 className="text-2xl font-bold mb-4">{t.security.cardHeading}</h3>
              <p className="text-gray-400 mb-6">
                {t.security.cardParagraph}
              </p>
              <div className="bg-primary bg-opacity-20 border border-primary rounded-lg p-4">
                <div className="text-primary font-semibold">{t.security.verifiedBadge}</div>
                <div className="text-sm text-gray-400 mt-1">{t.security.verifiedSub}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary-dark rounded-2xl mx-6 mb-10 text-dark-bg">
        <div className="max-w-4xl mx-auto text-center px-6">
          <div className="text-5xl mb-4">⛓️</div>
          <h2 className="text-4xl font-bold mb-4">{t.cta.heading}</h2>
          <p className="text-lg mb-8 opacity-90">
            {t.cta.paragraph}
          </p>
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-4 bg-dark-bg text-primary hover:bg-gray-900 rounded-lg font-semibold transition text-lg"
          >
            {t.cta.button}
          </button>
        </div>
      </section>

    </div>
  );
}
