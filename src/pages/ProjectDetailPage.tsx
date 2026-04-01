import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, FolderKanban } from 'lucide-react';
import { getProjectById, updateProject, deleteProject } from '../services/projects';
import { PROJECT_STATUSES } from '../types';
import type { Session, Project, ProjectStatus } from '../types';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import Toast from '../components/Toast';

interface ProjectDetailPageProps {
  session: Session;
}

const STATUS_OPTIONS = PROJECT_STATUSES.map((s) => ({ value: s, label: s }));

export default function ProjectDetailPage({ session }: ProjectDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(() =>
    id ? getProjectById(session.userId, id) : null,
  );
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [form, setForm] = useState(() =>
    project
      ? { name: project.name, description: project.description, status: project.status, supervisor: project.supervisor }
      : { name: '', description: '', status: 'Planned' as ProjectStatus, supervisor: '' },
  );
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <FolderKanban className="h-12 w-12 text-gray-300" />
        <p className="text-gray-500 text-sm">Project not found.</p>
        <Link to="/projects">
          <Button variant="secondary">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  const openEdit = () => {
    setForm({ name: project.name, description: project.description, status: project.status, supervisor: project.supervisor });
    setErrors({});
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setErrors({ name: 'Name is required.' });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    const updated: Project = {
      ...project,
      name: form.name.trim(),
      description: form.description.trim(),
      status: form.status,
      supervisor: form.supervisor.trim(),
      updatedAt: new Date().toISOString(),
    };
    updateProject(session.userId, updated);
    setProject(updated);
    setSaving(false);
    setEditOpen(false);
    setToast({ msg: 'Project updated!', type: 'success' });
  };

  const handleDelete = () => {
    deleteProject(session.userId, project.id);
    navigate('/projects');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}

      {/* Back nav */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      {/* Detail card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-xl font-bold text-gray-900 leading-tight">{project.name}</h1>
          <StatusBadge status={project.status} className="flex-shrink-0" />
        </div>

        {project.description && (
          <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
        )}

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide">Supervisor</dt>
            <dd className="mt-1 text-gray-800">{project.supervisor || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide">Status</dt>
            <dd className="mt-1">
              <StatusBadge status={project.status} />
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide">Created</dt>
            <dd className="mt-1 text-gray-800">{new Date(project.createdAt).toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide">Last updated</dt>
            <dd className="mt-1 text-gray-800">{new Date(project.updatedAt).toLocaleString()}</dd>
          </div>
        </dl>

        <div className="flex gap-3 pt-2">
          <Button onClick={openEdit}>
            <Pencil className="h-4 w-4" />
            Edit Project
          </Button>
          <Button variant="danger" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        open={editOpen}
        title="Edit Project"
        onClose={() => setEditOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button loading={saving} onClick={handleSave}>Save Changes</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Project name *"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            error={errors.name}
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as ProjectStatus }))}
            options={STATUS_OPTIONS}
          />
          <Input
            label="Supervisor"
            value={form.supervisor}
            onChange={(e) => setForm((f) => ({ ...f, supervisor: e.target.value }))}
          />
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal
        open={deleteOpen}
        title="Delete Project"
        onClose={() => setDeleteOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-gray-900">"{project.name}"</span>? This cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
}
