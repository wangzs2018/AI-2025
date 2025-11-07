/* 主脚本：数据、渲染、交互 */
(function(){
  const isDetail = document.body.getAttribute('data-page') === 'detail';
  const dataset = [
    {
      id: 'ai-foundation',
      title: '人工智能基础入门',
      subtitle: '掌握核心概念，构建知识地图',
      description: '本课程聚焦人工智能整体认知，覆盖机器学习、深度学习基本思想与常见应用场景，通过项目化案例快速建立系统框架。',
      duration: '12 小时',
      level: '初级',
      updated: '2025-10',
      outline: [
        'AI 概念与发展历史',
        '机器学习任务类型与流程',
        '常用算法速览：线性回归 / 决策树 / 聚类',
        '深度学习基本原理与网络结构',
        '实践：简单分类模型构建',
        '模型评估与调优概念'
      ],
      tags: ['AI', '基础', '入门'],
      bg: 'images/c-1.png'
    },
    {
      id: 'ml-practice',
      title: '机器学习实战进阶',
      subtitle: '从数据到可部署模型',
      description: '围绕真实数据集，完整演练特征工程、模型选择、调参与上线注意事项，强调可复现与工程化。',
      duration: '18 小时',
      level: '中级',
      updated: '2025-09',
      outline: [
        '项目结构与数据治理',
        '特征工程与数据增强',
        '模型对比与集成策略',
        '自动化调参与性能优化',
        '评估指标与误差分析',
        '部署与监控初步'
      ],
      tags: ['机器学习', '工程', '实战'],
      bg: 'images/c-2.png'
    },
    {
      id: 'nlp-modern',
      title: '现代 NLP 与大模型',
      subtitle: '理解 Transformer 与应用范式',
      description: '深入现代自然语言处理技术栈，重点剖析 Transformer、大规模预训练与下游任务微调策略。',
      duration: '20 小时',
      level: '中高级',
      updated: '2025-08',
      outline: [
        '分词与向量表示回顾',
        '注意力机制与 Transformer 架构',
        '预训练语言模型演进',
        '微调 / Prompt / Adapter 对比',
        '常见下游任务实现',
        '伦理与治理'
      ],
      tags: ['NLP', 'Transformer', 'LLM'],
      bg: 'images/c-3.png'
    },
    {
      id: 'data-visual',
      title: '数据可视化与讲故事',
      subtitle: '把数据结果转化为决策洞察',
      description: '学习图形语法与视觉编码原则，结合实际业务场景制作高信息密度且清晰的可视化作品与报告。',
      duration: '10 小时',
      level: '初中级',
      updated: '2025-07',
      outline: [
        '可视化认知基础',
        '图表类型与误用案例',
        '色彩与版式',
        '数据故事结构化表达',
        '交互式可视化概览',
        '综合案例演练'
      ],
      tags: ['可视化', '数据分析', '表达'],
      bg: 'images/c-4.png'
    }
  ];

  /* 主题切换 */
  const themeToggle = document.getElementById('themeToggle');
  if(themeToggle){
    themeToggle.addEventListener('click', ()=> {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('pref-theme', next);
    });
    const saved = localStorage.getItem('pref-theme');
    if(saved){ document.documentElement.setAttribute('data-theme', saved); }
  }

  function escapeHTML(str){ return str.replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;','\'':'&#39;'}[s])); }

  /* 主页渲染 */
  if(!isDetail){
    /* 初始化轮播 */
    (function initCarousel(){
      const slider = document.querySelector('[data-slider]');
      if(!slider) return;
      const slidesWrap = slider.querySelector('[data-slides]');
      const slides = Array.from(slidesWrap.querySelectorAll('.slide'));
      const prevBtn = slider.querySelector('[data-prev]');
      const nextBtn = slider.querySelector('[data-next]');
      const dotsWrap = slider.querySelector('[data-dots]');
      let index = 0;
      let timer; const INTERVAL = 6000; let paused=false;

      function buildDots(){
        dotsWrap.innerHTML='';
        slides.forEach((_,i)=> {
          const b = document.createElement('button');
          b.setAttribute('aria-label','跳转到第 '+(i+1)+' 张');
          if(i===index) b.setAttribute('aria-current','true');
          b.addEventListener('click',()=> { goTo(i); restart(); });
          dotsWrap.appendChild(b);
        });
      }
      function updateActive(){
        slides.forEach((s,i)=> s.classList.toggle('is-active',i===index));
        slidesWrap.style.transform = `translateX(-${index*100}%)`;
        Array.from(dotsWrap.children).forEach((c,i)=> {
          if(i===index) c.setAttribute('aria-current','true'); else c.removeAttribute('aria-current');
        });
      }
      function goTo(i){ index = (i+slides.length)%slides.length; updateActive(); }
      function next(){ goTo(index+1); }
      function prev(){ goTo(index-1); }
      function start(){ timer = setInterval(()=> { if(!paused) next(); }, INTERVAL); }
      function restart(){ clearInterval(timer); start(); }
      prevBtn&&prevBtn.addEventListener('click',()=> { prev(); restart(); });
      nextBtn&&nextBtn.addEventListener('click',()=> { next(); restart(); });
      slider.addEventListener('mouseenter',()=> paused=true);
      slider.addEventListener('mouseleave',()=> paused=false);
      buildDots(); updateActive(); start();
    })();

    const listEl = document.getElementById('courseList');
    const searchInput = document.getElementById('searchInput');
    const totalCoursesEl = document.getElementById('totalCourses');
    totalCoursesEl && (totalCoursesEl.textContent = dataset.length);

    function render(list){
      if(!listEl) return;
      listEl.innerHTML = '';
      const staticMap = {
        'ai-foundation': 'ai-foundation.html',
        'ml-practice': 'ml-practice.html',
        'nlp-modern': 'nlp-modern.html',
        'data-visual': 'data-visual.html'
      };
      list.forEach(c => {
        const card = document.createElement('div');
        const hasBg = c.bg ? ' has-bg' : '';
        card.className = 'course-card'+hasBg;
        if(c.bg){
          card.style.backgroundImage = `url(${c.bg})`;
        }
        const link = staticMap[c.id] || `detail.html?id=${encodeURIComponent(c.id)}`;
        card.innerHTML = `
          <div class="course-meta">${c.tags.map(t=>`<span class='badge'>${escapeHTML(t)}</span>`).join('')}</div>
          <h3><a href="${link}">${escapeHTML(c.title)}</a></h3>
          <p>${escapeHTML(c.subtitle)}</p>
          <div class="course-meta">
            <span>时长: ${escapeHTML(c.duration)}</span>
            <span>难度: ${escapeHTML(c.level)}</span>
          </div>
        `;
        listEl.appendChild(card);
      });
    }
    render(dataset);

    searchInput && searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      const filtered = dataset.filter(c => c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q) || c.tags.some(t=> t.toLowerCase().includes(q)) );
      render(filtered);
    });
  }

  /* 详情页渲染 */
  if(isDetail){
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const course = dataset.find(c => c.id === id);
    const titleEl = document.getElementById('course-title');
    const subEl = document.getElementById('course-subtitle');
    const durEl = document.getElementById('course-duration');
    const lvlEl = document.getElementById('course-level');
    const updEl = document.getElementById('course-updated');
    const descEl = document.getElementById('course-description');
    const outlineEl = document.getElementById('course-outline');
    const article = document.querySelector('.course-detail');
    const heroMap = {
      'ai-foundation': 'images/hero-ai.svg',
      'ml-practice': 'images/hero-ml.svg',
      'nlp-modern': 'images/hero-nlp.svg',
      'data-visual': 'images/hero-viz.svg'
    };

    if(!course){
      titleEl.textContent = '未找到该课程';
      descEl.textContent = '请返回主页选择其他课程。';
      outlineEl.innerHTML = '';
      return;
    }
    titleEl.textContent = course.title;
    subEl.textContent = course.subtitle;
    durEl.textContent = course.duration;
    lvlEl.textContent = course.level;
    updEl.textContent = course.updated;
    descEl.textContent = course.description;
    outlineEl.innerHTML = course.outline.map(i=>`<li>${escapeHTML(i)}</li>`).join('');
    if(article){
      const heroImg = heroMap[course.id];
      if(heroImg){
        article.classList.add('has-hero');
        article.style.setProperty('--hero-image', `url(${heroImg})`);
      }
    }
  }
})();
