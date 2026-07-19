'use client';
import { useEffect, useState } from 'react';
import { Plus, Users, Edit, Trash2, X, Save, Shield, User } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt?: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: 'Bearer ' + token },
      });
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
    } catch {
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const role = (form.elements.namedItem('role') as HTMLSelectElement).value;

    if (!name || !email || !password) {
      setError('请填写完整信息');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('auth_token');
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setShowAddModal(false);
      form.reset();
      fetchUsers();
    } else {
      setError(data.message || '创建失败');
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!editingUser) return;

    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const role = (form.elements.namedItem('role') as HTMLSelectElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    setLoading(true);
    const token = localStorage.getItem('auth_token');
    const res = await fetch('/api/admin/users/' + editingUser.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({ name, email, role, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setShowEditModal(false);
      setEditingUser(null);
      fetchUsers();
    } else {
      setError(data.message || '更新失败');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('确定要删除该用户吗？')) return;

    setLoading(true);
    const token = localStorage.getItem('auth_token');
    const res = await fetch('/api/admin/users/' + userId, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + token },
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      fetchUsers();
    } else {
      alert(data.message || '删除失败');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">用户管理</h1>
          <p className="text-sm text-muted-foreground mt-1">共 {users.length} 位用户</p>
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="h-4 w-4" /> 添加用户
        </button>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        {users.length > 0 ? (
          <div className="divide-y">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-red-100">
                    {user.role === 'admin' ? (
                      <Shield className="h-5 w-5 text-red-500" />
                    ) : (
                      <User className="h-5 w-5 text-orange-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">
                      {user.name}
                      {user.role === 'admin' && (
                        <span className="ml-2 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">管理员</span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5">{user.email}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{formatDate(user.createdAt)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => { setEditingUser(user); setShowEditModal(true); }}
                    className="inline-flex items-center gap-1 rounded-md bg-primary/10 text-primary px-3 py-1.5 text-xs font-medium hover:bg-primary/20 transition-colors">
                    <Edit className="h-3.5 w-3.5" /> 编辑
                  </button>
                  {user.id !== 'admin-001' && (
                    <button onClick={() => handleDeleteUser(user.id)}
                      className="inline-flex items-center gap-1 rounded-md bg-red-50 text-red-500 px-3 py-1.5 text-xs font-medium hover:bg-red-100 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" /> 删除
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center py-16 text-muted-foreground">
            <Users className="h-12 w-12 mb-3 opacity-30" />
            <p className="mb-4">暂无用户</p>
            <button onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus className="h-4 w-4" /> 添加第一位用户
            </button>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}>
          <div className="relative w-full max-w-sm rounded-2xl border bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowAddModal(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100">
              <X className="h-4 w-4" />
            </button>
            <h2 className="text-lg font-bold mb-4">添加用户</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">用户名</label>
                <input type="text" name="name" placeholder="请输入用户名" required
                  className="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">邮箱</label>
                <input type="email" name="email" placeholder="请输入邮箱" required
                  className="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">密码</label>
                <input type="password" name="password" placeholder="请输入密码" required minLength={6}
                  className="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">角色</label>
                <select name="role" className="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="author">作者</option>
                  <option value="admin">管理员</option>
                </select>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                {loading ? '添加中...' : '添加'}
              </button>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowEditModal(false)}>
          <div className="relative w-full max-w-sm rounded-2xl border bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowEditModal(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100">
              <X className="h-4 w-4" />
            </button>
            <h2 className="text-lg font-bold mb-4">编辑用户</h2>
            <form onSubmit={handleEditUser} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">用户名</label>
                <input type="text" name="name" defaultValue={editingUser.name} required
                  className="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">邮箱</label>
                <input type="email" name="email" defaultValue={editingUser.email} required
                  className="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">角色</label>
                <select name="role" defaultValue={editingUser.role}
                  disabled={editingUser.id === 'admin-001'}
                  className="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50">
                  <option value="author">作者</option>
                  <option value="admin">管理员</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">密码（留空则不修改）</label>
                <input type="password" name="password" placeholder="请输入新密码"
                  className="w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                {loading ? '保存中...' : '保存'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}