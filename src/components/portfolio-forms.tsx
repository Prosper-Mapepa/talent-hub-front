import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'react-hot-toast';

export function AddProjectForm({ studentId, onSuccess, disabled = false }: { studentId: string, onSuccess?: () => void, disabled?: boolean }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (file) {
        for (const f of file) formData.append('files', f);
      }
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/students/${studentId}/projects`, {
        method: 'POST',
        body: formData,
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error('Failed to add project');
      toast.success('Project added!');
      setTitle(''); setDescription(''); setFile(null);
      onSuccess && onSuccess();
    } catch (err) {
      toast.error('Error adding project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={disabled ? undefined : handleSubmit} className="space-y-2 mt-4">
      <Input placeholder="Project Title" value={title} onChange={e => setTitle(e.target.value)} required disabled={disabled} />
      <Textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required disabled={disabled} />
      <Input type="file" accept="image/*,application/pdf" multiple onChange={e => setFile(e.target.files ? Array.from(e.target.files) : null)} disabled={disabled} />
      <Button type="submit" className='bg-[#8F1A27] hover:bg-[#6D0432] text-white font-semibold px-10 mt-4' disabled={loading || disabled}>{loading ? 'Adding...' : 'Add Project'}</Button>
    </form>
  );
}

export function AddAchievementForm({ studentId, onSuccess, disabled = false }: { studentId: string, onSuccess?: () => void, disabled?: boolean }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      if (file) {
        for (const f of file) formData.append('files', f);
      }
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/students/${studentId}/achievements`, {
        method: 'POST',
        body: formData,
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error('Failed to add achievement');
      toast.success('Achievement added!');
      setTitle(''); setDescription(''); setFile(null);
      onSuccess && onSuccess();
    } catch (err) {
      toast.error('Error adding achievement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={disabled ? undefined : handleSubmit} className="space-y-2 mt-4">
      <Input placeholder="Achievement Title" value={title} onChange={e => setTitle(e.target.value)} required disabled={disabled} />
      <Textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required disabled={disabled} />
      <Input type="file" accept="image/*,application/pdf" multiple onChange={e => setFile(e.target.files ? Array.from(e.target.files) : null)} disabled={disabled} />
      <Button type="submit" className='bg-[#8F1A27] hover:bg-[#6D0432] text-white font-semibold px-10 mt-4' disabled={loading || disabled}>{loading ? 'Adding...' : 'Add Achievement'}</Button>
    </form>
  );
}

export function ProjectEditForm({ project, studentId, onSuccess, disabled = false }: { project: any, studentId: string, onSuccess?: () => void, disabled?: boolean }) {
  const [title, setTitle] = useState(project.title || '');
  const [description, setDescription] = useState(project.description || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/students/${studentId}/projects/${project.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(typeof window !== 'undefined' && localStorage.getItem('authToken') ? { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } : {})
        },
        body: JSON.stringify({ title, description })
      });
      if (!res.ok) throw new Error('Failed to update project');
      toast.success('Project updated!');
      onSuccess && onSuccess();
    } catch (err) {
      toast.error('Error updating project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={disabled ? undefined : handleSubmit} className="space-y-2 mt-4">
      <Input placeholder="Project Title" value={title} onChange={e => setTitle(e.target.value)} required disabled={disabled} />
      <Textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required disabled={disabled} />
      <Button type="submit" className='bg-[#8F1A27] hover:bg-[#6D0432] text-white font-semibold px-10 mt-4' disabled={loading || disabled}>{loading ? 'Saving...' : 'Save Changes'}</Button>
    </form>
  );
}

export function AchievementEditForm({ achievement, studentId, onSuccess, disabled = false }: { achievement: any, studentId: string, onSuccess?: () => void, disabled?: boolean }) {
  const [title, setTitle] = useState(achievement.title || '');
  const [description, setDescription] = useState(achievement.description || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/students/${studentId}/achievements/${achievement.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(typeof window !== 'undefined' && localStorage.getItem('authToken') ? { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } : {})
        },
        body: JSON.stringify({ title, description })
      });
      if (!res.ok) throw new Error('Failed to update achievement');
      toast.success('Achievement updated!');
      onSuccess && onSuccess();
    } catch (err) {
      toast.error('Error updating achievement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={disabled ? undefined : handleSubmit} className="space-y-2 mt-4">
      <Input placeholder="Achievement Title" value={title} onChange={e => setTitle(e.target.value)} required disabled={disabled} />
      <Textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required disabled={disabled} />
      <Button type="submit" className='bg-[#8F1A27] hover:bg-[#6D0432] text-white font-semibold px-10 mt-4' disabled={loading || disabled}>{loading ? 'Saving...' : 'Save Changes'}</Button>
    </form>
  );
} 