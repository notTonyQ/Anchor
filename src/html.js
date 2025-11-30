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
        
        /* Card Style */
        .card {
            background: var(--surface);
            padding: 2rem;
            border-radius: var(--radius);
            box-shadow: var(--shadow);
            margin-bottom: 2rem;
            border: 1px solid rgba(255,255,255,0.5);
        }
        
        /* Form */
        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
        }
        .form-group { margin-bottom: 1.25rem; }
        .form-group.full { grid-column: span 2; }
        
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
        button.btn-primary {
            background: var(--primary);
            color: white;
            border: none;
            padding: 0.875rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 1rem;
            width: 100%;
            transition: background 0.2s;
            box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2);
        }
        button.btn-primary:hover { background: var(--primary-hover); }
        
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
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            border: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: transform 0.1s, box-shadow 0.1s;
        }
        .task-item:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .task-info h3 { 
            margin: 0 0 0.4rem 0; 
            font-size: 1.1rem; 
            color: var(--text);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .task-meta { 
            font-size: 0.875rem; 
            color: var(--text-secondary); 
            line-height: 1.4;
        }
        .task-actions { margin-left: 1rem; }
        
        .btn-complete { 
            background: white; 
            color: var(--success); 
            border: 1px solid var(--success);
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        .btn-complete:hover {
            background: var(--success);
            color: white;
        }
        
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
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Anchor</h1>
            <p class="subtitle">长期事项锚点</p>
        </header>
        
        <div class="card">
            <form id="addForm">
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
                    <!-- Placeholder for alignment or another field -->
                </div>

                <div class="form-group">
                    <label>备注</label>
                    <textarea name="note" rows="2" placeholder="备注信息..."></textarea>
                </div>
                <button type="submit" class="btn-primary">添加锚点</button>
            </form>
        </div>

        <div class="tabs">
            <div class="tab active" onclick="switchTab('active')">进行中</div>
            <div class="tab" onclick="switchTab('archived')">已归档</div>
        </div>

        <div id="activeList" class="task-list"></div>
        <div id="archivedList" class="task-list hidden"></div>
    </div>

    <script>
        const API_URL = '/api/tasks';

        async function fetchTasks() {
            try {
                const res = await fetch(API_URL);
                const tasks = await res.json();
                renderTasks(tasks);
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
                const urgencyTag = \`<span class="tag \${task.urgency === 'Urgent' ? 'tag-urgent' : 'tag-normal'}">\${urgencyLabel}</span>\`;
                
                div.innerHTML = \`
                    <div class="task-info">
                        <h3>\${task.title} \${urgencyTag}</h3>
                        <div class="task-meta">
                            目标日期: \${task.target_date} | 提前: \${task.days_advance} 天<br>
                            \${task.note ? \`<span style="margin-top:4px; display:block">\${task.note}</span>\` : ''}
                        </div>
                    </div>
                    <div class="task-actions">
                        \${task.status === 'Active' 
                            ? \`<button class="btn-complete" onclick="markComplete(\${task.id})">标记完成</button>\`
                            : \`<span class="tag tag-completed">已完成</span>\`
                        }
                    </div>
                \`;

                if (task.status === 'Active') {
                    activeList.appendChild(div);
                    activeCount++;
                } else {
                    archivedList.appendChild(div);
                    archivedCount++;
                }
            });

            if (activeCount === 0) activeList.innerHTML = '<div class="empty-state">暂无进行中的锚点</div>';
            if (archivedCount === 0) archivedList.innerHTML = '<div class="empty-state">暂无已归档的锚点</div>';
        }

        async function markComplete(id) {
            if (!confirm('确定将此锚点标记为完成吗？')) return;
            await fetch(\`\${API_URL}/\${id}\`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Completed' })
            });
            fetchTasks();
        }

        document.getElementById('addForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            e.target.reset();
            fetchTasks();
        });

        function switchTab(tab) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelector(\`.tab[onclick="switchTab('\${tab}')"]\`).classList.add('active');
            
            if (tab === 'active') {
                document.getElementById('activeList').classList.remove('hidden');
                document.getElementById('archivedList').classList.add('hidden');
            } else {
                document.getElementById('activeList').classList.add('hidden');
                document.getElementById('archivedList').classList.remove('hidden');
            }
        }

        // Initial load
        fetchTasks();
    </script>
</body>
</html>
`;
