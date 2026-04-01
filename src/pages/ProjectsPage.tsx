import { useState, useCallback } from 'react';
import { Plus, Trash2, Pencil, FolderKanban, Search } from 'lucide-react';
import { getProjects, addProject, deleteProject, updateProject } from '../services/projects';
import { PROJECT_STATUSES } from '../types';
import type { Session, Project, ProjectStatus } from '../types';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import Toast from '../components/Toast';

interface ProjectsPageProps {
  session: Session;
}

const STATUS_OPTIONS = PROJECT_STATUSES.map((s) => ({ value: s, label: s }));

const emptyForm = () => ({
  name: '',
  description: '',
  status: 'Planned' as ProjectStatus,
  supervisor: '',
});

export default function ProjectsPage({ session }: ProjectsPageProps) {
  const [projects, setProjects] = useState<Project[]>(() => getProjects(session.userId));
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | 'All'>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const refresh = useCallback(() => setProjects(getProjects(session.userId)), [session.userId]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm());
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditing(project);
    setForm({
      name: project.name,
      description: project.description,
      status: project.status,
      supervisor: project.supervisor,
    });
    setErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = 'Project name is required.';
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    if (editing) {
      const updated: Project = {
        ...editing,
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status,
        supervisor: form.supervisor.trim(),
        updatedAt: new Date().toISOString(),
      };
      updateProject(session.userId, updated);
      setToast({ msg: 'Project updated!', type: 'success' });
    } else {
      addProject(session.userId, {
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status,
        supervisor: form.supervisor.trim(),
      });
      setToast({ msg: 'Project created!', type: 'success' });
    }
    setSaving(false);
    closeModal();
    refresh();
  };

  const confirmDelete = (project: Project) => setDeleteTarget(project);

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteProject(session.userId, deleteTarget.id);
    setDeleteTarget(null);
    refresh();
    setToast({ msg: 'Project deleted.', type: 'success' });
  };

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.supervisor.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const filterOptions = [
    { value: 'All', label: 'All Statuses' },
    ...STATUS_OPTIONS,
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FolderKanban className="h-6 w-6 text-gray-500" />
            Projects
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Filters */}
      {projects.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects…"
              className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as ProjectStatus | 'All')}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {filterOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Project cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-16 text-center">
          <FolderKanban className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            {projects.length === 0
              ? 'No projects yet. Create your first project!'
              : 'No projects match your filters.'}
          </p>
          {projects.length === 0 && (
            <Button size="sm" className="mt-4" onClick={openAdd}>
              <Plus className="h-4 w-4" />
              Create project
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold text-gray-900 line-clamp-2 flex-1">
                  {project.name}
                </h3>
                <StatusBadge status={project.status} className="flex-shrink-0" />
              </div>
              {project.description && (
                <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
              )}
              {project.supervisor && (
                <p className="text-xs text-gray-400">
                  <span className="font-medium">Supervisor:</span> {project.supervisor}
                </p>
              )}
              <p className="text-xs text-gray-400">
                Created {new Date(project.createdAt).toLocaleDateString()}
              </p>
              <div className="flex items-center gap-2 mt-auto pt-1">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => openEdit(project)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => confirmDelete(project)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        title={editing ? 'Edit Project' : 'New Project'}
        onClose={closeModal}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button loading={saving} onClick={handleSave}>
              {editing ? 'Save Changes' : 'Create Project'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Project name *"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            error={errors.name}
            placeholder="e.g. Website Redesign"
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Brief description of the project…"
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
            placeholder="e.g. John Doe"
          />
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        open={!!deleteTarget}
        title="Delete Project"
        onClose={() => setDeleteTarget(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-gray-900">"{deleteTarget?.name}"</span>? This action
          cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
