import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, Plus, CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { getProjects } from '../services/projects';
import type { Session, ProjectStatus } from '../types';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';

interface DashboardPageProps {
  session: Session;
}

export default function DashboardPage({ session }: DashboardPageProps) {
  const projects = useMemo(() => getProjects(session.userId), [session.userId]);

  const stats: { label: string; count: number; color: string; icon: React.ElementType }[] = [
    {
      label: 'Total Projects',
      count: projects.length,
      color: 'text-blue-600 bg-blue-50',
      icon: FolderKanban,
    },
    {
      label: 'In Progress',
      count: projects.filter((p) => p.status === 'In Progress').length,
      color: 'text-indigo-600 bg-indigo-50',
      icon: TrendingUp,
    },
    {
      label: 'Completed',
      count: projects.filter((p) => p.status === 'Completed').length,
      color: 'text-green-600 bg-green-50',
      icon: CheckCircle2,
    },
    {
      label: 'Blocked / On Hold',
      count: projects.filter((p) => p.status === 'Blocked' || p.status === 'On Hold').length,
      color: 'text-red-600 bg-red-50',
      icon: AlertCircle,
    },
  ];

  const recent = projects.slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {session.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Here's an overview of your projects.</p>
        </div>
        <Link to="/projects">
          <Button size="md">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className={`inline-flex p-2 rounded-xl ${s.color} mb-3`}>
              <s.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.count}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent projects */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            Recent Projects
          </h2>
          <Link
            to="/projects"
            className="text-sm text-blue-600 font-medium hover:underline"
          >
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FolderKanban className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No projects yet.</p>
            <Link to="/projects">
              <Button size="sm" className="mt-4">
                <Plus className="h-4 w-4" />
                Create your first project
              </Button>
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {recent.map((project) => (
              <li key={project.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/projects/${project.id}`}
                      className="text-sm font-semibold text-gray-900 hover:text-blue-600 truncate block"
                    >
                      {project.name}
                    </Link>
                    {project.description && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {project.description}
                      </p>
                    )}
                    {project.supervisor && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        Supervisor: {project.supervisor}
                      </p>
                    )}
                  </div>
                  <StatusBadge status={project.status as ProjectStatus} className="flex-shrink-0" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
