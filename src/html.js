export const loginHtml = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Anchor - 登录</title>
    <style>
        :root {
            --primary: #1e4578;
            --primary-hover: #4338ca;
            --bg: #f3f4f6;
            --surface: #ffffff;
            --text: #1f2937;
            --border: #e5e7eb;
            --radius: 12px;
            --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: var(--bg);
            color: var(--text);
            margin: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .login-card {
            background: var(--surface);
            padding: 2.5rem;
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            width: 100%;
            max-width: 400px;
            text-align: center;
        }
        h1 {
            color: var(--primary);
            margin: 0 0 1.5rem 0;
            font-size: 2rem;
        }
        input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid var(--border);
            border-radius: 8px;
            font-size: 1rem;
            margin-bottom: 1rem;
            box-sizing: border-box;
            transition: border-color 0.2s;
        }
        input:focus {
            outline: none;
            border-color: var(--primary);
        }
        button {
            width: 100%;
            background: var(--primary);
            color: white;
            border: none;
            padding: 0.75rem;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
        }
        button:hover {
            background: var(--primary-hover);
        }
        .error {
            color: #ef4444;
            margin-bottom: 1rem;
            font-size: 0.9rem;
            display: none;
        }
    </style>
</head>
<body>
    <div class="login-card">
        <h1>Anchor</h1>
        <div id="errorMsg" class="error">密码错误</div>
        <form method="POST" action="/login">
            <input type="password" name="password" placeholder="请输入访问密码" required autofocus>
            <button type="submit">进入</button>
        </form>
    </div>
</body>
</html>
`;

export const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Anchor - 长期事项提醒</title>
    <style>
        :root {
            --primary: #1e4578;
            --primary-hover: #4338ca;
            --bg: #f3f4f6;
            --surface: #ffffff;
            --text: #1f2937;
            --text-secondary: #6b7280;
            --border: #e5e7eb;
            --danger: #ef4444;
            --success: #10b981;
            --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --radius: 12px;
        }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: var(--bg);
            color: var(--text);
            margin: 0;
            padding: 40px 20px;
            line-height: 1.6;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: flex-start;
        }
        .container {
            width: 100%;
            max-width: 700px;
            background: transparent;
            padding-bottom: 80px; /* Space for FAB */
        }
        header {
            text-align: center;
            margin-bottom: 2.5rem;
        }
        h1 {
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--primary);
            margin: 0;
            letter-spacing: -0.025em;
        }
        p.subtitle {
            color: var(--text-secondary);
            margin-top: 0.5rem;
            font-size: 1.1rem;
        }

        /* Modal */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            backdrop-filter: blur(4px);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        .modal-overlay.show {
            opacity: 1;
            visibility: visible;
        }
        .modal {
            background: var(--surface);
            padding: 2rem;
            border-radius: var(--radius);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            width: 90%;
            max-width: 500px;
            transform: scale(0.95);
            transition: transform 0.3s ease;
            max-height: 90vh;
            overflow-y: auto;
        }
        .modal-overlay.show .modal {
            transform: scale(1);
        }
        .modal h2 {
            margin-top: 0;
            margin-bottom: 1.5rem;
            color: var(--primary);
        }

        /* Form */
        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        .form-group { margin-bottom: 1.25rem; }
        
        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            font-size: 0.9rem;
            color: var(--text);
        }
        input, select, textarea {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid var(--border);
            border-radius: 8px;
            box-sizing: border-box;
            font-size: 1rem;
            transition: all 0.2s;
            background: #f9fafb;
            font-family: inherit;
        }
        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
            background: #fff;
        }
        
        .form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            margin-top: 2rem;
        }

        button {
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.95rem;
            transition: all 0.2s;
        }
        .btn-primary {
            background: var(--primary);
            color: white;
        }
        .btn-primary:hover { background: var(--primary-hover); }
        
        .btn-cancel {
            background: #e5e7eb;
            color: var(--text);
        }
        .btn-cancel:hover { background: #d1d5db; }

        /* Tabs */
        .tabs {
            display: flex;
            background: #e5e7eb;
            padding: 4px;
            border-radius: 10px;
            margin-bottom: 1.5rem;
        }
        .tab {
            flex: 1;
            text-align: center;
            padding: 8px;
            cursor: pointer;
            border-radius: 8px;
            font-weight: 600;
            color: var(--text-secondary);
            transition: all 0.2s;
            font-size: 0.95rem;
        }
        .tab.active {
            background: var(--surface);
            color: var(--primary);
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        /* Task List */
        .task-list { display: flex; flex-direction: column; gap: 1rem; }
        .task-item {
            background: var(--surface);
            padding: 1.25rem;
            border-radius: 10px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: flex-start; /* Changed to flex-start for better multi-line alignment */
            transition: transform 0.1s, box-shadow 0.1s;
        }
        .task-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .task-info { flex: 1; }
        .task-info h3 {
            margin: 0 0 0.4rem 0;
            font-size: 1.1rem;
            color: var(--text);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex-wrap: wrap;
        }
        .task-meta {
            font-size: 0.875rem;
            color: var(--text-secondary);
            line-height: 1.5;
        }
        .task-actions {
            margin-left: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            min-width: 90px; /* Ensure consistent width for buttons */
        }
        
        .task-actions button {
            width: 100%;
            padding: 6px 12px;
            font-size: 0.8rem;
            border-radius: 6px;
            border: 1px solid transparent;
        }

        .btn-complete {
            background: white;
            color: var(--success);
            border-color: var(--success);
        }
        .btn-complete:hover { background: var(--success); color: white; }

        .btn-edit {
            background: white;
            color: var(--primary);
            border-color: var(--primary);
        }
        .btn-edit:hover { background: var(--primary); color: white; }

        .btn-delete {
            background: white;
            color: var(--danger);
            border-color: var(--danger);
        }
        .btn-delete:hover { background: var(--danger); color: white; }

        .tag {
            display: inline-flex;
            align-items: center;
            padding: 2px 8px;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .tag-urgent { background: #fee2e2; color: #991b1b; }
        .tag-normal { background: #e0f2fe; color: #075985; }
        .tag-completed { background: #f3f4f6; color: #374151; }

        .hidden { display: none; }

        /* FAB */
        .fab {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: var(--primary);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 2rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            transition: transform 0.2s, background 0.2s;
            z-index: 900;
            padding: 0;
        }
        .fab:hover {
            background: var(--primary-hover);
            transform: scale(1.1);
        }

        /* Empty State */
        .empty-state {
            text-align: center;
            padding: 3rem;
            color: var(--text-secondary);
            font-style: italic;
        }

        @media (max-width: 600px) {
            .form-grid { grid-template-columns: 1fr; gap: 0; }
            body { padding: 20px 10px; }
            .task-item { flex-direction: column; }
            .task-actions {
                width: 100%;
                flex-direction: row;
                margin-left: 0;
                margin-top: 1rem;
                justify-content: flex-end;
            }
            .task-actions button { width: auto; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Anchor</h1>
            <p class="subtitle">长期事项锚点</p>
        </header>

        <div class="tabs">
            <div class="tab active" onclick="switchTab('active')">进行中</div>
            <div class="tab" onclick="switchTab('archived')">已归档</div>
        </div>

        <div id="activeList" class="task-list"></div>
        <div id="archivedList" class="task-list hidden"></div>
    </div>

    <!-- Floating Action Button -->
    <button class="fab" onclick="openAddModal()">+</button>

    <!-- Modal -->
    <div id="taskModal" class="modal-overlay">
        <div class="modal">
            <h2 id="modalTitle">添加锚点</h2>
            <form id="taskForm">
                <input type="hidden" name="id">
                <div class="form-group">
                    <label>标题</label>
                    <input type="text" name="title" required placeholder="例如：护照换发、车辆年检">
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label>目标日期</label>
                        <input type="date" name="target_date" required>
                    </div>
                    <div class="form-group">
                        <label>紧急程度</label>
                        <select name="urgency">
                            <option value="Normal">一般 (每周提醒)</option>
                            <option value="Urgent">紧急 (每天提醒)</option>
                        </select>
                    </div>
                </div>

                <div class="form-grid">
                    <div class="form-group">
                        <label>提前提醒天数</label>
                        <input type="number" name="days_advance" value="7" min="1">
                    </div>
                    <div class="form-group">
                        <label>重复周期（天）</label>
                        <input type="number" name="repeat_cycle" value="0" min="0" placeholder="0表示不重复">
                    </div>
                </div>

                <div class="form-group">
                    <label>备注</label>
                    <textarea name="note" rows="3" placeholder="备注信息..."></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn-cancel" onclick="closeModal()">取消</button>
                    <button type="submit" class="btn-primary">保存</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        const API_URL = '/api/tasks';
        let currentTasks = [];

        async function fetchTasks() {
            try {
                const res = await fetch(API_URL);
                currentTasks = await res.json();
                renderTasks(currentTasks);
            } catch (e) {
                console.error("Failed to fetch tasks", e);
            }
        }

        function renderTasks(tasks) {
            const activeList = document.getElementById('activeList');
            const archivedList = document.getElementById('archivedList');

            activeList.innerHTML = '';
            archivedList.innerHTML = '';

            let activeCount = 0;
            let archivedCount = 0;

            tasks.forEach(task => {
                const div = document.createElement('div');
                div.className = 'task-item';
                const urgencyLabel = task.urgency === 'Urgent' ? '紧急' : '一般';
                const repeatInfo = task.repeat_cycle > 0 ? '重复周期: ' + task.repeat_cycle + '天' : '';
                const createdDate = task.created_at ? task.created_at.split(' ')[0] : '';
                const noteInfo = task.note ? '<div style="margin-top:8px; color:var(--text); font-style:italic; font-size:0.9em; border-left: 3px solid var(--border); padding-left: 8px;">' + task.note + '</div>' : '';
                const urgencyTag = '<span class="tag ' + (task.urgency === 'Urgent' ? 'tag-urgent' : 'tag-normal') + '">' + urgencyLabel + '</span>';
                
                // Buttons
                let buttons = '';
                if (task.status === 'Active') {
                    buttons += '<button class="btn-complete" onclick="markComplete(' + task.id + ')">完成</button>';
                    buttons += '<button class="btn-edit" onclick="openEditModal(' + task.id + ')">编辑</button>';
                } else {
                    buttons += '<span class="tag tag-completed" style="display:block; text-align:center; margin-bottom: 0.5rem;">已完成</span>';
                }
                buttons += '<button class="btn-delete" onclick="deleteTask(' + task.id + ')">删除</button>';

                // Meta Info Construction
                let metaHtml = '目标日期: <strong style="color:var(--primary)">' + task.target_date + '</strong>';
                metaHtml += '<br>提前: ' + task.days_advance + ' 天';
                if (repeatInfo) metaHtml += ' | ' + repeatInfo;
                
                div.innerHTML = 
                    '<div class="task-info">' +
                        '<h3>' + task.title + ' ' + urgencyTag + '</h3>' +
                        '<div class="task-meta">' +
                            metaHtml +
                            noteInfo +
                        '</div>' +
                    '</div>' +
                    '<div class="task-actions">' +
                        buttons +
                    '</div>';

                if (task.status === 'Active') {
                    activeList.appendChild(div);
                    activeCount++;
                } else {
                    archivedList.appendChild(div);
                    archivedCount++;
                }
            });

            if (activeCount === 0) activeList.innerHTML = '<div class="empty-state">暂无进行中的锚点<br><small>点击右下角 + 号添加</small></div>';
            if (archivedCount === 0) archivedList.innerHTML = '<div class="empty-state">暂无已归档的锚点</div>';
        }

        // --- Modal Logic ---
        const modalOverlay = document.getElementById('taskModal');
        const taskForm = document.getElementById('taskForm');
        const modalTitle = document.getElementById('modalTitle');

        function openAddModal() {
            taskForm.reset();
            taskForm.elements['id'].value = '';
            // Set default date to 1 week from now
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            taskForm.elements['target_date'].value = nextWeek.toISOString().split('T')[0];
            
            modalTitle.innerText = '添加锚点';
            modalOverlay.classList.remove('hidden');
            // Small delay to allow display:block to apply before adding opacity class
            setTimeout(() => modalOverlay.classList.add('show'), 10);
        }

        function openEditModal(id) {
            const task = currentTasks.find(t => t.id === id);
            if (!task) return;

            taskForm.reset();
            taskForm.elements['id'].value = task.id;
            taskForm.elements['title'].value = task.title;
            taskForm.elements['target_date'].value = task.target_date;
            taskForm.elements['urgency'].value = task.urgency;
            taskForm.elements['days_advance'].value = task.days_advance;
            taskForm.elements['repeat_cycle'].value = task.repeat_cycle;
            taskForm.elements['note'].value = task.note || '';

            modalTitle.innerText = '编辑锚点';
            modalOverlay.classList.remove('hidden');
            setTimeout(() => modalOverlay.classList.add('show'), 10);
        }

        function closeModal() {
            modalOverlay.classList.remove('show');
            setTimeout(() => {
                modalOverlay.classList.add('hidden');
            }, 300);
        }

        // Close modal on clicking outside
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });

        // --- Form Submit ---
        taskForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            const id = data.id;

            try {
                if (id) {
                    // Edit Mode
                    await fetch(API_URL + '/' + id, {
                        method: 'PATCH', // Using PATCH for update as defined in backend
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                } else {
                    // Add Mode
                    await fetch(API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                }
                closeModal();
                fetchTasks();
            } catch (err) {
                alert('Operation failed: ' + err.message);
            }
        });

        // --- Actions ---
        async function markComplete(id) {
            // if (!confirm('确定将此锚点标记为完成吗？')) return; 
            // Removed confirm for smoother UX, or keep it if safer. Let's keep it simple.
            await fetch(API_URL + '/' + id, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Completed' })
            });
            fetchTasks();
        }

        async function deleteTask(id) {
            if (!confirm('确定删除此锚点吗？此操作不可恢复。')) return;
            await fetch(API_URL + '/' + id, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
            fetchTasks();
        }

        function switchTab(tab) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelector('.tab[onclick="switchTab(\\'' + tab + '\\')"]').classList.add('active');

            if (tab === 'active') {
                document.getElementById('activeList').classList.remove('hidden');
                document.getElementById('archivedList').classList.add('hidden');
            } else {
                document.getElementById('activeList').classList.add('hidden');
                document.getElementById('archivedList').classList.remove('hidden');
            }
        }

        // Initial Load
        fetchTasks();
    </script>
</body>
</html>
`;
