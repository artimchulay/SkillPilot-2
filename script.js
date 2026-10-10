/* СОСТОЯНИЕ */
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
    currentCourse: null,
    editingSkillKey: null
};

/* ОТВЕТЫ ИИ */
const aiFallbacks = [
    "Отличная идея! Рекомендую составить расписание для регулярного обучения.",
    "Чтобы ускорить рост от Junior к Middle, сосредоточьтесь на практических проектах.",
    "Навык коммуникации часто становится решающим для перехода на уровень Lead.",
    "Не забывайте проходить челленджи — это самый быстрый способ получить опыт EXP."
];
let fallbackIndex = 0;

/* НАВИГАЦИЯ */
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));

    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-links a').forEach(a => {
        if (a.getAttribute('onclick') && a.getAttribute('onclick').includes(screenId)) {
            a.classList.add('active');
        }
    });
}

/* ТЕМА */
function toggleTheme() {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        html.classList.add('light');
    } else {
        html.classList.remove('light');
        html.classList.add('dark');
    }
}

/* ОПЫТ И УРОВНИ */
function addXP(amount) {
    state.xp += amount;
    
    // Проверка перехода на новый уровень (каждые 300 EXP)
    const newLevel = Math.floor(state.xp / 300);
    if (newLevel !== state.level) {
        state.level = newLevel;
        if (state.level < state.ranks.length) {
            selectLevelRank(state.level);
        }
    }

    renderUserStats();
}

function renderUserStats() {
    document.querySelectorAll('.user-xp-val').forEach(el => el.textContent = state.xp);
    document.querySelectorAll('.user-level-val').forEach(el => el.textContent = state.level);
    
    const userLB = document.getElementById('userLeaderboardXP');
    if (userLB) userLB.textContent = state.xp + ' EXP';

    const nextXP = (state.level + 1) * 300 - state.xp;
    const nextElem = document.getElementById('xpToNextLevel');
    if (nextElem) nextElem.textContent = nextXP > 0 ? nextXP : 0;
}

function selectLevelRank(index) {
    state.currentRankIndex = index;
    const circles = document.querySelectorAll('.level-circle');
    circles.forEach((c, idx) => {
        if (idx === index) c.classList.add('active-level');
        else c.classList.remove('active-level');
    });

    const rankName = state.ranks[index] || 'Lead';
    document.querySelectorAll('.user-rank-val').forEach(el => el.textContent = rankName);
}

/* КУРСЫ */
function startCourse(name, xp, courseId) {
    state.currentCourse = { name, xp, id: courseId };
    document.getElementById('completedCourseName').textContent = name;
    document.getElementById('courseXPReward').textContent = xp;
    openModal('courseCompletionModal');
}

function confirmCourseCompletion() {
    if (!state.currentCourse) return;
    
    addXP(state.currentCourse.xp);

    // Удаляем карточки завершённого курса отовсюду
    const cards = document.querySelectorAll(`.course-card[data-course-id="${state.currentCourse.id}"]`);
    cards.forEach(card => card.remove());

    closeModal('courseCompletionModal');
    state.currentCourse = null;
}

/* НАВЫКИ */
function renderSkills() {
    const dashContainer = document.getElementById('dashboard-skills-list');
    const fullContainer = document.getElementById('full-skills-list');
    
    if (dashContainer) dashContainer.innerHTML = '';
    if (fullContainer) fullContainer.innerHTML = '';

    Object.entries(state.skills).forEach(([key, skill], index) => {
        const itemHtml = `
            <div class="skill-item">
                <div class="skill-header">
                    <span class="skill-name">${skill.name}</span>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span class="skill-percent">${skill.percent}%</span>
                        <button class="edit-skill" onclick="openSkillModal('${key}')">⚙️</button>
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${skill.percent}%"></div>
                </div>
            </div>
        `;

        if (fullContainer) fullContainer.insertAdjacentHTML('beforeend', itemHtml);
        // В дашборде выводим первые два навыка
        if (dashContainer && index < 2) {
            dashContainer.insertAdjacentHTML('beforeend', itemHtml);
        }
    });
}

function openSkillModal(skillKey) {
    state.editingSkillKey = skillKey;
    const skill = state.skills[skillKey];
    const label = document.getElementById('editingSkillLabel');
    if (label && skill) label.textContent = `Изменение уровня: ${skill.name}`;
    openModal('skillEditModal');
}

function setSkillLevel(percent) {
    if (!state.editingSkillKey) return;
    state.skills[state.editingSkillKey].percent = percent;
    renderSkills();
    addXP(15); // Бонус за обновление навыка
    closeModal('skillEditModal');
    state.editingSkillKey = null;
}

/* ЧЕЛЛЕНДЖИ */
function toggleChallenge(checkbox, xpReward) {
    checkbox.classList.toggle('checked');
    if (checkbox.classList.contains('checked')) {
        checkbox.textContent = '✓';
        addXP(xpReward);
    } else {
        checkbox.textContent = '';
    }
}

function refreshChallenges() {
    document.querySelectorAll('.challenge-checkbox').forEach(box => {
        box.classList.remove('checked');
        box.textContent = '';
    });
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

/* ЧАТ С ИИ */
function openChat() {
    openModal('chatModal');
}

function closeChat() {
    closeModal('chatModal');
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text) return;

    appendMessage(text, 'user-message');
    input.value = '';

    setTimeout(() => {
        let answer = "";
        const lower = text.toLowerCase();
        if (lower.includes('курс')) answer = 'Рекомендую курс "Продвинутый курс лидерства".';
        else if (lower.includes('навык')) answer = 'Сфокусируйтесь на развитии технических навыков и коммуникации.';
        else if (lower.includes('план')) answer = 'Я составил рекомендацию: начните с 1 курса и выполняйте челленджи!';
        else {
            answer = aiFallbacks[fallbackIndex];
            fallbackIndex = (fallbackIndex + 1) % aiFallbacks.length;
        }
        appendMessage(answer, 'ai-message');
    }, 450);
}

function appendMessage(text, className) {
    const container = document.getElementById('chatMessages');
    const msg = document.createElement('div');
    msg.className = `message ${className}`;
    msg.textContent = text;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
}

function autoChat(userQuery, aiReply) {
    openChat();
    appendMessage(userQuery, 'user-message');
    setTimeout(() => appendMessage(aiReply, 'ai-message'), 350);
}

function openSkillEditor() {
    autoChat("Создать план развития", "Давайте создадим план. Рекомендую начать с повышения уровня Лидерства через курсы.");
}

function showLevelInfo() {
    autoChat("Расскажи о системе уровней", "Уровни: Junior → Middle → Senior → Team Lead. Вы получаете опыт EXP за прохождение курсов и челленджи!");
}

/* СТАРТ */
document.addEventListener('DOMContentLoaded', () => {
    renderSkills();
    renderUserStats();
});
