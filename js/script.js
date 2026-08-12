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
    if (el._animTimer) clearInterval(el._animTimer);
    const target = parseFloat(el.getAttribute('data-count')) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1800;
    const steps = 60;
    
    if (target === 0) {
      el.textContent = prefix + '0' + suffix;
      return;
    }
    
    const increment = target / steps;
    let current = 0;
    let step = 0;

    el._animTimer = setInterval(() => {
      step++;
      current = Math.min(current + increment, target);
      const display = Number.isInteger(target) ? Math.floor(current) : current.toFixed(1);
      el.textContent = prefix + display + suffix;
      if (step >= steps) {
        el.textContent = prefix + target + suffix;
        clearInterval(el._animTimer);
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
  applications: [],
  notifications: []
};

/* ==========================================
   REAL NOTIFICATIONS LOGIC
   ========================================== */
const NotificationsUI = {
  async init() {
    if (!window.API || !window.API.isLoggedIn()) return;
    try {
      this.notifications = await window.API.getNotifications();
      this.render();
    } catch (e) {
      console.error('Failed to load notifications', e);
    }
  },
  
  async markRead(id) {
    try {
      await window.API.markNotificationRead(id);
      this.notifications = this.notifications.map(n => 
        n._id === id ? { ...n, read: true } : n
      );
      this.render();
    } catch (e) {
      console.error('Failed to mark notification read', e);
    }
  },

  async markAllRead() {
    try {
      await window.API.markAllNotificationsRead();
      this.notifications = this.notifications.map(n => ({ ...n, read: true }));
      this.render();
    } catch (e) {
      console.error('Failed to mark all notifications read', e);
    }
  },

  render() {
    // 1. Update Badge
    const unreadCount = this.notifications.filter(n => !n.read).length;
    document.querySelectorAll('.unread-badge').forEach(badge => {
      badge.style.display = unreadCount > 0 ? 'block' : 'none';
    });

    // 2. Update Lists
    const listContainers = document.querySelectorAll('#notifications-list, .notifications-list-container');
    listContainers.forEach(container => {
      if (this.notifications.length === 0) {
        container.innerHTML = '<div style="padding: 16px; text-align: center; color: var(--text-muted);">No notifications yet</div>';
        return;
      }
      container.innerHTML = this.notifications.map(n => {
        const iconMap = {
          'info': 'ℹ️',
          'success': '✅',
          'warning': '⚠️',
          'error': '❌'
        };
        const colorMap = {
          'info': 'var(--primary)',
          'success': 'var(--accent)',
          'warning': 'var(--warning)',
          'error': 'var(--danger)'
        };
        const bgMap = {
          'info': 'var(--primary-50)',
          'success': 'var(--accent-50)',
          'warning': 'var(--warning-50)',
          'error': 'var(--danger-50)'
        };
        
        const timeAgo = new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const opacity = n.read ? '0.6' : '1';
        
        return `
          <div class="notification-item" style="padding: 12px 16px; border-bottom: 1px solid var(--gray-100); display: flex; gap: 12px; align-items: flex-start; cursor: pointer; opacity: ${opacity}; transition: background 0.2s;" onclick="window.JobTracker.NotificationsUI.markRead('${n._id}')">
            <div style="background: ${bgMap[n.type] || bgMap.info}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0;">
              ${iconMap[n.type] || iconMap.info}
            </div>
            <div>
              <div style="font-weight: 600; color: var(--text-primary); font-size: 0.95rem; margin-bottom: 2px;">${n.title}</div>
              <div style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 4px;">${n.message}</div>
              <div style="color: var(--gray-400); font-size: 0.75rem;">${timeAgo}</div>
            </div>
          </div>
        `;
      }).join('');
    });
  }
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
    document.querySelectorAll('form:not([onsubmit])').forEach(form => {
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
  async init() {
    window.toggleEditProfile = () => {
      const editSection = document.getElementById('edit-profile-form');
      const editBtn = document.getElementById('edit-profile-btn');
      if (editBtn && editSection) {
        const isEditing = editSection.style.display !== 'none';
        editSection.style.display = isEditing ? 'none' : 'block';
        editBtn.textContent = isEditing ? '✏️ Edit profile' : '✕ Cancel';
      }
    };
    
    window.saveProfile = async (event) => {
      event.preventDefault();
      try {
        const name = document.getElementById('profile-edit-name')?.value;
        const email = document.getElementById('profile-edit-email')?.value;
        const phone = document.getElementById('profile-edit-phone')?.value;
        const location = document.getElementById('profile-edit-location')?.value;
        const institution = document.getElementById('profile-edit-inst')?.value;
        const year = document.getElementById('profile-edit-year')?.value;
        const cgpa = document.getElementById('profile-edit-cgpa')?.value;
        const goal = document.getElementById('profile-edit-goal')?.value;
        const weeklyGoal = document.getElementById('profile-edit-weekly-goal')?.value;
        const professionalSummary = document.getElementById('profile-edit-summary')?.value;
        
        const res = await window.API.updateProfile({ 
          name, email, phone, location, institution, year, cgpa, goal, weeklyGoal, professionalSummary 
        });
        Toast.show('Profile updated successfully!', 'success');
        
        toggleEditProfile();
        
        // Re-run init to reload ui
        setTimeout(() => window.location.reload(), 500);
      } catch (err) {
        Toast.show(err.message, 'error');
      }
    };

    const renderEducationTimeline = () => {
      const container = document.getElementById('education-timeline-container');
      if (!container) return;
      const usr = window.API.getUser();
      const eduList = usr?.education || [];

      if (eduList.length === 0) {
        container.innerHTML = `
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div style="background:var(--bg-card);border:1px solid var(--gray-200);border-radius:var(--radius-md);padding:16px;">
              <div class="timeline-desc">No education added yet.</div>
            </div>
          </div>
        `;
        return;
      }

      container.innerHTML = eduList.map((edu, index) => {
        const isFirst = index === 0;
        const bg = isFirst ? 'var(--primary-50)' : 'var(--bg-card)';
        const border = isFirst ? 'var(--primary-100)' : 'var(--gray-200)';
        
        let tagsHtml = '';
        if (edu.cgpa) {
          tagsHtml += `<span style="background:var(--primary);color:white;font-size:0.72rem;font-weight:700;padding:2px 10px;border-radius:999px;">CGPA: ${edu.cgpa}</span>`;
        }
        if (edu.achievements) {
          tagsHtml += `<span style="background:var(--accent-50);color:var(--accent-dark);font-size:0.72rem;font-weight:600;padding:2px 10px;border-radius:999px;margin-left:8px;">${edu.achievements}</span>`;
        }

        return `
          <div class="timeline-item">
            <div class="timeline-dot" ${!isFirst ? 'style="background:var(--secondary);"' : ''}></div>
            <div style="background:${bg};border:1px solid ${border};border-radius:var(--radius-md);padding:16px;">
              <div class="timeline-date">${edu.startDate || ''} – ${edu.endDate || 'Present'}</div>
              <div class="timeline-title">${edu.degree || 'Degree'}</div>
              <div class="timeline-desc">${edu.institution || 'Institution'}</div>
              ${tagsHtml ? `<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">${tagsHtml}</div>` : ''}
            </div>
          </div>
        `;
      }).join('');
    };

    window.addEducationEntry = (edu = {}) => {
      const container = document.getElementById('education-entries-container');
      if (!container) return;
      const div = document.createElement('div');
      div.className = 'edu-entry';
      div.style.cssText = 'border:1px solid var(--gray-200);border-radius:var(--radius-md);padding:16px;margin-bottom:16px;background:var(--bg-card);position:relative;';
      div.innerHTML = `
        <button type="button" class="btn btn-ghost btn-sm" onclick="this.parentElement.remove()" style="position:absolute;top:10px;right:10px;color:var(--error);">✕ Remove</button>
        <div class="form-grid-2" style="margin-top:10px;">
          <div class="form-group">
            <label class="form-label">Degree/Program</label>
            <input type="text" class="form-control edu-degree" value="${edu.degree || ''}" placeholder="e.g. B.Tech in CSE" required>
          </div>
          <div class="form-group">
            <label class="form-label">Institution</label>
            <input type="text" class="form-control edu-inst" value="${edu.institution || ''}" placeholder="e.g. IIT Bombay" required>
          </div>
          <div class="form-group">
            <label class="form-label">Start Year</label>
            <input type="text" class="form-control edu-start" value="${edu.startDate || ''}" placeholder="e.g. 2021" required>
          </div>
          <div class="form-group">
            <label class="form-label">End Year</label>
            <input type="text" class="form-control edu-end" value="${edu.endDate || ''}" placeholder="e.g. 2025 (Expected)" required>
          </div>
          <div class="form-group">
            <label class="form-label">CGPA / Percentage</label>
            <input type="text" class="form-control edu-cgpa" value="${edu.cgpa || ''}" placeholder="e.g. 9.2/10">
          </div>
          <div class="form-group">
            <label class="form-label">Achievements</label>
            <input type="text" class="form-control edu-achiev" value="${edu.achievements || ''}" placeholder="e.g. Dean's List">
          </div>
        </div>
      `;
      container.appendChild(div);
    };

    window.toggleEditEducation = () => {
      const formDiv = document.getElementById('edit-education-form');
      const timelineDiv = document.getElementById('education-timeline-container');
      const editBtn = document.getElementById('edit-education-btn');
      
      if (!formDiv || !timelineDiv) return;
      
      const isEditing = formDiv.style.display !== 'none';
      if (isEditing) {
        // Cancel: hide form, show timeline
        formDiv.style.display = 'none';
        timelineDiv.style.display = 'block';
        if (editBtn) editBtn.textContent = 'Edit';
      } else {
        // Edit: show form, hide timeline, populate
        formDiv.style.display = 'block';
        timelineDiv.style.display = 'none';
        if (editBtn) editBtn.textContent = '✕ Cancel';
        
        const container = document.getElementById('education-entries-container');
        container.innerHTML = '';
        const usr = window.API.getUser();
        const eduList = usr?.education || [];
        if (eduList.length > 0) {
          eduList.forEach(edu => addEducationEntry(edu));
        } else {
          addEducationEntry(); // one blank entry
        }
      }
    };

    window.saveEducation = async (event) => {
      event.preventDefault();
      
      // Gather data
      const entries = document.querySelectorAll('.edu-entry');
      const newEducation = Array.from(entries).map(entry => ({
        degree: entry.querySelector('.edu-degree').value,
        institution: entry.querySelector('.edu-inst').value,
        startDate: entry.querySelector('.edu-start').value,
        endDate: entry.querySelector('.edu-end').value,
        cgpa: entry.querySelector('.edu-cgpa').value,
        achievements: entry.querySelector('.edu-achiev').value
      }));

      try {
        await window.API.updateProfile({ education: newEducation });
        Toast.show('Education updated successfully!', 'success');
        
        // Hide form, render timeline
        const formDiv = document.getElementById('edit-education-form');
        const timelineDiv = document.getElementById('education-timeline-container');
        const editBtn = document.getElementById('edit-education-btn');
        if (formDiv) formDiv.style.display = 'none';
        if (timelineDiv) timelineDiv.style.display = 'block';
        if (editBtn) editBtn.textContent = 'Edit';
        
        renderEducationTimeline();
      } catch (err) {
        Toast.show(err.message || 'Failed to save education', 'error');
      }
    };

    // --- SKILLS ---
    const renderSkills = () => {
      const container = document.getElementById('skills-display-container');
      if (!container) return;
      const usr = window.API.getUser();
      const tech = usr?.technicalSkills || { languages: [], frameworks: [], concepts: [] };
      
      const makeTags = (arr) => arr && arr.length ? arr.map(t => `<span class="skill-tag">${t}</span>`).join('') : '<span style="color:var(--text-muted);font-size:0.85rem;">None</span>';
      
      let html = '';
      if (!tech.languages?.length && !tech.frameworks?.length && !tech.concepts?.length) {
        html = '<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:0.9rem;">No skills added yet</div>';
      } else {
        html = `
          <div style="margin-bottom:16px;">
            <div style="font-size:0.82rem;font-weight:600;color:var(--text-secondary);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em;">Languages</div>
            <div class="skills-grid">${makeTags(tech.languages)}</div>
          </div>
          <div style="margin-bottom:16px;">
            <div style="font-size:0.82rem;font-weight:600;color:var(--text-secondary);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em;">Frameworks & Tools</div>
            <div class="skills-grid">${makeTags(tech.frameworks)}</div>
          </div>
          <div>
            <div style="font-size:0.82rem;font-weight:600;color:var(--text-secondary);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em;">Concepts</div>
            <div class="skills-grid">${makeTags(tech.concepts)}</div>
          </div>
        `;
      }
      container.innerHTML = html;
    };

    window.toggleEditSkills = () => {
      const formDiv = document.getElementById('edit-skills-form');
      const dispDiv = document.getElementById('skills-display-container');
      const editBtn = document.getElementById('edit-skills-btn');
      if (!formDiv || !dispDiv) return;
      
      const isEditing = formDiv.style.display !== 'none';
      formDiv.style.display = isEditing ? 'none' : 'block';
      dispDiv.style.display = isEditing ? 'block' : 'none';
      if (editBtn) editBtn.textContent = isEditing ? 'Edit' : '✕ Cancel';
      
      if (!isEditing) {
        const usr = window.API.getUser();
        const tech = usr?.technicalSkills || {};
        document.getElementById('edit-skills-languages').value = (tech.languages || []).join(', ');
        document.getElementById('edit-skills-frameworks').value = (tech.frameworks || []).join(', ');
        document.getElementById('edit-skills-concepts').value = (tech.concepts || []).join(', ');
      }
    };

    window.saveSkills = async (e) => {
      e.preventDefault();
      const parse = (val) => val.split(',').map(s => s.trim()).filter(s => s);
      const newSkills = {
        languages: parse(document.getElementById('edit-skills-languages').value),
        frameworks: parse(document.getElementById('edit-skills-frameworks').value),
        concepts: parse(document.getElementById('edit-skills-concepts').value),
      };
      
      try {
        await window.API.updateProfile({ technicalSkills: newSkills });
        Toast.show('Skills updated successfully!', 'success');
        toggleEditSkills();
        renderSkills();
      } catch(err) { Toast.show(err.message, 'error'); }
    };

    // --- EXPERIENCE ---
    const renderExperience = () => {
      const container = document.getElementById('experience-display-container');
      if (!container) return;
      const usr = window.API.getUser();
      const expList = usr?.workExperience || [];
      
      if (expList.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:0.9rem;">No experience added yet</div>';
        return;
      }
      
      container.innerHTML = expList.map((exp, idx) => {
        const isFirst = idx === 0;
        return `
          <div class="timeline-item">
            <div class="timeline-dot" ${!isFirst ? 'style="background:var(--secondary);"' : ''}></div>
            <div style="background:var(--bg-card);border:1px solid var(--gray-200);border-radius:var(--radius-md);padding:16px;">
              <div class="timeline-date">${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}</div>
              <div class="timeline-title">${exp.role}</div>
              <div class="timeline-desc" style="font-weight:600;color:var(--text-primary);">${exp.company} ${exp.location ? '- ' + exp.location : ''}</div>
              <div class="timeline-desc" style="margin-top:8px;">${exp.description || ''}</div>
            </div>
          </div>
        `;
      }).join('');
    };

    window.addExperienceEntry = (exp = {}) => {
      const container = document.getElementById('experience-entries-container');
      if (!container) return;
      const div = document.createElement('div');
      div.className = 'exp-entry';
      div.style.cssText = 'border:1px solid var(--gray-200);border-radius:var(--radius-md);padding:16px;margin-bottom:16px;background:var(--bg-card);position:relative;';
      div.innerHTML = `
        <button type="button" class="btn btn-ghost btn-sm" onclick="this.parentElement.remove()" style="position:absolute;top:10px;right:10px;color:var(--error);">✕ Remove</button>
        <div class="form-grid-2" style="margin-top:10px;">
          <div class="form-group"><label class="form-label">Role</label><input type="text" class="form-control exp-role" value="${exp.role||''}" required></div>
          <div class="form-group"><label class="form-label">Company</label><input type="text" class="form-control exp-comp" value="${exp.company||''}" required></div>
          <div class="form-group"><label class="form-label">Location</label><input type="text" class="form-control exp-loc" value="${exp.location||''}"></div>
          <div class="form-group"><label class="form-label">Start Date</label><input type="text" class="form-control exp-start" value="${exp.startDate||''}" required></div>
          <div class="form-group"><label class="form-label">End Date</label><input type="text" class="form-control exp-end" value="${exp.endDate||''}"></div>
          <div class="form-group" style="display:flex;align-items:center;padding-top:28px;">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;"><input type="checkbox" class="exp-curr" ${exp.current?'checked':''}> Current Job</label>
          </div>
        </div>
        <div class="form-group" style="margin-top:12px;">
          <label class="form-label">Description</label>
          <textarea class="form-control exp-desc">${exp.description||''}</textarea>
        </div>
      `;
      container.appendChild(div);
    };

    window.toggleEditExperience = () => {
      const formDiv = document.getElementById('edit-experience-form');
      const dispDiv = document.getElementById('experience-display-container');
      const editBtn = document.getElementById('edit-experience-btn');
      if (!formDiv || !dispDiv) return;
      const isEditing = formDiv.style.display !== 'none';
      formDiv.style.display = isEditing ? 'none' : 'block';
      dispDiv.style.display = isEditing ? 'block' : 'none';
      if (editBtn) editBtn.textContent = isEditing ? 'Edit' : '✕ Cancel';
      
      if (!isEditing) {
        const container = document.getElementById('experience-entries-container');
        container.innerHTML = '';
        const usr = window.API.getUser();
        const exps = usr?.workExperience || [];
        if (exps.length > 0) exps.forEach(ex => addExperienceEntry(ex));
        else addExperienceEntry();
      }
    };

    window.saveExperience = async (e) => {
      e.preventDefault();
      const entries = document.querySelectorAll('.exp-entry');
      const newExps = Array.from(entries).map(entry => ({
        role: entry.querySelector('.exp-role').value,
        company: entry.querySelector('.exp-comp').value,
        location: entry.querySelector('.exp-loc').value,
        startDate: entry.querySelector('.exp-start').value,
        endDate: entry.querySelector('.exp-end').value,
        current: entry.querySelector('.exp-curr').checked,
        description: entry.querySelector('.exp-desc').value
      }));
      try {
        await window.API.updateProfile({ workExperience: newExps });
        Toast.show('Experience updated successfully!', 'success');
        toggleEditExperience();
        renderExperience();
      } catch(err) { Toast.show(err.message, 'error'); }
    };

    // --- CONTACT ---
    window.toggleEditContact = () => {
      const formDiv = document.getElementById('edit-contact-form');
      const dispDiv = document.getElementById('contact-display-container');
      const editBtn = document.getElementById('edit-contact-btn');
      if (!formDiv || !dispDiv) return;
      const isEditing = formDiv.style.display !== 'none';
      formDiv.style.display = isEditing ? 'none' : 'block';
      dispDiv.style.display = isEditing ? 'flex' : 'none';
      if (editBtn) editBtn.textContent = isEditing ? 'Edit' : '✕ Cancel';
      
      if (!isEditing) {
        const usr = window.API.getUser() || {};
        document.getElementById('contact-edit-email').value = usr.email || '';
        document.getElementById('contact-edit-phone').value = usr.phone || '';
        document.getElementById('contact-edit-linkedin').value = usr.linkedin || '';
        document.getElementById('contact-edit-github').value = usr.github || '';
        document.getElementById('contact-edit-location').value = usr.location || '';
      }
    };

    window.saveContact = async (e) => {
      e.preventDefault();
      try {
        await window.API.updateProfile({
          email: document.getElementById('contact-edit-email').value,
          phone: document.getElementById('contact-edit-phone').value,
          linkedin: document.getElementById('contact-edit-linkedin').value,
          github: document.getElementById('contact-edit-github').value,
          location: document.getElementById('contact-edit-location').value,
        });
        Toast.show('Contact info updated!', 'success');
        toggleEditContact();
        setTimeout(() => window.location.reload(), 500);
      } catch(err) { Toast.show(err.message, 'error'); }
    };

    // --- RESUME ---
    const renderResume = () => {
      const usr = window.API.getUser();
      if (!usr) return;
      const fileNameEl = document.getElementById('resume-file-name');
      const dBtn = document.getElementById('resume-download-btn');
      if (usr.resume && usr.resume.fileName) {
        if (fileNameEl) fileNameEl.textContent = usr.resume.fileName;
        if (dBtn) dBtn.style.display = 'inline-block';
      }
    };

    window.handleResumeUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      if (file.size > 5 * 1024 * 1024) {
        Toast.show("File must be smaller than 5MB", "error");
        return;
      }

      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64Data = ev.target.result;
        try {
          await window.API.updateProfile({
            resume: { fileName: file.name, data: base64Data }
          });
          Toast.show('Resume uploaded successfully!', 'success');
          renderResume();
        } catch(err) { Toast.show(err.message, 'error'); }
      };
      reader.readAsDataURL(file);
    };

    window.downloadResume = () => {
      const usr = window.API.getUser();
      if (usr && usr.resume && usr.resume.data) {
        const link = document.createElement('a');
        link.href = usr.resume.data;
        link.download = usr.resume.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        Toast.show('Resume downloading...', 'success');
      }
    };

    if (window.API && window.API.isLoggedIn()) {
      const user = window.API.getUser();
      if (user) {
        // Form inputs
        const fieldsToPopulate = ['name', 'email', 'phone', 'location', 'inst', 'year', 'cgpa', 'goal', 'weeklyGoal', 'summary', 'linkedin'];
        fieldsToPopulate.forEach(f => {
          let val;
          if (f === 'inst') val = user.institution;
          else if (f === 'summary') val = user.professionalSummary;
          else if (f === 'weeklyGoal') val = user.weeklyGoal;
          else val = user[f];
          
          const el = document.getElementById(f === 'weeklyGoal' ? 'profile-edit-weekly-goal' : `profile-edit-${f}`);
          if (el) el.value = val !== undefined && val !== null ? val : '';
        });

        // Display elements
        const updateText = (id, val, fallback = 'Not provided') => {
          const el = document.getElementById(id);
          if (el) el.textContent = val && val.trim() !== '' ? val : fallback;
        };

        updateText('profile-hero-name', user.name);
        updateText('profile-hero-role', user.goal, 'Role not provided');
        updateText('profile-display-email', user.email);
        updateText('profile-display-phone', user.phone);
        updateText('profile-display-location', user.location);
        updateText('profile-display-linkedin', user.linkedin);
        updateText('profile-display-github', user.github);
        updateText('profile-display-summary', user.professionalSummary, 'Summary not provided.');
        updateText('profile-display-cgpa-stat', user.cgpa, '-');
        
        // Badges rendering
        const badgesContainer = document.getElementById('profile-badges-container');
        if (badgesContainer) {
          let badgesHtml = '';
          if (user.year) badgesHtml += `<span class="profile-badge">🎓 ${user.year}</span>`;
          if (user.location) badgesHtml += `<span class="profile-badge">📍 ${user.location}</span>`;
          if (user.goal) badgesHtml += `<span class="profile-badge">💼 ${user.goal}</span>`;
          if (user.cgpa) badgesHtml += `<span class="profile-badge">⭐ CGPA ${user.cgpa}/10</span>`;
          badgesContainer.innerHTML = badgesHtml;
        }

        // Initialize sections
        renderEducationTimeline();
        renderSkills();
        renderExperience();
        renderResume();
      }
      
      // Load and display statistics from real application data
      try {
        const data = await window.API.getAnalytics();
        const sMap = data.statusCounts || {};
        
        const elTotal = document.getElementById('profile-total-applications');
        const elInterviews = document.getElementById('profile-interviews');
        const elOffers = document.getElementById('profile-offers');
        
        if (elTotal) elTotal.textContent = data.totalApplications || 0;
        if (elInterviews) elInterviews.textContent = sMap['interview'] || 0;
        if (elOffers) elOffers.textContent = sMap['offer'] || 0;
      } catch (e) {
        console.error('Failed to load profile analytics', e);
      }
    }
  }
};

/* ==========================================
   ANALYTICS PAGE - INITIALIZE CHARTS
   ========================================== */
const AnalyticsPage = {
  async init() {
    if (!document.getElementById('bar-chart')) return;
    
    if (!window.API || !window.API.isLoggedIn()) return;
    try {
      const data = await window.API.getAnalytics();
      
      // Update top level cards if they exist
      const statTotal = document.getElementById('stat-total-apps');
      const statResponse = document.getElementById('stat-response-rate');
      const statInterviews = document.getElementById('stat-interviews');
      const statOffers = document.getElementById('stat-offers');
      
      const updateStat = (el, val) => {
        if (!el) return;
        if (el.hasAttribute('data-count')) {
          el.setAttribute('data-count', val);
          if (typeof CounterAnimation !== 'undefined') CounterAnimation.animateCounter(el);
        } else {
          el.textContent = val;
        }
      };

      updateStat(statTotal, data.totalApplications || 0);
      if (statResponse) statResponse.textContent = (data.responseRate || 0) + '%';
      updateStat(statInterviews, data.statusCounts['interview'] || 0);
      updateStat(statOffers, data.statusCounts['offer'] || 0);

      // Monthly Applications Bar Chart
      const months = data.monthlyTrends.map(m => m.month);
      const counts = data.monthlyTrends.map(m => m.count);
      Charts.drawBar('bar-chart',
        months.length ? months : ['No Data'],
        counts.length ? counts : [0],
        { color: '#2563EB' }
      );

      // Status Distribution Donut
      const sMap = data.statusCounts;
      const statusLabels = ['Applied', 'Interview', 'Offer', 'Rejected', 'Pending'];
      const applied = (sMap['applied']||0) + (sMap['oa-test']||0);
      const interviews = sMap['interview'] || 0;
      const offers = sMap['offer'] || 0;
      const rejections = (sMap['rejected']||0) + (sMap['withdrawn']||0);
      const pending = (sMap['pending']||0) + (sMap['wishlist']||0);
      
      const statusData = [applied, interviews, offers, rejections, pending];
      const total = data.totalApplications || 0;
      
      const setLegend = (id, count) => {
        const el = document.getElementById(id);
        if (el) {
          const pct = total > 0 ? ((count / total) * 100).toFixed(1) : '0';
          el.innerHTML = `${count} <span style="color:var(--text-muted);font-size:0.78rem;font-weight:400;">(${pct}%)</span>`;
        }
      };
      
      setLegend('analytics-legend-applied', applied);
      setLegend('analytics-legend-interview', interviews);
      setLegend('analytics-legend-offer', offers);
      setLegend('analytics-legend-rejected', rejections);
      setLegend('analytics-legend-pending', pending);
      
      const allApps = await window.API.getApplications();
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const weeklyApps = allApps.filter(app => new Date(app.applicationDate) >= oneWeekAgo).length;
      
      const goalEl = document.getElementById('analytics-goal-text');
      const user = window.API.getUser() || {};
      const wg = user.weeklyGoal || 10;
      if (goalEl) {
        goalEl.textContent = `This week: ${weeklyApps} / ${wg} applications`;
      }
      
      const fracEl = document.getElementById('weekly-apps-fraction');
      const progEl = document.getElementById('weekly-apps-progress');
      const pctEl = document.getElementById('weekly-apps-percent');
      if (fracEl && progEl && pctEl) {
        const pct = Math.min(100, Math.round((weeklyApps / wg) * 100)) || 0;
        fracEl.textContent = `${weeklyApps} / ${wg}`;
        progEl.style.width = `${pct}%`;
        progEl.dataset.width = pct;
        pctEl.textContent = `${pct}% of weekly goal`;
      }
      
      Charts.drawDonut('donut-chart',
        statusLabels,
        statusData,
        {
          colors: ['#2563EB', '#7C3AED', '#10B981', '#EF4444', '#F59E0B'],
          centerText: data.totalApplications.toString(),
          centerLabel: 'Total'
        }
      );

      // Response Rate Line Chart
      const lineLabels = data.monthlyTrends.map(m => m.month);
      const appsCounts = data.monthlyTrends.map(m => m.count);
      const respCounts = data.monthlyTrends.map(m => m.responses || 0);

      Charts.drawLine('line-chart',
        lineLabels.length ? lineLabels : ['No Data'],
        [
          { data: appsCounts.length ? appsCounts : [0], color: '#2563EB', label: 'Applications sent' },
          { data: respCounts.length ? respCounts : [0], color: '#10B981', label: 'Responses received' }
        ]
      );

      // Company breakdown horizontal bar
      const topCompanies = data.topCompanies.map(c => c.company);
      const topCounts = data.topCompanies.map(c => c.count);
      Charts.drawHBar('hbar-chart',
        topCompanies.length ? topCompanies : ['No Data'],
        topCounts.length ? topCounts : [0],
        { colors: ['#2563EB', '#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#06B6D4'] }
      );

    } catch (e) {
      console.error('Failed to load analytics', e);
    }

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
  async init() {
    if (!document.getElementById('dash-line-chart')) return;
    
    if (!window.API || !window.API.isLoggedIn()) return;
    try {
      const data = await window.API.getAnalytics();
      const allApps = await window.API.getApplications();
      
      // Update header stat counts
      const dashTotalApps = document.getElementById('dash-total-apps');
      const dashInterviews = document.getElementById('dash-interviews');
      const dashOffers = document.getElementById('dash-offers');
      const dashRejections = document.getElementById('dash-rejections');
      const dashPending = document.getElementById('dash-pending');
      
      const sMap = data.statusCounts || {};
      const rejections = (sMap['rejected']||0) + (sMap['withdrawn']||0);
      const pending = (sMap['pending']||0) + (sMap['wishlist']||0);
      const applied = (sMap['applied']||0) + (sMap['oa-test']||0);
      const interviews = sMap['interview'] || 0;
      const offers = sMap['offer'] || 0;

      const updateStat = (el, val) => {
        if (!el) return;
        if (el.hasAttribute('data-count')) {
          el.setAttribute('data-count', val);
          if (typeof CounterAnimation !== 'undefined') CounterAnimation.animateCounter(el);
        } else {
          el.textContent = val;
        }
      };

      updateStat(dashTotalApps, data.totalApplications || 0);
      updateStat(dashInterviews, interviews);
      updateStat(dashOffers, offers);
      updateStat(dashRejections, rejections);
      updateStat(dashPending, pending);

      // Applications this week
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const weeklyApps = allApps.filter(app => new Date(app.applicationDate) >= oneWeekAgo).length;
      
      const weeklyEl = document.getElementById('dash-weekly-apps');
      const weeklyBar = document.getElementById('dash-weekly-apps-bar');
      const user = window.API.getUser();
      if (weeklyEl) weeklyEl.textContent = weeklyApps;
      if (weeklyBar) {
        if (user && user.goal) {
          let pct = Math.min(100, (weeklyApps / user.goal) * 100);
          weeklyBar.setAttribute('data-width', pct);
          weeklyBar.style.width = pct + '%';
        } else {
          weeklyBar.style.display = 'none'; // Hide if no goal
          const parentText = weeklyBar.parentElement.previousElementSibling;
          if (parentText) parentText.textContent = `Applications this week: ${weeklyApps}`;
        }
      }

      // Profile Completeness
      const dashProfComp = document.getElementById('dash-profile-completeness');
      const dashProfCompBar = document.getElementById('dash-profile-completeness-bar');
      if (user) {
        let compPct = UserUtils.getProfileCompleteness(user);
        if (dashProfComp) dashProfComp.textContent = compPct + '%';
        if (dashProfCompBar) {
          dashProfCompBar.setAttribute('data-width', compPct);
          dashProfCompBar.style.width = compPct + '%';
        }
      }

      // Account Completeness
      const dashAccComp = document.getElementById('dash-account-completeness');
      const dashAccCompBar = document.getElementById('dash-account-completeness-bar');
      if (user) {
        let accCompPct = UserUtils.getAccountCompleteness(user, allApps.length);
        if (dashAccComp) dashAccComp.textContent = accCompPct + '%';
        if (dashAccCompBar) {
          dashAccCompBar.setAttribute('data-width', accCompPct);
          dashAccCompBar.style.width = accCompPct + '%';
        }
      }

      // Charts Timeline with Filter
      const renderTimeline = (filterValue) => {
        const labels = [];
        const counts = [];
        const current = new Date();
        current.setHours(23, 59, 59, 999);
        
        if (filterValue === '6weeks') {
          for (let i = 5; i >= 0; i--) {
            const end = new Date(current.getTime() - i * 7 * 24 * 60 * 60 * 1000);
            const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
            labels.push(end.toLocaleDateString('en-US', {month:'short', day:'numeric'}));
            let count = 0;
            allApps.forEach(app => {
              const d = new Date(app.applicationDate);
              if (d > start && d <= end) count++;
            });
            counts.push(count);
          }
        } else if (filterValue === '3months') {
          for (let i = 11; i >= 0; i--) {
            const end = new Date(current.getTime() - i * 7 * 24 * 60 * 60 * 1000);
            const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
            labels.push(end.toLocaleDateString('en-US', {month:'short', day:'numeric'}));
            let count = 0;
            allApps.forEach(app => {
              const d = new Date(app.applicationDate);
              if (d > start && d <= end) count++;
            });
            counts.push(count);
          }
        } else if (filterValue === 'year') {
          for (let i = 11; i >= 0; i--) {
            const d = new Date(current.getFullYear(), current.getMonth() - i, 1);
            labels.push(d.toLocaleDateString('en-US', {month:'short', year: '2-digit'}));
            let count = 0;
            allApps.forEach(app => {
              const ad = new Date(app.applicationDate);
              if (ad.getMonth() === d.getMonth() && ad.getFullYear() === d.getFullYear()) count++;
            });
            counts.push(count);
          }
        }

        if (typeof Charts !== 'undefined' && Charts.drawLine) {
          Charts.drawLine('dash-line-chart',
            labels,
            [{ data: counts, color: '#2563EB', label: 'Applications' }]
          );
        }
      };

      // Initial timeline render
      renderTimeline('6weeks');
      
      const filterEl = document.getElementById('dash-timeline-filter');
      if (filterEl) {
        const newFilterEl = filterEl.cloneNode(true);
        filterEl.parentNode.replaceChild(newFilterEl, filterEl);
        newFilterEl.addEventListener('change', (e) => {
          renderTimeline(e.target.value);
        });
      }

      const statusLabels = ['Applied', 'Interview', 'Offer', 'Rejected', 'Pending'];
      const statusData = [applied, interviews, offers, rejections, pending];
      const colors = ['#2563EB', '#7C3AED', '#10B981', '#EF4444', '#F59E0B'];

      if (typeof Charts !== 'undefined' && Charts.drawDonut) {
        Charts.drawDonut('dash-donut-chart', statusLabels, statusData, {
          colors: colors,
          centerText: (data.totalApplications || 0).toString(),
          centerLabel: 'Total'
        });
      }

      // Status Legend
      const legendEl = document.getElementById('dash-status-legend');
      if (legendEl) {
        legendEl.innerHTML = statusLabels.map((lbl, i) => `
          <div class="legend-item">
            <div class="legend-dot" style="background:${colors[i]};"></div>${lbl} (${statusData[i]})
          </div>
        `).join('');
      }

      // Recent Applications (latest 5)
      const tbody = document.getElementById('recent-apps-tbody');
      if (tbody) {
        if (allApps.length === 0) {
          tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:20px;">No recent applications</td></tr>';
        } else {
          // Sort by date desc and take 5
          const sorted = [...allApps].sort((a,b) => new Date(b.applicationDate) - new Date(a.applicationDate)).slice(0, 5);
          tbody.innerHTML = sorted.map(app => {
            const initials = app.company.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();
            const dateStr = new Date(app.applicationDate).toLocaleDateString('en-US', {month:'short', day:'numeric'});
            let bClass = 'badge-applied';
            if(['interview'].includes(app.status)) bClass = 'badge-interview';
            if(['offer'].includes(app.status)) bClass = 'badge-offer';
            if(['rejected','withdrawn'].includes(app.status)) bClass = 'badge-rejected';
            if(['pending','wishlist'].includes(app.status)) bClass = 'badge-pending';
            
            return `
              <tr>
                <td>
                  <div class="company-cell">
                    <div class="company-logo" style="background:var(--primary);color:white;">${initials}</div><span>${app.company}</span>
                  </div>
                </td>
                <td style="color:var(--text-secondary);font-size:0.88rem;">${app.role}</td>
                <td><span class="badge ${bClass}">${app.status}</span></td>
                <td style="color:var(--text-muted);font-size:0.85rem;">${dateStr}</td>
                <td><a href="applications.html" class="btn btn-ghost btn-sm">View</a></td>
              </tr>
            `;
          }).join('');
        }
      }

      // Upcoming Deadlines (future dates, nearest first)
      const deadlinesContainer = document.getElementById('upcoming-deadlines-container');
      if (deadlinesContainer) {
        const withDeadlines = allApps.filter(app => app.deadline && new Date(app.deadline) >= new Date(new Date().setHours(0,0,0,0)));
        withDeadlines.sort((a,b) => new Date(a.deadline) - new Date(b.deadline));
        
        if (withDeadlines.length === 0) {
          deadlinesContainer.innerHTML = '<div style="color:var(--text-muted);padding:20px;">No upcoming deadlines</div>';
        } else {
          deadlinesContainer.innerHTML = withDeadlines.map(app => {
            const daysLeft = Math.ceil((new Date(app.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            let colorVar = '--primary';
            let bgVar = 'white';
            if (daysLeft <= 3) { colorVar = '--danger'; bgVar = 'var(--danger-50)'; }
            else if (daysLeft <= 7) { colorVar = '--warning'; bgVar = 'var(--warning-50)'; }
            const dateStr = new Date(app.deadline).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'});
            
            return `
              <div style="padding:16px;border:1.5px solid var(${colorVar});border-radius:var(--radius-md);background:${bgVar};">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
                  <div style="font-weight:700;font-size:0.9rem;">${app.company}</div>
                  <span style="background:var(${colorVar});color:white;font-size:0.72rem;font-weight:700;padding:2px 8px;border-radius:999px;">${daysLeft} days left</span>
                </div>
                <div style="font-size:0.82rem;color:var(--text-secondary);">${app.role}</div>
                <div style="font-size:0.78rem;color:var(${colorVar});margin-top:6px;font-weight:600;">Deadline: ${dateStr}</div>
              </div>
            `;
          }).join('');
        }
      }

    } catch (e) {
      console.error('Failed to load dashboard analytics', e);
    }

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
   USER UTILITIES
   ========================================== */
const UserUtils = {
  getInitials(name) {
    if (!name) return 'U';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].substring(0, 1).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  },
  
  getProfileCompleteness(user) {
    if (!user) return 0;
    const fields = [
      'name', 'email', 'goal', 'location', 'phone', 'year', 'cgpa',
      'institution', 'linkedin', 'professionalSummary'
    ];
    let filled = fields.filter(f => user[f] && user[f].trim() !== '').length;
    
    // Arrays / Objects
    if (user.education && user.education.length > 0) filled++;
    if (user.workExperience && user.workExperience.length > 0) filled++;
    if (user.technicalSkills && (user.technicalSkills.languages?.length || user.technicalSkills.frameworks?.length || user.technicalSkills.concepts?.length)) filled++;
    if (user.resume && user.resume.fileName) filled++;
    
    const totalFields = fields.length + 4; // primitives + 4 complex
    return Math.round((filled / totalFields) * 100);
  },

  getAccountCompleteness(user, appsCount) {
    if (!user) return 0;
    let score = 0;
    const maxScore = 5;
    
    if (user.name && user.email) score++; // Account initialized
    if (this.getProfileCompleteness(user) > 50) score++; // Basic profile
    if (user.resume && user.resume.fileName) score++; // Resume uploaded
    if (user.goal) score++; // Goal set
    if (appsCount > 0) score++; // Added at least one application
    
    return Math.round((score / maxScore) * 100);
  },
  
  updateGlobalUI(user, appsCount = 0) {
    if (!user) return;
    const initials = this.getInitials(user.name);
    
    // Update all avatars
    document.querySelectorAll('.nav-avatar, .sidebar-user-avatar, #profile-hero-avatar, #settings-user-avatar').forEach(el => {
      el.textContent = initials;
    });
    
    // Update names
    document.querySelectorAll('#sidebar-user-name, #settings-user-name, #profile-hero-name').forEach(el => {
      el.textContent = user.name || 'Not provided';
    });
    
    // Update emails / subtext
    document.querySelectorAll('#sidebar-user-inst, #settings-user-email, #profile-display-email').forEach(el => {
      el.textContent = user.email || 'Not provided';
    });
    
    // Greeting
    const greeting = document.getElementById('user-greeting');
    if (greeting && user.name) {
      const hour = new Date().getHours();
      const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
      greeting.innerHTML = `${timeGreeting}, ${user.name.split(' ')[0]}! 👋`;
    }
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
    NotificationsUI.init();
  }, 100);

  // Global User and Apps initialization
  async function runGlobalInit() {
    if (window.API && window.API.isLoggedIn()) {
      try {
        const apps = await window.API.getApplications();
        const user = window.API.getUser();
        
        if (user) {
          UserUtils.updateGlobalUI(user, apps.length);
        }
        
        const badge = document.getElementById('sidebar-total-badge');
        if (badge) badge.textContent = apps.length;
        
        const planUsage = document.getElementById('settings-user-plan-usage');
        if (planUsage) planUsage.textContent = apps.length;
      } catch (e) {
        console.error("Global init failed:", e);
      }
    }
  }

  // Add page entrance animation
  document.body.classList.add('page-enter');
  
  runGlobalInit();

  console.log('🚀 JobTracker initialized');
});

// Export for external use
window.JobTracker = { Toast, ThemeManager, Charts, AppData, Modal, NotificationsUI };
