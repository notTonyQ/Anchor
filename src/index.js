import { html } from './html.js';

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // Serve Frontend
        if (url.pathname === '/') {
            return new Response(html, {
                headers: { 'Content-Type': 'text/html' },
            });
        }

        // API: List Tasks
        if (url.pathname === '/api/tasks' && request.method === 'GET') {
            const { results } = await env.DB.prepare(
                'SELECT * FROM tasks ORDER BY target_date ASC'
            ).all();
            return Response.json(results);
        }

        // API: Create Task
        if (url.pathname === '/api/tasks' && request.method === 'POST') {
            const data = await request.json();
            const { title, note, target_date, days_advance, urgency } = data;

            await env.DB.prepare(
                'INSERT INTO tasks (title, note, target_date, days_advance, urgency) VALUES (?, ?, ?, ?, ?)'
            ).bind(title, note, target_date, days_advance || 7, urgency || 'Normal').run();

            return new Response('Created', { status: 201 });
        }

        // API: Update Task (Mark Complete)
        if (url.pathname.startsWith('/api/tasks/') && request.method === 'PATCH') {
            const id = url.pathname.split('/').pop();
            const { status } = await request.json();

            await env.DB.prepare(
                'UPDATE tasks SET status = ? WHERE id = ?'
            ).bind(status, id).run();

            return new Response('Updated', { status: 200 });
        }

        return new Response('Not Found', { status: 404 });
    },

    async scheduled(event, env, ctx) {
        console.log('Cron triggered');

        // Get all active tasks
        const { results: tasks } = await env.DB.prepare(
            "SELECT * FROM tasks WHERE status = 'Active'"
        ).all();

        const today = new Date().toISOString().split('T')[0];

        for (const task of tasks) {
            let shouldRemind = false;
            const targetDate = new Date(task.target_date);
            const now = new Date();

            // Calculate days difference
            const diffTime = targetDate - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // 1. First Reminder
            // Note: diffDays is approximate due to timezones, but good enough for daily check
            // If target is 2023-12-10 and today is 2023-12-03, diff is 7.
            if (diffDays === task.days_advance) {
                shouldRemind = true;
            }

            // 2. Overdue & Active
            if (diffDays < 0) {
                const lastReminded = task.last_reminded_at ? new Date(task.last_reminded_at) : null;

                if (task.urgency === 'Urgent') {
                    // Remind daily if not reminded today
                    if (!lastReminded || lastReminded.toISOString().split('T')[0] !== today) {
                        shouldRemind = true;
                    }
                } else { // Normal
                    // Remind weekly
                    if (!lastReminded) {
                        shouldRemind = true;
                    } else {
                        const daysSinceLast = Math.ceil((now - lastReminded) / (1000 * 60 * 60 * 24));
                        if (daysSinceLast >= 7) {
                            shouldRemind = true;
                        }
                    }
                }
            }

            if (shouldRemind) {
                await sendEmail(env, task);
                // Update last_reminded_at
                await env.DB.prepare(
                    'UPDATE tasks SET last_reminded_at = ? WHERE id = ?'
                ).bind(new Date().toISOString(), task.id).run();
            }
        }
    }
};

async function sendEmail(env, task) {
    if (!env.RESEND_API_KEY) {
        console.log('No Resend API Key, skipping email for:', task.title);
        return;
    }

    const html = `
    <h1>Anchor Reminder: ${task.title}</h1>
    <p><strong>Target Date:</strong> ${task.target_date}</p>
    <p><strong>Urgency:</strong> ${task.urgency}</p>
    <p><strong>Note:</strong> ${task.note || 'None'}</p>
    <p>Please take action or mark as completed in the app.</p>
  `;

    try {
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: env.SENDER_EMAIL || 'onboarding@resend.dev',
                to: 'delivered@resend.dev', // Default to testing email, user should change logic to their email if needed
                subject: `[Anchor] Reminder: ${task.title}`,
                html: html
            })
        });

        if (!res.ok) {
            console.error('Resend Error:', await res.text());
        } else {
            console.log('Email sent for:', task.title);
        }
    } catch (e) {
        console.error('Fetch Error:', e);
    }
}
