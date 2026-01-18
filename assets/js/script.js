// ========== Global Accordion start=========================
document.querySelectorAll('.accordion-item-expand').forEach(arrow => {
  arrow.addEventListener('click', function (e) {
    e.stopPropagation(); // 🚫 prevent header click

    const item = this.closest('.accordion-item');
    const content = item.querySelector('.accordion-content');
    const isOpen = this.classList.contains('active');

    // close all others
    document.querySelectorAll('.accordion-item').forEach(i => {
      i.querySelector('.accordion-content').style.maxHeight = null;
      i.querySelector('.accordion-item-expand').classList.remove('active');
    });

    // toggle current
    if (!isOpen) {
      this.classList.add('active');
      content.style.maxHeight = content.scrollHeight + 'px';
    }
  });
});
//=========== Global Accordion Close=========================


/*******************************
 * Sidebar collapse & nav logic
 *******************************/
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebar');
const collapseIcon = document.getElementById('collapseIcon');

toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('collapsed');
  // collapseIcon.textContent = sidebar.classList.contains('collapsed') ? '▶' : '◀';
});

const scanBtn = document.querySelector(".sidebar-new-scan");
const recentScanBtn = document.querySelector(".recent-scan-btn");

const navItems = document.querySelectorAll('.nav-item');
const resultBtns = document.querySelectorAll('.results-btn');
const scanTab = document.querySelector(".sidebar-scan-tab");
const dashboardTab = document.querySelector(".dashboard-tab");
const dashboardOverview = document.querySelector("#dashboardPanel");
const panels = document.querySelectorAll('.panel');
const pageTitleEl = document.getElementById('pageTitle');


const titleMap = {
  dashboardPanel: 'Vulnerability Overview',
  assetsPanel: 'Asset Management',
  scansPanel: 'Vulnerability Scanner',
  reportPanel: 'Custom Reports',
  threatPanel: 'Threat Intelligence',
  brandPanel: 'Brand Protection',
  compliancePanel: 'Compliance',
  aiAgent: 'AI Agent Support',
  pricingPanel: 'Pricing & Billing',
  settingPanel: 'Profile Setting',
  notificationPanel: 'My Notification'
};

function activatePanel(panelId, dynamicTitle = null, breadcrumbLabel = null) {
  panels.forEach(p => {
    p.classList.toggle('active', p.id === panelId);
  });

  const title = dynamicTitle || titleMap[panelId] || 'M.tech Dashboard';

  pageTitleEl.textContent = title;
  document.title = title + ' — M.tech';

  updateBreadcrumb(panelId, breadcrumbLabel || title);
}



navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    activatePanel(item.dataset.panel);
  });
});

document.querySelectorAll('.results-btn').forEach(btn => {
  btn.addEventListener('click', () => {

    const panelId = btn.dataset.panel;

    const hostname = btn
      .closest('.api-gateway-item')
      ?.querySelector('.hostname')
      ?.textContent.trim();

    activatePanel(panelId);

    pageTitleEl.textContent = hostname;
    document.title = hostname + ' — M.tech';

    updateBreadcrumb(panelId, hostname);
  });
});

/* =======================
   BREADCRUMB HELPER
======================= */
function updateBreadcrumb(panelId, dynamicLabel = null) {
  const home = document.getElementById('breadcrumbHome');
  const section = document.getElementById('breadcrumbSection');
  const current = document.getElementById('currentPage');

  if (!home || !current) return;

  home.textContent = 'Home';

  // default section mapping
  let sectionLabel = '';
  let pageLabel = dynamicLabel || titleMap[panelId] || 'Dashboard';

  if (panelId === 'apiGatewayPanel') {
    sectionLabel = '/ Asset Management';
  }

  section.textContent = sectionLabel;
  current.textContent = pageLabel;

  // hide section if not needed
  section.style.display = sectionLabel ? 'inline' : 'none';
}




function activateScanTab() {
  navItems.forEach(i => i.classList.remove('active'));
  scanTab.classList.add('active');

  panels.forEach(p => {
    p.classList.toggle('active', p.id === 'scansPanel');
  });

  const newTitle = titleMap.scansPanel || 'Vulnerability Scanner';
  pageTitleEl.textContent = newTitle;
  document.title = newTitle + ' — M.tech';

  // ✅ ADD THIS LINE
  updateBreadcrumb('scansPanel');
}


/* ---- BUTTON TRIGGERS ---- */
if (scanBtn) {
  scanBtn.addEventListener('click', activateScanTab);
}

if (recentScanBtn) {
  recentScanBtn.addEventListener('click', activateScanTab);
}




/*******************************
 * Mini Charts
 *******************************/
function createMiniChart(canvasId, data, color, bgFrom, bgTo) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, bgFrom);
  gradient.addColorStop(1, bgTo);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map((_, i) => i + 1),
      datasets: [{
        data,
        borderColor: color,
        backgroundColor: gradient,
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { x: { display: false }, y: { display: false } },
      responsive: true,
      maintainAspectRatio: false
    }
  });
}


createMiniChart(
  'mini1',
  [2, 3, 2, 4, 5, 4, 6],
  '#3366FF',
  'rgba(51,102,255,0.20)',
  'rgba(51,102,255,0)'
);

createMiniChart(
  'mini2',
  [5, 10, 9, 7, 8, 10, 9],
  '#FD4438',
  'rgba(253,68,56,0.20)',
  'rgba(253,68,56,0)'
);

createMiniChart(
  'mini3',
  [80, 82, 78, 85, 88, 90, 89],
  '#3366FF',
  'rgba(51,102,255,0.20)',
  'rgba(51,102,255,0)'
);

createMiniChart(
  'mini4',
  [3, 2, 4, 3, 5, 2, 4],
  '#FD4438',
  'rgba(253, 69, 56, 0.20)',
  'rgba(253,68,56,0)'
);


/*******************************
 * Vulnerability main chart
 *******************************/
const vulnCanvas = document.getElementById('vulnChart');
const vulnCtx = vulnCanvas.getContext('2d');

/* ---------- DATA ---------- */
const trendSets = {
  week: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [12, 9, 14, 18, 150, 20, 22]
  },
  month: {
    labels: Array.from({ length: 12 }, (_, i) => 'W' + (i + 1)),
    data: [12, 18, 15, 20, 22, 19, 240, 28, 26, 300, 27, 32]
  },
  year: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [20, 140, 730, 160, 170, 750, 180, 200, 190, 210, 205, 530]
  }
};

/* ---------- HELPERS ---------- */
function getDynamicMax(values) {
  return Math.ceil(Math.max(...values) * 1.15); // 15% headroom
}

function fullHeightCandles(len, max) {
  return Array.from({ length: len }, () => max);
}

/* ---------- GRADIENT ---------- */
const gradient = vulnCtx.createLinearGradient(0, 0, 0, vulnCanvas.height);
gradient.addColorStop(0, 'rgba(51, 102, 255, 0.69)');
gradient.addColorStop(1, 'rgba(51, 102, 255, 0.1)');

/* ---------- INITIAL VALUES ---------- */
const initialValues = trendSets.week.data;
const initialMax = getDynamicMax(initialValues);

/* ---------- CHART ---------- */
const vulnChart = new Chart(vulnCtx, {
  data: {
    labels: trendSets.week.labels,
    datasets: [
      // Full-height candle placeholders
      {
        type: 'bar',
        data: fullHeightCandles(initialValues.length, initialMax),
        backgroundColor: 'rgba(51, 102, 255, 0)',
        borderRadius: 12,
        barPercentage: 0.45,
        borderColor: '#ffffff15',
        borderWidth: 1,
        categoryPercentage: 0.6
      },
      // Dynamic line
      {
        type: 'line',
        data: initialValues,
        borderColor: '#3366FF',
        backgroundColor: gradient,
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        borderWidth: 2
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(255,255,255,0.7)' }
      },
      y: {
        display: false,
        suggestedMax: initialMax   // 🔥 auto scale, no cut
      }
    }
  }
});

/* ---------- TABS (Week / Month / Year) ---------- */
const trendTabButtons = document.querySelectorAll('.trend .tabs button');

trendTabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    trendTabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const range = btn.dataset.range;
    if (!trendSets[range]) return;

    const values = trendSets[range].data;
    const dynMax = getDynamicMax(values);

    vulnChart.data.labels = trendSets[range].labels;

    // Update line
    vulnChart.data.datasets[1].data = values;

    // Update full-height candles
    vulnChart.data.datasets[0].data =
      fullHeightCandles(values.length, dynMax);

    // Update scale dynamically
    vulnChart.options.scales.y.suggestedMax = dynMax;

    vulnChart.update();
  });
});

/* ---------- DEFAULT ACTIVE TAB ---------- */
(function () {
  const active = document.querySelector('.trend .tabs button.active');
  if (!active && trendTabButtons.length) {
    trendTabButtons[0].classList.add('active');
  }
})();




/*******************************
 * Recent Scans (tabs + rendering)
 *******************************/
document.querySelectorAll('.scan-section').forEach(section => {
  const tabs = section.querySelectorAll('.scan-tab');
  const panels = section.querySelectorAll('.scan-list');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {

      // activate tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // activate panel
      panels.forEach(p => p.classList.remove('active'));
      const target = tab.dataset.target;
      section
        .querySelector(`.scan-list[data-panel="${target}"]`)
        .classList.add('active');
    });
  });
});


// ======================================== Overview Close =================================

// ==================================Asset management start ================================

/* TAB SWITCHING */
document.querySelectorAll('.asset-manage-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.asset-manage-tab-btn')
      .forEach(b => b.classList.remove('asset-manage-active'));
    document.querySelectorAll('.asset-manage-panel')
      .forEach(p => p.classList.remove('asset-manage-active'));

    btn.classList.add('asset-manage-active');
    document.getElementById(btn.dataset.tab)
      .classList.add('asset-manage-active');
  });
});

/* DYNAMIC FILTER GENERATION & LOGIC */
document.querySelectorAll('.asset-manage-panel').forEach(panel => {
  const items = panel.querySelectorAll('.asset-manage-item');
  const filterWrap = panel.querySelector('.asset-manage-filters');

  // Get unique levels from items
  const levels = [...new Set([...items].map(i => i.dataset.level))];

  // Create "All" filter
  // filterWrap.innerHTML =
  //   `<button class="asset-manage-filter-btn asset-manage-active" data-filter="all">
  //     All
  //   </button>`;

  // Create filters from item status
  levels.forEach(level => {
    const count = [...items].filter(i => i.dataset.level === level).length;
    filterWrap.innerHTML +=
      `<button class="asset-manage-filter-btn" data-filter="${level}">
        ${level} (${count})
      </button>`;
  });

  // Filter click handler
  filterWrap.addEventListener('click', e => {
    if (!e.target.classList.contains('asset-manage-filter-btn')) return;

    filterWrap.querySelectorAll('.asset-manage-filter-btn')
      .forEach(b => b.classList.remove('asset-manage-active'));

    e.target.classList.add('asset-manage-active');

    const filter = e.target.dataset.filter;

    items.forEach(item => {
      item.style.display =
        filter === 'all' || item.dataset.level === filter
          ? 'block'
          : 'none';
    });
  });
});
// ==================================Asset management close ================================

// =================================Scan panel start ========================================
const form = document.getElementById('scanForm');
const beam = document.getElementById('scanBeam');
const btn = document.getElementById('scanBtn');

form.addEventListener('submit', e => {
  e.preventDefault();

  // start radar
  beam.style.animationPlayState = 'running';
  btn.disabled = true;
  btn.textContent = 'Scanning...';

  // demo stop after 8s
  setTimeout(() => {
    beam.style.animationPlayState = 'paused';
    btn.disabled = false;
    btn.textContent = 'Scan';
  }, 20000);
});
// =================================Scan panel close ========================================

// =================================Custom report panel start ========================================
/*******************************
 * Custom report Sidebar
 *******************************/
const report_sidebar = document.getElementById('report_sidebar');
const reportToggleSidebar = document.getElementById('reportToggleSidebar');

reportToggleSidebar.addEventListener('click', () => {
  report_sidebar.classList.toggle('collapsed');
});

/* ---------- ELEMENT REFERENCES ---------- */
const reportPanel = document.getElementById('reportPanel');
const openReportPanel = document.getElementById('openReportPanel');
const closeReport = document.getElementById('closeReport');
const reportTab = document.querySelector('.report-tab');

/* ---------- PANEL OPEN / CLOSE ---------- */
openReportPanel && (openReportPanel.onclick = () => reportPanel.classList.add('open'));

closeReport.onclick = () => {
  reportPanel.classList.remove('open');
  activatePanel('dashboardPanel');
  dashboardTab.classList.add("active");
  reportTab.classList.remove("active")
};

// File genarate form here****************
const fileGenerateForm = document.getElementById('reportForm');

fileGenerateForm.addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent form submission

  const title = document.getElementById('reportTitle').value;
  const scan = document.getElementById('scanSelect').value;
  const format = document.getElementById('formatSelect').value;

  if (title && scan && format) {
    let content = `
          <h1>Report Title: ${title}</h1>
          <p>Scan: ${scan}</p>
          <p>Format: ${format}</p>
        `;

    if (format === 'pdf') {
      // Simulate PDF download with structured content
      const blob = new Blob([content], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${title}.pdf`;
      link.click();
    } else if (format === 'html') {
      // Simulate HTML download
      const blob = new Blob([content], { type: 'text/html' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${title}.html`;
      link.click();
    } else if (format === 'doc') {
      // Simulate HTML download
      const blob = new Blob([content], { type: 'text/doc' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${title}.doc`;
      link.click();
    }
  } else {
    alert('Please fill in all fields.');
  }
});


// conditions here************************
/* =======================
  SCHEMA
======================= */
const schema = {
  "Header & Title": ["Executive Summary", "Report Header", "Company Information"],
  "Security Analysis": ["Vulnerability Summary", "Risk Assessment Matrix", "Critical Security Findings", "Host-by-Host Analysis"],
  "Compliance": ["NIST Cybersecurity Framework", "PCI DSS Compliance", "Brand Protection Analysis"],
  "Charts & Graphs": ["Vulnerability Severity Distribution", "Security Trend Analysis", "Threat Detection Timeline"],
  "Recommendations": ["Remediation Roadmap", "Strategic Security Roadmap", "Security Best Practices"],
};

/* =======================
   ICONS
======================= */
const icons = {
  "Executive Summary": "chart_data",
  "Report Header": "description",
  "Company Information": "apartment",
  "Vulnerability Summary": "bug_report",
  "Risk Assessment Matrix": "grid_on",
  "Critical Security Findings": "warning",
  "Host-by-Host Analysis": "dns",
  "NIST Cybersecurity Framework": "shield",
  "PCI DSS Compliance": "credit_card",
  "Brand Protection Analysis": "title",
  "Vulnerability Severity Distribution": "pie_chart",
  "Security Trend Analysis": "chart_data",
  "Threat Detection Timeline": "schedule",
  "Remediation Roadmap": "construction",
  "Strategic Security Roadmap": "road",
  "Security Best Practices": "star",
};

const sectionIcons = {
  "Header & Title": "folder",
  "Security Analysis": "shield",
  "Compliance": "verified",
  "Charts & Graphs": "chart_data",
  "Recommendations": "lightbulb",
};

/* =======================
   GLOBALS
======================= */
const rc_sidebar_btn = document.getElementById('rc_sidebar_btn');
const inner_rc_content = document.getElementById('inner_rc_content');

let dragged = null;
let activeBlock = null;

// 🔥 NEW: section drag reference
let draggedSection = null;

/* =======================
   BUILD SIDEBAR (ACCORDION)
======================= */
let firstOpen = true;

Object.entries(schema).forEach(([section, buttons]) => {

  const group = document.createElement('div');
  group.className = 'group';

  const title = document.createElement('div');
  title.className = 'group-title';
  if (firstOpen) title.classList.add('active');

  title.innerHTML = `
    <span class="group-title-left">
      <span class="material-symbols-outlined">
        ${sectionIcons[section] || 'folder'}
      </span>
      <span class="group-title-text">${section}</span>
    </span>
    <span class="material-symbols-outlined">keyboard_arrow_down</span>
  `;

  const items = document.createElement('div');
  items.className = 'group-items';
  if (!firstOpen) items.classList.add('collapsed');
  firstOpen = false;

  buttons.forEach(name => {
    const btn = document.createElement('button');
    btn.draggable = true;
    btn.innerHTML = `
      <span class="material-symbols-outlined">${icons[name] || 'help'}</span>
      ${name}
    `;
    btn.ondragstart = () => dragged = { section, name };
    items.appendChild(btn);
  });

  title.onclick = () => {
    document.querySelectorAll('.group-items').forEach(el => el.classList.add('collapsed'));
    document.querySelectorAll('.group-title').forEach(el => el.classList.remove('active'));
    items.classList.remove('collapsed');
    title.classList.add('active');
  };

  group.append(title, items);
  rc_sidebar_btn.appendChild(group);
});

/* =======================
   BUILD ALL SECTIONS
======================= */
Object.entries(schema).forEach(([sectionName, buttons]) => {

  const section = document.createElement('div');
  section.className = 'section';
  section.dataset.section = sectionName;
  section.draggable = true; // 🔥 NEW

  section.innerHTML = `
    <h2 draggable="true">${sectionName}</h2>
    <div class="buttons"></div>
    <div class="blocks"></div>
  `;

  // 🔥 SECTION DRAG EVENTS
  section.addEventListener('dragstart', e => {
    draggedSection = section;
    section.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  });

  section.addEventListener('dragend', () => {
    draggedSection = null;
    section.classList.remove('dragging');
  });

  section.addEventListener('dragover', e => {
    e.preventDefault();
    const after = getDragAfterElement(inner_rc_content, e.clientY);
    if (after == null) {
      inner_rc_content.appendChild(section);
    } else {
      inner_rc_content.insertBefore(section, after);
    }
  });

  inner_rc_content.appendChild(section);

  buttons.forEach(btnName => {
    createRecommendedButton(section, btnName);
  });
});

/* =======================
   DROP HANDLER (SIDEBAR → SECTION)
======================= */
inner_rc_content.ondragover = e => e.preventDefault();
inner_rc_content.ondrop = () => {
  if (!dragged) return;
  const section = document.querySelector(`[data-section="${dragged.section}"]`);
  createBlock(section, dragged.name);
  dragged = null;
};

/* =======================
   HELPER: SECTION SORT
======================= */
function getDragAfterElement(container, y) {
  const els = [...container.querySelectorAll('.section:not(.dragging)')];
  return els.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    }
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

/* =======================
   RECOMMENDED BUTTON
======================= */
function createRecommendedButton(section, btnName) {
  if (section.querySelector(`[data-btn="${btnName}"]`)) return;

  const btn = document.createElement('div');
  btn.className = 'sec-btn';
  btn.dataset.btn = btnName;

  btn.innerHTML = `
    <span class="material-symbols-outlined">${icons[btnName] || 'help'}</span>
    ${btnName}
    <span class="close">✕</span>
  `;

  btn.onclick = e => {
    if (e.target.classList.contains('close')) {
      btn.remove();
      return;
    }
    createBlock(section, btnName);
  };

  section.querySelector('.buttons').appendChild(btn);
}

/* =======================
   CREATE BLOCK
======================= */
function createBlock(section, btnName) {
  const existingBtn = section.querySelector(`[data-btn="${btnName}"]`);
  if (existingBtn) existingBtn.remove();

  const block = document.createElement('div');
  block.className = 'block';
  block.dataset.btn = btnName;

  block.innerHTML = `
    <div class="block-header">
      <strong>${btnName}</strong>
    </div>
    <div class="block-body">
      <input placeholder="${btnName}">
      <div class="block-action">
        <button onclick="openPopup(this)">
          <span class="material-symbols-outlined">settings</span>
        </button>
        <button onclick="deleteBlock(this)">
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div>
    </div>
  `;

  section.querySelector('.blocks').appendChild(block);
}

/* =======================
   DELETE BLOCK
======================= */
function deleteBlock(el) {
  const block = el.closest('.block');
  const section = block.closest('.section');
  const btnName = block.dataset.btn;

  block.remove();
  createRecommendedButton(section, btnName);
}

/* =======================
   POPUP
======================= */
const rc_input_popup = document.getElementById('rc_input_popup');
const popupInput = document.getElementById('popupInput');

function openPopup(el) {
  activeBlock = el.closest('.block');
  popupInput.value = activeBlock.querySelector('strong').innerText;
  rc_input_popup.style.display = 'flex';
}

function closePopup() {
  rc_input_popup.style.display = 'none';
}

function savePopup() {
  const v = popupInput.value;
  activeBlock.querySelector('strong').innerText = v;
  activeBlock.querySelector('input').placeholder = v;
  activeBlock.dataset.btn = v;
  closePopup();
}

// =================================Custom report panel close ========================================





/* ================= AI CHAT LOGIC (CHATGPT STYLE) ================= */
/*******************************
 * AI SIDEBAR COLLAPSE
 *******************************/
const aiSidebar = document.getElementById('ai_sidebar');
const aitoggleBtn = document.getElementById('aiToggleSidebar');

aitoggleBtn.addEventListener('click', () => {
  aiSidebar.classList.toggle('collapsed');
});

/* ---------- TIME HELPER ---------- */
function getMessageTime() {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/* ---------- ELEMENT REFERENCES ---------- */
const aiPanel = document.getElementById('aiPanel');
const openAi = document.getElementById('openAi');
const closeAi = document.getElementById('closeAi');
const closeAiToScan = document.getElementById('popuNewScanBtn');
const newChatBtn = document.getElementById('newChat');
const chatList = document.getElementById('chatList');
const messages = document.getElementById('messages');
const promptInput = document.getElementById('ai-prompt-input');
const send = document.getElementById('send');
const prompts = document.getElementById('aiPrompts');
const backToDashboard = document.querySelector('.backToDashboard');

/* ---------- CHAT STATE ---------- */
let chats = [];
let activeChatId = null;

/* ---------- PANEL OPEN / CLOSE ---------- */
openAi && (openAi.onclick = () => aiPanel.classList.add('open'));

closeAi.onclick = () => {
  aiPanel.classList.remove('open');
  activatePanel('dashboardPanel');
  openAi.classList.remove("active");
  dashboardTab.classList.add("active")
};

closeAiToScan.onclick = () => {
  aiPanel.classList.remove('open');
  activatePanel('scansPanel');
};
backToDashboard.onclick = () => {
  aiPanel.classList.remove('open');
  activatePanel('dashboardPanel');
};



/* ---------- CREATE NEW CHAT ---------- */
function createChat() {
  const chat = {
    id: Date.now(),
    title: '',
    messages: [
      {
        role: 'bot',
        text: 'How can I help you today?',
        time: getMessageTime()
      }
    ]
  };

  chats.unshift(chat);
  activeChatId = chat.id;
  renderChats();
  renderMessages();
}

/* ---------- RENDER CHAT LIST ---------- */
function renderChats() {
  chatList.innerHTML = '';

  chats.forEach(chat => {
    const div = document.createElement('div');
    div.className = 'chat-item' + (chat.id === activeChatId ? ' active' : '');
    div.textContent = chat.title || '';

    div.onclick = () => {
      activeChatId = chat.id;
      renderChats();
      renderMessages();
    };

    chatList.appendChild(div);
  });
}

/* ---------- RENDER MESSAGES ---------- */
function renderMessages() {
  messages.innerHTML = '';

  const chat = chats.find(c => c.id === activeChatId);
  if (!chat) return;

  chat.messages.forEach(m => {
    const div = document.createElement('div');
    div.className = 'msg ' + m.role;

    if (m.html) {
      div.innerHTML = m.html;
    } else {
      div.textContent = m.text;
    }

    // ⏱ message time
    if (m.time) {
      const timeEl = document.createElement('div');
      timeEl.className = 'msg-time';
      timeEl.textContent = m.time;
      div.appendChild(timeEl);
    }

    messages.appendChild(div);
  });

  messages.scrollTop = messages.scrollHeight;

  const hasUserMessage = chat.messages.some(m => m.role === 'user');
  if (prompts) {
    prompts.style.display = hasUserMessage ? 'none' : 'grid';
  }
}

/* ---------- SEND MESSAGE ---------- */
function sendMessage(text) {
  if (!text || !text.trim()) return;

  const chat = chats.find(c => c.id === activeChatId);
  if (!chat) return;

  chat.messages.push({
    role: 'user',
    text,
    time: getMessageTime()
  });

  chat.title = text.slice(0, 22) + "...";

  renderChats();
  renderMessages();

  // typing indicator
  const typing = document.createElement('div');
  typing.className = 'typing';
  typing.textContent = 'AI is typing...';
  messages.appendChild(typing);

  setTimeout(() => {
    typing.remove();
    chat.messages.push({
      role: 'bot',
      text: 'I can analyze vulnerabilities, explain risks, or help remediation.',
      time: getMessageTime()
    });
    renderMessages();
  }, 900);
}

/* ---------- INPUT EVENTS ---------- */
send.onclick = () => {
  sendMessage(promptInput.value);
  promptInput.value = '';
};

promptInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    sendMessage(promptInput.value);
    promptInput.value = '';
  }
});

/* ---------- PROMPT CARD CLICK ---------- */
document.querySelectorAll('.prompt-card').forEach(card => {
  card.onclick = () => sendMessage(card.textContent);
});

/* ---------- SCAN POPUP TOGGLE ---------- */
document.querySelector('#scanPopupOpenBtn').onclick = () => {
  document.querySelector('.recent_scan_popup').classList.toggle('open');
};

/* ---------- SCAN ITEM CLICK → CHAT MESSAGE ---------- */
function initScanItems() {
  const scanTable = document.querySelector('.recent_scan_table');
  const scanPopup = document.querySelector('.recent_scan_popup');
  if (!scanTable) return;

  scanTable.addEventListener('click', e => {
    const item = e.target.closest('.scan-item');
    if (!item) return;

    // hide popup
    scanPopup.classList.remove('open');

    const logo = item.querySelector('.scan_site_logo')?.src || '';
    const name = item.querySelector('.scan-site-name')?.textContent || '';
    const date = item.querySelector('.scan-date')?.textContent || '';
    const level = item.dataset.level || 'info';

    const chat = chats.find(c => c.id === activeChatId);
    if (!chat) return;

    const scanHTML = `
      <div class="scan-item-message">
        <img src="${logo}" alt="${name}" style="width:50px; height:50px; object-fit:contain;">
        <div class="scan-item-info">
          <div class="scan-into-top">
            <div class="info_top_left">
              <h4 class="scan_site_name">${name}</h4>
              <span>${date}</span>
            </div>
            <div class="info_top_right">
                <div class="vulnar-badge">31 Varnalabilities</div>
            </div>

          </div>
          <div class="scan-into-bottom">
              <span class="message-scan-status scan-${level}">${level}</span>
          </div>


        </div>
      </div>
    `;

    chat.messages.push({
      role: 'user',
      html: scanHTML,
      time: getMessageTime()
    });

    renderMessages();

    setTimeout(() => {
      chat.messages.push({
        role: 'bot',
        text: 'Scan received. What would you like to analyze?',
        time: getMessageTime()
      });
      renderMessages();
    }, 800);
  });
}

document.addEventListener('DOMContentLoaded', initScanItems);

/* ---------- INIT ---------- */
newChatBtn.onclick = createChat;
createChat();

// Pricing and setting panel open logic for each pricing and setting menu item 
/* ===============================
   DASHBOARD REDIRECT MENU LOGIC
================================ */

/**
 * Redirect to dashboard and open a panel
 */
function redirectToDashboard(panelId) {
  // Close side panels if open
  document.querySelector('#aiPanel')?.classList.remove('open');
  document.querySelector('#reportPanel')?.classList.remove('open');

  // Activate dashboard container first
  panels.forEach(p => p.classList.remove('active'));
  document.getElementById('dashboardPanel')?.classList.add('active');

  // Open target panel
  activatePanel(panelId);

  // Update breadcrumb
  updateBreadcrumb(panelId);
}

/* ===============================
   PRICING MENU
================================ */
document.querySelectorAll('.pricingMenu').forEach(menu => {
  menu.addEventListener('click', e => {
    e.preventDefault();
    redirectToDashboard('pricingPanel');
  });
});

/* ===============================
   SETTINGS MENU
================================ */
document.querySelectorAll('.settingMenu').forEach(menu => {
  menu.addEventListener('click', e => {
    e.preventDefault();
    redirectToDashboard('settingPanel');
  });
});

// Api Gateway page tab switching start***********************************************
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    tab.classList.add('active');
    document.getElementById(target).classList.add('active');
  });
});

// Api Gateway page tab switching close***********************************************

// Api gateway view result logic start**********************************************
document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.results-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();

      const panelId = btn.getAttribute('data-panel');

      // Close all panels (same behavior as others)
      document.querySelectorAll('.panel').forEach(panel => {
        panel.classList.remove('active');
      });

      // Open API Gateway panel
      const targetPanel = document.getElementById(panelId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

});


const assetPanel = document.querySelector('.asset-panel');

/* Close side panels when clicking outside */
document.addEventListener('click', () => {
  let anyClosed = false;

  document.querySelectorAll('.side-panel').forEach(panel => {
    if (panel.classList.contains('active')) {
      panel.classList.remove('active');
      anyClosed = true;
    }
  });

  // 👉 Activate asset panel after side panel closes
  if (anyClosed && assetPanel) {
    assetPanel.classList.add('active');
  }
});

/* Prevent closing when clicking inside side panel */
document.querySelectorAll('.side-panel').forEach(panel => {
  panel.addEventListener('click', e => e.stopPropagation());
});

// Api gateway view result logic close**********************************************


// Header user menu logic start ************************************************
const profileMenu = document.querySelector(".user-panel-profile");
const settingPanel = document.querySelector("#settingPanel");

profileMenu.onclick = () => {
  reportPanel.classList.remove('open');
  activatePanel('settingPanel');
  aiPanel.classList.remove("open");
  settingPanel.classList.add("active")
};

const userPanelNotification = document.querySelector(".user-panel-notification");
const notificationPanel = document.querySelector("#notificationPanel");

userPanelNotification.onclick = () => {
  reportPanel.classList.remove('open');
  activatePanel('notificationPanel');
  aiPanel.classList.remove("open");
  notificationPanel.classList.add("active")
};

const userJiraSetting = document.querySelector(".user-panel-jira-setting");
const jiraSettingPanel = document.querySelector("#jiraSettingPanel");

userJiraSetting.onclick = () => {
  reportPanel.classList.remove('open');
  activatePanel('jiraSettingPanel');
  aiPanel.classList.remove("open");
  userJiraSetting.classList.add("active")
};

const userScanHistory = document.querySelector(".user-panel-scan-history");
userScanHistory.onclick = () => {
  reportPanel.classList.remove('open');
  activatePanel('dashboardPanel');
  aiPanel.classList.remove("open");
  userScanHistory.classList.add("active")
};

// Header user menu logic close ***********************************************