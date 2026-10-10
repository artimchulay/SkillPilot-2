/* КУРСЫ С ПРИВЯЗКОЙ К ТРЕКАМ */
const DEFAULT_COURSES = [
    { id: 'c1', name: 'Продвинутый курс лидерства', xp: 200, weeks: '8 нед.', rating: 4.8, track: 'team_lead' },
    { id: 'c2', name: 'Профессиональное управление проектами', xp: 150, weeks: '6 нед.', rating: 4.6, track: 'team_lead' },
    { id: 'c3', name: 'Архитектура и чистый код', xp: 180, weeks: '7 нед.', rating: 4.9, track: 'tech_lead' },
    { id: 'c4', name: 'Эффективные коммуникации', xp: 120, weeks: '4 нед.', rating: 4.9, track: 'fast_middle' }
];

/* КАРЬЕРНЫЕ ТРЕКИ */
const CAREER_TRACKS = {
    team_lead: {
        name: '👔 Team Lead (Руководитель)',
        desc: 'Фокус на лидерство, управление проектами и собеседования.',
        targetSkill: 'leadership',
        recCourseId: 'c1'
    },
    tech_lead: {
        name: '💻 Tech Lead (Архитектор)',
        desc: 'Фокус на технические навыки до 100% и решение архитектурных задач.',
        targetSkill: 'tech',
        recCourseId: 'c3'
    },
    fast_middle: {
        name: '🚀 Уверенный Middle (Быстрый старт)',
        desc: 'Сбалансированное развитие всех навыков для уверенного роста.',
        targetSkill: 'pm',
        recCourseId: 'c4'
    }
};

/* 7 НАЧАЛЬНЫХ ЗАДАНИЙ (ЛОГИЧЕСКАЯ ЦЕПОЧКА) */
const INITIAL_QUESTS = [
    { id: 'q_track', title: '🎯 Выбрать карьерный трек в чате с ИИ', xp: 40, done: false },
    { id: 'q_skills', title: '📊 Оценить навыки через опрос ИИ', xp: 50, done: false },
    { id: 'q_ai_ask', title: '💬 Задать любой вопрос реальной нейросети', xp: 30, done: false },
    { id: 'q_rec_course', title: '📚 Пройти курс, рекомендованный вашим планом', xp: 100, done: false },
    { id: 'q_theme', title: '🌓 Переключить тему оформления', xp: 20, done: false },
    { id: 'q_target_rank', title: '🏆 Кликнуть на ранг Team Lead на карте уровней', xp: 25, done: false },
    { id: 'q_gear_tune', title: '⚙️ Поднять ключевой навык своего трека до 75%+', xp: 40, done: false }
];

const ALL_ACHIEVEMENTS = [
    { id: 'first_click', name: 'Первопроходец', icon: '👣', desc: 'Перейти на другую вкладку', unlocked: false },
    { id: 'style', name: 'Мастер стиля', icon: '🌓', desc: 'Сменить тему оформления', unlocked: false },
    { id: 'ai_talk', name: 'Диалог с будущим', icon: '🤖', desc: 'Задать вопрос нейросети', unlocked: false },
    { id: 'skill_tune', name: 'Инженер навыков', icon: '⚙️', desc: 'Оценить любой навык', unlocked: false },
    { id: 'expert_100', name: 'Перфекционист', icon: '💯', desc: 'Довести навык до 100%', unlocked: false },
    { id: 'first_course', name: 'Жажда знаний', icon: '📚', desc: 'Завершить 1 курс', unlocked: false },
    { id: 'quest_master', name: 'Квестоман', icon: '🏆', desc: 'Выполнить задания от ИИ', unlocked: false }
];

/* СОСТОЯНИЕ */
const state = {
    xp: 0,
    level: 0,
    ranks: ['Junior', 'Middle', 'Senior', 'Team Lead'],
    currentRankIndex: 0,
    selectedTrackKey: null,
    skills: {
        leadership: { name: 'Лидерство', percent: 0 },
        pm: { name: 'Управление проектами', percent: 0 },
        tech: { name: 'Технические навыки', percent: 0 },
        interview: { name: 'Проведение собеседований', percent: 0 }
    },
    courses: [...DEFAULT_COURSES],
    quests: JSON.parse(JSON.stringify(INITIAL_QUESTS)),
    achievements: JSON.parse(JSON.stringify(ALL_ACHIEVEMENTS)),
    currentCourse: null,
    editingSkillKey: null,
    botGreeted: false
};

/* НАВИГАЦИЯ */
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-links .nav-item').forEach(b => b.classList.remove('active'));

    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-links .nav-item').forEach(b => {
        if (b.getAttribute('onclick')?.includes(screenId)) b.classList.add('active');
    });

    if (screenId !== 'screen-dashboard') unlockAchievement('first_click');
}

/* ТЕМА */
function toggleTheme() {
    const html = document.documentElement;
    html.classList.toggle('dark');
    html.classList.toggle('light');
    unlockAchievement('style');
    completeQuest('q_theme');
}

/* ОПЫТ И УРОВНИ */
function addXP(amount) {
    state.xp += amount;
    const newLevel = Math.floor(state.xp / 300);
    if (newLevel !== state.level) {
        state.level = newLevel;
        if (state.level < state.ranks.length) selectLevelRank(state.level);
    }
    renderAll();
}

function selectLevelRank(index) {
    state.currentRankIndex = index;
    document.querySelectorAll('.level-circle').forEach((c, idx) => {
        c.classList.toggle('active-level', idx === index);
    });
    if (index === 3) completeQuest('q_target_rank');
    renderAll();
}

/* АЧИВКИ С ТОСТ-АНИМАЦИЕЙ */
function unlockAchievement(achId) {
    const ach = state.achievements.find(a => a.id === achId);
    if (ach && !ach.unlocked) {
        ach.unlocked = true;
        addXP(30);
        showAchievementToast(ach);
        renderAchievements();
    }
}

function showAchievementToast(ach) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast-achievement';
    toast.innerHTML = `
        <div class="toast-icon">${ach.icon}</div>
        <div>
            <div class="toast-title">Достижение получено! (+30 EXP)</div>
            <div class="toast-name">${ach.name}</div>
        </div>
    `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = '0.5s';
        setTimeout(() => toast.remove(), 500);
    }, 3500);
}

function renderAchievements() {
    const grid = document.getElementById('badges-grid');
    if (!grid) return;
    grid.innerHTML = state.achievements.map(a => `
        <div class="badge ${a.unlocked ? 'unlocked' : 'locked'}">
            <div class="badge-icon">${a.icon}</div>
            <div class="badge-name">${a.name}</div>
            <div class="badge-desc">${a.desc}</div>
        </div>
    `).join('');

    const count = state.achievements.filter(a => a.unlocked).length;
    document.getElementById('unlocked-count').textContent = count;
}

/* КВЕСТЫ */
function completeQuest(questId) {
    const q = state.quests.find(item => item.id === questId);
    if (q && !q.done) {
        q.done = true;
        addXP(q.xp);
        renderQuests();

        if (state.quests.every(item => item.done)) {
            unlockAchievement('quest_master');
        }
    }
}

function renderQuests() {
    const container = document.getElementById('quests-list');
    if (!container) return;
    container.innerHTML = state.quests.map(q => `
        <div class="quest-item ${q.done ? 'done' : ''}">
            <span>${q.title}</span>
            <span class="quest-reward">${q.done ? '✅ Выполнено' : `+${q.xp} EXP`}</span>
        </div>
    `).join('');
}

/* ВЫБОР КАРЬЕРНОГО ТРЕКА */
function startTrackSelection() {
    openChat();
    appendMsgWithChips("🎯 Выберите ваш желаемый карьерный трек, чтобы я составил пошаговый план развития:", [
        { text: '👔 Team Lead', action: () => applyTrack('team_lead') },
        { text: '💻 Tech Lead', action: () => applyTrack('tech_lead') },
        { text: '🚀 Уверенный Middle', action: () => applyTrack('fast_middle') }
    ]);
}

function applyTrack(trackKey) {
    state.selectedTrackKey = trackKey;
    const track = CAREER_TRACKS[trackKey];

    // Обновляем баннер на дашборде
    document.getElementById('trackTitle').textContent = track.name;
    document.getElementById('trackDesc').textContent = track.desc;

    completeQuest('q_track');

    // План от ИИ
    const planText = `🎉 Отличный выбор: ${track.name}!\n\n📋 Ваш персональный план развития:\n1. Оцените навыки в профиле.\n2. Пройдите курс «${getCourseById(track.recCourseId)?.name}» (подсвечен золотом!).\n3. Поднимите ключевой навык до 75%+.`;
    appendMsg(planText, 'ai-message');

    renderCourses();
}

function getCourseById(id) {
    return state.courses.find(c => c.id === id);
}

/* КУРСЫ */
function renderCourses() {
    const renderCards = (courses) => courses.map(c => {
        const isRec = state.selectedTrackKey && c.id === CAREER_TRACKS[state.selectedTrackKey]?.recCourseId;
        return `
            <div class="course-card ${isRec ? 'recommended' : ''}" onclick="startCourse('${c.name}', ${c.xp}, '${c.id}')">
                ${isRec ? '<span class="badge-rec">Рекомендовано планом ⭐</span>' : ''}
                <div class="course-title">${c.name}</div>
                <div class="course-meta">
                    <span>🕒 ${c.weeks}</span>
                    <span>⭐ ${c.rating}</span>
                    <span>🎯 +${c.xp} EXP</span>
                </div>
            </div>
        `;
    }).join('');

    const dash = document.getElementById('dashboard-courses-list');
    const all = document.getElementById('all-courses-list');
    if (dash) dash.innerHTML = renderCards(state.courses.slice(0, 2));
    if (all) all.innerHTML = renderCards(state.courses);
}

function startCourse(name, xp, id) {
    state.currentCourse = { name, xp, id };
    document.getElementById('completedCourseName').textContent = name;
    document.getElementById('courseXPReward').textContent = xp;
    openModal('courseCompletionModal');
}

function confirmCourseCompletion() {
    if (!state.currentCourse) return;
    addXP(state.currentCourse.xp);

    if (state.selectedTrackKey && state.currentCourse.id === CAREER_TRACKS[state.selectedTrackKey]?.recCourseId) {
        completeQuest('q_rec_course');
    }

    state.courses = state.courses.filter(c => c.id !== state.currentCourse.id);
    unlockAchievement('first_course');
    closeModal('courseCompletionModal');
    state.currentCourse = null;
    renderCourses();
}

/* НАВЫКИ */
function renderSkills() {
    const renderHtml = (items) => items.map(([key, s]) => `
        <div class="skill-item">
            <div class="skill-header">
                <span>${s.name}</span>
                <div>
                    <span style="${s.percent === 0 ? 'color:var(--text-dim);' : ''}">${s.percent === 0 ? '0% (Не оценён)' : s.percent + '%'}</span>
                    <button type="button" class="edit-skill" onclick="openSkillModal('${key}')">⚙️</button>
                </div>
            </div>
            <div class="progress-bar"><div class="progress-fill" style="width:${s.percent}%"></div></div>
        </div>
    `).join('');

    const entries = Object.entries(state.skills);
    const dash = document.getElementById('dashboard-skills-list');
    const full = document.getElementById('full-skills-list');
    if (dash) dash.innerHTML = renderHtml(entries.slice(0, 2));
    if (full) full.innerHTML = renderHtml(entries);
}

function openSkillModal(key) {
    state.editingSkillKey = key;
    document.getElementById('editingSkillLabel').textContent = `Навык: ${state.skills[key].name}`;
    openModal('skillEditModal');
}

function setSkillLevel(percent) {
    if (!state.editingSkillKey) return;
    state.skills[state.editingSkillKey].percent = percent;
    addXP(20);
    unlockAchievement('skill_tune');
    if (percent === 100) unlockAchievement('expert_100');

    // Проверяем квест на 75%+ ключевого навыка
    if (state.selectedTrackKey && state.editingSkillKey === CAREER_TRACKS[state.selectedTrackKey]?.targetSkill && percent >= 75) {
        completeQuest('q_gear_tune');
    }

    closeModal('skillEditModal');
    renderSkills();
}

/* ИНТЕРАКТИВНЫЙ ОПРОС ПО НАВЫКАМ */
function startSkillAssessment() {
    openChat();
    appendMsg("Давайте быстро откалибруем ваши 4 навыка! С какого начнём?", 'ai-message');
    askSkillInChat('leadership');
}

function askSkillInChat(skillKey) {
    const skill = state.skills[skillKey];
    appendMsgWithChips(`Каков ваш текущий уровень по навыку «${skill.name}»?`, [
        { text: 'Базовый (25%)', action: () => applySkillFromChat(skillKey, 25) },
        { text: 'Средний (50%)', action: () => applySkillFromChat(skillKey, 50) },
        { text: 'Уверенный (75%)', action: () => applySkillFromChat(skillKey, 75) },
        { text: 'Эксперт (100%)', action: () => applySkillFromChat(skillKey, 100) }
    ]);
}

function applySkillFromChat(key, val) {
    state.skills[key].percent = val;
    addXP(25);
    unlockAchievement('skill_tune');
    renderSkills();

    const keys = Object.keys(state.skills);
    const nextIndex = keys.indexOf(key) + 1;

    if (nextIndex < keys.length) {
        appendMsg(`✅ Сохранено: ${state.skills[key].name} = ${val}%! Следующий:`, 'ai-message');
        askSkillInChat(keys[nextIndex]);
    } else {
        appendMsg(`🎉 Все навыки успешно оценены и отображаются в профиле!`, 'ai-message');
        completeQuest('q_skills');
    }
}

/* ================= НАСТОЯЩИЙ ИИ ЧЕРЕЗ REST API ================= */

function openChat() {
    const modal = document.getElementById('chatModal');
    modal.style.display = 'flex';

    if (!state.botGreeted) {
        state.botGreeted = true;
        const chatBox = document.getElementById('chatMessages');
        chatBox.innerHTML = '';
        const welcome = `👋 Привет! Я SkillPilot AI — ваш персональный наставник на базе реальной нейросети.\n\nСейчас ваш опыт: ${state.xp} EXP (${state.ranks[state.currentRankIndex]}).\nЯ помогу составить план, отвечу на любой вопрос или просто поговорю с вами!`;
        appendMsgWithChips(welcome, [
            { text: '🎯 Выбрать карьерный трек', action: () => startTrackSelection() },
            { text: '📊 Оценить мои навыки', action: () => startSkillAssessment() },
            { text: '💡 Дай совет по карьере', action: () => sendMessageDirect('Дай мне полезный карьерный совет') }
        ]);
    }
}

function closeChat() {
    document.getElementById('chatModal').style.display = 'none';
}

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text) return;
    sendMessageDirect(text);
    input.value = '';
}

async function sendMessageDirect(text) {
    appendMsg(text, 'user-message');
    unlockAchievement('ai_talk');
    completeQuest('q_ai_ask');

    const loadingId = 'ai-load-' + Date.now();
    appendLoadingMsg(loadingId);

    try {
        // Запрос к реальной LLM модели (Mistral)
        const realAnswer = await fetchRealAI(text);
        removeLoadingMsg(loadingId);
        appendMsg(realAnswer, 'ai-message');
    } catch (err) {
        removeLoadingMsg(loadingId);
        // Резервный ответ при отсутствии сети
        appendMsg(`Сейчас у вас ${state.xp} EXP (${state.ranks[state.currentRankIndex]}). Рекомендую следовать выбранному карьерному треку на Главной!`, 'ai-message');
    }
}

// Запрос к нейросети через POST
async function fetchRealAI(userPrompt) {
    const trackInfo = state.selectedTrackKey ? CAREER_TRACKS[state.selectedTrackKey].name : 'Трек еще не выбран';
    
    const systemPrompt = `Ты дружелюбный карьерный ИИ-наставник SkillPilot.
Данные пользователя: ${state.xp} EXP, ранг: ${state.ranks[state.currentRankIndex]}, выбранный трек: ${trackInfo}.
Отвечай естественно, умно, по-русски, кратко (2-4 предложения). Поддерживай любые темы, давай карьерные советы и мотивируй развиваться.`;

    const response = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            model: 'mistral'
        })
    });

    if (!response.ok) throw new Error('API Error');
    return await response.text();
}

function appendMsg(text, cls) {
    const box = document.getElementById('chatMessages');
    const el = document.createElement('div');
    el.className = `message ${cls}`;
    el.textContent = text;
    box.appendChild(el);
    box.scrollTop = box.scrollHeight;
}

function appendMsgWithChips(text, chips) {
    const box = document.getElementById('chatMessages');
    const el = document.createElement('div');
    el.className = `message ai-message`;
    el.textContent = text;

    if (chips && chips.length) {
        const chipsContainer = document.createElement('div');
        chipsContainer.className = 'chat-chips';
        chips.forEach(chip => {
            const btn = document.createElement('button');
            btn.className = 'chat-chip';
            btn.textContent = chip.text;
            btn.onclick = () => chip.action();
            chipsContainer.appendChild(btn);
        });
        el.appendChild(chipsContainer);
    }

    box.appendChild(el);
    box.scrollTop = box.scrollHeight;
}

function appendLoadingMsg(id) {
    const box = document.getElementById('chatMessages');
    const el = document.createElement('div');
    el.id = id;
    el.className = 'message ai-message';
    el.style.fontStyle = 'italic';
    el.textContent = '🤖 Нейросеть генерирует ответ...';
    box.appendChild(el);
    box.scrollTop = box.scrollHeight;
}

function removeLoadingMsg(id) {
    document.getElementById(id)?.remove();
}

function autoChat(q, a) {
    openChat();
    appendMsg(q, 'user-message');
    setTimeout(() => appendMsg(a, 'ai-message'), 350);
}

function showLevelInfo() {
    autoChat("Как работают уровни?", "Каждые 300 EXP повышают ранг: Junior → Middle → Senior → Team Lead. Опыт начисляется за квесты, курсы и ачивки!");
}

/* DRAG & DROP ДЛЯ ЧАТА */
(function initDraggableChat() {
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    document.addEventListener('DOMContentLoaded', () => {
        const header = document.getElementById('chatDragHeader');
        const modal = document.getElementById('chatModal');
        if (!header || !modal) return;

        header.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('btn-close-chat')) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = modal.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;
            modal.style.right = 'auto';
            modal.style.left = `${initialLeft}px`;
            modal.style.top = `${initialTop}px`;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            modal.style.left = `${initialLeft + (e.clientX - startX)}px`;
            modal.style.top = `${initialTop + (e.clientY - startY)}px`;
        });

        document.addEventListener('mouseup', () => { isDragging = false; });
    });
})();

/* МОДАЛКИ КУРСОВ И НАВЫКОВ */
function openModal(id) { document.getElementById(id).style.display = 'block'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

/* СБРОС */
function resetProgress() {
    if (!confirm("Сбросить весь прогресс, навыки (на 0%), квесты и ачивки?")) return;
    state.xp = 0; state.level = 0; state.currentRankIndex = 0;
    state.selectedTrackKey = null;
    state.botGreeted = false;
    Object.keys(state.skills).forEach(k => state.skills[k].percent = 0);
    state.courses = [...DEFAULT_COURSES];
    state.quests = JSON.parse(JSON.stringify(INITIAL_QUESTS));
    state.achievements = JSON.parse(JSON.stringify(ALL_ACHIEVEMENTS));

    document.getElementById('trackTitle').textContent = 'Трек не выбран';
    document.getElementById('trackDesc').textContent = 'Выберите цель через ИИ-наставника, чтобы построить план обучения.';

    selectLevelRank(0);
    renderAll();
}

/* РЕНДЕР */
function renderAll() {
    document.querySelectorAll('.user-xp-val').forEach(el => el.textContent = state.xp);
    document.querySelectorAll('.user-level-val').forEach(el => el.textContent = state.level);
    document.querySelectorAll('.user-rank-val').forEach(el => el.textContent = state.ranks[state.currentRankIndex]);
    const lb = document.getElementById('userLeaderboardXP');
    if (lb) lb.textContent = `${state.xp} EXP`;
    const nextElem = document.getElementById('xpToNextLevel');
    if (nextElem) nextElem.textContent = Math.max(0, (state.level + 1) * 300 - state.xp);

    renderSkills();
    renderCourses();
    renderQuests();
    renderAchievements();
}

document.addEventListener('DOMContentLoaded', () => {
    renderAll();
});
