import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  Award,
  BarChart2,
  Code2,
  Download,
  Edit2,
  ExternalLink,
  Folder,
  GripVertical,
  LayoutDashboard,
  Lock,
  LogOut,
  Plus,
  Save,
  Settings as SettingsIcon,
  Trash2,
  Upload,
  User,
  X,
} from 'lucide-react';
import { getPortfolio, savePortfolio, changePassword } from '../../lib/api';
import { emptyPortfolio, type Portfolio } from '../../types';
import { AlertStack, Loader, useAlerts } from './ui';
import { Field, Modal, SelectField, TextAreaField } from './Modals';
import { Analytics } from './Analytics';

type SectionId = 'overview' | 'analytics' | 'about' | 'skills' | 'projects' | 'certificates' | 'settings';

type ModalType = 'skill' | 'education' | 'experience' | 'expertise' | 'project' | 'certificate' | null;

const NAV: { id: SectionId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'about', label: 'About Me', icon: User },
  { id: 'skills', label: 'Skills', icon: Code2 },
  { id: 'projects', label: 'Projects', icon: Folder },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

function mergeAbout(p: Portfolio): Portfolio {
  return {
    about: { ...emptyPortfolio.about, ...(p.about ?? {}) },
    skills: p.skills ?? [],
    projects: p.projects ?? [],
    certificates: p.certificates ?? [],
  };
}

export function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [data, setData] = useState<Portfolio>(emptyPortfolio);
  const [section, setSection] = useState<SectionId>('overview');
  const [loader, setLoader] = useState({ show: true, text: 'Initializing Dashboard...' });
  const { alerts, showAlert } = useAlerts();

  const [modal, setModal] = useState<ModalType>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [interestInput, setInterestInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dragIndex = useRef<number | null>(null);
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getPortfolio()
      .then((p) => setData(mergeAbout(p)))
      .catch((e) => showAlert(e.message ?? 'Failed to load data', 'error'))
      .finally(() => setLoader({ show: false, text: '' }));
  }, [showAlert]);

  async function persist(next: Portfolio, successMsg: string, busyText = 'Saving...') {
    setLoader({ show: true, text: busyText });
    try {
      const saved = await savePortfolio(next);
      setData(mergeAbout(saved));
      showAlert(successMsg, 'success');
    } catch (e) {
      showAlert((e as Error).message, 'error');
    } finally {
      setLoader({ show: false, text: '' });
    }
  }

  const f = (k: string) => form[k] ?? '';
  const setF = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  function openModal(type: Exclude<ModalType, null>, index: number | null = null) {
    setModal(type);
    setEditIndex(index);
    if (index === null) {
      setForm({});
      return;
    }
    if (type === 'skill') {
      const s = data.skills[index];
      setForm({ name: s.name, category: s.category, level: String(s.level) });
    } else if (type === 'education') {
      const e = data.about.education[index];
      setForm({ degree: e.degree, institution: e.institution, year: e.year, description: e.description });
    } else if (type === 'experience') {
      const e = data.about.experience[index];
      setForm({ role: e.role, company: e.company, period: e.period, description: e.description });
    } else if (type === 'expertise') {
      const e = data.about.expertise[index];
      setForm({ area: e.area, description: e.description });
    } else if (type === 'project') {
      const p = data.projects[index];
      setForm({
        title: p.title,
        tech: p.tech,
        description: p.description,
        repoLink: p.repoLink ?? p.link ?? '',
        demoLink: p.demoLink ?? '',
        image: p.image ?? '',
      });
    } else if (type === 'certificate') {
      const c = data.certificates[index];
      setForm({ title: c.title, issuer: c.issuer, date: c.date, description: c.description, image: c.image ?? '' });
    }
  }

  function closeModal() {
    setModal(null);
    setEditIndex(null);
    setForm({});
  }

  function upsert<T>(list: T[], item: T): T[] {
    const next = [...list];
    if (editIndex !== null) next[editIndex] = item;
    else next.push(item);
    return next;
  }

  async function submitModal(e: FormEvent) {
    e.preventDefault();
    const editing = editIndex !== null;
    let next: Portfolio = data;
    let msg = '';
    if (modal === 'skill') {
      const skills = upsert(data.skills, { name: f('name'), category: f('category'), level: parseInt(f('level') || '0', 10) });
      next = { ...data, skills };
      msg = editing ? 'Skill updated successfully!' : 'Skill added successfully!';
    } else if (modal === 'education') {
      const education = upsert(data.about.education, { degree: f('degree'), institution: f('institution'), year: f('year'), description: f('description') });
      next = { ...data, about: { ...data.about, education } };
      msg = editing ? 'Education updated successfully!' : 'Education added successfully!';
    } else if (modal === 'experience') {
      const experience = upsert(data.about.experience, { role: f('role'), company: f('company'), period: f('period'), description: f('description') });
      next = { ...data, about: { ...data.about, experience } };
      msg = editing ? 'Experience updated successfully!' : 'Experience added successfully!';
    } else if (modal === 'expertise') {
      const expertise = upsert(data.about.expertise, { area: f('area'), description: f('description') });
      next = { ...data, about: { ...data.about, expertise } };
      msg = editing ? 'Expertise updated successfully!' : 'Expertise added successfully!';
    } else if (modal === 'project') {
      const projects = upsert(data.projects, {
        title: f('title'),
        tech: f('tech'),
        description: f('description'),
        repoLink: f('repoLink'),
        demoLink: f('demoLink'),
        image: f('image'),
      });
      next = { ...data, projects };
      msg = editing ? 'Project updated successfully!' : 'Project added successfully!';
    } else if (modal === 'certificate') {
      const certificates = upsert(data.certificates, { title: f('title'), issuer: f('issuer'), date: f('date'), description: f('description'), image: f('image') });
      next = { ...data, certificates };
      msg = editing ? 'Certificate updated successfully!' : 'Certificate added successfully!';
    }
    closeModal();
    await persist(next, msg);
  }

  async function deleteSkill(i: number) {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    await persist({ ...data, skills: data.skills.filter((_, x) => x !== i) }, 'Skill deleted successfully!', 'Deleting Skill...');
  }
  async function deleteProject(i: number) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    await persist({ ...data, projects: data.projects.filter((_, x) => x !== i) }, 'Project deleted successfully!', 'Deleting Project...');
  }
  async function deleteCertificate(i: number) {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    await persist({ ...data, certificates: data.certificates.filter((_, x) => x !== i) }, 'Certificate deleted successfully!', 'Deleting Certificate...');
  }
  async function deleteEducation(i: number) {
    if (!confirm('Are you sure you want to delete this education entry?')) return;
    await persist({ ...data, about: { ...data.about, education: data.about.education.filter((_, x) => x !== i) } }, 'Education entry deleted successfully!');
  }
  async function deleteExperience(i: number) {
    if (!confirm('Are you sure you want to delete this experience entry?')) return;
    await persist({ ...data, about: { ...data.about, experience: data.about.experience.filter((_, x) => x !== i) } }, 'Experience entry deleted successfully!');
  }
  async function deleteExpertise(i: number) {
    if (!confirm('Are you sure you want to delete this expertise area?')) return;
    await persist({ ...data, about: { ...data.about, expertise: data.about.expertise.filter((_, x) => x !== i) } }, 'Expertise area deleted successfully!');
  }

  async function addInterest() {
    const v = interestInput.trim();
    if (!v) return;
    setInterestInput('');
    await persist({ ...data, about: { ...data.about, interests: [...data.about.interests, v] } }, 'Interest added successfully!');
  }
  async function deleteInterest(i: number) {
    await persist({ ...data, about: { ...data.about, interests: data.about.interests.filter((_, x) => x !== i) } }, 'Interest removed successfully!');
  }

  function updateAbout(field: keyof Portfolio['about'], value: string) {
    setData((d) => ({ ...d, about: { ...d.about, [field]: value } }));
  }

  async function reorder(key: 'skills' | 'projects' | 'certificates', to: number) {
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from === null || from === to) return;
    const list = [...(data[key] as unknown[])];
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
    await persist({ ...data, [key]: list } as Portfolio, 'Order updated successfully!', 'Updating Order...');
  }

  async function saveBasicInfo(e: FormEvent) {
    e.preventDefault();
    await persist(data, 'Basic information updated successfully!');
  }
  async function savePhilosophy(e: FormEvent) {
    e.preventDefault();
    await persist(data, 'Philosophy updated successfully!');
  }

  async function submitPassword(e: FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) return showAlert('Passwords do not match!', 'error');
    if (newPassword.length < 6) return showAlert('Password must be at least 6 characters long!', 'error');
    setLoader({ show: true, text: 'Updating Password...' });
    try {
      await changePassword(newPassword);
      showAlert('Password updated successfully!', 'success');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showAlert((err as Error).message, 'error');
    } finally {
      setLoader({ show: false, text: '' });
    }
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    showAlert('Data exported successfully!', 'success');
  }
  async function importData(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as Portfolio;
      await persist(mergeAbout(parsed), 'Data imported successfully!', 'Importing Data...');
    } catch {
      showAlert('Invalid backup file.', 'error');
    }
    e.target.value = '';
  }

  async function saveAll() {
    if (!confirm('This will save all current data. Continue?')) return;
    await persist(data, 'All data saved successfully!', 'Saving All Data...');
  }

  const dragProps = (key: 'skills' | 'projects' | 'certificates', i: number) => ({
    draggable: true,
    onDragStart: () => (dragIndex.current = i),
    onDragOver: (e: React.DragEvent) => e.preventDefault(),
    onDrop: () => reorder(key, i),
  });

  return (
    <>
      <Loader show={loader.show} text={loader.text} />

      <header className="dashboard-header">
        <div className="dashboard-logo">
          <span style={{ color: '#EAB308' }}>PIKANOMWAAN</span>
          <span>.ADMIN</span>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn btn-primary" onClick={saveAll} title="Save all data">
            <Save size={16} /> Save All
          </button>
          <a href="#/" target="_blank" rel="noreferrer" className="btn btn-secondary">
            <ExternalLink size={16} /> View Site
          </a>
          <button className="btn btn-danger" onClick={onLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <div className="dashboard-main">
        <aside className="sidebar">
          <ul className="sidebar-nav">
            {NAV.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button className={section === id ? 'active' : ''} onClick={() => setSection(id)}>
                  <Icon size={16} /> {label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="content-area">
          <AlertStack alerts={alerts} />

          {section === 'overview' && (
            <section className="section active">
              <div className="section-header">
                <h1 className="section-title">Dashboard Overview</h1>
                <p className="section-description">Manage your portfolio content from one place</p>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{data.skills.length}</div>
                  <div className="stat-label">Skills</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{data.projects.length}</div>
                  <div className="stat-label">Projects</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{data.certificates.length}</div>
                  <div className="stat-label">Certificates</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{data.about.years || 0}</div>
                  <div className="stat-label">Years Experience</div>
                </div>
              </div>
              <div className="card">
                <h3 className="card-title">Quick Actions</h3>
                <div className="flex gap-2">
                  <button className="btn btn-primary" onClick={() => { setSection('skills'); openModal('skill'); }}>
                    <Plus size={16} /> Add Skill
                  </button>
                  <button className="btn btn-primary" onClick={() => { setSection('projects'); openModal('project'); }}>
                    <Plus size={16} /> Add Project
                  </button>
                  <button className="btn btn-secondary" onClick={exportData}>
                    <Download size={16} /> Export Data
                  </button>
                </div>
              </div>
            </section>
          )}

          {section === 'analytics' && <Analytics />}

          {section === 'about' && (
            <section className="section active">
              <div className="section-header">
                <h1 className="section-title">About Me</h1>
                <p className="section-description">Update your personal information and background</p>
              </div>

              <div className="card">
                <h3 className="card-title">Basic Information</h3>
                <form onSubmit={saveBasicInfo}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Years of Experience</label>
                      <input className="form-input" placeholder="e.g., 5+" value={data.about.years} onChange={(e) => updateAbout('years', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input className="form-input" placeholder="e.g., Bangkok, Thailand" value={data.about.location} onChange={(e) => updateAbout('location', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Availability Status</label>
                      <input className="form-input" placeholder="e.g., Open for Freelance" value={data.about.status} onChange={(e) => updateAbout('status', e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Short Description</label>
                    <textarea className="form-textarea" placeholder="Brief introduction about yourself" value={data.about.description} onChange={(e) => updateAbout('description', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Detailed Description</label>
                    <textarea className="form-textarea" placeholder="More detailed information about your background" value={data.about.detail} onChange={(e) => updateAbout('detail', e.target.value)} />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    <Save size={16} /> Save Basic Info
                  </button>
                </form>
              </div>

              <div className="card">
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                  <h3 className="card-title">Education</h3>
                  <button className="btn btn-primary btn-small" onClick={() => openModal('education')}>
                    <Plus size={14} /> Add Education
                  </button>
                </div>
                {data.about.education.length === 0 ? (
                  <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>No education entries added yet</p>
                ) : (
                  data.about.education.map((edu, i) => (
                    <div key={i} style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', marginBottom: '0.75rem', borderRadius: 4 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>{edu.degree}</h4>
                          <p style={{ color: '#EAB308', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{edu.institution}</p>
                          <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>{edu.year}</p>
                        </div>
                        <div className="table-actions">
                          <button className="btn btn-secondary btn-small btn-icon" onClick={() => openModal('education', i)}><Edit2 size={14} /></button>
                          <button className="btn btn-danger btn-small btn-icon" onClick={() => deleteEducation(i)}><Trash2 size={14} /></button>
                        </div>
                      </div>
                      <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.5 }}>{edu.description}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="card">
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                  <h3 className="card-title">Experience</h3>
                  <button className="btn btn-primary btn-small" onClick={() => openModal('experience')}>
                    <Plus size={14} /> Add Experience
                  </button>
                </div>
                {data.about.experience.length === 0 ? (
                  <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>No experience entries added yet</p>
                ) : (
                  data.about.experience.map((exp, i) => (
                    <div key={i} style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', marginBottom: '0.75rem', borderRadius: 4 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>{exp.role}</h4>
                          <p style={{ color: '#EAB308', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{exp.company}</p>
                          <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>{exp.period}</p>
                        </div>
                        <div className="table-actions">
                          <button className="btn btn-secondary btn-small btn-icon" onClick={() => openModal('experience', i)}><Edit2 size={14} /></button>
                          <button className="btn btn-danger btn-small btn-icon" onClick={() => deleteExperience(i)}><Trash2 size={14} /></button>
                        </div>
                      </div>
                      <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.5 }}>{exp.description}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="card">
                <h3 className="card-title">Philosophy &amp; Approach</h3>
                <form onSubmit={savePhilosophy}>
                  <div className="form-group">
                    <label className="form-label">Your Development Philosophy</label>
                    <textarea className="form-textarea" rows={4} placeholder="Describe your approach..." value={data.about.philosophy} onChange={(e) => updateAbout('philosophy', e.target.value)} />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    <Save size={16} /> Save Philosophy
                  </button>
                </form>
              </div>

              <div className="card">
                <h3 className="card-title">Interests &amp; Hobbies</h3>
                <div className="form-group">
                  <label className="form-label">Add Interest</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input className="form-input" placeholder="e.g., 3D Graphics & WebGL" value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addInterest(); } }} />
                    <button type="button" className="btn btn-primary" onClick={addInterest}><Plus size={16} /></button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                  {data.about.interests.length === 0 ? (
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>No interests added yet</p>
                  ) : (
                    data.about.interests.map((it, i) => (
                      <span key={i} style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 0.75rem', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                        {it}
                        <button onClick={() => deleteInterest(i)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}><X size={14} /></button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="card">
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                  <h3 className="card-title">Technical Expertise</h3>
                  <button className="btn btn-primary btn-small" onClick={() => openModal('expertise')}>
                    <Plus size={14} /> Add Expertise
                  </button>
                </div>
                {data.about.expertise.length === 0 ? (
                  <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>No expertise areas added yet</p>
                ) : (
                  data.about.expertise.map((exp, i) => (
                    <div key={i} style={{ background: '#1E1E1E', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', marginBottom: '0.75rem', borderRadius: 4 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600, flex: 1 }}>{exp.area}</h4>
                        <div className="table-actions" style={{ flexShrink: 0 }}>
                          <button className="btn btn-secondary btn-small btn-icon" onClick={() => openModal('expertise', i)}><Edit2 size={14} /></button>
                          <button className="btn btn-danger btn-small btn-icon" onClick={() => deleteExpertise(i)}><Trash2 size={14} /></button>
                        </div>
                      </div>
                      <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.5 }}>{exp.description}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {section === 'skills' && (
            <section className="section active">
              <div className="section-header flex-between">
                <div>
                  <h1 className="section-title">Skills Management</h1>
                  <p className="section-description">Add, edit, or remove your skills</p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal('skill')}><Plus size={16} /> Add Skill</button>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>Sort</th>
                    <th>Skill Name</th>
                    <th>Category</th>
                    <th>Level (%)</th>
                    <th style={{ width: 150 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.skills.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', color: '#6b7280' }}>No skills added yet</td></tr>
                  ) : (
                    data.skills.map((skill, i) => (
                      <tr key={i} {...dragProps('skills', i)}>
                        <td><div className="drag-handle"><GripVertical size={16} /></div></td>
                        <td><div className="text-truncate" title={skill.name}><strong>{skill.name}</strong></div></td>
                        <td><div className="text-truncate" title={skill.category}>{skill.category}</div></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ flex: 1, background: '#1E1E1E', height: 8, borderRadius: 4, overflow: 'hidden' }}>
                              <div style={{ width: `${skill.level}%`, height: '100%', background: '#EAB308' }} />
                            </div>
                            <span style={{ minWidth: 40 }}>{skill.level}%</span>
                          </div>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button className="btn btn-secondary btn-small btn-icon" onClick={() => openModal('skill', i)}><Edit2 size={14} /></button>
                            <button className="btn btn-danger btn-small btn-icon" onClick={() => deleteSkill(i)}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>
          )}

          {section === 'projects' && (
            <section className="section active">
              <div className="section-header flex-between">
                <div>
                  <h1 className="section-title">Projects Management</h1>
                  <p className="section-description">Manage your portfolio projects</p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal('project')}><Plus size={16} /> Add Project</button>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>Sort</th>
                    <th style={{ width: 80 }}>Image</th>
                    <th>Project Title</th>
                    <th>Tech Stack</th>
                    <th>Description</th>
                    <th style={{ width: 150 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.projects.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: '#6b7280' }}>No projects added yet</td></tr>
                  ) : (
                    data.projects.map((p, i) => (
                      <tr key={i} {...dragProps('projects', i)}>
                        <td><div className="drag-handle"><GripVertical size={16} /></div></td>
                        <td>
                          <div style={{ width: 60, height: 45, overflow: 'hidden', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }}>
                            <img src={p.image || 'https://via.placeholder.com/80x60?text=No+Image'} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        </td>
                        <td><div className="text-truncate" title={p.title}><strong>{p.title}</strong></div></td>
                        <td><span style={{ background: '#EAB308', color: '#000', padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>{p.tech}</span></td>
                        <td><div className="text-clamp-2" title={p.description}>{p.description}</div></td>
                        <td>
                          <div className="table-actions">
                            <button className="btn btn-secondary btn-small btn-icon" onClick={() => openModal('project', i)}><Edit2 size={14} /></button>
                            <button className="btn btn-danger btn-small btn-icon" onClick={() => deleteProject(i)}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>
          )}

          {section === 'certificates' && (
            <section className="section active">
              <div className="section-header flex-between">
                <div>
                  <h1 className="section-title">Certificates Management</h1>
                  <p className="section-description">Manage your professional certificates and achievements</p>
                </div>
                <button className="btn btn-primary" onClick={() => openModal('certificate')}><Plus size={16} /> Add Certificate</button>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>Sort</th>
                    <th style={{ width: 80 }}>Image</th>
                    <th>Certificate Title</th>
                    <th>Issuer</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th style={{ width: 150 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.certificates.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: 'center', color: '#6b7280' }}>No certificates added yet</td></tr>
                  ) : (
                    data.certificates.map((c, i) => (
                      <tr key={i} {...dragProps('certificates', i)}>
                        <td><div className="drag-handle"><GripVertical size={16} /></div></td>
                        <td>
                          <div style={{ width: 60, height: 45, overflow: 'hidden', borderRadius: 4, border: '1px solid rgba(255,255,255,0.1)' }}>
                            <img src={c.image || 'https://via.placeholder.com/80x60?text=No+Image'} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        </td>
                        <td><div className="text-truncate" title={c.title}><strong>{c.title}</strong></div></td>
                        <td><div className="text-truncate" title={c.issuer}>{c.issuer}</div></td>
                        <td><span style={{ background: '#EAB308', color: '#000', padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>{c.date}</span></td>
                        <td><div className="text-clamp-2" title={c.description}>{c.description}</div></td>
                        <td>
                          <div className="table-actions">
                            <button className="btn btn-secondary btn-small btn-icon" onClick={() => openModal('certificate', i)}><Edit2 size={14} /></button>
                            <button className="btn btn-danger btn-small btn-icon" onClick={() => deleteCertificate(i)}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>
          )}

          {section === 'settings' && (
            <section className="section active">
              <div className="section-header">
                <h1 className="section-title">Settings</h1>
                <p className="section-description">Manage your admin settings</p>
              </div>
              <div className="card">
                <h3 className="card-title">Change Password</h3>
                <form onSubmit={submitPassword}>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input type="password" className="form-input" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input type="password" className="form-input" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                  <button type="submit" className="btn btn-primary"><Lock size={16} /> Update Password</button>
                </form>
              </div>
              <div className="card">
                <h3 className="card-title">Data Management</h3>
                <div className="flex gap-2">
                  <button className="btn btn-primary" onClick={exportData}><Download size={16} /> Export Data</button>
                  <button className="btn btn-secondary" onClick={() => importRef.current?.click()}><Upload size={16} /> Import Data</button>
                  <input ref={importRef} type="file" accept=".json" style={{ display: 'none' }} onChange={importData} />
                </div>
                <p style={{ marginTop: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>Export your data as a backup or import previously saved data.</p>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Skill Modal */}
      <Modal open={modal === 'skill'} title={editIndex !== null ? 'Edit Skill' : 'Add Skill'} onClose={closeModal} onSubmit={submitModal} submitLabel="Save Skill">
        <Field label="Skill Name" value={f('name')} onChange={(v) => setF('name', v)} placeholder="e.g., JavaScript" required />
        <SelectField label="Category" value={f('category')} onChange={(v) => setF('category', v)} required options={[
          { value: '', label: 'Select category' }, { value: 'Frontend', label: 'Frontend' }, { value: 'Backend', label: 'Backend' },
          { value: 'Creative', label: 'Creative' }, { value: 'Database', label: 'Database' }, { value: 'DevOps', label: 'DevOps' }, { value: 'Other', label: 'Other' },
        ]} />
        <Field label="Skill Level (%)" type="number" value={f('level')} onChange={(v) => setF('level', v)} placeholder="0-100" min={0} max={100} required />
      </Modal>

      {/* Education Modal */}
      <Modal open={modal === 'education'} title={editIndex !== null ? 'Edit Education' : 'Add Education'} onClose={closeModal} onSubmit={submitModal} submitLabel="Save Education">
        <Field label="Degree/Program" value={f('degree')} onChange={(v) => setF('degree', v)} placeholder="e.g., Bachelor of Science in Computer Science" required />
        <Field label="Institution" value={f('institution')} onChange={(v) => setF('institution', v)} placeholder="e.g., Chulalongkorn University" required />
        <Field label="Year/Period" value={f('year')} onChange={(v) => setF('year', v)} placeholder="e.g., 2018 - 2022" required />
        <TextAreaField label="Description" value={f('description')} onChange={(v) => setF('description', v)} placeholder="Describe your studies, achievements, etc." required />
      </Modal>

      {/* Experience Modal */}
      <Modal open={modal === 'experience'} title={editIndex !== null ? 'Edit Experience' : 'Add Experience'} onClose={closeModal} onSubmit={submitModal} submitLabel="Save Experience">
        <Field label="Role/Position" value={f('role')} onChange={(v) => setF('role', v)} placeholder="e.g., Senior Frontend Developer" required />
        <Field label="Company" value={f('company')} onChange={(v) => setF('company', v)} placeholder="e.g., Digital Innovations Co." required />
        <Field label="Period" value={f('period')} onChange={(v) => setF('period', v)} placeholder="e.g., 2022 - Present" required />
        <TextAreaField label="Description" value={f('description')} onChange={(v) => setF('description', v)} placeholder="Describe your responsibilities and achievements..." required />
      </Modal>

      {/* Expertise Modal */}
      <Modal open={modal === 'expertise'} title={editIndex !== null ? 'Edit Expertise' : 'Add Expertise'} onClose={closeModal} onSubmit={submitModal} submitLabel="Save Expertise">
        <Field label="Expertise Area" value={f('area')} onChange={(v) => setF('area', v)} placeholder="e.g., Frontend Architecture" required />
        <TextAreaField label="Description" value={f('description')} onChange={(v) => setF('description', v)} placeholder="Describe your expertise in this area..." required />
      </Modal>

      {/* Project Modal */}
      <Modal open={modal === 'project'} title={editIndex !== null ? 'Edit Project' : 'Add Project'} onClose={closeModal} onSubmit={submitModal} submitLabel="Save Project">
        <Field label="Project Title" value={f('title')} onChange={(v) => setF('title', v)} placeholder="e.g., Awesome App" required />
        <Field label="Repository Link (GitHub)" type="url" value={f('repoLink')} onChange={(v) => setF('repoLink', v)} placeholder="https://github.com/username/repo" />
        <Field label="Demo Link (Live Website)" type="url" value={f('demoLink')} onChange={(v) => setF('demoLink', v)} placeholder="https://example.com" />
        <Field label="Tech Stack" value={f('tech')} onChange={(v) => setF('tech', v)} placeholder="e.g., React / Node.js" required />
        <TextAreaField label="Description" value={f('description')} onChange={(v) => setF('description', v)} placeholder="Describe your project" required />
        <Field label="Cover Image URL" type="url" value={f('image')} onChange={(v) => setF('image', v)} placeholder="https://raw.githubusercontent.com/.../project.jpg" />
      </Modal>

      {/* Certificate Modal */}
      <Modal open={modal === 'certificate'} title={editIndex !== null ? 'Edit Certificate' : 'Add Certificate'} onClose={closeModal} onSubmit={submitModal} submitLabel="Save Certificate">
        <Field label="Certificate Title" value={f('title')} onChange={(v) => setF('title', v)} placeholder="e.g., AWS Certified Solutions Architect" required />
        <Field label="Issuer" value={f('issuer')} onChange={(v) => setF('issuer', v)} placeholder="e.g., Amazon Web Services" required />
        <Field label="Date" value={f('date')} onChange={(v) => setF('date', v)} placeholder="e.g., 2024" required />
        <TextAreaField label="Description" value={f('description')} onChange={(v) => setF('description', v)} placeholder="Describe the certificate" required />
        <Field label="Certificate Image URL" type="url" value={f('image')} onChange={(v) => setF('image', v)} placeholder="https://raw.githubusercontent.com/.../cert.jpg" />
      </Modal>
    </>
  );
}
