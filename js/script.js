/**
 * JobTracker - Main JavaScript
 * Handles: Theme, Navigation, Charts, Animations, Interactivity
 */

'use strict';

/* ==========================================
   THEME MANAGER
   ========================================== */
const ThemeManager = {
  init() {
    const saved = localStorage.getItem('jt-theme') || 'light';
    this.apply(saved);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  },
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('jt-theme', theme);
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    });
    // Update settings toggle if present
    const settingsToggle = document.getElementById('theme-setting-toggle');
    if (settingsToggle) settingsToggle.checked = theme === 'dark';
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    this.apply(current === 'dark' ? 'light' : 'dark');
  }
};

/* ==========================================
   NAVBAR
   ========================================== */
const Navbar = {
  init() {
    this.navbar = document.querySelector('.navbar');
    this.hamburger = document.querySelector('.hamburger');
    this.mobileMenu = document.querySelector('.mobile-menu');

    if (this.navbar) {
      window.addEventListener('scroll', () => this.handleScroll());
    }
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => this.toggleMobile());
    }
    // Close mobile menu on link click
    document.querySelectorAll('.mobile-menu .nav-link').forEach(link => {
      link.addEventListener('click', () => this.closeMobile());
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (this.mobileMenu && this.mobileMenu.classList.contains('open')) {
        if (!e.target.closest('.mobile-menu') && !e.target.closest('.hamburger')) {
          this.closeMobile();
        }
      }
    });
    // Set active link
    this.setActiveLink();
  },
  handleScroll() {
    if (window.scrollY > 10) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  },
  toggleMobile() {
    this.mobileMenu.classList.toggle('open');
  },
  closeMobile() {
    if (this.mobileMenu) this.mobileMenu.classList.remove('open');
  },
  setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .sidebar-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.includes(currentPage)) {
        link.classList.add('active');
      }
    });
  }
};

/* ==========================================
   SIDEBAR MANAGER (for app pages)
   ========================================== */
const Sidebar = {
  init() {
    this.sidebar = document.querySelector('.sidebar');
    this.overlay = document.querySelector('.sidebar-overlay');
    this.toggleBtn = document.querySelector('.mobile-sidebar-toggle');

    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggle());
    }
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.close());
    }
  },
  toggle() {
    this.sidebar.classList.toggle('open');
    this.overlay.classList.toggle('show');
  },
  close() {
    this.sidebar.classList.remove('open');
    this.overlay.classList.remove('show');
  }
};

/* ==========================================
   PAGE LOADER
   ========================================== */
const Loader = {
  init() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          loader.classList.add('hidden');
          setTimeout(() => loader.remove(), 400);
        }, 400);
      });
    }
  }
};

/* ==========================================
   SCROLL ANIMATIONS
   ========================================== */
const ScrollAnimations = {
  init() {
    const elements = document.querySelectorAll('.scroll-reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
  }
};

/* ==========================================
   COUNTER ANIMATION
   ========================================== */
const CounterAnimation = {
  init() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  },
  animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(current + increment, target);
      const display = Number.isInteger(target) ? Math.floor(current) : current.toFixed(1);
      el.textContent = prefix + display + suffix;
      if (step >= steps) {
        el.textContent = prefix + target + suffix;
        clearInterval(timer);
      }
    }, duration / steps);
  }
};

/* ==========================================
   PASSWORD STRENGTH INDICATOR
   ========================================== */
const PasswordStrength = {
  init() {
    const passwordInputs = document.querySelectorAll('[data-password-strength]');
    passwordInputs.forEach(input => {
      input.addEventListener('input', () => {
        const val = input.value;
        const strength = this.calculate(val);
        const containerId = input.getAttribute('data-password-strength');
        const container = document.getElementById(containerId);
        if (container) {
          const fill = container.querySelector('.strength-fill');
          const text = container.querySelector('.strength-text');
          if (fill) {
            fill.className = 'strength-fill';
            if (val.length > 0) fill.classList.add(strength.level);
          }
          if (text) text.textContent = val.length > 0 ? strength.label : '';
        }
      });
    });
  },
  calculate(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
      { level: 'weak', label: 'Weak - Add more characters' },
      { level: 'weak', label: 'Weak - Add uppercase, numbers' },
      { level: 'fair', label: 'Fair - Getting stronger' },
      { level: 'good', label: 'Good - Almost there!' },
      { level: 'strong', label: 'Strong - Excellent password!' },
    ];
    return levels[Math.min(score, levels.length - 1)];
  }
};

/* ==========================================
   CHARTS (Canvas-based, no library)
   ========================================== */
const Charts = {
  colors: {
    primary: '#2563EB',
    secondary: '#7C3AED',
    accent: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#06B6D4',
    light: ['#2563EB', '#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#06B6D4']
  },

  // Bar Chart
  drawBar(canvasId, labels, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight || 280;
    ctx.clearRect(0, 0, W, H);

    const padding = { top: 20, right: 20, bottom: 50, left: 50 };
    const chartW = W - padding.left - padding.right;
    const chartH = H - padding.top - padding.bottom;
    const max = Math.max(...data) * 1.2 || 10;
    const barW = (chartW / labels.length) * 0.55;
    const gap = chartW / labels.length;

    // Grid lines
    const gridLines = 5;
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--gray-100').trim() || '#F3F4F6';
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + chartH - (i / gridLines) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(W - padding.right, y);
      ctx.stroke();
      // Y labels
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round((i / gridLines) * max), padding.left - 6, y + 4);
    }

    // Bars
    data.forEach((val, i) => {
      const x = padding.left + i * gap + (gap - barW) / 2;
      const barH = (val / max) * chartH;
      const y = padding.top + chartH - barH;

      // Gradient fill
      const grad = ctx.createLinearGradient(0, y, 0, padding.top + chartH);
      grad.addColorStop(0, options.color || this.colors.primary);
      grad.addColorStop(1, (options.color || this.colors.primary) + '44');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
      ctx.fill();

      // Value on top
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(val, x + barW / 2, y - 5);

      // X label
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(labels[i], x + barW / 2, H - 10);
    });
  },

  // Line Chart
  drawLine(canvasId, labels, datasets, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight || 280;
    ctx.clearRect(0, 0, W, H);

    const padding = { top: 20, right: 20, bottom: 50, left: 50 };
    const chartW = W - padding.left - padding.right;
    const chartH = H - padding.top - padding.bottom;
    const allVals = datasets.flatMap(d => d.data);
    const max = Math.max(...allVals) * 1.2 || 10;

    // Grid lines
    const gridLines = 5;
    ctx.strokeStyle = '#F3F4F6';
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + chartH - (i / gridLines) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(W - padding.right, y);
      ctx.stroke();
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(Math.round((i / gridLines) * max), padding.left - 6, y + 4);
    }

    // X labels
    labels.forEach((label, i) => {
      const x = padding.left + (i / (labels.length - 1)) * chartW;
      ctx.fillStyle = '#9CA3AF';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, H - 10);
    });

    // Lines and fills
    datasets.forEach(dataset => {
      const points = dataset.data.map((val, i) => ({
        x: padding.left + (i / (dataset.data.length - 1)) * chartW,
        y: padding.top + chartH - (val / max) * chartH
      }));

      // Area fill
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
      ctx.lineTo(points[0].x, padding.top + chartH);
      ctx.closePath();
      const areaGrad = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
      areaGrad.addColorStop(0, dataset.color + '33');
      areaGrad.addColorStop(1, dataset.color + '00');
      ctx.fillStyle = areaGrad;
      ctx.fill();

      // Line
      ctx.beginPath();
      ctx.strokeStyle = dataset.color;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
      ctx.stroke();

      // Points
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = dataset.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    });
  },

  // Donut Chart
  drawDonut(canvasId, labels, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = Math.min(canvas.offsetWidth, canvas.offsetHeight || 260);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight || 260;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const cx = W / 2, cy = H / 2;
    const radius = Math.min(W, H) * 0.38;
    const innerRadius = radius * 0.62;
    const colors = options.colors || this.colors.light;
    const total = data.reduce((a, b) => a + b, 0);

    let startAngle = -Math.PI / 2;
    data.forEach((val, i) => {
      const sliceAngle = (val / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      startAngle += sliceAngle;
    });

    // Inner circle (donut hole)
    ctx.beginPath();
    ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg-card').trim() || '#ffffff';
    ctx.fillStyle = bg;
    ctx.fill();

    // Center text
    ctx.fillStyle = '#111827';
    ctx.font = `bold ${Math.floor(radius * 0.28)}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(options.centerText || total, cx, cy - 8);
    ctx.font = `${Math.floor(radius * 0.14)}px Inter, sans-serif`;
    ctx.fillStyle = '#9CA3AF';
    ctx.fillText(options.centerLabel || 'Total', cx, cy + Math.floor(radius * 0.2));
  },

  // Horizontal Bar (for progress/comparison)
  drawHBar(canvasId, labels, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = canvas.offsetWidth;
    const rowH = 42;
    const H = canvas.height = labels.length * rowH + 20;
    ctx.clearRect(0, 0, W, H);

    const labelWidth = 110;
    const barAreaW = W - labelWidth - 60;
    const max = Math.max(...data) || 1;
    const colors = options.colors || this.colors.light;

    labels.forEach((label, i) => {
      const y = i * rowH + 10;
      const barW = (data[i] / max) * barAreaW;

      // Label
      ctx.fillStyle = '#374151';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(label, labelWidth - 8, y + 15);

      // Background track
      ctx.fillStyle = '#F3F4F6';
      ctx.beginPath();
      ctx.roundRect(labelWidth, y + 5, barAreaW, 18, 9);
      ctx.fill();

      // Bar
      const grad = ctx.createLinearGradient(labelWidth, 0, labelWidth + barW, 0);
      grad.addColorStop(0, colors[i % colors.length]);
      grad.addColorStop(1, colors[(i + 1) % colors.length]);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(labelWidth, y + 5, Math.max(barW, 4), 18, 9);
      ctx.fill();

      // Value
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(data[i], labelWidth + barW + 8, y + 18);
    });
  }
};

/* ==========================================
   DUMMY DATA
   ========================================== */
const AppData = {
  applications: [
    { id: 1, company: 'Google', role: 'Software Engineer Intern', status: 'interview', date: '2024-12-10', deadline: '2025-01-15', location: 'Bangalore, India', color: 'color-google', initials: 'G' },
    { id: 2, company: 'Microsoft', role: 'Frontend Developer', status: 'applied', date: '2024-12-08', deadline: '2025-01-20', location: 'Hyderabad, India', color: 'color-microsoft', initials: 'MS' },
    { id: 3, company: 'Amazon', role: 'SDE Intern', status: 'offer', date: '2024-11-25', deadline: '2024-12-30', location: 'Chennai, India', color: 'color-amazon', initials: 'A' },
    { id: 4, company: 'Adobe', role: 'UI/UX Design Intern', status: 'rejected', date: '2024-11-18', deadline: '2024-12-15', location: 'Noida, India', color: 'color-adobe', initials: 'Ad' },
    { id: 5, company: 'Infosys', role: 'Technology Analyst', status: 'applied', date: '2024-12-15', deadline: '2025-02-01', location: 'Pune, India', color: 'color-infosys', initials: 'I' },
    { id: 6, company: 'TCS', role: 'Software Developer', status: 'pending', date: '2024-12-12', deadline: '2025-01-30', location: 'Mumbai, India', color: 'color-tcs', initials: 'T' },
    { id: 7, company: 'Deloitte', role: 'Business Analyst Intern', status: 'interview', date: '2024-12-01', deadline: '2025-01-10', location: 'Gurgaon, India', color: 'color-deloitte', initials: 'D' },
    { id: 8, company: 'Accenture', role: 'Cloud Engineer', status: 'pending', date: '2024-12-18', deadline: '2025-02-10', location: 'Bangalore, India', color: 'color-accenture', initials: 'Ac' },
    { id: 9, company: 'Meta', role: 'React Developer', status: 'applied', date: '2024-12-05', deadline: '2025-01-25', location: 'Remote', color: 'color-meta', initials: 'M' },
    { id: 10, company: 'Netflix', role: 'Data Engineer Intern', status: 'wishlist', date: '2024-12-20', deadline: '2025-02-28', location: 'Remote', color: 'color-netflix', initials: 'N' },
  ],
  notifications: [
    { icon: '🎉', title: 'Interview Scheduled', desc: 'Google has scheduled your technical interview', time: '2 hours ago', color: 'var(--accent-50)', iconColor: 'var(--accent)' },
    { icon: '📧', title: 'New Application Update', desc: 'Amazon has reviewed your application', time: '5 hours ago', color: 'var(--primary-50)', iconColor: 'var(--primary)' },
    { icon: '⏰', title: 'Deadline Approaching', desc: 'Microsoft application deadline in 3 days', time: '1 day ago', color: 'var(--warning-50)', iconColor: 'var(--warning)' },
    { icon: '❌', title: 'Application Update', desc: 'Adobe has updated your application status', time: '2 days ago', color: 'var(--danger-50)', iconColor: 'var(--danger)' },
  ]
};

/* ==========================================
   FORM INTERACTIONS
   ========================================== */
const Forms = {
  init() {
    // File upload drag and drop
    const fileUpload = document.querySelector('.file-upload');
    if (fileUpload) {
      fileUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUpload.style.borderColor = 'var(--primary)';
        fileUpload.style.background = 'var(--primary-50)';
      });
      fileUpload.addEventListener('dragleave', () => {
        fileUpload.style.borderColor = '';
        fileUpload.style.background = '';
      });
      fileUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) this.handleFileUpload(file, fileUpload);
      });
      fileUpload.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.doc,.docx';
        input.onchange = (e) => this.handleFileUpload(e.target.files[0], fileUpload);
        input.click();
      });
    }

    // Form submission prevention (demo)
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
          const originalText = submitBtn.innerHTML;
          submitBtn.innerHTML = '<span class="loader-ring" style="width:18px;height:18px;border-width:2px;"></span>';
          submitBtn.disabled = true;
          setTimeout(() => {
            submitBtn.innerHTML = '✅ Saved!';
            setTimeout(() => {
              submitBtn.innerHTML = originalText;
              submitBtn.disabled = false;
            }, 2000);
          }, 1200);
        }
      });
    });
  },
  handleFileUpload(file, container) {
    if (!file) return;
    container.innerHTML = `
      <div class="file-upload-icon">📄</div>
      <p style="font-weight:600;color:var(--text-primary);margin-bottom:4px;">${file.name}</p>
      <p style="font-size:0.82rem;color:var(--text-muted);">${(file.size / 1024).toFixed(1)} KB · Click to change</p>
    `;
    container.style.borderColor = 'var(--accent)';
    container.style.background = 'var(--accent-50)';
  }
};

/* ==========================================
   NOTIFICATIONS / TOAST
   ========================================== */
const Toast = {
  show(message, type = 'success', duration = 3500) {
    const colors = {
      success: { bg: 'var(--accent)', icon: '✅' },
      error: { bg: 'var(--danger)', icon: '❌' },
      info: { bg: 'var(--primary)', icon: 'ℹ️' },
      warning: { bg: 'var(--warning)', icon: '⚠️' }
    };
    const config = colors[type] || colors.success;

    const toast = document.createElement('div');
    toast.style.cssText = `
      position:fixed;bottom:24px;right:24px;z-index:9999;
      background:${config.bg};color:white;
      padding:14px 20px;border-radius:12px;
      box-shadow:0 8px 32px rgba(0,0,0,0.2);
      display:flex;align-items:center;gap:10px;
      font-size:0.9rem;font-weight:600;
      transform:translateY(20px);opacity:0;
      transition:all 0.3s ease;
      max-width:340px;font-family:Inter,sans-serif;
    `;
    toast.innerHTML = `<span>${config.icon}</span><span>${message}</span>`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });

    setTimeout(() => {
      toast.style.transform = 'translateY(20px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

/* ==========================================
   DROPDOWN MENUS
   ========================================== */
const Dropdowns = {
  init() {
    document.querySelectorAll('[data-dropdown]').forEach(trigger => {
      const menuId = trigger.getAttribute('data-dropdown');
      const menu = document.getElementById(menuId);
      if (!menu) return;

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menu.classList.contains('open');
        // Close all other dropdowns
        document.querySelectorAll('.dropdown-menu.open').forEach(m => m.classList.remove('open'));
        if (!isOpen) menu.classList.add('open');
      });
    });

    document.addEventListener('click', () => {
      document.querySelectorAll('.dropdown-menu.open').forEach(m => m.classList.remove('open'));
    });
  }
};

/* ==========================================
   MODAL MANAGER
   ========================================== */
const Modal = {
  init() {
    document.querySelectorAll('[data-modal-open]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-modal-open');
        this.open(id);
      });
    });
    document.querySelectorAll('[data-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-modal-close');
        this.close(id);
      });
    });
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.close(overlay.id);
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(o => this.close(o.id));
      }
    });
  },
  open(id) {
    const overlay = document.getElementById(id);
    if (overlay) {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  },
  close(id) {
    const overlay = document.getElementById(id);
    if (overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
};

/* ==========================================
   SEARCH AND FILTER (Applications page)
   ========================================== */
const FilterManager = {
  init() {
    const searchInput = document.getElementById('app-search');
    const statusFilter = document.getElementById('status-filter');
    const sortFilter = document.getElementById('sort-filter');

    if (searchInput) searchInput.addEventListener('input', () => this.filter());
    if (statusFilter) statusFilter.addEventListener('change', () => this.filter());
    if (sortFilter) sortFilter.addEventListener('change', () => this.filter());
  },
  filter() {
    const query = document.getElementById('app-search')?.value.toLowerCase() || '';
    const status = document.getElementById('status-filter')?.value || 'all';
    const cards = document.querySelectorAll('.app-card');

    cards.forEach(card => {
      const company = card.querySelector('.company-name')?.textContent.toLowerCase() || '';
      const role = card.querySelector('.company-role')?.textContent.toLowerCase() || '';
      const cardStatus = card.getAttribute('data-status') || '';

      const matchesQuery = company.includes(query) || role.includes(query);
      const matchesStatus = status === 'all' || cardStatus === status;

      card.style.display = matchesQuery && matchesStatus ? '' : 'none';
    });

    // Update count
    const visible = document.querySelectorAll('.app-card:not([style*="display: none"])').length;
    const countEl = document.getElementById('app-count');
    if (countEl) countEl.textContent = visible;
  }
};

/* ==========================================
   SETTINGS PAGE
   ========================================== */
const Settings = {
  init() {
    // Theme setting toggle
    const themeToggle = document.getElementById('theme-setting-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('change', () => ThemeManager.toggle());
    }

    // Settings navigation
    document.querySelectorAll('.settings-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const target = item.getAttribute('data-section');
        document.querySelectorAll('.settings-section-content').forEach(s => {
          s.style.display = s.id === target ? '' : 'none';
        });
      });
    });

    // Toggle notifications
    document.querySelectorAll('.notification-toggle').forEach(toggle => {
      toggle.addEventListener('change', function () {
        const label = this.closest('.toggle-switch').nextElementSibling;
        Toast.show(this.checked ? 'Notifications enabled' : 'Notifications disabled', 'info');
      });
    });
  }
};

/* ==========================================
   PROFILE PAGE
   ========================================== */
const profile = {
  init() {
    const editBtn = document.getElementById('edit-profile-btn');
    const editSection = document.getElementById('edit-profile-form');
    if (editBtn && editSection) {
      editBtn.addEventListener('click', () => {
        const isEditing = editSection.style.display !== 'none';
        editSection.style.display = isEditing ? 'none' : 'block';
        editBtn.textContent = isEditing ? '✏️ Edit profile' : '✕ Cancel';
      });
    }
  }
};

/* ==========================================
   ANALYTICS PAGE - INITIALIZE CHARTS
   ========================================== */
const AnalyticsPage = {
  init() {
    if (!document.getElementById('bar-chart')) return;

    // Monthly Applications Bar Chart
    Charts.drawBar('bar-chart',
      ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      [3, 5, 7, 4, 8, 12, 9, 15, 11, 8, 14, 10],
      { color: '#2563EB' }
    );

    // Status Distribution Donut
    Charts.drawDonut('donut-chart',
      ['Applied', 'Interview', 'Offer', 'Rejected', 'Pending'],
      [32, 18, 5, 12, 8],
      {
        colors: ['#2563EB', '#7C3AED', '#10B981', '#EF4444', '#F59E0B'],
        centerText: '75',
        centerLabel: 'Total'
      }
    );

    // Response Rate Line Chart
    Charts.drawLine('line-chart',
      ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      [
        { data: [15, 25, 32, 28, 45, 52, 48, 65], color: '#2563EB', label: 'Applications' },
        { data: [8, 12, 18, 14, 22, 28, 25, 35], color: '#10B981', label: 'Responses' }
      ]
    );

    // Company breakdown horizontal bar
    Charts.drawHBar('hbar-chart',
      ['Google', 'Microsoft', 'Amazon', 'Infosys', 'TCS', 'Deloitte'],
      [3, 4, 5, 8, 6, 2],
      { colors: ['#2563EB', '#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'] }
    );

    // Re-draw on resize
    window.addEventListener('resize', () => {
      clearTimeout(this._resizeTimer);
      this._resizeTimer = setTimeout(() => this.init(), 250);
    });
  }
};

/* ==========================================
   DASHBOARD PAGE - CHARTS
   ========================================== */
const DashboardPage = {
  init() {
    if (!document.getElementById('dash-line-chart')) return;

    Charts.drawLine('dash-line-chart',
      ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      [{ data: [2, 4, 3, 7, 5, 9], color: '#2563EB', label: 'Applications' }]
    );

    Charts.drawDonut('dash-donut-chart',
      ['Applied', 'Interview', 'Offer', 'Rejected', 'Pending'],
      [10, 4, 2, 3, 5],
      {
        colors: ['#2563EB', '#7C3AED', '#10B981', '#EF4444', '#F59E0B'],
        centerText: '24',
        centerLabel: 'Total'
      }
    );

    window.addEventListener('resize', () => {
      clearTimeout(this._resizeTimer);
      this._resizeTimer = setTimeout(() => this.init(), 250);
    });
  }
};

/* ==========================================
   TOOLTIPS
   ========================================== */
const Tooltips = {
  init() {
    document.querySelectorAll('[data-tip]').forEach(el => {
      el.classList.add('tooltip');
    });
  }
};

/* ==========================================
   PROGRESS BAR ANIMATION
   ========================================== */
const progressBars = {
  init() {
    const bars = document.querySelectorAll('.progress-fill[data-width]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target.getAttribute('data-width');
          entry.target.style.width = target + '%';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    bars.forEach(bar => {
      bar.style.width = '0%';
      observer.observe(bar);
    });
  }
};

/* ==========================================
   APP INITIALIZATION
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Core
  Loader.init();
  ThemeManager.init();
  Navbar.init();
  Sidebar.init();
  ScrollAnimations.init();
  CounterAnimation.init();
  PasswordStrength.init();
  Forms.init();
  Dropdowns.init();
  Modal.init();
  FilterManager.init();
  Settings.init();
  profile.init();
  Tooltips.init();
  progressBars.init();

  // Page-specific charts (deferred to ensure canvas is rendered)
  setTimeout(() => {
    AnalyticsPage.init();
    DashboardPage.init();
  }, 100);

  // Add page entrance animation
  document.body.classList.add('page-enter');

  console.log('🚀 JobTracker initialized');
});

// Export for external use
window.JobTracker = { Toast, ThemeManager, Charts, AppData, Modal };
