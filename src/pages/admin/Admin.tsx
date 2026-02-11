import React, { useState } from "react";
import {
  LogOut,
  FolderKanban,
  Wrench,
  User,
  FileText,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import { useProjects } from "../../hooks/useProjects";
import { useServices } from "../../hooks/useServices";
import { useProfile, useLinks } from "../../hooks/useProfile";
import { useResume } from "../../hooks/useResume";
import {
  createProject,
  updateProject,
  deleteProject,
} from "../../services/projectService";
import {
  createService,
  updateService,
  deleteService,
} from "../../services/servicesService";
import { updateProfile, updateLinks } from "../../services/profileService";
import { updateResume } from "../../services/resumeService";
import { FirestoreProject, FirestoreService, FirestoreProfile, FirestoreLinks, FirestoreResume } from "../../types/firebase";
import { isFirebaseConfigured } from "../../lib/firebase/config";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "../../components/ui/alert-dialog";
import LoginForm from "./components/LoginForm";
import ProjectForm from "./components/ProjectForm";
import ServiceForm from "./components/ServiceForm";
import ProfileForm from "./components/ProfileForm";
import ResumeForm from "./components/ResumeForm";

type Tab = "projects" | "services" | "profile" | "resume";

const Admin: React.FC = () => {
  const { user, isLoading: authLoading, error: authError, signIn, signOut, clearError } = useAuth();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: services, isLoading: servicesLoading } = useServices();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: links, isLoading: linksLoading } = useLinks();
  const { data: resume, isLoading: resumeLoading } = useResume();

  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [isFormLoading, setIsFormLoading] = useState(false);

  // Project state
  const [editingProject, setEditingProject] = useState<FirestoreProject | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);

  // Service state
  const [editingService, setEditingService] = useState<FirestoreService | null>(null);
  const [showServiceForm, setShowServiceForm] = useState(false);

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "project" | "service";
    id: string;
    title: string;
  } | null>(null);

  // Check if Firebase is configured
  if (!isFirebaseConfigured()) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
            <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">Firebase Not Configured</h1>
            <p className="text-slate-400 mb-6">
              Please configure Firebase by creating a <code className="text-indigo-400">.env.local</code> file with your Firebase credentials.
            </p>
            <p className="text-slate-500 text-sm">
              See <code className="text-indigo-400">.env.local.example</code> for the required variables.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading screen while checking auth state
  if (authLoading && !user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user) {
    return (
      <LoginForm
        onLogin={signIn}
        error={authError}
        isLoading={authLoading}
      />
    );
  }

  // Project handlers
  const handleSaveProject = async (projectData: FirestoreProject) => {
    setIsFormLoading(true);
    try {
      if (editingProject) {
        await updateProject(projectData.id, projectData);
        toast.success("Project updated successfully");
      } else {
        await createProject(projectData);
        toast.success("Project created successfully");
      }
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setShowProjectForm(false);
      setEditingProject(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save project");
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDeleteProject = (id: string, title: string) => {
    setDeleteConfirm({ type: "project", id, title });
  };

  const handleEditProject = (project: FirestoreProject) => {
    setEditingProject(project);
    setShowProjectForm(true);
  };

  // Service handlers
  const handleSaveService = async (serviceData: FirestoreService) => {
    setIsFormLoading(true);
    try {
      if (editingService) {
        await updateService(serviceData.id!, serviceData);
        toast.success("Service updated successfully");
      } else {
        await createService(serviceData);
        toast.success("Service created successfully");
      }
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setShowServiceForm(false);
      setEditingService(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save service");
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDeleteService = (id: string, title: string) => {
    setDeleteConfirm({ type: "service", id, title });
  };

  const handleEditService = (service: FirestoreService) => {
    setEditingService(service);
    setShowServiceForm(true);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    setIsFormLoading(true);
    try {
      if (deleteConfirm.type === "project") {
        await deleteProject(deleteConfirm.id);
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        toast.success("Project deleted successfully");
      } else {
        await deleteService(deleteConfirm.id);
        queryClient.invalidateQueries({ queryKey: ["services"] });
        toast.success("Service deleted successfully");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Failed to delete ${deleteConfirm.type}`);
    } finally {
      setIsFormLoading(false);
      setDeleteConfirm(null);
    }
  };

  // Profile handlers
  const handleSaveProfile = async (profileData: Partial<FirestoreProfile>) => {
    setIsFormLoading(true);
    try {
      await updateProfile(profileData);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save profile");
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleSaveLinks = async (linksData: Partial<FirestoreLinks>) => {
    setIsFormLoading(true);
    try {
      await updateLinks(linksData);
      queryClient.invalidateQueries({ queryKey: ["links"] });
      toast.success("Links updated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save links");
    } finally {
      setIsFormLoading(false);
    }
  };

  // Resume handlers
  const handleSaveResume = async (resumeData: Partial<FirestoreResume>) => {
    setIsFormLoading(true);
    try {
      await updateResume(resumeData);
      queryClient.invalidateQueries({ queryKey: ["resume"] });
      toast.success("Resume updated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save resume");
    } finally {
      setIsFormLoading(false);
    }
  };

  // Convert projects to Firestore format for editing
  const projectsForEdit: FirestoreProject[] = projects?.map((p) => ({
    id: p.id,
    title: p.title,
    subtitle: p.subtitle,
    category: p.category,
    year: p.year,
    company: p.company,
    bannerIconName: p.bannerIcon?.name || "Code2",
    theme: p.theme,
    headerInfo: p.headerInfo.map((h) => ({
      label: h.label,
      text: h.text,
      iconName: h.icon?.name || "Code2",
    })),
    overview: p.overview,
    features: p.features.map((f) => ({
      title: f.title,
      desc: f.desc,
      iconName: f.icon?.name || "Code2",
    })),
    images: p.images,
    contributions: p.contributions,
    techStack: p.techStack,
    marqueeIconNames: p.marqueeIcons.map((i) => i?.name || "Code2"),
    challenge: p.challenge,
    coverMedia: p.coverMedia || [],
    order: 0,
  })) || [];

  // Convert services to Firestore format for editing
  const servicesForEdit: FirestoreService[] = services?.map((s) => ({
    id: s.id,
    iconName: s.icon?.name || "Code2",
    title: s.title,
    description: s.description,
    order: 0,
  })) || [];

  const tabs = [
    { id: "projects" as Tab, label: "Projects", icon: FolderKanban },
    { id: "services" as Tab, label: "Services", icon: Wrench },
    { id: "profile" as Tab, label: "Profile", icon: User },
    { id: "resume" as Tab, label: "Resume", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Delete Confirmation Modal */}
      <AlertDialog open={deleteConfirm !== null} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete {deleteConfirm?.type}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete &ldquo;{deleteConfirm?.title}&rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Project Form Modal */}
      {showProjectForm && (
        <ProjectForm
          project={editingProject}
          onSave={handleSaveProject}
          onCancel={() => {
            setShowProjectForm(false);
            setEditingProject(null);
          }}
          isLoading={isFormLoading}
        />
      )}

      {/* Service Form Modal */}
      {showServiceForm && (
        <ServiceForm
          service={editingService}
          onSave={handleSaveService}
          onCancel={() => {
            setShowServiceForm(false);
            setEditingService(null);
          }}
          isLoading={isFormLoading}
        />
      )}

      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FolderKanban className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            </div>

            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-700 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-indigo-500 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Projects</h2>
              <button
                onClick={() => {
                  setEditingProject(null);
                  setShowProjectForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Project
              </button>
            </div>

            {projectsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            ) : (
              <div className="space-y-4">
                {projectsForEdit.map((project) => (
                  <div
                    key={project.id}
                    className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                      <p className="text-slate-400 text-sm">{project.subtitle}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span>{project.category}</span>
                        <span>{project.year}</span>
                        <span>{project.company}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditProject(project)}
                        className="p-2 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id, project.title)}
                        className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {projectsForEdit.length === 0 && (
                  <div className="text-center py-12 text-slate-400">
                    <FolderKanban className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No projects yet. Add your first project to get started.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Services</h2>
              <button
                onClick={() => {
                  setEditingService(null);
                  setShowServiceForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Service
              </button>
            </div>

            {servicesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {servicesForEdit.map((service) => (
                  <div
                    key={service.id}
                    className="bg-slate-800 rounded-xl p-6 border border-slate-700"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                        <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                          {service.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditService(service)}
                          className="p-2 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id!, service.title)}
                          className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {servicesForEdit.length === 0 && (
                  <div className="text-center py-12 text-slate-400 md:col-span-2">
                    <Wrench className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No services yet. Add your first service to get started.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>

            {profileLoading || linksLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            ) : (
              <ProfileForm
                profile={profile as FirestoreProfile | null}
                links={links as FirestoreLinks | null}
                onSaveProfile={handleSaveProfile}
                onSaveLinks={handleSaveLinks}
                isLoading={isFormLoading}
              />
            )}
          </div>
        )}

        {/* Resume Tab */}
        {activeTab === "resume" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Resume Management</h2>

            {resumeLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            ) : (
              <ResumeForm
                resume={(resume as FirestoreResume) || null}
                onSave={handleSaveResume}
                isLoading={isFormLoading}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
