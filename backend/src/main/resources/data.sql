INSERT INTO user (id, name, email, password, role, created_at, updated_at) VALUES 
('admin-001', 'Admin', 'admin@techblog.com', '$2b$10$UY4JeijfPK55KQe8iE24.euwQBRU2nkU4OeduuYZDHeSrD.luWOlu', 'admin', NOW(), NOW()) 
ON DUPLICATE KEY UPDATE password = VALUES(password);

INSERT INTO category (id, name, slug, created_at) VALUES 
('cat-ai', 'AI资讯', 'ai', NOW()),
('cat-nas', 'NAS教程', 'nas', NOW()),
('cat-soft', '软件教程', 'software', NOW()),
('cat-tools', '工具导航', 'tools', NOW()),
('cat-res', '资源分享', 'resources', NOW()) 
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO tag (id, name, slug, created_at) VALUES 
('tag-1', 'GPT-5', 'gpt-5', NOW()),
('tag-2', 'OpenAI', 'openai', NOW()),
('tag-3', '大模型', 'big-model', NOW()),
('tag-4', 'NAS', 'nas', NOW()),
('tag-5', 'Docker', 'docker', NOW()),
('tag-6', 'React', 'react', NOW()),
('tag-7', 'Next.js', 'nextjs', NOW()),
('tag-8', '前端', 'frontend', NOW()),
('tag-9', 'Python', 'python', NOW()),
('tag-10', 'Linux', 'linux', NOW()) 
ON DUPLICATE KEY UPDATE name = VALUES(name);
