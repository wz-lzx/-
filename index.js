// DOM元素选择器
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollEffects();
    initAnimations();
    initInteractions();
});

// 导航栏功能
function initNavigation() {
    // 移动端菜单切换
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // 导航链接点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // 关闭移动端菜单
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                
                // 平滑滚动到目标区域
                const offsetTop = targetSection.offsetTop - 70; // 减去导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 点击页面其他地方关闭移动端菜单
    document.addEventListener('click', function(e) {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

// 滚动效果
function initScrollEffects() {
    // 导航栏滚动效果
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 导航栏背景变化
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // 导航栏隐藏/显示效果（可选）
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 向下滚动 - 隐藏导航栏
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动 - 显示导航栏
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // 滚动显示动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 观察需要动画的元素
    const animateElements = document.querySelectorAll('.section-title, .skill-item, .hobby-item, .contact-item, .update-item, .recommendation-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// 初始化动画
function initAnimations() {
    // 个人头像加载动画
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        setTimeout(() => {
            profileImage.classList.add('fade-in-up');
        }, 300);
    }

    // 文字逐字显示效果（可选）
    const profileName = document.querySelector('.profile-name');
    const profileSlogan = document.querySelector('.profile-slogan');
    
    if (profileName) {
        animateText(profileName, 100);
    }
    
    if (profileSlogan) {
        setTimeout(() => {
            animateText(profileSlogan, 50);
        }, 800);
    }
}

// 文字动画效果
function animateText(element, delay = 100) {
    const text = element.textContent;
    element.textContent = '';
    element.style.opacity = '1';
    
    let index = 0;
    const timer = setInterval(() => {
        if (index < text.length) {
            element.textContent += text[index];
            index++;
        } else {
            clearInterval(timer);
        }
    }, delay);
}

// 交互效果
function initInteractions() {
    // 技能项点击效果
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('click', function() {
            // 添加点击反馈动画
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // 可以添加更多交互逻辑
            const skillName = this.querySelector('span').textContent;
            showTooltip(`点击了技能：${skillName}`);
        });
    });

    // 兴趣爱好点击效果
    const hobbyItems = document.querySelectorAll('.hobby-item');
    hobbyItems.forEach(item => {
        item.addEventListener('click', function() {
            const hobbyName = this.querySelector('.hobby-name').textContent;
            showTooltip(`兴趣爱好：${hobbyName}`);
        });
    });

    // 联系方式点击追踪
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const contactType = this.querySelector('.contact-text').textContent;
            
            // 如果是邮件链接，记录点击事件
            if (this.href.includes('mailto:')) {
                console.log(`用户点击了邮件联系：${contactType}`);
            } else {
                console.log(`用户点击了外部链接：${contactType}`);
            }
        });
    });

    // 推荐链接点击效果
    const recommendationItems = document.querySelectorAll('.recommendation-item');
    recommendationItems.forEach(item => {
        item.addEventListener('click', function() {
            const linkName = this.querySelector('span').textContent;
            console.log(`用户访问了：${linkName}`);
        });
    });

    // 页面滚动进度指示器（可选）
    createScrollProgress();
}

// 创建滚动进度指示器
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--accent-color), var(--accent-hover));
        z-index: 1001;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollProgress = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrollProgress + '%';
    });
}

// 工具提示功能
function showTooltip(message, duration = 2000) {
    // 移除已存在的工具提示
    const existingTooltip = document.querySelector('.custom-tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }

    // 创建新的工具提示
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = message;
    tooltip.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--primary-color);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 1002;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
        box-shadow: var(--shadow-medium);
    `;

    document.body.appendChild(tooltip);

    // 显示动画
    setTimeout(() => {
        tooltip.style.opacity = '1';
    }, 10);

    // 自动隐藏
    setTimeout(() => {
        tooltip.style.opacity = '0';
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 300);
    }, duration);
}

// 键盘导航支持
document.addEventListener('keydown', function(e) {
    // ESC键关闭移动端菜单
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
    
    // 数字键快速导航（可选）
    if (e.key >= '1' && e.key <= '3') {
        const linkIndex = parseInt(e.key) - 1;
        if (navLinks[linkIndex]) {
            navLinks[linkIndex].click();
        }
    }
});

// 页面可见性变化处理
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面隐藏时暂停动画
        document.body.style.animationPlayState = 'paused';
    } else {
        // 页面显示时恢复动画
        document.body.style.animationPlayState = 'running';
    }
});

// 窗口大小变化处理
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // 重新计算布局
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }, 250);
});

// 平滑滚动到顶部功能
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 创建返回顶部按钮（可选）
function createBackToTopButton() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--accent-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: var(--shadow-medium);
    `;

    document.body.appendChild(backToTopBtn);

    // 滚动显示/隐藏按钮
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });

    // 点击返回顶部
    backToTopBtn.addEventListener('click', scrollToTop);
}

// 初始化返回顶部按钮
createBackToTopButton();

// 性能优化：防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 性能优化：节流函数
function throttle(func, limit) {
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
}

// 应用性能优化到滚动事件
window.addEventListener('scroll', throttle(function() {
    // 滚动相关的优化处理
}, 100));