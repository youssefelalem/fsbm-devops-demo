/* ============================================================
   🎓 EduPredictors — JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ========== Particles ==========
    const particlesEl = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        const size = Math.random() * 6 + 2;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.animationDelay = (Math.random() * 6) + 's';
        p.style.animationDuration = (Math.random() * 4 + 4) + 's';
        p.style.opacity = Math.random() * 0.5 + 0.1;
        particlesEl.appendChild(p);
    }

    // ========== Navbar Scroll ==========
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    // ========== Smooth Scroll ==========
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ========== Fade-in Observer ==========
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // ========== Counter Animation ==========
    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        const duration = 2000;
        const start = performance.now();
        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(ease * target).toLocaleString('fr-FR');
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

    // ========== Tabs ==========
    document.querySelectorAll('.form-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // ========== Prediction Form ==========
    const form = document.getElementById('prediction-form');
    const resultCard = document.getElementById('result-card');
    const btnText = document.querySelector('.btn-text');
    const btnLoader = document.querySelector('.btn-loader');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';

        const formData = new FormData(form);
        const data = {};
        formData.forEach((val, key) => {
            // Try to parse numbers
            const num = parseFloat(val);
            data[key] = isNaN(num) || ['sexe', 'zone', 'soutien_familial', 'niveau', 'filiere',
                'region', 'niveau_education_pere', 'niveau_education_mere', 'statut_parental',
                'cours_particuliers', 'niveau_motivation', 'participation_classe',
                'attention_cours', 'implication_parents', 'confiance_en_soi',
                'internet', 'chambre_personnelle', 'ordinateur_portable',
                'score_engagement', 'score_feedback_enseignants', 'score_collaboration',
                'comportement', 'prise_notes', 'niveau_stress', 'niveau_anxiete',
                'satisfaction_ecole', 'satisfaction_enseignants',
                'efficacite_auto_apprentissage', 'gestion_temps', 'organisation',
                'resolution_problemes', 'pensee_critique'].includes(key) ? val : num;
        });

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await response.json();

            if (result.success) {
                showResult(result.prediction);
            } else {
                alert('Erreur : ' + (result.error || 'Inconnue'));
            }
        } catch (err) {
            alert('Erreur de connexion au serveur. Assurez-vous que l\'API est démarrée.');
        } finally {
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    });

    function showResult(score) {
        resultCard.style.display = 'block';
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Animate gauge
        const gaugeFill = document.getElementById('gauge-fill');
        const gaugeValue = document.getElementById('gauge-value');
        const interp = document.getElementById('result-interpretation');

        // Total arc length = 251.2
        const maxArc = 251.2;
        const targetOffset = maxArc - (score / 20) * maxArc;

        // Animate value
        let currentVal = 0;
        const dur = 1500;
        const startTime = performance.now();

        function animate(now) {
            const progress = Math.min((now - startTime) / dur, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const val = ease * score;
            gaugeValue.textContent = val.toFixed(1);
            gaugeFill.style.strokeDashoffset = maxArc - (val / 20) * maxArc;
            if (progress < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);

        // Interpretation
        interp.className = 'result-interpretation';
        if (score >= 16) {
            interp.classList.add('excellent');
            interp.textContent = '🌟 Excellent ! Cet étudiant a un potentiel académique très élevé.';
        } else if (score >= 12) {
            interp.classList.add('good');
            interp.textContent = '👍 Bien ! Moyenne satisfaisante avec un bon potentiel d\'amélioration.';
        } else if (score >= 10) {
            interp.classList.add('average');
            interp.textContent = '⚠️ Passable. Des efforts supplémentaires sont recommandés.';
        } else {
            interp.classList.add('poor');
            interp.textContent = '📚 En difficulté. Un soutien scolaire renforcé est conseillé.';
        }
    }

});
