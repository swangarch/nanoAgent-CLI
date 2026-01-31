'use strict';

// 立即执行函数，避免全局污染
(function() {
    'use strict';
    
    // DOM 加载完成后执行
    document.addEventListener('DOMContentLoaded', function() {
        initializeApp();
    });

    // 应用初始化
    function initializeApp() {
        setupMobileNavigation();
        setupSmoothScrolling();
        setupScrollEffects();
        setupIntersectionObserver();
        setupAccessibility();
        setupPerformanceOptimizations();
        setupLazyLoading();
        setupThemeToggle();
        setupContactForm();
    }

    // 移动端导航设置
    function setupMobileNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (!hamburger || !navMenu) return;

        let isMenuOpen = false;

        hamburger.addEventListener('click', function() {
            isMenuOpen = !isMenuOpen;
            hamburger.classList.toggle('active', isMenuOpen);
            navMenu.classList.toggle('active', isMenuOpen);
            hamburger.setAttribute('aria-expanded', isMenuOpen);
            
            // 防止背景滚动
            document.body.style.overflow = isMenuOpen ? 'hidden' : '';
            
            // 聚焦管理
            if (isMenuOpen) {
                navMenu.querySelector('a').focus();
            }
        });

        // 点击导航链接时关闭菜单
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                isMenuOpen = false;
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // ESC 键关闭菜单
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isMenuOpen) {
                hamburger.click();
                hamburger.focus();
            }
        });
    }

    // 平滑滚动设置
    function setupSmoothScrolling() {
        // 使用事件委托提高性能
        document.addEventListener('click', function(e) {
            if (e.target.matches('a[href^="#"]') || e.target.closest('a[href^="#"]')) {
                e.preventDefault();
                
                const link = e.target.matches('a[href^="#"]') ? e.target : e.target.closest('a[href^="#"]');
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // 设置焦点
                    setTimeout(() => {
                        target.setAttribute('tabindex', '-1');
                        target.focus();
                    }, 500);
                }
            }
        });
    }

    // 滚动效果设置
    function setupScrollEffects() {
        let ticking = false;
        
        function updateHeaderBackground() {
            const header = document.querySelector('header');
            if (!header) return;
            
            const scrollY = window.pageYOffset;
            
            if (scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateHeaderBackground);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', function() {
            requestTick();
            ticking = false;
        });
    }

    // Intersection Observer 设置
    function setupIntersectionObserver() {
        const observerOptions = {
            threshold: [0.1, 0.2, 0.5],
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // 为项目卡片添加延迟动画
                    if (entry.target.classList.contains('project-card')) {
                        animateProjectCards();
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // 观察所有需要动画的元素
        const animatedElements = document.querySelectorAll('.project-card, .skill-item, .contact-item');
        animatedElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(element);
        });
    }

    // 项目卡片动画
    function animateProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // 无障碍功能设置
    function setupAccessibility() {
        // 键盘导航支持
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-nav');
        });

        // 焦点可见性改进
        const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
        focusableElements.forEach(element => {
            element.addEventListener('focus', function() {
                this.classList.add('focused');
            });
            
            element.addEventListener('blur', function() {
                this.classList.remove('focused');
            });
        });
    }

    // 性能优化设置
    function setupPerformanceOptimizations() {
        // 图片懒加载（如果需要的话）
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));

        // 预加载关键资源
        const preloadLinks = [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
        ];
        
        preloadLinks.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });
    }

    // 懒加载设置
    function setupLazyLoading() {
        // 创建观察者用于懒加载非关键内容
        const lazyContentObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // 加载延迟内容
                    if (element.dataset.content) {
                        element.innerHTML = element.dataset.content;
                        element.removeAttribute('data-content');
                    }
                    
                    lazyContentObserver.unobserve(element);
                }
            });
        });

        // 观察需要懒加载的元素
        document.querySelectorAll('[data-lazy]').forEach(element => {
            lazyContentObserver.observe(element);
        });
    }

    // 主题切换功能（可选）
    function setupThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.setAttribute('aria-label', '切换主题');
        themeToggle.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--primary-color);
            color: white;
            border: none;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transition: var(--transition);
        `;

        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            
            // 更新图标
            this.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            
            // 保存主题偏好
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });

        // 添加到页面
        document.body.appendChild(themeToggle);

        // 恢复主题偏好
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        // 响应系统主题变化
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', function(e) {
                if (!localStorage.getItem('theme')) {
                    document.body.classList.toggle('dark-theme', e.matches);
                    themeToggle.innerHTML = e.matches ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
                }
            });
        }
    }

    // 联系表单处理（如果有的话）
    function setupContactForm() {
        const contactItems = document.querySelectorAll('.contact-item');
        
        contactItems.forEach(item => {
            item.addEventListener('click', function(e) {
                const text = this.querySelector('span').textContent;
                
                // 根据内容类型处理点击
                if (text.includes('@')) {
                    // 邮箱
                    window.location.href = `mailto:${text}`;
                } else if (text.includes('github.com')) {
                    // GitHub
                    window.open(`https://${text}`, '_blank');
                } else if (text.includes('linkedin.com')) {
                    // LinkedIn
                    window.open(`https://${text}`, '_blank');
                } else if (text.startsWith('@')) {
                    // Twitter
                    window.open(`https://twitter.com/${text.slice(1)}`, '_blank');
                }
            });
            
            // 键盘支持
            item.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }

    // 错误处理
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
    });

    // 页面加载性能监控
    window.addEventListener('load', function() {
        // 如果需要，可以添加性能监控代码
        const loadTime = performance.now();
        console.log(`页面加载时间: ${loadTime.toFixed(2)}ms`);
    });

})();

// 工具函数
const utils = {
    // 防抖函数
    debounce: function(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    // 节流函数
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // 检查元素是否在视窗中
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};
