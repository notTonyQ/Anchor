import { html, loginHtml } from './html.js';

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // --- Authentication Check ---
        if (env.ACCESS_PASSWORD) {
            // 1. Handle Login POST
            if (url.pathname === '/login' && request.method === 'POST') {
                const formData = await request.formData();
                const password = formData.get('password');

                if (password === env.ACCESS_PASSWORD) {
                    return new Response(null, {
                        status: 302,
                        headers: {
                            'Location': '/',
                            'Set-Cookie': `ANCHOR_AUTH=${env.ACCESS_PASSWORD}; HttpOnly; Path=/; Max-Age=31536000; SameSite=Lax`
                        }
                    });
                } else {
                    // Return login page with error style (simple client-side trick or just re-render)
                    // We can inject a small script or style to show the error if we want, 
                    // or just rely on the user trying again.
                    // Let's inject a style to show the error message div.
                    const errorHtml = loginHtml.replace('display: none;', 'display: block;');
                    return new Response(errorHtml, {
                        headers: { 'Content-Type': 'text/html; charset=utf-8' },
                    });
                }
            }

            // 2. Validate Cookie for all other requests
            const cookie = request.headers.get('Cookie') || '';
            if (!cookie.includes(`ANCHOR_AUTH=${env.ACCESS_PASSWORD}`)) {
                // If API request, return 401
                if (url.pathname.startsWith('/api')) {
                    return new Response('Unauthorized', { status: 401 });
                }
                // Otherwise serve Login Page for browser navigation
                return new Response(loginHtml, {
                    headers: { 'Content-Type': 'text/html; charset=utf-8' },
                });
            }
        }

        // --- Main Application Logic (Authenticated or No Password Set) ---

        // Serve Frontend
        if (url.pathname === '/') {
            return new Response(html, {
                headers: { 'Content-Type': 'text/html; charset=utf-8' },
            });
        }

        // API: List Tasks
        if (url.pathname === '/api/tasks' && request.method === 'GET') {
            const { results } = await env.DB.prepare(
                'SELECT * FROM tasks ORDER BY target_date ASC'
            ).all();
            return new Response(JSON.stringify(results), {
                headers: { 'Content-Type': 'application/json; charset=utf-8' },
            });
        }

        // API: Create Task
        if (url.pathname === '/api/tasks' && request.method === 'POST') {
            const data = await request.json();
            const { title, note, target_date, days_advance, repeat_cycle, urgency } = data;

            await env.DB.prepare(
                'INSERT INTO tasks (title, note, target_date, days_advance, repeat_cycle, urgency) VALUES (?, ?, ?, ?, ?, ?)'
            ).bind(title, note, target_date, days_advance || 7, repeat_cycle || 0, urgency || 'Normal').run();

            return new Response('Created', {
                status: 201,
                headers: { 'Content-Type': 'application/json; charset=utf-8' }
            });
        }

        // API: Delete Task
        if (url.pathname.startsWith('/api/tasks/') && request.method === 'DELETE') {
            const id = url.pathname.split('/').pop();

            await env.DB.prepare(
                'DELETE FROM tasks WHERE id = ?'
            ).bind(id).run();

            return new Response('Deleted', {
                status: 200,
                headers: { 'Content-Type': 'application/json; charset=utf-8' }
            });
        }

        // API: Update Task (Mark Complete or Edit Content)
        if (url.pathname.startsWith('/api/tasks/') && request.method === 'PATCH') {
            const id = url.pathname.split('/').pop();
            const body = await request.json();

            // Scenario 1: Edit Task Content
            if (body.title !== undefined) {
                await env.DB.prepare(
                    'UPDATE tasks SET title=?, note=?, target_date=?, days_advance=?, repeat_cycle=?, urgency=? WHERE id=?'
                ).bind(
                    body.title,
                    body.note,
                    body.target_date,
                    body.days_advance,
                    body.repeat_cycle,
                    body.urgency,
                    id
                ).run();

                return new Response('Updated Content', {
                    status: 200,
                    headers: { 'Content-Type': 'application/json; charset=utf-8' }
                });
            }

            // Scenario 2: Update Status (Mark Complete)
            if (body.status !== undefined) {
                const { status } = body;

                // If marking as Completed and repeat_cycle > 0, create a new task
                if (status === 'Completed') {
                    // Get the task details
                    const { results } = await env.DB.prepare(
                        'SELECT * FROM tasks WHERE id = ?'
                    ).bind(id).all();

                    if (results && results.length > 0) {
                        const task = results[0];

                        // Mark current task as completed
                        await env.DB.prepare(
                            'UPDATE tasks SET status = ? WHERE id = ?'
                        ).bind(status, id).run();

                        // If repeat_cycle > 0, create a new recurring task
                        if (task.repeat_cycle > 0) {
                            // Calculate new target date
                            const newTargetDate = new Date(task.target_date);
                            newTargetDate.setDate(newTargetDate.getDate() + task.repeat_cycle);

                            // Format date to YYYY-MM-DD
                            const newTargetDateStr = newTargetDate.toISOString().split('T')[0];

                            // Create new task with same details but new target date
                            await env.DB.prepare(
                                'INSERT INTO tasks (title, note, target_date, days_advance, repeat_cycle, urgency, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
                            ).bind(
                                task.title,
                                task.note,
                                newTargetDateStr,
                                task.days_advance,
                                task.repeat_cycle,
                                task.urgency,
                                'Active'
                            ).run();
                        }

                        return new Response('Updated Status', {
                            status: 200,
                            headers: { 'Content-Type': 'application/json; charset=utf-8' }
                        });
                    }
                }

                // If not a completion with repeat, just update status normally
                await env.DB.prepare(
                    'UPDATE tasks SET status = ? WHERE id = ?'
                ).bind(status, id).run();

                return new Response('Updated Status', {
                    status: 200,
                    headers: { 'Content-Type': 'application/json; charset=utf-8' }
                });
            }
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

    // Get urgency style based on web app design
    const urgencyStyle = task.urgency === 'Urgent'
        ? `display: inline-block; padding: 4px 12px; background: rgba(239, 68, 68, 0.1); color: #ef4444; font-size: 0.85em; font-weight: 600; border-radius: 4px;`
        : `display: inline-block; padding: 4px 12px; background: rgba(30, 69, 120, 0.1); color: #1e4578; font-size: 0.85em; font-weight: 600; border-radius: 4px;`;

    const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>锚点提醒：${task.title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f3f4f6; color: #1f2937; line-height: 1.6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background: #f3f4f6; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 6px 14px rgba(0,0,0,0.08);">
                    <!-- Header -->
                    <tr>
                        <td style="background: #1e4578; padding: 32px 32px 28px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">📌 Anchor 提醒</h1>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 32px;">
                            <h2 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 700; color: #1f2937; line-height: 1.3;">${task.title}</h2>

                            <div style="margin: 20px 0 24px;">
                                <span style="${urgencyStyle}">${task.urgency === 'Urgent' ? '⚠️ 紧急' : '📅 普通'}</span>
                            </div>

                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; background: #f9fafb; border-radius: 8px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 16px 20px; border-bottom: 1px solid #e5e7eb;">
                                        <span style="color: #6b7280; font-size: 14px; font-weight: 500;">目标日期</span>
                                    </td>
                                    <td style="padding: 16px 20px; border-bottom: 1px solid #e5e7eb; text-align: right;">
                                        <span style="color: #1e4578; font-weight: 700; font-size: 15px;">${task.target_date}</span>
                                    </td>
                                </tr>
                            </table>

                            ${task.note ? `
                            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 3px solid #e5e7eb; margin: 24px 0 0 0;">
                                <div style="color: #6b7280; font-size: 13px; font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">备注</div>
                                <div style="color: #1f2937; line-height: 1.7; font-size: 15px;">${task.note}</div>
                            </div>
                            ` : ''}

                            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                                请在 Anchor 应用中查看详情或标记为已完成。
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="color: #9ca3af; font-size: 13px; margin: 0; font-weight: 500;">此邮件由 Anchor 应用自动发送</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
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
                to: env.RECEIVER_EMAIL || 'delivered@resend.dev', // Default to testing email, user should change logic to their email if needed
                subject: `[Anchor] 提醒: ${task.title}`,
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