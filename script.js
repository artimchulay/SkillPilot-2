/* БАЗОВЫЕ КУРСЫ */
const DEFAULT_COURSES = [
    { id: 'c1', name: 'Продвинутый курс лидерства', xp: 200, weeks: '8 нед.', rating: 4.8 },
    { id: 'c2', name: 'Управление проектами', xp: 150, weeks: '6 нед.', rating: 4.6 },
    { id: 'c3', name: 'Эффективные коммуникации', xp: 120, weeks: '4 нед.', rating: 4.9 }
];

/* 7 БЫСТРЫХ ДОСТИЖЕНИЙ */
const ALL_ACHIEVEMENTS = [
    { id: 'first_click', name: 'Первопроходец', icon: '👣', desc: 'Перейти на другую вкладку', unlocked: false },
    { id: 'style', name: 'Мастер стиля', icon: '🌓', desc: 'Сменить тему оформления', unlocked: false },
    { id: 'ai_talk', name: 'Диалог с будущим', icon: '🤖', desc: 'Задать вопрос ИИ', unlocked: false },
    { id: 'skill_tune', name: 'Инженер навыков', icon: '⚙️', desc: 'Изменить любой навык', unlocked: false },
    { id: 'expert_100', name: 'Перфекционист', icon: '💯', desc: 'Довести навык до 100%', unlocked: false },
    { id: 'first_course', name: 'Жажда знаний', icon: '📚', desc: 'Завершить 1 курс', unlocked: false },
    { id: 'quest_master', name: 'Квестоман', icon: '🏆', desc: 'Выполнить задания от ИИ', unlocked: false }
];

/* БОЛЬШОЙ ПУЛ ДЛЯ ГЕНЕРАТОРА ЗАДАЧ */
const QUEST_POOL = [
    { id: 'q_theme', title: '🌓 Переключить тему оформления', xp: 20 },
    { id: 'q_skills', title: '👁️ Заглянуть во вкладку «Навыки»', xp: 25 },
    { id: 'q_ai_ask', title: '💬 Спросить ИИ: "какой прогресс?"', xp: 30 },
    { id: 'q_gear', title: '⚙️ Настроить любой навык через ⚙️', xp: 35 },
    { id: 'q_rank', title: '🎯 Кликнуть на ранг Senior во вкладке Уровни', xp: 25 },
    { id: 'q_course', title: '📚 Завершить любой доступный курс', xp: 50 },
    { id: 'q_advice', title: '💡 Спросить ИИ: "дай совет дня"', xp: 30 }
];

/* СОСТОЯНИЕ ПРИЛОЖЕНИЯ */
const state = {
    xp: 0,
    level: 0,
    ranks: ['Junior', 'Middle', 'Senior', 'Team Lead'],
    currentRankIndex: 0,
    skills: {
        leadership: { name: 'Лидерство', percent: 80 },
        pm: { name: 'Управление проектами', percent: 65 },
        tech: { name: 'Технические навыки', percent: 90 },
        interview: { name: 'Проведение собеседований', percent: 50 }
    },
    courses: [...DEFAULT_COURSES],
    activeQuests: [],
    achievements: JSON.parse(JSON.stringify(ALL_ACHIEVEMENTS)),
    currentCourse: null,
    editingSkillKey: null,
    botGreeted: false // флаг первого знакомства
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
    if (screenId === 'screen-skills') completeQuestByTitle('Навыки');
}

/* ПЕРЕКЛЮЧЕНИЕ ТЕМЫ */
function toggleTheme() {
    const html = document.documentElement;
    html.classList.toggle('dark');
    html.classList.toggle('light');
    unlockAchievement('style');
    completeQuestByTitle('тему');
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
    if (index === 2) completeQuestByTitle('Senior');
    renderAll();
}

/* АЧИВКИ С АНИМАЦИЕЙ */
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
            <div class="toast-title">Достижение разблокировано! (+30 EXP)</div>
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
    const countElem = document.getElementById('unlocked-count');
    if (countElem) countElem.textContent = count;
}

/* КВЕСТЫ ОТ ИИ */
function generateNewQuests() {
    const shuffled = [...QUEST_POOL].sort(() => 0.5 - Math.random());
    state.activeQuests = shuffled.slice(0, 4).map(q => ({ ...q, done: false }));
    renderQuests();

    const btn = document.getElementById('btn-ai-quests');
    if (btn) btn.style.display = 'none';
}

function completeQuestByTitle(keyword) {
    const quest = state.activeQuests.find(q => !q.done && q.title.toLowerCase().includes(keyword.toLowerCase()));
    if (quest) {
        quest.done = true;
        addXP(quest.xp);
        renderQuests();

        if (state.activeQuests.every(q => q.done)) {
            unlockAchievement('quest_master');
            const btn = document.getElementById('btn-ai-quests');
            if (btn) btn.style.display = 'inline-block';
        }
    }
}

function renderQuests() {
    const container = document.getElementById('quests-list');
    if (!container) return;
    container.innerHTML = state.activeQuests.map(q => `
        <div class="quest-item ${q.done ? 'done' : ''}">
            <span>${q.title}</span>
            <span class="quest-reward">${q.done ? '✅ Выполнено' : `+${q.xp} EXP`}</span>
        </div>
    `).join('');
}

/* КУРСЫ */
function renderCourses() {
    const renderCards = (courses) => courses.map(c => `
        <div class="course-card" onclick="startCourse('${c.name}', ${c.xp}, '${c.id}')">
            <div class="course-title">${c.name}</div>
            <div class="course-meta">
                <span>🕒 ${c.weeks}</span>
                <span>⭐ ${c.rating}</span>
                <span>🎯 +${c.xp} EXP</span>
            </div>
        </div>
    `).join('');

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
    state.courses = state.courses.filter(c => c.id !== state.currentCourse.id);
    unlockAchievement('first_course');
    completeQuestByTitle('курс');
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
                    <span>${s.percent}%</span>
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
    addXP(15);
    unlockAchievement('skill_tune');
    if (percent === 100) unlockAchievement('expert_100');
    completeQuestByTitle('навык');
    closeModal('skillEditModal');
    renderSkills();
}

/* ================= НАСТОЯЩИЙ ИИ + САМОПРЕЗЕНТАЦИЯ ================= */

function openChat() {
    openModal('chatModal');
    
    // Бот представляется при первом открытии диалога
    if (!state.botGreeted) {
        state.botGreeted = true;
        const chatBox = document.getElementById('chatMessages');
        chatBox.innerHTML = ''; // очищаем
        const intro = `👋 Здравствуйте! Я SkillPilot AI — ваш персональный карьерный наставник на базе реальной нейросети.\n\nСейчас ваш статус: ${state.xp} EXP (${state.ranks[state.currentRankIndex]}).\nЯ могу составить план обучения, оценить прогресс или просто поболтать. О чем хотите поговорить?`;
        appendMsg(intro, 'ai-message');
    }

    setTimeout(() => {
        document.getElementById('messageInput')?.focus();
    }, 100);
}

function closeChat() {
    closeModal('chatModal');
}

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text) return;

    appendMsg(text, 'user-message');
    input.value = '';

    unlockAchievement('ai_talk');
    completeQuestByTitle('ИИ');

    const loadingId = 'ai-loading-' + Date.now();
    appendLoadingMsg(loadingId);

    try {
        const realAnswer = await fetchRealAI(text);
        removeLoadingMsg(loadingId);
        appendMsg(realAnswer, 'ai-message');
    } catch (err) {
        removeLoadingMsg(loadingId);
        appendMsg(`Ваш текущий опыт: ${state.xp} EXP (${state.ranks[state.currentRankIndex]}). Я готов помочь вам с карьерным планом и курсами!`, 'ai-message');
    }
}

async function fetchRealAI(userPrompt) {
    const systemInstruction = `Ты дружелюбный ИИ-наставник на платформе SkillPilot. 
Пользователь имеет: ${state.xp} EXP, ранг: ${state.ranks[state.currentRankIndex]}. 
Отвечай свободно, по-русски, живо, давай дельные карьерные советы, поддерживай любую беседу. Ответ должен быть емким (2-4 предложения).`;

    const url = `https://text.pollinations.ai/${encodeURIComponent(userPrompt)}?system=${encodeURIComponent(systemInstruction)}&model=mistral`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("API error");
    return await response.text();
}

function appendLoadingMsg(id) {
    const box = document.getElementById('chatMessages');
    const el = document.createElement('div');
    el.id = id;
    el.className = 'message ai-message';
    el.style.fontStyle = 'italic';
    el.style.opacity = '0.7';
    el.textContent = '🤖 ИИ думает...';
    box.appendChild(el);
    box.scrollTop = box.scrollHeight;
}

function removeLoadingMsg(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function appendMsg(text, cls) {
    const box = document.getElementById('chatMessages');
    const el = document.createElement('div');
    el.className = `message ${cls}`;
    el.textContent = text;
    box.appendChild(el);
    box.scrollTop = box.scrollHeight;
}

function autoChat(q, a) {
    openChat();
    appendMsg(q, 'user-message');
    setTimeout(() => appendMsg(a, 'ai-message'), 350);
}

function openSkillEditor() {
    autoChat("Помоги составить план", "Рекомендую начать с закрытия квестов от ИИ на Главной и поднять навык Лидерства до 100%!");
}

function showLevelInfo() {
    autoChat("Как работают уровни?", "Каждые 300 EXP повышают ранг: Junior → Middle → Senior → Team Lead. Опыт начисляется за курсы, квесты и ачивки!");
}

/* МОДАЛЬНЫЕ ОКНА */
function openModal(id) {
    document.getElementById(id).style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
    const anyOpen = Array.from(document.querySelectorAll('.modal, .chat-modal')).some(m => m.style.display === 'block');
    if (!anyOpen) document.getElementById('overlay').style.display = 'none';
}

function closeAllModals() {
    document.querySelectorAll('.modal, .chat-modal').forEach(m => m.style.display = 'none');
    document.getElementById('overlay').style.display = 'none';
}

/* СБРОС ПРОГРЕССА */
function resetProgress() {
    if (!confirm("Сбросить весь опыт, ачивки и квесты на 0?")) return;
    state.xp = 0;
    state.level = 0;
    state.currentRankIndex = 0;
    state.botGreeted = false;
    state.courses = [...DEFAULT_COURSES];
    state.achievements = JSON.parse(JSON.stringify(ALL_ACHIEVEMENTS));
    selectLevelRank(0);
    generateNewQuests();
    renderAll();
}

/* ОБЩИЙ РЕНДЕР */
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
    renderAchievements();
}

/* ИНИЦИАЛИЗАЦИЯ */
document.addEventListener('DOMContentLoaded', () => {
    generateNewQuests();
    renderAll();
});
