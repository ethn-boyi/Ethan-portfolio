// ── SCROLL REVEAL ──
document.addEventListener('DOMContentLoaded', () => {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => el.classList.add('js-ready'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0, rootMargin: '0px 0px 0px 0px' });

    reveals.forEach(el => observer.observe(el));
});


// ── TYPING EFFECT ──
document.addEventListener('DOMContentLoaded', () => {
    const lines = ['Ethan', 'Boyi', 'Oduori'];
    const classes = [null, 'accent-text', 'dim'];
    const h1 = document.querySelector('h1');
    h1.innerHTML = '';

    let lineIndex = 0;
    let charIndex = 0;

    function typeLine() {
        if (lineIndex >= lines.length) {
            // Typing done — show the rest of the hero content
            document.querySelector('.hero-sub').style.opacity = '1';
            document.querySelector('.hero-cta').style.opacity = '1';
            return;
        }

        const text = lines[lineIndex];
        const cls  = classes[lineIndex];

        // Create or get the current span
        let span = h1.querySelector(`[data-line="${lineIndex}"]`);
        if (!span) {
            span = document.createElement('span');
            span.setAttribute('data-line', lineIndex);
            if (cls) span.className = cls;
            h1.appendChild(span);
            if (lineIndex < lines.length - 1) h1.appendChild(document.createElement('br'));
        }

        if (charIndex < text.length) {
            span.textContent += text[charIndex];
            charIndex++;
            setTimeout(typeLine, 80);
        } else {
            lineIndex++;
            charIndex = 0;
            setTimeout(typeLine, 200);
        }
    }

    // Hide sub and cta until typing finishes
    const sub = document.querySelector('.hero-sub');
    const cta = document.querySelector('.hero-cta');
    if (sub) { sub.style.opacity = '0'; sub.style.transition = 'opacity 0.6s ease'; }
    if (cta) { cta.style.opacity = '0'; cta.style.transition = 'opacity 0.6s ease'; }

    setTimeout(typeLine, 600);
});


// ── CURSOR GLOW ──
const cursor = document.createElement('div');
cursor.className = 'cursor-glow';
document.body.appendChild(cursor);

let mx = -200, my = -200;
let cx = -200, cy = -200;

document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
});

function animateCursor() {
    cx += (mx - cx) * 0.1;
    cy += (my - cy) * 0.1;
    cursor.style.transform = `translate(${cx - 150}px, ${cy - 150}px)`;
    requestAnimationFrame(animateCursor);
}
animateCursor();


// ── SKILL PROGRESS BARS ──
// Define skill levels (out of 100)
const skillLevels = {
    'HTML': 90, 'CSS': 85, 'JavaScript': 75,
    'Node.js': 60, 'React Native': 55,
    'Git': 80, 'GitHub': 80,
    'MS Word': 95, 'Excel': 85, 'PowerPoint': 85, 'Access': 70
};

document.addEventListener('DOMContentLoaded', () => {
    const pills = document.querySelectorAll('.skill-pills .pill');

    pills.forEach(pill => {
        const name = pill.textContent.trim();
        const level = skillLevels[name];
        if (!level) return;

        // Wrap pill text and add bar
        pill.innerHTML = `
            <span class="pill-label">${name}</span>
            <span class="pill-bar-wrap">
                <span class="pill-bar" data-level="${level}"></span>
            </span>
        `;
        pill.classList.add('has-bar');
    });

    // Animate bars when skills section enters view
    const skillsSection = document.getElementById('skills');
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.pill-bar').forEach(bar => {
                    const level = bar.getAttribute('data-level');
                    setTimeout(() => { bar.style.width = level + '%'; }, 200);
                });
                barObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    if (skillsSection) barObserver.observe(skillsSection);
});


// ── PARTICLE BACKGROUND ──
const canvas = document.createElement('canvas');
canvas.className = 'particles-canvas';
document.getElementById('hero').prepend(canvas);
const ctx = canvas.getContext('2d');

let particles = [];
const COUNT = 45;

function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

for (let i = 0; i < COUNT; i++) {
    particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        o: Math.random() * 0.4 + 0.1
    });
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connecting lines between nearby particles
    particles.forEach((p, i) => {
        particles.slice(i + 1).forEach(q => {
            const dist = Math.hypot(p.x - q.x, p.y - q.y);
            if (dist < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 229, 160, ${0.06 * (1 - dist / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(q.x, q.y);
                ctx.stroke();
            }
        });
    });

    // Draw dots
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 160, ${p.o})`;
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });

    requestAnimationFrame(drawParticles);
}
drawParticles();


// ── CONTACT FORM HANDLER ──
emailjs.init('xaXg9sebzHztAztC8'); 

function handleSubmit() {
    const name    = document.getElementById('fname').value.trim();
    const email   = document.getElementById('femail').value.trim();
    const message = document.getElementById('fmessage').value.trim();

    if (!name || !email || !message) {
        alert('Please fill in all fields before sending.');
        return;
    }
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    const btn = document.querySelector('#contact .btn-primary');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    emailjs.send('service_zend0yp', 'template_jxytugc', {
        from_name:  name,
        from_email: email,
        message:    message
    })
    .then(() => {
        document.getElementById('formSuccess').style.display = 'block';
        document.getElementById('fname').value    = '';
        document.getElementById('femail').value   = '';
        document.getElementById('fmessage').value = '';
        btn.textContent = 'Send message';
        btn.disabled = false;
    })
    .catch((error) => {
        alert('Oops! Something went wrong. Please try again.');
        console.error('EmailJS error:', error);
        btn.textContent = 'Send message';
        btn.disabled = false;
    });
}


// ── ACTIVE NAV HIGHLIGHT ──
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
    });
});

document.getElementById('sendBtn').addEventListener('click', handleSubmit);
