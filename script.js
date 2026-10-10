:root.dark {
    --bg: #0b1220; --card: #0f1724; --border: rgba(255,255,255,0.08);
    --text: #e6eef8; --text-dim: #94a3b8; --accent: #7c5cff; --accent-2: #2dd4bf;
    --glass: rgba(255,255,255,0.04); --glass-2: rgba(255,255,255,0.08);
}
:root.light {
    --bg: #f9f6f0; --card: #fefcf8; --border: #e8dfcb;
    --text: #5a5343; --text-dim: #8a8374; --accent: #c9a96e; --accent-2: #b08d57;
    --glass: rgba(0,0,0,0.03); --glass-2: rgba(0,0,0,0.06);
}

* { margin: 0; padding: 0; box-sizing: border-box; }
body { 
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; 
    background: var(--bg); 
    color: var(--text); 
    line-height: 1.5; 
    overflow-x: hidden; /* Защита от горизонтальной прокрутки */
}

.container { max-width: 1200px; margin: 0 auto; padding: 20px; }
.screen { display: none; }
.screen.active { display: block; }

/* Карточки и кнопки */
.card { 
    background: var(--card); border-radius: 14px; padding: 20px; 
    margin-bottom: 20px; border: 1px solid var(--border); 
    box-shadow: 0 4px 15px rgba(0,0,0,0.02); 
}
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; gap: 8px; }
.card-title { font-size: 1.15em; font-weight: 700; }
.btn { 
    background: var(--glass); color: var(--text); border: 1px solid var(--border); 
    padding: 9px 16px; border-radius: 9px; cursor: pointer; font-weight: 600; 
    transition: .2s; user-select: none; 
}
.btn:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.08); }
.btn-primary { background: linear-gradient(90deg, var(--accent), var(--accent-2)); color: #fff; border: none; }
.btn-reset { color: #dc3545; border-color: rgba(220,53,69,0.3); background: rgba(220,53,69,0.08); }
.btn-sm { padding: 6px 12px; font-size: 0.85em; }

/* Хедер */
.header { background: var(--card); border-radius: 14px; padding: 12px 20px; margin-bottom: 20px; border: 1px solid var(--border); }
.nav-container { display: flex; justify-content: space-between; align-items: center; }
.header-top-row { display: flex; align-items: center; gap: 12px; }
.header-actions { display: flex; gap: 8px; align-items: center; }
.logo { font-size: 22px; font-weight: 800; color: var(--accent-2); user-select: none; }
.nav-links { display: flex; gap: 8px; }
.nav-item { 
    color: var(--text-dim); background: transparent; border: none; padding: 8px 14px; 
    border-radius: 9px; font-weight: 600; cursor: pointer; transition: .2s; white-space: nowrap; 
}
.nav-item:hover { background: var(--glass-2); color: var(--text); }
.nav-item.active { background: linear-gradient(90deg, var(--accent), var(--accent-2)); color: #fff; }

.main-grid { display: grid; grid-template-columns: 1fr 340px; gap: 20px; }
.gamification-panel { background: linear-gradient(135deg, rgba(201,169,110,0.15), rgba(176,141,87,0.08)); }
.gamification-header { display: flex; justify-content: space-between; align-items: center; }
.user-xp-title { font-size: 1.25em; font-weight: 700; }
.user-rank-subtitle { font-size: 1em; font-weight: 500; }
.next-level-tip { font-size: 0.9em; color: var(--text-dim); margin-top: 2px; }
.stats-badge { background: var(--glass-2); padding: 6px 12px; border-radius: 20px; border: 1px solid var(--border); font-size: 0.9em; font-weight: 700; white-space: nowrap; }

/* Карточка трека */
.track-banner { background: linear-gradient(135deg, rgba(201,169,110,0.1), rgba(176,141,87,0.04)); border: 2px dashed var(--accent); }
.track-banner-inner { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.track-tag { background: var(--accent); color: white; padding: 3px 8px; border-radius: 6px; font-size: 0.75em; font-weight: 700; text-transform: uppercase; }

/* Квесты */
.quests-list { display: grid; gap: 8px; }
.quest-item { display: flex; justify-content: space-between; align-items: center; background: var(--glass); padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border); transition: .2s; gap: 10px; }
.quest-item.done { opacity: 0.65; background: rgba(40,167,69,0.08); border-color: rgba(40,167,69,0.3); text-decoration: line-through; }
.quest-reward { font-weight: 700; color: var(--accent-2); font-size: 0.9em; white-space: nowrap; }

/* Навыки */
.skill-item { margin-bottom: 14px; }
.skill-header { display: flex; justify-content: space-between; margin-bottom: 6px; font-weight: 600; font-size: 0.95em; }
.edit-skill { cursor: pointer; padding: 2px 7px; border-radius: 6px; background: var(--glass); border: 1px solid var(--border); }
.progress-bar { background: var(--glass); border-radius: 10px; height: 9px; overflow: hidden; }
.progress-fill { background: linear-gradient(90deg, var(--accent), var(--accent-2)); height: 100%; border-radius: 10px; transition: width .3s; }

/* Курсы */
.courses-grid { display: grid; gap: 12px; }
.course-card { background: var(--card); padding: 14px; border-radius: 11px; border: 1px solid var(--border); border-left: 4px solid var(--accent); cursor: pointer; transition: .2s; position: relative; }
.course-card:hover { transform: translateY(-3px); }
.course-card.recommended { border: 2px solid var(--accent); border-left: 6px solid var(--accent); box-shadow: 0 4px 18px rgba(201,169,110,0.25); }
.badge-rec { position: absolute; top: 10px; right: 12px; background: var(--accent); color: white; font-size: 0.72em; padding: 2px 8px; border-radius: 12px; font-weight: 700; }
.course-title { font-weight: 700; margin-bottom: 4px; padding-right: 90px; }
.course-meta { display: flex; gap: 10px; color: var(--text-dim); font-size: 0.85em; flex-wrap: wrap; }

/* Достижения */
.badges-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.badge { background: var(--card); padding: 12px 8px; border-radius: 12px; text-align: center; border: 1px solid var(--border); transition: all .3s; }
.badge.locked { opacity: 0.4; filter: grayscale(1); }
.badge.unlocked { border-color: var(--accent); background: linear-gradient(135deg, rgba(201,169,110,0.12), transparent); box-shadow: 0 4px 12px rgba(201,169,110,0.2); animation: badgePop 0.5s ease-out; }
.badge-icon { font-size: 1.8em; margin-bottom: 2px; }
.badge-name { font-size: 0.8em; font-weight: 700; }
.badge-desc { font-size: 0.72em; color: var(--text-dim); margin-top: 3px; }

@keyframes badgePop { 0% { transform: scale(0.85); } 50% { transform: scale(1.15); } 100% { transform: scale(1); } }

/* Toast */
#toast-container { position: fixed; top: 20px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
.toast-achievement { 
    background: var(--card); border: 2px solid var(--accent); box-shadow: 0 8px 30px rgba(0,0,0,0.25); 
    border-radius: 14px; padding: 14px 18px; display: flex; align-items: center; gap: 12px; min-width: 280px; 
    animation: slideInToast 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28); pointer-events: auto;
}
.toast-icon { font-size: 2.2em; }
.toast-title { font-size: 0.78em; text-transform: uppercase; color: var(--accent-2); font-weight: 800; }
.toast-name { font-weight: 700; font-size: 1.05em; }

@keyframes slideInToast { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

/* Уровни */
.level-system { text-align: center; padding: 15px; }
.level-path { display: grid; grid-template-columns: repeat(4, 1fr); position: relative; margin: 15px 0; }
.level-path::before { content: ''; position: absolute; top: 20px; left: 12%; right: 12%; height: 3px; background: var(--border); z-index: 1; }
.level-stage { display: flex; flex-direction: column; align-items: center; gap: 6px; z-index: 2; }
.level-circle { width: 42px; height: 42px; border-radius: 50%; background: var(--card); border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; font-weight: 700; cursor: pointer; transition: .2s; }
.level-circle.active-level { background: linear-gradient(90deg, var(--accent), var(--accent-2)); color: white; border-color: transparent; transform: scale(1.15); box-shadow: 0 4px 14px rgba(0,0,0,0.15); }
.level-label { font-size: 0.85em; font-weight: 600; }

.leaderboard-horizontal { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.leaderboard-user { background: var(--card); padding: 12px; border-radius: 10px; text-align: center; border: 1px solid var(--border); }
.leaderboard-avatar { width: 40px; height: 40px; border-radius: 50%; margin: 4px auto; background: var(--glass); display: flex; align-items: center; justify-content: center; font-size: 1.2em; }
.leaderboard-name { font-weight: 700; font-size: 0.9em; }
.leaderboard-xp { color: var(--accent-2); font-weight: 700; font-size: 0.85em; }

.modal { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: var(--card); border-radius: 14px; padding: 18px; z-index: 1002; min-width: 360px; max-width: 90vw; border: 1px solid var(--border); box-shadow: 0 10px 40px rgba(0,0,0,0.25); }

/* ПЕРЕМЕЩАЕМОЕ И РАСТЯГИВАЕМОЕ ОКНО ЧАТА (ДЛЯ ПК) */
.ai-chat-widget { 
    position: fixed; bottom: 20px; right: 20px; background: linear-gradient(90deg, var(--accent), var(--accent-2)); 
    color: white; padding: 12px 20px; border-radius: 50px; cursor: pointer; font-weight: 700; z-index: 1000; 
    box-shadow: 0 6px 20px rgba(0,0,0,0.15); user-select: none;
}

.chat-modal {
    display: none; position: fixed; top: 12%; right: 25px; width: 440px; height: 530px;
    min-width: 320px; min-height: 380px; background: var(--card);
    border-radius: 16px; border: 2px solid var(--border); box-shadow: 0 12px 45px rgba(0,0,0,0.28);
    z-index: 1050; resize: both; overflow: hidden; flex-direction: column;
}

/* Режим во весь экран (ПК) */
.chat-modal.maximized {
    top: 15px !important; left: 15px !important; right: 15px !important; bottom: 15px !important;
    width: calc(100vw - 30px) !important; height: calc(100vh - 30px) !important;
    max-width: none !important; max-height: none !important; resize: none !important;
}

.chat-drag-header {
    background: var(--glass-2); padding: 12px 16px; border-bottom: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center; cursor: grab; user-select: none;
}
.chat-drag-header:active { cursor: grabbing; }

.chat-status-pill {
    font-size: 0.72em; background: rgba(40,167,69,0.12); color: #28a745; border: 1px solid rgba(40,167,69,0.3);
    padding: 2px 7px; border-radius: 10px; font-weight: 700;
}

.btn-win-ctrl {
    background: transparent; border: none; font-size: 1.05em; cursor: pointer; color: var(--text-dim); padding: 2px 6px; border-radius: 6px;
}
.btn-win-ctrl:hover { color: var(--text); background: var(--glass); }

.chat-messages { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 10px; }
.message { padding: 10px 14px; border-radius: 12px; max-width: 86%; font-size: 0.92em; white-space: pre-wrap; line-height: 1.45; }
.user-message { background: linear-gradient(90deg, var(--accent), var(--accent-2)); color: white; align-self: flex-end; }
.ai-message { background: var(--glass-2); border: 1px solid var(--border); align-self: flex-start; }

.chat-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.chat-chip {
    background: var(--card); border: 1px solid var(--accent); color: var(--text);
    padding: 5px 10px; border-radius: 8px; font-size: 0.85em; font-weight: 600; cursor: pointer; transition: .2s;
}
.chat-chip:hover { background: var(--accent); color: white; }

.chat-input-bar { display: flex; padding: 12px; gap: 8px; border-top: 1px solid var(--border); background: var(--card); }
.chat-input-bar input { flex: 1; padding: 9px 12px; border: 1px solid var(--border); border-radius: 8px; background: transparent; color: var(--text); outline: none; }
.chat-input-bar input:focus { border-color: var(--accent); }

/* ================= АДАПТАЦИЯ ПОД ПЛАНШЕТЫ И ТЕЛЕФОНЫ ================= */

@media (max-width: 850px) {
    .main-grid { grid-template-columns: 1fr; }
    .leaderboard-horizontal { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
    .container { padding: 12px 10px; }
    
    /* Шапка на телефоне */
    .header { padding: 10px 12px; margin-bottom: 14px; }
    .nav-container { flex-direction: column; align-items: stretch; gap: 10px; }
    .header-top-row { justify-content: space-between; }
    .logo { font-size: 20px; }
    
    /* Меню вкладок: плавная горизонтальная прокрутка пальцем */
    .nav-links { 
        display: flex; gap: 6px; overflow-x: auto; 
        padding-bottom: 2px; -webkit-overflow-scrolling: touch; 
    }
    .nav-links::-webkit-scrollbar { display: none; } /* скрыть скроллбар */
    .nav-item { padding: 7px 12px; font-size: 0.88em; flex-shrink: 0; }
    
    .card { padding: 16px 14px; margin-bottom: 14px; border-radius: 12px; }
    .card-title { font-size: 1.05em; }

    /* Баннер трека на телефоне */
    .track-banner-inner { flex-direction: column; align-items: flex-start; }
    .track-btn { width: 100%; margin-top: 6px; text-align: center; }

    /* Дорожная карта на телефоне */
    .level-path::before { top: 16px; left: 10%; right: 10%; }
    .level-circle { width: 34px; height: 34px; font-size: 0.8em; }
    .level-label { font-size: 0.72em; }

    /* Карточки курсов */
    .course-title { padding-right: 0; margin-bottom: 6px; }
    .badge-rec { position: static; display: inline-block; margin-bottom: 6px; }

    /* Таблица лидеров */
    .leaderboard-horizontal { grid-template-columns: repeat(2, 1fr); gap: 8px; }
    .leaderboard-user { padding: 8px; font-size: 0.85em; }
    .leaderboard-avatar { width: 34px; height: 34px; font-size: 1em; }

    /* ЧАТ НА ТЕЛЕФОНЕ: ПРЕВРАЩАЕТСЯ В УДОБНУЮ МОБИЛЬНУЮ ШТОРКУ */
    .chat-modal {
        position: fixed !important;
        top: auto !important;
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        height: 85vh !important;
        min-width: 100% !important;
        max-width: 100vw !important;
        border-radius: 18px 18px 0 0 !important;
        resize: none !important; /* На телефоне растягивать не нужно */
        box-shadow: 0 -10px 40px rgba(0,0,0,0.3) !important;
    }
    .btn-max-ctrl { display: none !important; } /* Скрыть кнопку максимизации на телефоне */
    .chat-drag-header { cursor: default; }

    /* Уведомления ачивок на телефоне */
    #toast-container { left: 12px; right: 12px; top: 12px; }
    .toast-achievement { min-width: auto; width: 100%; padding: 10px 14px; }
    
    /* Модалки */
    .modal { width: 92vw; min-width: auto; padding: 16px; }
}
