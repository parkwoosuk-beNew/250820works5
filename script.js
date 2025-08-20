// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. 인터섹션 옵저버를 이용한 스크롤 애니메이션
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // 애니메이션 대상 요소들 선택
    const animatedElements = document.querySelectorAll('.service-card, .feature-item, .pricing-card, .process-step, .testimonial-card');
    
    // 각 요소에 animate-on-scroll 클래스 추가 및 관찰 시작
    animatedElements.forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });

    // 2. 부드러운 스크롤 네비게이션
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. 모바일 메뉴 토글
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('mobile-menu-open');
            this.textContent = navMenu.classList.contains('mobile-menu-open') ? '✕' : '☰';
        });

        // 모바일 메뉴 링크 클릭 시 메뉴 닫기
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('mobile-menu-open');
                mobileMenuToggle.textContent = '☰';
            });
        });
    }

    // 4. 헤더 스크롤 효과
    let lastScrollY = window.scrollY;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    });

    // 5. CTA 버튼 클릭 이벤트
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-cta, .nav-cta-btn');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // onclick 속성이 있는 버튼은 기존 로직을 실행하지 않음
            if (this.hasAttribute('onclick')) {
                return;
            }
            
            // 실제 상담 신청 로직은 여기에 구현
            if (this.textContent.includes('상담')) {
                e.preventDefault();
                showContactModal();
            }
        });
    });

    // 6. 상담 신청 모달 (간단한 예시)
    function showContactModal() {
        // 실제 구현에서는 더 정교한 모달을 사용하거나 외부 폼 서비스와 연동
        const userConfirm = confirm('무료 상담을 신청하시겠습니까?\n\n담당자가 24시간 내에 연락드리겠습니다.');
        
        if (userConfirm) {
            // 실제로는 폼 데이터를 서버로 전송
            alert('상담 신청이 완료되었습니다!\n곧 연락드리겠습니다. 📞');
            
            // GA 이벤트 트래킹 (Google Analytics가 설치된 경우)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'consultation_request', {
                    'event_category': 'engagement',
                    'event_label': 'free_consultation'
                });
            }
        }
    }

    // 7. 카운터 애니메이션 (숫자 효과)
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }

    // 8. 스크롤 진행 표시기 (선택사항)
    function createScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--primary), var(--accent));
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.offsetHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }

    // 스크롤 진행 표시기 활성화
    createScrollProgress();

    // 9. 이미지 지연 로딩 (Lazy Loading)
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // 10. 폼 유효성 검사 (상담 신청 폼이 있는 경우)
    function validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });

        // 이메일 형식 검증
        const emailFields = form.querySelectorAll('input[type="email"]');
        emailFields.forEach(field => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (field.value && !emailRegex.test(field.value)) {
                field.classList.add('error');
                isValid = false;
            }
        });

        // 전화번호 형식 검증
        const phoneFields = form.querySelectorAll('input[type="tel"]');
        phoneFields.forEach(field => {
            const phoneRegex = /^[0-9-+\s()]*$/;
            if (field.value && !phoneRegex.test(field.value)) {
                field.classList.add('error');
                isValid = false;
            }
        });

        return isValid;
    }

    // 11. 성능 최적화 - 디바운싱된 스크롤 이벤트
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

    // 스크롤 이벤트 최적화
    const optimizedScrollHandler = debounce(function() {
        // 스크롤 관련 로직들을 여기에 배치
    }, 10);

    window.addEventListener('scroll', optimizedScrollHandler);

    // 12. 다크 모드 토글 (선택사항)
    function initDarkModeToggle() {
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (!darkModeToggle) return;

        // 사용자 선호도 확인
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.body.classList.add('dark-mode');
        }

        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // 다크 모드 초기화
    initDarkModeToggle();

    // 13. 페이지 로드 완료 후 초기 애니메이션
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // 히어로 섹션 애니메이션 실행
        const heroElements = document.querySelectorAll('.fade-in, .fade-in-delay, .fade-in-delay-2');
        heroElements.forEach(element => {
            element.style.animationPlayState = 'running';
        });
    });

    console.log('포미서비스 웹사이트 초기화 완료 🚀');
});

// CSS 클래스 추가 (모바일 메뉴용)
const mobileMenuStyles = `
.nav-menu.mobile-menu-open {
    display: flex !important;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: var(--white);
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 4px 10px var(--shadow);
    border-top: 1px solid var(--light);
}

.nav-menu.mobile-menu-open li {
    margin: 0.5rem 0;
}

.header.scrolled {
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
}

.error {
    border-color: var(--accent) !important;
    box-shadow: 0 0 0 2px rgba(242, 72, 34, 0.2);
}

@media (max-width: 768px) {
    .nav-menu {
        display: none;
    }
}
`;

// 스타일 요소 추가
const styleElement = document.createElement('style');
styleElement.textContent = mobileMenuStyles;
document.head.appendChild(styleElement);

// 상담 신청 팝업 함수 (히어로 섹션용)
function showContactPopup(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    alert('contact@formeai.org 이메일로 상담 신청해주세요');
} 