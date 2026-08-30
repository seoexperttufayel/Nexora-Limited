import React, { useState, useRef } from 'react';
import { Project, ProjectDocument, ProjectUpdate, Language, Role, Member } from '../types';
import { compressImage } from '../utils/imageCompressor';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  FileText, 
  Image as ImageIcon, 
  Paperclip, 
  Upload, 
  Download, 
  X, 
  Eye, 
  Clock, 
  AlertCircle, 
  Check, 
  FileCheck,
  FolderOpen,
  Send,
  Camera,
  Maximize2
} from 'lucide-react';

interface Props {
  projects: Project[];
  lang: Language;
  role?: Role;
  currentUser?: Member | null;
  onCreateProject?: (project: Project) => void;
  onUpdateProject?: (project: Project) => void;
  onDeleteProject?: (projectId: string) => void;
}

export const ProjectsView: React.FC<Props> = ({
  projects,
  lang,
  role = 'public',
  currentUser,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
}) => {
  const isAdmin = role === 'admin';

  // State
  const [filterStatus, setFilterStatus] = useState<'all' | 'planning' | 'ongoing' | 'completed'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<string | null>(null);
  const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'overview' | 'photos' | 'documents' | 'updates'>('overview');

  // Form states for New Project
  const [formData, setFormData] = useState({
    titleBn: '',
    titleEn: '',
    categoryBn: 'হালাল কৃষি ও ডেইরি',
    categoryEn: 'Halal Agro & Dairy',
    locationBn: 'সিলেট, বাংলাদেশ',
    locationEn: 'Sylhet, Bangladesh',
    targetBudget: 2000000,
    raisedBudget: 500000,
    status: 'ongoing' as 'planning' | 'ongoing' | 'completed',
    expectedReturnBn: '১৮% - ২৪% বার্ষিক সম্ভাব্য মুনাফা',
    expectedReturnEn: '18% - 24% Projected Annual Yield',
    descriptionBn: '',
    descriptionEn: '',
    shariahModelBn: 'মুদারাবা (মুনাফা বণ্টন অংশীদারি)',
    shariahModelEn: 'Mudarabah (Profit-Sharing Partnership)',
    startDate: new Date().toISOString().split('T')[0],
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80',
  });

  // State for adding a new written update / note
  const [newUpdateText, setNewUpdateText] = useState('');
  const [newUpdateTitle, setNewUpdateTitle] = useState('');
  const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false);

  // File input refs
  const photoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  // Filtering projects
  const activeProjects = projects.filter(p => !p.isDeleted);
  const filteredProjects = activeProjects.filter(p => {
    if (filterStatus === 'all') return true;
    return p.status === filterStatus;
  });

  // Handle Cover Photo Upload (with auto-compression)
  const handleCoverPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedDataUrl = await compressImage(file, 1000, 1000, 0.82);
      setFormData(prev => ({ ...prev, image: compressedDataUrl }));
    } catch (err) {
      console.error('Cover photo compression error:', err);
    }
  };

  // Submit Create Project
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleBn.trim() && !formData.titleEn.trim()) {
      alert(lang === 'bn' ? 'দয়া করে প্রকল্পের নাম লিখুন' : 'Please enter project title');
      return;
    }

    const newProject: Project = {
      id: `PRJ-${Date.now().toString().slice(-4)}`,
      titleBn: formData.titleBn || formData.titleEn,
      titleEn: formData.titleEn || formData.titleBn,
      categoryBn: formData.categoryBn,
      categoryEn: formData.categoryEn,
      locationBn: formData.locationBn,
      locationEn: formData.locationEn,
      targetBudget: Number(formData.targetBudget) || 0,
      raisedBudget: Number(formData.raisedBudget) || 0,
      status: formData.status,
      expectedReturnBn: formData.expectedReturnBn,
      expectedReturnEn: formData.expectedReturnEn,
      descriptionBn: formData.descriptionBn,
      descriptionEn: formData.descriptionEn,
      shariahModelBn: formData.shariahModelBn,
      shariahModelEn: formData.shariahModelEn,
      startDate: formData.startDate,
      image: formData.image,
      photos: [],
      documents: [],
      updates: [
        {
          id: `UPD-${Date.now()}`,
          title: lang === 'bn' ? 'প্রকল্প সূচনা ও আনুষ্ঠানিক অনুমোদন' : 'Project Inauguration & Approval',
          text: formData.descriptionBn || formData.descriptionEn || (lang === 'bn' ? 'নেক্সোরা লিমিটেডের আওতায় প্রকল্পটি আনুষ্ঠানিকভাবে গৃহীত হয়েছে।' : 'Project has been officially approved under Nexora Limited.'),
          date: new Date().toISOString().split('T')[0],
          author: currentUser?.name || 'Super Admin'
        }
      ],
      createdAt: new Date().toISOString(),
      createdBy: currentUser?.name || 'Admin'
    };

    if (onCreateProject) {
      onCreateProject(newProject);
    }
    setShowCreateModal(false);
    // Reset form
    setFormData({
      titleBn: '',
      titleEn: '',
      categoryBn: 'হালাল কৃষি ও ডেইরি',
      categoryEn: 'Halal Agro & Dairy',
      locationBn: 'সিলেট, বাংলাদেশ',
      locationEn: 'Sylhet, Bangladesh',
      targetBudget: 2000000,
      raisedBudget: 500000,
      status: 'ongoing',
      expectedReturnBn: '১৮% - ২৪% বার্ষিক সম্ভাব্য মুনাফা',
      expectedReturnEn: '18% - 24% Projected Annual Yield',
      descriptionBn: '',
      descriptionEn: '',
      shariahModelBn: 'মুদারাবা (মুনাফা বণ্টন অংশীদারি)',
      shariahModelEn: 'Mudarabah (Profit-Sharing Partnership)',
      startDate: new Date().toISOString().split('T')[0],
      image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80',
    });
  };

  // Submit Edit Project
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !onUpdateProject) return;

    const updated: Project = {
      ...selectedProject,
      titleBn: formData.titleBn || selectedProject.titleBn,
      titleEn: formData.titleEn || selectedProject.titleEn,
      categoryBn: formData.categoryBn,
      categoryEn: formData.categoryEn,
      locationBn: formData.locationBn,
      locationEn: formData.locationEn,
      targetBudget: Number(formData.targetBudget) || 0,
      raisedBudget: Number(formData.raisedBudget) || 0,
      status: formData.status,
      expectedReturnBn: formData.expectedReturnBn,
      expectedReturnEn: formData.expectedReturnEn,
      descriptionBn: formData.descriptionBn,
      descriptionEn: formData.descriptionEn,
      shariahModelBn: formData.shariahModelBn,
      shariahModelEn: formData.shariahModelEn,
      startDate: formData.startDate,
      image: formData.image || selectedProject.image
    };

    onUpdateProject(updated);
    setSelectedProject(updated);
    setShowEditModal(false);
  };

  // Handle Photo Upload to Project (with auto-compression to prevent lag and Firestore quota errors)
  const handleProjectPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedProject || !onUpdateProject) return;

    try {
      const fileList = Array.from(files) as File[];
      const compressedUrls: string[] = [];
      for (const file of fileList) {
        const compressed = await compressImage(file, 1000, 1000, 0.82);
        compressedUrls.push(compressed);
      }

      const currentPhotos = selectedProject.photos || [];
      const updated: Project = {
        ...selectedProject,
        photos: [...compressedUrls, ...currentPhotos]
      };
      onUpdateProject(updated);
      setSelectedProject(updated);
    } catch (err) {
      console.error('Gallery upload error:', err);
    }

    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  // Handle Delete Project Photo
  const handleDeletePhoto = (indexToDelete: number) => {
    if (!selectedProject || !onUpdateProject) return;
    const currentPhotos = selectedProject.photos || [];
    const updatedPhotos = currentPhotos.filter((_, idx) => idx !== indexToDelete);
    const updated: Project = {
      ...selectedProject,
      photos: updatedPhotos
    };
    onUpdateProject(updated);
    setSelectedProject(updated);
  };

  // Handle Document File Upload to Project
  const handleProjectDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedProject || !onUpdateProject) return;

    Array.from(files).forEach((file: File) => {
      if (file.size > 15 * 1024 * 1024) {
        alert(lang === 'bn' ? `${file.name} ফাইলের সাইজ ১৫MB এর বেশি হতে পারবে না` : `${file.name} exceeds 15MB`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const fileDataUrl = event.target!.result as string;
          const formatFileSize = (bytes: number) => {
            if (bytes < 1024) return bytes + ' B';
            else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
            else return (bytes / 1048576).toFixed(1) + ' MB';
          };

          const newDoc: ProjectDocument = {
            id: `DOC-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: file.name,
            fileUrl: fileDataUrl,
            fileType: file.type || 'application/octet-stream',
            fileSize: formatFileSize(file.size),
            uploadedAt: new Date().toISOString().split('T')[0],
            uploadedBy: currentUser?.name || 'Admin'
          };

          const currentDocs = selectedProject.documents || [];
          const updated: Project = {
            ...selectedProject,
            documents: [newDoc, ...currentDocs]
          };
          onUpdateProject(updated);
          setSelectedProject(updated);
        }
      };
      reader.readAsDataURL(file);
    });

    if (docInputRef.current) docInputRef.current.value = '';
  };

  // Handle Delete Project Document
  const handleDeleteDocument = (docId: string) => {
    if (!selectedProject || !onUpdateProject) return;
    const currentDocs = selectedProject.documents || [];
    const updatedDocs = currentDocs.filter(d => d.id !== docId);
    const updated: Project = {
      ...selectedProject,
      documents: updatedDocs
    };
    onUpdateProject(updated);
    setSelectedProject(updated);
  };

  // Handle Add Written Update
  const handleAddUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdateText.trim() || !selectedProject || !onUpdateProject) return;

    setIsSubmittingUpdate(true);
    const newUpdate: ProjectUpdate = {
      id: `UPD-${Date.now()}`,
      title: newUpdateTitle.trim() || (lang === 'bn' ? 'প্রকল্প অগ্রগতি বিবরণী' : 'Project Progress Note'),
      text: newUpdateText.trim(),
      date: new Date().toISOString().split('T')[0],
      author: currentUser?.name || (lang === 'bn' ? 'ব্যবস্থাপনা কর্তৃপক্ষ' : 'Management')
    };

    const currentUpdates = selectedProject.updates || [];
    const updated: Project = {
      ...selectedProject,
      updates: [newUpdate, ...currentUpdates]
    };

    onUpdateProject(updated);
    setSelectedProject(updated);
    setNewUpdateText('');
    setNewUpdateTitle('');
    setIsSubmittingUpdate(false);
  };

  // Delete Written Update
  const handleDeleteUpdate = (updateId: string) => {
    if (!selectedProject || !onUpdateProject) return;
    const currentUpdates = selectedProject.updates || [];
    const updatedUpdates = currentUpdates.filter(u => u.id !== updateId);
    const updated: Project = {
      ...selectedProject,
      updates: updatedUpdates
    };
    onUpdateProject(updated);
    setSelectedProject(updated);
  };

  // Delete Project Confirmation
  const confirmDeleteProject = (projectId: string) => {
    if (onDeleteProject) {
      onDeleteProject(projectId);
    }
    setShowDeleteConfirmModal(null);
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
  };

  // Open Edit Modal with project data
  const openEditModal = (proj: Project) => {
    setFormData({
      titleBn: proj.titleBn,
      titleEn: proj.titleEn,
      categoryBn: proj.categoryBn,
      categoryEn: proj.categoryEn,
      locationBn: proj.locationBn,
      locationEn: proj.locationEn,
      targetBudget: proj.targetBudget,
      raisedBudget: proj.raisedBudget,
      status: proj.status,
      expectedReturnBn: proj.expectedReturnBn,
      expectedReturnEn: proj.expectedReturnEn,
      descriptionBn: proj.descriptionBn,
      descriptionEn: proj.descriptionEn,
      shariahModelBn: proj.shariahModelBn,
      shariahModelEn: proj.shariahModelEn,
      startDate: proj.startDate,
      image: proj.image,
    });
    setShowEditModal(true);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <Building2 className="w-4 h-4" />
            <span>{lang === 'bn' ? 'প্রকল্প ও পোর্টফোলিও' : 'Projects & Portfolios'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {lang === 'bn' ? 'নেক্সোরা বিনিয়োগ প্রকল্প ও বাস্তবায়ন' : 'Nexora Real Estate & Business Ventures'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'bn'
              ? 'প্রতিটি প্রকল্প কঠোরভাবে শরিয়াহ নীতি অনুযায়ী পরিচালিত এবং শেয়ারহোল্ডারদের যৌথ তহবিলের মাধ্যমে অর্থায়িত।'
              : 'Every investment project is vetted by our Shariah advisory board and funded through collective shareholder contributions.'}
          </p>
        </div>

        {/* Admin Action Button */}
        {isAdmin && (
          <button
            onClick={() => {
              setFormData({
                titleBn: '',
                titleEn: '',
                categoryBn: 'হালাল কৃষি ও ডেইরি',
                categoryEn: 'Halal Agro & Dairy',
                locationBn: 'সিলেট, বাংলাদেশ',
                locationEn: 'Sylhet, Bangladesh',
                targetBudget: 2000000,
                raisedBudget: 500000,
                status: 'ongoing',
                expectedReturnBn: '১৮% - ২৪% বার্ষিক সম্ভাব্য মুনাফা',
                expectedReturnEn: '18% - 24% Projected Annual Yield',
                descriptionBn: '',
                descriptionEn: '',
                shariahModelBn: 'মুদারাবা (মুনাফা বণ্টন অংশীদারি)',
                shariahModelEn: 'Mudarabah (Profit-Sharing Partnership)',
                startDate: new Date().toISOString().split('T')[0],
                image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80',
              });
              setShowCreateModal(true);
            }}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 hover:shadow-emerald-600/30 transition transform active:scale-95 shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>{lang === 'bn' ? 'নতুন প্রকল্প তৈরি করুন' : 'Create New Project'}</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', labelBn: 'সকল প্রকল্প', labelEn: 'All Projects', count: activeProjects.length },
            { id: 'ongoing', labelBn: 'চলমান', labelEn: 'Ongoing', count: activeProjects.filter(p => p.status === 'ongoing').length },
            { id: 'planning', labelBn: 'পরিকল্পনাধীন', labelEn: 'Planning', count: activeProjects.filter(p => p.status === 'planning').length },
            { id: 'completed', labelBn: 'সম্পন্ন', labelEn: 'Completed', count: activeProjects.filter(p => p.status === 'completed').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center space-x-2 ${
                filterStatus === tab.id
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{lang === 'bn' ? tab.labelBn : tab.labelEn}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                filterStatus === tab.id ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span>{lang === 'bn' ? 'মোট প্রকল্প:' : 'Total Projects:'}</span>
          <span className="font-bold text-white font-mono">{filteredProjects.length}</span>
        </div>
      </div>

      {/* EMPTY STATE */}
      {filteredProjects.length === 0 && (
        <div className="p-12 sm:p-16 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-5 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
            <FolderOpen className="w-8 h-8 text-emerald-400/80" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {lang === 'bn' ? 'বর্তমানে কোনো প্রকল্প তালিকাভুক্ত নেই' : 'No Investment Projects Listed Yet'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              {lang === 'bn'
                ? 'প্রশাসক হিসেবে আপনি নতুন বিনিয়োগ প্রকল্প যুক্ত করতে পারবেন এবং ছবি, নথি ও বিস্তারিত অগ্রগতি বিবরণী প্রকাশ করতে পারবেন।'
                : 'As an administrator, you can create new investment projects, upload photos, documents, and publish real-time project updates.'}
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => {
                setShowCreateModal(true);
              }}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-emerald-900/30"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'bn' ? 'প্রথম প্রকল্প যুক্ত করুন' : 'Create First Project'}</span>
            </button>
          )}
        </div>
      )}

      {/* PROJECTS GRID / LIST */}
      {filteredProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => {
            const target = proj.targetBudget || 1;
            const raised = proj.raisedBudget || 0;
            const progressPercent = Math.min(100, Math.round((raised / target) * 100));
            const photoCount = (proj.photos || []).length;
            const docCount = (proj.documents || []).length;
            const updateCount = (proj.updates || []).length;

            return (
              <div
                key={proj.id}
                onClick={() => setSelectedProject(proj)}
                className="group bg-slate-900 hover:bg-slate-900/90 rounded-3xl border border-slate-800 hover:border-emerald-500/40 overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer hover:shadow-emerald-500/5 hover:-translate-y-1"
              >
                {/* Cover Image & Badges */}
                <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={proj.image || 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80'}
                    alt={proj.titleEn}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  
                  {/* Status Tag */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                      proj.status === 'completed'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        : proj.status === 'ongoing'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {proj.status === 'ongoing' ? (lang === 'bn' ? 'চলমান' : 'Ongoing') :
                       proj.status === 'completed' ? (lang === 'bn' ? 'সম্পন্ন' : 'Completed') :
                       (lang === 'bn' ? 'পরিকল্পনাধীন' : 'Planning')}
                    </span>
                  </div>

                  {/* Category Tag */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-400 truncate">
                      {lang === 'bn' ? proj.categoryBn : proj.categoryEn}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded-md backdrop-blur-sm border border-slate-700/50">
                      <Calendar className="w-3 h-3" />
                      {proj.startDate}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                      {lang === 'bn' ? proj.titleBn : proj.titleEn}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {lang === 'bn' ? proj.descriptionBn : proj.descriptionEn}
                    </p>
                    <div className="flex items-center space-x-1.5 text-xs text-slate-400 pt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="truncate">{lang === 'bn' ? proj.locationBn : proj.locationEn}</span>
                    </div>
                  </div>

                  {/* Financial & Upload Indicators */}
                  <div className="space-y-3 pt-3 border-t border-slate-800/80 text-xs">
                    
                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between font-semibold text-[11px]">
                        <span className="text-slate-400">
                          {lang === 'bn' ? 'তহবিল বণ্টন:' : 'Allocated Fund:'}{' '}
                          <span className="text-white font-mono">৳ {(proj.raisedBudget || 0).toLocaleString()}</span>
                        </span>
                        <span className="text-emerald-400 font-mono">{progressPercent}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Meta attachments indicator bar */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center gap-1 hover:text-slate-200" title="Photos">
                          <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{photoCount}</span>
                        </span>
                        <span className="flex items-center gap-1 hover:text-slate-200" title="Documents">
                          <Paperclip className="w-3.5 h-3.5 text-blue-400" />
                          <span>{docCount}</span>
                        </span>
                        <span className="flex items-center gap-1 hover:text-slate-200" title="Updates">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>{updateCount}</span>
                        </span>
                      </div>

                      <span className="text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>{lang === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'}</span>
                        <span>→</span>
                      </span>
                    </div>

                  </div>
                </div>

                {/* Admin Quick Action Bar (Bottom of card) */}
                {isAdmin && (
                  <div className="px-5 py-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-xs" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => openEditModal(proj)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                      <span>{lang === 'bn' ? 'সম্পাদনা' : 'Edit'}</span>
                    </button>

                    <button
                      onClick={() => setShowDeleteConfirmModal(proj.id)}
                      className="text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'মুছে ফেলুন' : 'Delete'}</span>
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. PROJECT DETAILS & FILE MANAGEMENT MODAL */}
      {/* ========================================================================= */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            
            {/* Modal Header with Cover Banner */}
            <div className="relative h-48 sm:h-60 w-full bg-slate-950 shrink-0">
              <img
                src={selectedProject.image || 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80'}
                alt={selectedProject.titleEn}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 backdrop-blur-md transition"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Title Info */}
              <div className="absolute bottom-4 left-5 right-5 space-y-1.5 text-white">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border ${
                    selectedProject.status === 'completed'
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                      : selectedProject.status === 'ongoing'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    {selectedProject.status === 'ongoing' ? (lang === 'bn' ? 'চলমান' : 'Ongoing') :
                     selectedProject.status === 'completed' ? (lang === 'bn' ? 'সম্পন্ন' : 'Completed') :
                     (lang === 'bn' ? 'পরিকল্পনাধীন' : 'Planning')}
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    {lang === 'bn' ? selectedProject.categoryBn : selectedProject.categoryEn}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                  {lang === 'bn' ? selectedProject.titleBn : selectedProject.titleEn}
                </h2>
                <div className="flex items-center space-x-2 text-xs text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{lang === 'bn' ? selectedProject.locationBn : selectedProject.locationEn}</span>
                  <span>•</span>
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{selectedProject.startDate}</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-1 sm:space-x-2 px-5 py-3 bg-slate-950 border-b border-slate-800 text-xs sm:text-sm font-semibold overflow-x-auto shrink-0">
              {[
                { id: 'overview', labelBn: 'সামগ্রিক বিবরণ', labelEn: 'Overview & Details', icon: FileText },
                { id: 'photos', labelBn: `ফটো গ্যালারি (${(selectedProject.photos || []).length})`, labelEn: `Photos (${(selectedProject.photos || []).length})`, icon: ImageIcon },
                { id: 'documents', labelBn: `নথি ও ফাইল (${(selectedProject.documents || []).length})`, labelEn: `Files & Docs (${(selectedProject.documents || []).length})`, icon: Paperclip },
                { id: 'updates', labelBn: `লগ ও আপডেট (${(selectedProject.updates || []).length})`, labelEn: `Updates (${(selectedProject.updates || []).length})`, icon: Clock },
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDetailTab(tab.id as any)}
                    className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition shrink-0 ${
                      activeDetailTab === tab.id
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{lang === 'bn' ? tab.labelBn : tab.labelEn}</span>
                  </button>
                );
              })}

              {isAdmin && (
                <div className="ml-auto flex items-center space-x-2 pl-2">
                  <button
                    onClick={() => openEditModal(selectedProject)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title="Edit Project Details"
                  >
                    <Edit3 className="w-4 h-4 text-blue-400" />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirmModal(selectedProject.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Modal Body / Tab Contents (Scrollable) */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">

              {/* ------------------------------------------------------------- */}
              {/* TAB 1: OVERVIEW */}
              {/* ------------------------------------------------------------- */}
              {activeDetailTab === 'overview' && (
                <div className="space-y-6">
                  
                  {/* Financial & Shariah Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 block">{lang === 'bn' ? 'শরিয়াহ চুক্তির ধরন' : 'Shariah Framework'}</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1 text-sm">
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                        <span>{lang === 'bn' ? selectedProject.shariahModelBn : selectedProject.shariahModelEn}</span>
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 block">{lang === 'bn' ? 'প্রত্যাশিত বার্ষিক মুনাফা' : 'Projected Yield'}</span>
                      <span className="text-amber-400 font-bold flex items-center gap-1 text-sm">
                        <TrendingUp className="w-4 h-4 shrink-0" />
                        <span>{lang === 'bn' ? selectedProject.expectedReturnBn : selectedProject.expectedReturnEn}</span>
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1 sm:col-span-2 md:col-span-1">
                      <span className="text-slate-400 block">{lang === 'bn' ? 'বাজেট ও অর্থায়ন' : 'Target vs Raised'}</span>
                      <span className="text-white font-bold font-mono text-sm">
                        ৳ {(selectedProject.raisedBudget || 0).toLocaleString()} / ৳ {(selectedProject.targetBudget || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Full Description */}
                  <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span>{lang === 'bn' ? 'প্রকল্পের বিস্তারিত বিবরণ ও উদ্দেশ্য' : 'Project Description & Objectives'}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {lang === 'bn' 
                        ? (selectedProject.descriptionBn || selectedProject.descriptionEn || 'কোনো বিবরণ লিপিবদ্ধ করা হয়নি।')
                        : (selectedProject.descriptionEn || selectedProject.descriptionBn || 'No detailed description available.')}
                    </p>
                  </div>

                  {/* Summary of documents and photos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      onClick={() => setActiveDetailTab('photos')}
                      className="p-4 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 transition cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white">{lang === 'bn' ? 'সংযুক্ত ফটো গ্যালারি' : 'Photo Gallery'}</h5>
                          <p className="text-[11px] text-slate-400">{(selectedProject.photos || []).length} {lang === 'bn' ? 'টি ছবি আপলোডকৃত' : 'photos attached'}</p>
                        </div>
                      </div>
                      <span className="text-emerald-400 text-xs font-semibold">→</span>
                    </div>

                    <div
                      onClick={() => setActiveDetailTab('documents')}
                      className="p-4 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 transition cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                          <Paperclip className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white">{lang === 'bn' ? 'প্রকল্প নথি ও কাগজপত্র' : 'Project Documents'}</h5>
                          <p className="text-[11px] text-slate-400">{(selectedProject.documents || []).length} {lang === 'bn' ? 'টি ফাইল আপলোডকৃত' : 'files attached'}</p>
                        </div>
                      </div>
                      <span className="text-blue-400 text-xs font-semibold">→</span>
                    </div>
                  </div>

                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* TAB 2: PHOTO GALLERY */}
              {/* ------------------------------------------------------------- */}
              {activeDetailTab === 'photos' && (
                <div className="space-y-6">
                  
                  {/* Admin Photo Upload Bar */}
                  {isAdmin && (
                    <div className="p-4 rounded-2xl bg-slate-950 border border-dashed border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center space-x-3 text-xs">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                          <Camera className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{lang === 'bn' ? 'প্রকল্পের নতুন ছবি আপলোড করুন' : 'Upload Project Photos'}</p>
                          <p className="text-slate-400 text-[11px]">{lang === 'bn' ? 'JPG, PNG বা WebP ফরম্যাট (সর্বোচ্চ ৮MB প্রতি ছবি)' : 'JPG, PNG or WebP format (Max 8MB)'}</p>
                        </div>
                      </div>

                      <label className="cursor-pointer px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 transition shrink-0">
                        <Upload className="w-4 h-4" />
                        <span>{lang === 'bn' ? 'ছবি নির্বাচন করুন' : 'Select Photos'}</span>
                        <input
                          ref={photoInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleProjectPhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}

                  {/* Photo Grid */}
                  {(!selectedProject.photos || selectedProject.photos.length === 0) ? (
                    <div className="p-10 text-center rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 space-y-2">
                      <ImageIcon className="w-8 h-8 mx-auto text-slate-500" />
                      <p className="text-xs font-semibold">{lang === 'bn' ? 'এই প্রকল্পে এখনো কোনো অতিরিক্ত ছবি আপলোড করা হয়নি।' : 'No additional photos uploaded for this project yet.'}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {selectedProject.photos.map((photoUrl, idx) => (
                        <div
                          key={idx}
                          className="group relative h-36 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden"
                        >
                          <img
                            src={photoUrl}
                            alt={`Project Photo ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                            onClick={() => setPreviewPhotoUrl(photoUrl)}
                          />
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                            <button
                              onClick={() => setPreviewPhotoUrl(photoUrl)}
                              className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 transition"
                              title="View Full"
                            >
                              <Maximize2 className="w-4 h-4" />
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => handleDeletePhoto(idx)}
                                className="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 transition"
                                title="Delete Photo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* TAB 3: DOCUMENTS & ATTACHMENTS */}
              {/* ------------------------------------------------------------- */}
              {activeDetailTab === 'documents' && (
                <div className="space-y-6">
                  
                  {/* Admin Document Upload Bar */}
                  {isAdmin && (
                    <div className="p-4 rounded-2xl bg-slate-950 border border-dashed border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center space-x-3 text-xs">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                          <Paperclip className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{lang === 'bn' ? 'প্রকল্পের গুরুত্বপূর্ণ নথি / চুক্তিপত্র আপলোড করুন' : 'Upload Project Documents & Deeds'}</p>
                          <p className="text-slate-400 text-[11px]">{lang === 'bn' ? 'PDF, Word, Excel, দলিল বা স্ক্যান কপি (সর্বোচ্চ ১৫MB)' : 'PDF, Word, Excel, scanned deeds (Max 15MB)'}</p>
                        </div>
                      </div>

                      <label className="cursor-pointer px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-1.5 transition shrink-0">
                        <Upload className="w-4 h-4" />
                        <span>{lang === 'bn' ? 'নথি নির্বাচন করুন' : 'Select Files'}</span>
                        <input
                          ref={docInputRef}
                          type="file"
                          multiple
                          onChange={handleProjectDocUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}

                  {/* Documents List */}
                  {(!selectedProject.documents || selectedProject.documents.length === 0) ? (
                    <div className="p-10 text-center rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 space-y-2">
                      <Paperclip className="w-8 h-8 mx-auto text-slate-500" />
                      <p className="text-xs font-semibold">{lang === 'bn' ? 'এই প্রকল্পে এখনো কোনো অফিসিয়াল ফাইল বা দলিল সংযুক্ত করা হয়নি।' : 'No official documents or files attached yet.'}</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {selectedProject.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900/90 border border-slate-800 flex items-center justify-between transition gap-3"
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                              <FileCheck className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">{doc.name}</p>
                              <p className="text-[10px] text-slate-400 flex items-center gap-2">
                                <span>{doc.fileSize || 'File'}</span>
                                <span>•</span>
                                <span>{doc.uploadedAt}</span>
                                {doc.uploadedBy && (
                                  <>
                                    <span>•</span>
                                    <span>{doc.uploadedBy}</span>
                                  </>
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            <a
                              href={doc.fileUrl}
                              download={doc.name}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 text-xs font-semibold flex items-center gap-1 transition"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>{lang === 'bn' ? 'ডাউনলোড' : 'Download'}</span>
                            </a>

                            {isAdmin && (
                              <button
                                onClick={() => handleDeleteDocument(doc.id)}
                                className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                                title="Delete Document"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* TAB 4: WRITTEN UPDATES & PROGRESS LOGS */}
              {/* ------------------------------------------------------------- */}
              {activeDetailTab === 'updates' && (
                <div className="space-y-6">
                  
                  {/* Admin Add Written Update Form */}
                  {isAdmin && (
                    <form onSubmit={handleAddUpdate} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                        <Clock className="w-4 h-4" />
                        <span>{lang === 'bn' ? 'নতুন প্রকল্প অগ্রগতি নোট লিখুন' : 'Post Project Update / Progress Note'}</span>
                      </div>

                      <input
                        type="text"
                        value={newUpdateTitle}
                        onChange={(e) => setNewUpdateTitle(e.target.value)}
                        placeholder={lang === 'bn' ? 'আপডেটের শিরোনাম (যেমন: ৩য় কিস্তি বরাদ্দ ও কাজ শুরু)' : 'Update Title (e.g. Phase 2 Construction Started)'}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                      />

                      <textarea
                        value={newUpdateText}
                        onChange={(e) => setNewUpdateText(e.target.value)}
                        rows={3}
                        placeholder={lang === 'bn' ? 'বিস্তারিত অগ্রগতির বিবরণ লিখুন...' : 'Write detailed progress log or announcement...'}
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 resize-none"
                        required
                      />

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmittingUpdate || !newUpdateText.trim()}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1.5 transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{lang === 'bn' ? 'প্রকাশ করুন' : 'Publish Update'}</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Updates Timeline List */}
                  {(!selectedProject.updates || selectedProject.updates.length === 0) ? (
                    <div className="p-10 text-center rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 space-y-2">
                      <Clock className="w-8 h-8 mx-auto text-slate-500" />
                      <p className="text-xs font-semibold">{lang === 'bn' ? 'এই প্রকল্পে এখনো কোনো আপডেট পোস্ট করা হয়নি।' : 'No progress updates posted yet.'}</p>
                    </div>
                  ) : (
                    <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
                      {selectedProject.updates.map((update) => (
                        <div key={update.id} className="relative group space-y-1.5">
                          <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
                          
                          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-bold text-white">
                                {update.title || (lang === 'bn' ? 'অগ্রগতি বিবরণী' : 'Progress Note')}
                              </h5>
                              <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono">
                                <span>{update.date}</span>
                                {isAdmin && (
                                  <button
                                    onClick={() => handleDeleteUpdate(update.id)}
                                    className="text-slate-500 hover:text-rose-400 transition"
                                    title="Delete update"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                              {update.text}
                            </p>

                            {update.author && (
                              <p className="text-[10px] text-emerald-400/80 pt-1 font-semibold">
                                — {update.author}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CREATE NEW PROJECT MODAL */}
      {/* ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 my-auto max-h-[92vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {lang === 'bn' ? 'নতুন বিনিয়োগ প্রকল্প তৈরি করুন' : 'Create New Investment Project'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'bn' ? 'প্রকল্পের প্রাথমিক তথ্য ও বাজেট বিবরণী প্রদান করুন' : 'Provide basic project parameters and budget allocation'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              
              {/* Project Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {lang === 'bn' ? 'প্রকল্পের নাম (বাংলা)' : 'Project Title (Bengali)'} *
                  </label>
                  <input
                    type="text"
                    value={formData.titleBn}
                    onChange={(e) => setFormData(prev => ({ ...prev, titleBn: e.target.value }))}
                    placeholder="যেমন: নেক্সোরা অর্গানিক এগ্রো ফার্ম"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {lang === 'bn' ? 'প্রকল্পের নাম (ইংরেজি)' : 'Project Title (English)'}
                  </label>
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                    placeholder="e.g. Nexora Organic Agro Farm"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {lang === 'bn' ? 'ক্যাটাগরি' : 'Category'}
                  </label>
                  <select
                    value={formData.categoryBn}
                    onChange={(e) => {
                      const val = e.target.value;
                      let en = 'Halal Agro & Dairy';
                      if (val.includes('রিয়েল')) en = 'Real Estate & Lease';
                      else if (val.includes('বাণিজ্যিক')) en = 'Commerce & Trading';
                      else if (val.includes('প্রযুক্তি')) en = 'Tech & Startups';
                      else if (val.includes('লজিস্টিকস')) en = 'Supply Chain & Logistics';
                      setFormData(prev => ({ ...prev, categoryBn: val, categoryEn: en }));
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="হালাল কৃষি ও ডেইরি">হালাল কৃষি ও ডেইরি (Halal Agro & Dairy)</option>
                    <option value="রিয়েল এস্টেট ও বাণিজ্যিক স্পেস">রিয়েল এস্টেট ও বাণিজ্যিক স্পেস (Real Estate)</option>
                    <option value="বাণিজ্যিক ব্যবসা ও আমদানি-রপ্তানি">বাণিজ্যিক ব্যবসা ও আমদানি-রপ্তানি (Commerce)</option>
                    <option value="লজিস্টিকস ও কোল্ড স্টোরেজ">লজিস্টিকস ও কোল্ড স্টোরেজ (Logistics)</option>
                    <option value="তথ্যপ্রযুক্তি ও স্টার্টআপ উদ্যোগ">তথ্যপ্রযুক্তি ও স্টার্টআপ উদ্যোগ (IT & Tech)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {lang === 'bn' ? 'প্রকল্পের বর্তমান স্ট্যাটাস' : 'Project Status'}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ongoing">চলমান (Ongoing)</option>
                    <option value="planning">পরিকল্পনাধীন (Planning)</option>
                    <option value="completed">সম্পন্ন (Completed)</option>
                  </select>
                </div>
              </div>

              {/* Location & Start Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {lang === 'bn' ? 'প্রকল্পের অবস্থান / জেলা' : 'Location'}
                  </label>
                  <input
                    type="text"
                    value={formData.locationBn}
                    onChange={(e) => setFormData(prev => ({ ...prev, locationBn: e.target.value, locationEn: e.target.value }))}
                    placeholder="যেমন: সিলেট সদর, বাংলাদেশ"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {lang === 'bn' ? 'কার্যক্রম শুরুর তারিখ' : 'Start Date'}
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Budget Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {lang === 'bn' ? 'মোট সম্ভাব্য বাজেট (৳)' : 'Target Budget (BDT)'} *
                  </label>
                  <input
                    type="number"
                    value={formData.targetBudget}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetBudget: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {lang === 'bn' ? 'প্রাথমিক বরাদ্দকৃত তহবিল (৳)' : 'Initial Allocated Fund (BDT)'}
                  </label>
                  <input
                    type="number"
                    value={formData.raisedBudget}
                    onChange={(e) => setFormData(prev => ({ ...prev, raisedBudget: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Shariah Model & Expected Return */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {lang === 'bn' ? 'শরিয়াহ চুক্তির কাঠামো' : 'Shariah Model'}
                  </label>
                  <input
                    type="text"
                    value={formData.shariahModelBn}
                    onChange={(e) => setFormData(prev => ({ ...prev, shariahModelBn: e.target.value, shariahModelEn: e.target.value }))}
                    placeholder="মুদারাবা / মুশারাকা / ইজারা"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {lang === 'bn' ? 'প্রত্যাশিত লভ্যাংশ হার' : 'Projected Yield / Return'}
                  </label>
                  <input
                    type="text"
                    value={formData.expectedReturnBn}
                    onChange={(e) => setFormData(prev => ({ ...prev, expectedReturnBn: e.target.value, expectedReturnEn: e.target.value }))}
                    placeholder="১৮% - ২৪% বার্ষিক সম্ভাব্য মুনাফা"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {lang === 'bn' ? 'প্রকল্পের বিস্তারিত বিবরণ' : 'Detailed Description'}
                </label>
                <textarea
                  rows={3}
                  value={formData.descriptionBn}
                  onChange={(e) => setFormData(prev => ({ ...prev, descriptionBn: e.target.value, descriptionEn: e.target.value }))}
                  placeholder={lang === 'bn' ? 'প্রকল্পের উদ্দেশ্য, কর্মপরিকল্পনা ও বিনিয়োগ ক্ষেত্র বর্ণনা করুন...' : 'Explain the project scope, business model, and operational steps...'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              {/* Cover Photo Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  {lang === 'bn' ? 'কভার ফটো নির্বাচন করুন' : 'Project Cover Photo'}
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 rounded-xl bg-slate-950 border border-slate-700 overflow-hidden shrink-0">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition">
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'bn' ? 'ডিভাইস হতে ছবি আপলোড' : 'Upload from device'}</span>
                    <input
                      ref={coverImageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCoverPhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-lg shadow-emerald-900/30"
                >
                  <Check className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'প্রকল্প সংরক্ষণ করুন' : 'Save Project'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. EDIT PROJECT MODAL */}
      {/* ========================================================================= */}
      {showEditModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 my-auto max-h-[92vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {lang === 'bn' ? 'প্রকল্পের তথ্য সম্পাদনা করুন' : 'Edit Project Details'}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedProject.id}</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              
              {/* Project Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {lang === 'bn' ? 'প্রকল্পের নাম (বাংলা)' : 'Project Title (Bengali)'}
                  </label>
                  <input
                    type="text"
                    value={formData.titleBn}
                    onChange={(e) => setFormData(prev => ({ ...prev, titleBn: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {lang === 'bn' ? 'প্রকল্পের নাম (ইংরেজি)' : 'Project Title (English)'}
                  </label>
                  <input
                    type="text"
                    value={formData.titleEn}
                    onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Status & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {lang === 'bn' ? 'প্রকল্পের স্ট্যাটাস' : 'Status'}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="ongoing">চলমান (Ongoing)</option>
                    <option value="planning">পরিকল্পনাধীন (Planning)</option>
                    <option value="completed">সম্পন্ন (Completed)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {lang === 'bn' ? 'ক্যাটাগরি' : 'Category'}
                  </label>
                  <input
                    type="text"
                    value={formData.categoryBn}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoryBn: e.target.value, categoryEn: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Budgets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {lang === 'bn' ? 'মোট সম্ভাব্য বাজেট (৳)' : 'Target Budget'}
                  </label>
                  <input
                    type="number"
                    value={formData.targetBudget}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetBudget: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {lang === 'bn' ? 'বরাদ্দকৃত সংগৃহীত তহবিল (৳)' : 'Allocated Fund'}
                  </label>
                  <input
                    type="number"
                    value={formData.raisedBudget}
                    onChange={(e) => setFormData(prev => ({ ...prev, raisedBudget: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {lang === 'bn' ? 'প্রকল্পের বিবরণ' : 'Description'}
                </label>
                <textarea
                  rows={3}
                  value={formData.descriptionBn}
                  onChange={(e) => setFormData(prev => ({ ...prev, descriptionBn: e.target.value, descriptionEn: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Cover Photo Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  {lang === 'bn' ? 'কভার ফটো পরিবর্তন' : 'Change Cover Photo'}
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 rounded-xl bg-slate-950 border border-slate-700 overflow-hidden shrink-0">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition">
                    <Camera className="w-4 h-4 text-blue-400" />
                    <span>{lang === 'bn' ? 'নতুন ছবি নির্বাচন' : 'Choose New Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverPhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
                >
                  {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-1.5 transition"
                >
                  <Check className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'আপডেট সংরক্ষণ করুন' : 'Save Changes'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. DELETE PROJECT CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-white">
                {lang === 'bn' ? 'প্রকল্পটি নিশ্চিতভাবে মুছে ফেলবেন?' : 'Permanently Delete Project?'}
              </h4>
              <p className="text-xs text-slate-400">
                {lang === 'bn'
                  ? 'এই প্রকল্পের আওতাধীন সকল আপলোডকৃত ফাইল, ছবি ও অগ্রগতি বিবরণী সিস্টেম হতে চিরতরে মুছে যাবে।'
                  : 'All uploaded files, photos, and progress logs under this project will be permanently removed.'}
              </p>
            </div>

            <div className="flex justify-center space-x-3 pt-2">
              <button
                onClick={() => setShowDeleteConfirmModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
              >
                {lang === 'bn' ? 'না, বাতিল' : 'Cancel'}
              </button>
              <button
                onClick={() => confirmDeleteProject(showDeleteConfirmModal)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center space-x-1.5 transition shadow-lg shadow-rose-900/30"
              >
                <Trash2 className="w-4 h-4" />
                <span>{lang === 'bn' ? 'হ্যাঁ, মুছে ফেলুন' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. LIGHTBOX PHOTO ZOOM PREVIEW */}
      {/* ========================================================================= */}
      {previewPhotoUrl && (
        <div
          onClick={() => setPreviewPhotoUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg cursor-zoom-out animate-in fade-in"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-800 shadow-2xl">
            <img
              src={previewPhotoUrl}
              alt="Enlarged Project Photo"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl"
            />
            <button
              onClick={() => setPreviewPhotoUrl(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 border border-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
