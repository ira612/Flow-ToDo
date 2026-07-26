
// ---------- Data ----------
let tasks = [];
let currentFilter = 'all';
let searchQuery = '';
let editingId = null;
let streakCount = 0;
let lastCompletedDate = null;
let isCelebrating = false;

// ---------- DOM refs ----------
const taskList = document.querySelector('#taskList');
const emptyState = document.querySelector('#emptyState');
const taskInput = document.querySelector('#taskInput');
const searchInput = document.querySelector('#searchInput');
const addBtn = document.querySelector('#addBtn');
const addBtnModal = document.querySelector('#addBtnModal');
const closeInput = document.querySelector('#closeInput');
const inputOverlay = document.querySelector('#inputOverlay');
const prioritySelect = document.querySelector('#prioritySelect');
const moodSelect = document.querySelector('#moodSelect');
const dueDateInput = document.querySelector('#dueDateInput');
const remainingCount = document.querySelector('#remainingCount');
const completedCount = document.querySelector('#completedCount');
const totalCount = document.querySelector('#totalCount');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.querySelector('#clearCompletedBtn');
const themeToggle = document.querySelector('#themeToggle');
const themeIcon = document.querySelector('#themeIcon');
const tabBadge = document.querySelector('#tabBadge');
const dashboardProgressFill = document.querySelector('#dashboardProgressFill');
const dashboardProgressText = document.querySelector('#dashboardProgressText');
const streakCountEl = document.querySelector('#streakCount');
const greetingText = document.querySelector('#greetingText');
const greetingSub = document.querySelector('#greetingSub');
const greetingIcon = document.querySelector('#greetingIcon');
const dashboard = document.querySelector('#dashboard');
const quoteText = document.querySelector('#quoteDisplay .quote__text');
const badgeToast = document.querySelector('#badgeToast');
const badgeEmoji = document.querySelector('#badgeEmoji');
const badgeText = document.querySelector('#badgeText');

// ---------- Quotes ----------
const quotes = [
    "Small steps lead to big results.",
    "Stay consistent, even when it's hard.",
    "Every task completed is a victory.",
    "You're doing better than you think.",
    "Flow is the state of pure focus.",
    "Progress, not perfection.",
    "Today's effort is tomorrow's reward.",
    "Start where you are. Use what you have.",
    "One task at a time, you'll get there.",
    "The only way out is through.",
];

// ---------- Sparkle System ----------
const canvas = document.getElementById('sparkleCanvas');
const ctx = canvas.getContext('2d');
let sparkles = [];
let sparkleRunning = false;

function resizeSparkleCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeSparkleCanvas);
resizeSparkleCanvas();

class Sparkle {
    constructor(x, y, color = null) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 8 + 4;
        this.color = color || `hsl(${Math.random() * 60 + 200}, 90%, 70%)`;
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = (Math.random() - 0.5) * 6 - 2;
        this.life = 1;
        this.decay = 0.01 + Math.random() * 0.02;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.05;
        this.rotation += this.rotationSpeed;
        this.life -= this.decay;
        this.size *= 0.99;
    }
    draw() {
        if (this.life <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        const s = this.size;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const r = i % 2 === 0 ? s : s * 0.4;
            ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

function burstSparkles(x, y, count = 30, color = null) {
    if (sparkleRunning) return;
    for (let i = 0; i < count; i++) {
        const sp = new Sparkle(
            x + (Math.random() - 0.5) * 20,
            y + (Math.random() - 0.5) * 20,
            color || `hsl(${Math.random() * 360}, 90%, 70%)`
        );
        sparkles.push(sp);
    }
    if (!sparkleRunning) {
        sparkleRunning = true;
        animateSparkles();
    }
}

function animateSparkles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for (const s of sparkles) {
        s.update();
        if (s.life > 0) {
            alive = true;
            s.draw();
        }
    }
    sparkles = sparkles.filter(s => s.life > 0);
    if (alive) {
        requestAnimationFrame(animateSparkles);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        sparkleRunning = false;
    }
}

// ---------- Theme ----------
function loadTheme() {
    const saved = localStorage.getItem('flow_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    themeIcon.textContent = saved === 'dark' ? '☀️' : '🌙';
}
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    themeIcon.textContent = next === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('flow_theme', next);
}
themeToggle.addEventListener('click', toggleTheme);

// ---------- Greeting ----------
function updateGreeting() {
    const hour = new Date().getHours();
    let icon, text, sub;
    if (hour < 12) {
        icon = '🌅';
        text = 'Good Morning';
        sub = 'Fresh start, fresh flow.';
    } else if (hour < 17) {
        icon = '☀️';
        text = 'Good Afternoon';
        sub = 'Keep the momentum going.';
    } else if (hour < 20) {
        icon = '🌇';
        text = 'Good Evening';
        sub = 'Finish strong tonight.';
    } else {
        icon = '🌙';
        text = 'Good Night';
        sub = 'Rest well, dream big.';
    }
    greetingIcon.textContent = icon;
    greetingText.textContent = text;
    greetingSub.textContent = sub;
}
updateGreeting();

// ---------- Quote ----------
function updateQuote() {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    quoteText.textContent = q;
}
updateQuote();
setInterval(updateQuote, 30000);

// ---------- Streak ----------
function updateStreak() {
    const stored = localStorage.getItem('flow_streak');
    if (stored) {
        try {
            const data = JSON.parse(stored);
            streakCount = data.count || 0;
            lastCompletedDate = data.lastDate || null;
        } catch (_) {}
    }
    if (lastCompletedDate) {
        const last = new Date(lastCompletedDate);
        const todayDate = new Date();
        const diffDays = Math.floor((todayDate - last) / (1000 * 60 * 60 * 24));
        if (diffDays > 1) {
            streakCount = 0;
            lastCompletedDate = null;
            saveStreak();
        }
    }
    streakCountEl.textContent = streakCount;
}

function saveStreak() {
    localStorage.setItem('flow_streak', JSON.stringify({
        count: streakCount,
        lastDate: lastCompletedDate
    }));
}

function incrementStreak() {
    const today = new Date().toDateString();
    if (lastCompletedDate !== today) {
        const last = lastCompletedDate ? new Date(lastCompletedDate) : null;
        const todayDate = new Date();
        const diffDays = last ? Math.floor((todayDate - last) / (1000 * 60 * 60 * 24)) : 1;
        if (diffDays === 0) return;
        if (diffDays === 1) {
            streakCount++;
        } else {
            streakCount = 1;
        }
        lastCompletedDate = today;
        saveStreak();
        streakCountEl.textContent = streakCount;
        if (streakCount > 0 && streakCount % 5 === 0) {
            showBadge('🏆', `${streakCount} Day Streak! 🔥`);
            burstSparkles(window.innerWidth / 2, window.innerHeight / 2, 60);
        }
    }
}

// ---------- Badge Toast ----------
let badgeTimeout = null;

function showBadge(emoji, text) {
    badgeEmoji.textContent = emoji;
    badgeText.textContent = text;
    badgeToast.classList.add('badge-toast--show');
    clearTimeout(badgeTimeout);
    badgeTimeout = setTimeout(() => {
        badgeToast.classList.remove('badge-toast--show');
    }, 3000);
}

// ---------- Relative Date ----------
function getRelativeDate(dateStr) {
    if (!dateStr) return null;
    const due = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((due - today) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return { text: 'Today', type: 'today' };
    if (diffDays === 1) return { text: 'Tomorrow', type: 'tomorrow' };
    if (diffDays === -1) return { text: 'Yesterday', type: 'overdue' };
    if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, type: 'overdue' };
    if (diffDays <= 7) return { text: `${diffDays}d left`, type: 'soon' };
    return { text: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), type: 'normal' };
}


function appendHighlightedText(container, text, query) {
    const q = query.trim();
    if (!q) {
        container.appendChild(document.createTextNode(text));
        return;
    }
    const lowerText = text.toLowerCase();
    const lowerQuery = q.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);
    if (index === -1) {
        container.appendChild(document.createTextNode(text));
        return;
    }
    container.appendChild(document.createTextNode(text.substring(0, index)));
    const mark = document.createElement('span');
    mark.className = 'highlight';
    mark.textContent = text.substring(index, index + q.length);
    container.appendChild(mark);
    container.appendChild(document.createTextNode(text.substring(index + q.length)));
}

// ---------- Save Indicator ----------
let saveIndicatorTimeout = null;

function showSaveStatus(success) {
    let indicator = document.querySelector('.save-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'save-indicator';
        document.body.appendChild(indicator);
    }
    indicator.textContent = success ? '💾 Saved' : '⚠️ Save failed';
    indicator.style.color = success ? '#00B894' : '#FF6B6B';
    indicator.style.opacity = '1';
    indicator.style.transform = 'translateY(0)';
    clearTimeout(saveIndicatorTimeout);
    saveIndicatorTimeout = setTimeout(() => {
        indicator.style.opacity = '0';
        indicator.style.transform = 'translateY(10px)';
    }, 1200);
}

// ================================================================
// ★★★★★ PERSISTENCE — FULLY FIXED ★★★★★
// ================================================================

const STORAGE_KEY = 'flow_todo_data';

function save() {
    try {
        if (!Array.isArray(tasks)) {
            tasks = [];
        }

        const data = {
            tasks: tasks.map(task => ({
                id: task.id,
                text: task.text || 'Untitled',
                completed: task.completed === true, // ⭐ Force boolean
                priority: task.priority || 'medium',
                mood: task.mood || 'focused',
                dueDate: task.dueDate || null,
                createdAt: task.createdAt || Date.now()
            })),
            filter: currentFilter,
            version: '2.0',
            savedAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        console.log(`💾 Saved ${data.tasks.length} tasks (${data.tasks.filter(t => t.completed).length} completed)`);
        showSaveStatus(true);
        return true;
    } catch (error) {
        console.error('❌ Save failed:', error);
        showSaveStatus(false);
        return false;
    }
}


function restore() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            console.log('📭 No saved data found.');
            return false;
        }

        const data = JSON.parse(raw);

        if (!data.tasks || !Array.isArray(data.tasks)) {
            console.warn('⚠️ Invalid data structure.');
            return false;
        }

  
        tasks = data.tasks.map(task => ({
            id: task.id || Date.now() + Math.random() * 1000,
            text: task.text || 'Untitled note',
            completed: task.completed === true, 
            priority: task.priority || 'medium',
            mood: task.mood || 'focused',
            dueDate: task.dueDate || null,
            createdAt: task.createdAt || Date.now()
        }));

        if (data.filter && ['all', 'active', 'completed'].includes(data.filter)) {
            currentFilter = data.filter;
        }

        const completedCount = tasks.filter(t => t.completed).length;
        console.log(`✅ Restored ${tasks.length} tasks (${completedCount} completed)`);
        return true;
    } catch (error) {
        console.error('❌ Restore failed:', error);
        return false;
    }
}


function forceSave() {
    if (!Array.isArray(tasks)) {
        tasks = [];
    }
    tasks = tasks.map(t => ({
        ...t,
        completed: t.completed === true,
        priority: t.priority || 'medium',
        mood: t.mood || 'focused'
    }));
    return save();
}

// ================================================================
// CORE FUNCTIONS
// ================================================================

function addTask() {
    const text = taskInput.value.trim();
    if (!text) {
        taskInput.style.borderColor = '#FF6B6B';
        setTimeout(() => (taskInput.style.borderColor = ''), 500);
        return;
    }

    const task = {
        id: Date.now() + Math.random() * 1000,
        text: text,
        completed: false, // ⭐ New tasks are always incomplete
        priority: prioritySelect.value || 'medium',
        mood: moodSelect.value || 'focused',
        dueDate: dueDateInput.value || null,
        createdAt: Date.now(),
    };

    tasks.push(task);
    taskInput.value = '';
    dueDateInput.value = '';
    closeInputOverlay();
    render();
    forceSave(); // ⭐ Auto-save

    const rect = addBtn.getBoundingClientRect();
    burstSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
}

function deleteTask(id, animate = true) {
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return;

    if (animate) {
        const items = taskList.querySelectorAll('.note-item');
        for (const el of items) {
            if (Number(el.dataset.id) === id) {
                const rect = el.getBoundingClientRect();
                burstSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);
                el.classList.add('note-item--deleting');
                setTimeout(() => {
                    tasks.splice(index, 1);
                    render();
                    forceSave(); // ⭐ Auto-save
                }, 400);
                return;
            }
        }
    }

    tasks.splice(index, 1);
    render();
    forceSave(); 
}

function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

  
    task.completed = !task.completed;


    render();
    forceSave(); 

    // Visual effects
    if (task.completed) {
        const items = taskList.querySelectorAll('.note-item');
        for (const el of items) {
            if (Number(el.dataset.id) === id) {
                const rect = el.getBoundingClientRect();
                burstSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2, 35);
                break;
            }
        }
        incrementStreak();

        const remaining = tasks.filter(t => !t.completed).length;
        if (remaining === 0 && tasks.length > 0) {
            celebrateCompletion();
        }

        const completedCount = tasks.filter(t => t.completed).length;
        if (completedCount === 5) showBadge('🌟', '5 tasks done! Keep flowing!');
        if (completedCount === 10) showBadge('🏅', '10 tasks completed! Amazing!');
        if (completedCount === 25) showBadge('🏆', '25 tasks! You\'re a legend!');
    }
}

function celebrateCompletion() {
    if (isCelebrating) return;
    isCelebrating = true;
    const rect = dashboard.getBoundingClientRect();
    burstSparkles(rect.left + rect.width / 2, rect.top + rect.height / 2, 80);
    showBadge('🎉', 'All tasks complete! You\'re on fire! 🔥');
    dashboard.classList.add('dashboard--celebrate');
    setTimeout(() => {
        dashboard.classList.remove('dashboard--celebrate');
        isCelebrating = false;
    }, 1200);
}

function editTask(id) {
    if (editingId !== null) return;
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const items = taskList.querySelectorAll('.note-item');
    let targetLi = null;
    for (const el of items) {
        if (Number(el.dataset.id) === id) {
            targetLi = el;
            break;
        }
    }
    if (!targetLi) return;

    const textSpan = targetLi.querySelector('.note-item__text');
    const input = document.createElement('input');
    input.className = 'note-item__edit-input';
    input.value = task.text;
    input.style.cssText =
        'flex:1;padding:0.25rem 0.5rem;border:2px solid var(--primary);border-radius:8px;background:var(--surface);font-family:var(--font-hand);font-size:1.1rem;color:var(--text);outline:none;';
    textSpan.replaceWith(input);
    input.focus();
    input.select();
    editingId = id;

    const commitEdit = () => {
        const newText = input.value.trim();
        if (newText) {
            task.text = newText;
            render();
            forceSave();
        } else {
            render();
        }
        editingId = null;
        input.removeEventListener('blur', commitEdit);
        input.removeEventListener('keydown', keydownHandler);
    };

    const keydownHandler = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            commitEdit();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            render();
            editingId = null;
            input.removeEventListener('blur', commitEdit);
            input.removeEventListener('keydown', keydownHandler);
        }
    };

    input.addEventListener('blur', commitEdit);
    input.addEventListener('keydown', keydownHandler);
}

function clearCompleted() {
    const completed = tasks.filter(t => t.completed);
    if (completed.length === 0) return;
    if (confirm(`Clear ${completed.length} completed tasks?`)) {
        tasks = tasks.filter(t => !t.completed);
        render();
        forceSave(); // ⭐ Auto-save
        showBadge('🧹', 'Cleaned up completed task!');
    }
}

function closeInputOverlay() {
    inputOverlay.classList.remove('input-overlay--open');
    taskInput.value = '';
}

// ---------- Render ----------
function render() {
    // Clear the board
    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }

    // Apply filter
    let filtered = tasks.slice();
    if (currentFilter === 'active') {
        filtered = filtered.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filtered = filtered.filter(t => t.completed);
    }

    // Apply search
    if (searchQuery.trim() !== '') {
        const q = searchQuery.trim().toLowerCase();
        filtered = filtered.filter(t => t.text.toLowerCase().includes(q));
    }

    // Empty state
    if (tasks.length === 0) {
        emptyState.classList.add('empty-state--visible');
        const content = emptyState.querySelector('.empty-state__content');
        if (content) {
            content.querySelector('.empty-state__icon').textContent = '🌊';
            content.querySelector('.empty-state__title').textContent = 'No tasks yet';
            content.querySelector('.empty-state__sub').textContent = 'Add your first task';
        }
    } else {
        emptyState.classList.remove('empty-state--visible');
    }

    // No results
    if (filtered.length === 0 && tasks.length > 0) {
        const msg = document.createElement('div');
        msg.className = 'empty-state empty-state--visible';
        msg.style.cssText = 'width:100%;';
        const content = document.createElement('div');
        content.className = 'empty-state__content';
        const icon = document.createElement('span');
        icon.className = 'empty-state__icon';
        icon.textContent = '🔍';
        const title = document.createElement('p');
        title.className = 'empty-state__title';
        title.textContent = 'No notes match';
        const sub = document.createElement('p');
        sub.className = 'empty-state__sub';
        sub.textContent = 'Try a different filter or search.';
        content.appendChild(icon);
        content.appendChild(title);
        content.appendChild(sub);
        msg.appendChild(content);
        taskList.appendChild(msg);
        updateStatsAndProgress();
        updateDashboard();
        updateTabBadge();
        return;
    }

    // Mood emojis
    const moodMap = {
        happy: '😊',
        focused: '🎯',
        chill: '😌',
        energetic: '⚡',
        thoughtful: '🤔'
    };

    // Render each task
    for (const task of filtered) {
        const li = document.createElement('div');
        li.className = 'note-item';
        if (task.completed) {
            li.classList.add('note-item--completed'); 
        }
        li.dataset.id = task.id;
        li.dataset.vibe = task.priority || 'medium';
        li.draggable = true;

        const rot = (Math.random() - 0.5) * 3;
        li.style.setProperty('--rot', `${rot}deg`);

        // Drag handle
        const grip = document.createElement('span');
        grip.className = 'note-item__drag-handle';
        grip.textContent = '⠿';

        // Header
        const header = document.createElement('div');
        header.className = 'note-item__header';

        const checkbox = document.createElement('button');
        checkbox.className = 'note-item__checkbox';
        checkbox.setAttribute('aria-label', task.completed ? 'Mark incomplete' : 'Mark complete');
        checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleComplete(task.id);
        });

        const mood = document.createElement('span');
        mood.className = 'note-item__mood';
        mood.textContent = moodMap[task.mood] || '📝';

        const actions = document.createElement('div');
        actions.className = 'note-item__actions';
        const delBtn = document.createElement('button');
        delBtn.className = 'note-item__delete';
        delBtn.textContent = '✕';
        delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTask(task.id);
        });
        actions.appendChild(delBtn);

        header.appendChild(checkbox);
        header.appendChild(mood);
        header.appendChild(actions);

        // Text
        const textSpan = document.createElement('span');
        textSpan.className = 'note-item__text';
        appendHighlightedText(textSpan, task.text, searchQuery);
        textSpan.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            editTask(task.id);
        });

        // Meta
        const meta = document.createElement('div');
        meta.className = 'note-item__meta';

        if (task.dueDate) {
            const dueInfo = getRelativeDate(task.dueDate);
            if (dueInfo) {
                const due = document.createElement('span');
                due.className = `note-item__due`;
                if (dueInfo.type === 'today') due.classList.add('note-item__due--today');
                else if (dueInfo.type === 'overdue') due.classList.add('note-item__due--overdue');
                due.textContent = dueInfo.text;
                meta.appendChild(due);
            }
        }

        li.appendChild(grip);
        li.appendChild(header);
        li.appendChild(textSpan);
        li.appendChild(meta);

        // Click to select
        li.addEventListener('click', () => {
            const items = taskList.querySelectorAll('.note-item');
            items.forEach(el => el.classList.remove('note-item--selected'));
            li.classList.add('note-item--selected');
        });

        // Drag events
        li.addEventListener('dragstart', handleDragStart);
        li.addEventListener('dragend', handleDragEnd);
        li.addEventListener('dragover', handleDragOver);
        li.addEventListener('dragenter', handleDragEnter);
        li.addEventListener('dragleave', handleDragLeave);
        li.addEventListener('drop', handleDrop);

        taskList.appendChild(li);
    }

    updateStatsAndProgress();
    updateDashboard();
    updateTabBadge();
}

// ---------- Drag & Drop ----------
let draggedItem = null;

function handleDragStart(e) {
    draggedItem = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.dataset.id);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    document.querySelectorAll('.note-item.drag-over').forEach(el => el.classList.remove('drag-over'));
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDragEnter(e) {
    e.preventDefault();
    if (this !== draggedItem) this.classList.add('drag-over');
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    const draggedId = Number(e.dataTransfer.getData('text/plain'));
    const targetId = Number(this.dataset.id);
    if (draggedId === targetId) return;

    const draggedIndex = tasks.findIndex(t => t.id === draggedId);
    const targetIndex = tasks.findIndex(t => t.id === targetId);
    if (draggedIndex === -1 || targetIndex === -1) return;

    const [removed] = tasks.splice(draggedIndex, 1);
    tasks.splice(targetIndex, 0, removed);
    render();
    forceSave(); // ⭐ Auto-save
}

// ---------- Stats ----------
function updateStatsAndProgress() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const remaining = total - completed;

    const updateNumber = (el, val) => {
        if (Number(el.textContent) !== val) {
            el.textContent = val;
            el.style.transform = 'scale(1.2)';
            setTimeout(() => el.style.transform = 'scale(1)', 200);
        } else {
            el.textContent = val;
        }
    };

    updateNumber(remainingCount, remaining);
    updateNumber(completedCount, completed);
    updateNumber(totalCount, total);
}

function updateDashboard() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    dashboardProgressFill.style.width = percent + '%';
    dashboardProgressText.textContent = percent + '%';
}

function updateTabBadge() {
    const remaining = tasks.filter(t => !t.completed).length;
    if (remaining > 0) {
        tabBadge.textContent = remaining;
       document.title = `(${remaining}) Flow · To-Do`;
    } else {
        tabBadge.textContent = '';
       document.title = 'Flow · To-Do';
    }
}

// ---------- Filter & Search ----------
function setFilter(filter) {
    currentFilter = filter;
    filterBtns.forEach(btn => {
        const f = btn.dataset.filter;
        const isActive = f === filter;
        btn.classList.toggle('filter-btn--active', isActive);
    });
    render();
    forceSave(); 
}

function searchTasks() {
    searchQuery = searchInput.value;
    render();
}

// ---------- Keyboard ----------
document.addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea, select')) return;

    if (e.key === 'Delete' || e.key === 'Backspace') {
        const selected = taskList.querySelector('.note-item--selected');
        if (selected) {
            e.preventDefault();
            deleteTask(Number(selected.dataset.id));
        }
    }

    if (e.key === 'e' || e.key === 'E') {
        const selected = taskList.querySelector('.note-item--selected');
        if (selected) {
            e.preventDefault();
            editTask(Number(selected.dataset.id));
        }
    }

    if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        inputOverlay.classList.add('input-overlay--open');
        taskInput.focus();
    }

    if (e.key === 'Escape') {
        closeInputOverlay();
    }
});

// ---------- Event Binding ----------
addBtn.addEventListener('click', () => {
    inputOverlay.classList.add('input-overlay--open');
    taskInput.focus();
});

closeInput.addEventListener('click', closeInputOverlay);

inputOverlay.addEventListener('click', (e) => {
    if (e.target === inputOverlay) closeInputOverlay();
});

addBtnModal.addEventListener('click', addTask);

taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addTask();
    }
});

clearCompletedBtn.addEventListener('click', clearCompleted);
searchInput.addEventListener('input', searchTasks);

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.note-item')) {
        taskList.querySelectorAll('.note-item--selected').forEach(el => el.classList.remove('note-item--selected'));
    }
});

// ================================================================
// INIT — LOAD EVERYTHING
// ================================================================

function init() {
    console.log('🚀 Initializing Flow task...');

    // Load theme
    loadTheme();
    updateGreeting();
    updateQuote();

   
    const hasData = restore();

    if (!hasData) {
        // No saved data — use defaults
        console.log('📝 Creating default tasks...');
        tasks = [{
            id: Date.now() + 1,
            text: 'Welcome to Flow · To-Do✨',
            completed: false,
            priority: 'medium',
            mood: 'happy',
            dueDate: null,
            createdAt: Date.now()
        }, {
            id: Date.now() + 2,
            text: 'Double-click to edit this Task',
            completed: false,
            priority: 'low',
            mood: 'chill',
            dueDate: null,
            createdAt: Date.now()
        }, {
            id: Date.now() + 3,
            text: 'Drag Task to rearrange 🌊',
            completed: false,
            priority: 'high',
            mood: 'energetic',
            dueDate: null,
            createdAt: Date.now()
        }, ];
        currentFilter = 'all';
        forceSave(); 
    }

    
    updateStreak();

    // Set active filter
    filterBtns.forEach(btn => {
        const f = btn.dataset.filter;
        const isActive = f === currentFilter;
        btn.classList.toggle('filter-btn--active', isActive);
    });

   
    render();

    // Check for completion celebration
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    if (total > 0 && completed === total) {
        setTimeout(() => celebrateCompletion(), 600);
    }

    // Welcome badge
    setTimeout(() => {
        if (tasks.length > 0) {
            const completedCount = tasks.filter(t => t.completed).length;
            showBadge('🌊', `${tasks.length} notes loaded (${completedCount} done)`);
        }
    }, 800);

    console.log(`✅ Initialization complete. ${tasks.length} tasks loaded.`);
}

// ⭐ START THE APP
init();
