'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Briefcase,
  Award,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  TrendingUp,
  FileCheck2,
  ShieldCheck,
  Plus,
  Send,
  UserCheck,
  Star,
  Check,
  Sparkles,
  Building2,
  Sprout,
  Truck,
  BookOpen,
  Landmark,
} from 'lucide-react';

export type WorkforceRole = 'WORKER' | 'CONTRACTOR' | 'FARMER';
export type WorkforceTab =
  | 'profile'
  | 'jobs'
  | 'post-job'
  | 'applications-offers'
  | 'attendance'
  | 'earnings-history'
  | 'farm-bridge';

export default function WorkforcePage() {
  const [activeRole, setActiveRole] = useState<WorkforceRole>('WORKER');
  const [activeTab, setActiveTab] = useState<WorkforceTab>('profile');

  // Worker State
  const [workerProfile, setWorkerProfile] = useState({
    id: 'wp-laxman-004',
    name: 'Laxman Naik',
    phone: '+91 98483 44556',
    village: 'Kotbaspalli',
    mandal: 'Tandur',
    district: 'Vikarabad',
    experienceYears: 6,
    serviceRadiusKm: 20,
    expectedDailyRate: 650,
    expectedHourlyRate: 90,
    employmentType: 'DAILY_WAGE',
    availabilityStatus: 'LOOKING_FOR_WORK',
    rating: 4.85,
    completedJobs: 92,
    reliabilityRate: 98,
    bio: 'Specialist in calibrated agrochemical spraying, cotton picking, and harvester operation with 6+ years field experience.',
  });

  // Skills State
  const [skills] = useState([
    {
      id: 'ws-01',
      skillCode: 'SPRAYER_OPERATOR',
      name: 'Sprayer Operator',
      category: 'Crop Protection',
      level: 'EXPERT',
      years: 6,
      verified: true,
      isPrimary: true,
    },
    {
      id: 'ws-02',
      skillCode: 'GENERAL_AGRICULTURAL_WORKER',
      name: 'General Agricultural Labor',
      category: 'Field Labor',
      level: 'ADVANCED',
      years: 6,
      verified: true,
      isPrimary: false,
    },
    {
      id: 'ws-03',
      skillCode: 'AGRICULTURAL_MACHINERY_OPERATOR',
      name: 'Harvester & Machinery Operator',
      category: 'Machinery Operation',
      level: 'INTERMEDIATE',
      years: 3,
      verified: true,
      isPrimary: false,
    },
  ]);

  // Certifications State
  const [certifications] = useState([
    {
      id: 'cert-01',
      name: 'Certified Agricultural Power Sprayer Operator & Chemical Safety',
      issuer: 'Telangana State Agricultural Extension & PJTSAU',
      certNumber: 'PJTSAU-EXT-2024-8891',
      issueDate: '2024-04-10',
      expiryDate: '2027-04-09',
      status: 'VERIFIED',
    },
    {
      id: 'cert-02',
      name: 'Precision Harvester Equipment Operation Certificate',
      issuer: 'National Skill Development Corporation (NSDC)',
      certNumber: 'NSDC-AGR-2023-4412',
      issueDate: '2023-08-15',
      expiryDate: '2028-08-14',
      status: 'VERIFIED',
    },
  ]);

  // Jobs State
  const [jobs, setJobs] = useState([
    {
      id: 'job-post-001',
      title: 'Cotton Picking & Manual Harvesting Crew (50 Acres)',
      employer: 'M. Anjaneyulu (Sri Sai Logistics & Contracting)',
      employerType: 'CONTRACTOR',
      jobType: 'HARVESTING',
      location: 'Tangipalli / Kotbaspalli Farmlands, Tandur',
      distanceKm: 3.5,
      startDate: '2026-09-15',
      endDate: '2026-09-22',
      startTime: '07:00',
      endTime: '17:00',
      workersRequired: 20,
      dailyRate: 700,
      description: 'Urgent requirement for 20 experienced agricultural laborers for hand-picking clean seed cotton. Daily transport and clean drinking water provided.',
      requiredSkill: 'General Agricultural Labor',
      minExpYears: 1,
      certificationRequired: false,
      status: 'PUBLISHED',
      staffingStats: { required: 20, applied: 34, shortlisted: 22, offered: 20, accepted: 18, shortage: 2 },
    },
    {
      id: 'job-post-002',
      title: 'Precision Bio-Fertilizer & Micronutrient Sprayer Operator',
      employer: 'Ravi Kumar (Farmer)',
      employerType: 'FARMER',
      jobType: 'SPRAYING',
      location: 'Ravi North Plot, Tangipalli (4.5 Acres)',
      distanceKm: 2.1,
      startDate: '2026-09-12',
      endDate: '2026-09-13',
      startTime: '06:30',
      endTime: '11:30',
      workersRequired: 2,
      dailyRate: 750,
      description: 'Need 2 certified power sprayer operators with calibrated nozzle handling for 4.5 acres Bt-Cotton pest control.',
      requiredSkill: 'Sprayer Operator',
      minExpYears: 2,
      certificationRequired: true,
      status: 'PUBLISHED',
      staffingStats: { required: 2, applied: 5, shortlisted: 3, offered: 2, accepted: 2, shortage: 0 },
    },
    {
      id: 'job-post-003',
      title: 'Drip Irrigation Maintenance & Emitter Flushing Crew',
      employer: 'Tangipalli Rythu Seva Samithi',
      employerType: 'FPO',
      jobType: 'IRRIGATION',
      location: 'Tandur Horticultural Cluster (30 Acres)',
      distanceKm: 5.8,
      startDate: '2026-09-18',
      endDate: '2026-09-20',
      startTime: '08:00',
      endTime: '16:00',
      workersRequired: 6,
      dailyRate: 650,
      description: 'Lateral pipe alignment, acid flushing, and filter backwash for chilli and vegetable drip zones.',
      requiredSkill: 'Irrigation Worker',
      minExpYears: 1,
      certificationRequired: false,
      status: 'PUBLISHED',
      staffingStats: { required: 6, applied: 9, shortlisted: 6, offered: 6, accepted: 5, shortage: 1 },
    },
  ]);

  // Applications State
  const [applications, setApplications] = useState([
    {
      id: 'app-01',
      jobId: 'job-post-001',
      jobTitle: 'Cotton Picking & Manual Harvesting Crew (50 Acres)',
      workerId: 'wp-laxman-004',
      workerName: 'Laxman Naik',
      workerPhone: '+91 98483 44556',
      rating: 4.85,
      skill: 'General Agricultural Labor (ADVANCED)',
      expectedPay: 700,
      status: 'SHORTLISTED',
      appliedAt: '2026-09-02',
      message: 'Experienced in rapid hand-picking cotton with minimal leaf impurities.',
    },
    {
      id: 'app-02',
      jobId: 'job-post-002',
      jobTitle: 'Precision Bio-Fertilizer & Micronutrient Sprayer Operator',
      workerId: 'wp-laxman-004',
      workerName: 'Laxman Naik',
      workerPhone: '+91 98483 44556',
      rating: 4.85,
      skill: 'Sprayer Operator (EXPERT)',
      expectedPay: 750,
      status: 'OFFERED',
      appliedAt: '2026-09-06',
      message: 'Certified in chemical safety with PJTSAU diploma. Ready for 4.5 acres bio-spray.',
    },
  ]);

  // Offers State
  const [offers, setOffers] = useState([
    {
      id: 'offer-01',
      jobId: 'job-post-002',
      jobTitle: 'Precision Bio-Fertilizer & Micronutrient Sprayer Operator',
      employer: 'Ravi Kumar (Farmer)',
      payAmount: 750,
      payType: 'DAILY',
      startDate: '2026-09-12',
      endDate: '2026-09-13',
      message: 'Offer for 2 days of bio-spraying on 4.5 acres Bt-Cotton. Power sprayer provided.',
      status: 'OFFERED',
      expiresAt: '2026-09-11',
    },
  ]);

  // Assignments State
  const [assignments, setAssignments] = useState([
    {
      id: 'asgn-01',
      jobId: 'job-post-002',
      jobTitle: 'Precision Bio-Fertilizer & Micronutrient Sprayer Operator',
      employer: 'Ravi Kumar (Farmer)',
      workerName: 'Laxman Naik',
      startDate: '2026-09-12',
      endDate: '2026-09-13',
      payAmount: 750,
      status: 'ACTIVE',
      assignedAt: '2026-09-06',
    },
  ]);

  // Attendance Records State
  const [attendanceRecords, setAttendanceRecords] = useState([
    {
      id: 'att-01',
      assignmentId: 'asgn-01',
      date: '2026-09-12',
      checkInTime: '06:35 AM',
      checkOutTime: '11:45 AM',
      hoursWorked: 5.1,
      status: 'PRESENT',
      method: 'CONTRACTOR_CONFIRMED',
      verifiedBy: 'Ravi Kumar (Farmer)',
      notes: 'Sprayed 4.5 acres cotton field with micronutrient formula. On time and clean operation.',
    },
  ]);

  // Work History State
  const [workHistory] = useState([
    {
      id: 'hist-01',
      jobTitle: 'Cotton Sowing & Intercultural Weeding',
      employer: 'Sri Sai Agri Contracting',
      startDate: '2026-06-10',
      endDate: '2026-06-15',
      daysWorked: 5,
      hoursWorked: 40,
      earnings: 3250,
      rating: 4.9,
      feedback: 'Extremely hardworking and punctual. High quality line-sowing.',
    },
    {
      id: 'hist-02',
      jobTitle: 'Tandur Redgram Foliar Spraying Operation',
      employer: 'Tangipalli Rythu Seva Samithi (FPO)',
      startDate: '2026-07-20',
      endDate: '2026-07-22',
      daysWorked: 3,
      hoursWorked: 24,
      earnings: 2250,
      rating: 4.8,
      feedback: 'Expert handling of power sprayers with zero chemical waste.',
    },
    {
      id: 'hist-03',
      jobTitle: 'Precision Bio-Fertilizer & Micronutrient Sprayer Operator',
      employer: 'Ravi Kumar (Farmer)',
      startDate: '2026-09-12',
      endDate: '2026-09-13',
      daysWorked: 2,
      hoursWorked: 10.2,
      earnings: 1500,
      rating: 5.0,
      feedback: 'Excellent timing, covered full 4.5 acres seamlessly.',
    },
  ]);

  // Farm Planner Bridge Simulation State
  const [farmActivities] = useState([
    {
      id: 'act-01',
      crop: 'Bt-Cotton (RCH-659)',
      plot: 'North Plot (4.5 Acres)',
      activityName: 'Cotton 2nd Foliar Nutrition & Pest Spraying',
      scheduledDate: '2026-09-24',
      workersRequired: 2,
      requiredSkill: 'Sprayer Operator',
      estimatedDailyRate: 750,
      status: 'PLANNER_READY',
    },
    {
      id: 'act-02',
      crop: 'Bt-Cotton (RCH-659)',
      plot: 'Main Field (50.0 Acres)',
      activityName: 'Cotton 1st Manual Bolls Harvest Picking',
      scheduledDate: '2026-10-15',
      workersRequired: 25,
      requiredSkill: 'General Agricultural Labor',
      estimatedDailyRate: 700,
      status: 'PLANNER_READY',
    },
  ]);

  // Modal States
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(jobs[0]);
  const [applyPitch, setApplyPitch] = useState('');
  const [applyExpectedWage, setApplyExpectedWage] = useState('700');

  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobType, setNewJobType] = useState('HARVESTING');
  const [newJobWorkers, setNewJobWorkers] = useState('10');
  const [newJobDailyRate, setNewJobDailyRate] = useState('700');
  const [newJobStartDate, setNewJobStartDate] = useState('2026-09-20');
  const [newJobDesc, setNewJobDesc] = useState('');

  // Handlers
  const handleApplySubmit = () => {
    const newApp = {
      id: `app-${Date.now().toString(36)}`,
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      workerId: workerProfile.id,
      workerName: workerProfile.name,
      workerPhone: workerProfile.phone,
      rating: workerProfile.rating,
      skill: `${selectedJob.requiredSkill} (EXPERT)`,
      expectedPay: parseInt(applyExpectedWage) || selectedJob.dailyRate,
      status: 'SUBMITTED',
      appliedAt: new Date().toISOString().split('T')[0],
      message: applyPitch || 'Available and ready for assigned field work.',
    };

    setApplications((prev) => [newApp, ...prev]);
    setShowApplyModal(false);
    setActiveTab('applications-offers');
  };

  const handleCreateJob = () => {
    const newJ = {
      id: `job-post-${Date.now().toString(36)}`,
      title: newJobTitle || 'Agricultural Work Crew',
      employer: activeRole === 'CONTRACTOR' ? 'Sri Sai Agri Contracting' : 'Farmer Ravi Kumar',
      employerType: activeRole,
      jobType: newJobType,
      location: 'Tandur Agricultural Mandal',
      distanceKm: 4.0,
      startDate: newJobStartDate,
      endDate: '2026-09-25',
      startTime: '07:00',
      endTime: '17:00',
      workersRequired: parseInt(newJobWorkers) || 5,
      dailyRate: parseInt(newJobDailyRate) || 700,
      description: newJobDesc || 'Standard agricultural field labor requirement.',
      requiredSkill: 'General Agricultural Labor',
      minExpYears: 1,
      certificationRequired: false,
      status: 'PUBLISHED',
      staffingStats: {
        required: parseInt(newJobWorkers) || 5,
        applied: 0,
        shortlisted: 0,
        offered: 0,
        accepted: 0,
        shortage: parseInt(newJobWorkers) || 5,
      },
    };

    setJobs((prev) => [newJ, ...prev]);
    setShowPostJobModal(false);
    setActiveTab('jobs');
  };

  const handleAcceptOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'ACCEPTED' } : o))
    );
    const targetOffer = offers.find((o) => o.id === offerId);
    if (targetOffer) {
      const newAsgn = {
        id: `asgn-${Date.now().toString(36)}`,
        jobId: targetOffer.jobId,
        jobTitle: targetOffer.jobTitle,
        employer: targetOffer.employer,
        workerName: workerProfile.name,
        startDate: targetOffer.startDate,
        endDate: targetOffer.endDate,
        payAmount: targetOffer.payAmount,
        status: 'CONFIRMED',
        assignedAt: new Date().toISOString().split('T')[0],
      };
      setAssignments((prev) => [newAsgn, ...prev]);
    }
  };

  const handleCheckIn = (assignmentId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newRecord = {
      id: `att-${Date.now().toString(36)}`,
      assignmentId,
      date: today,
      checkInTime: nowTime,
      checkOutTime: null as any,
      hoursWorked: 0,
      status: 'PRESENT',
      method: 'CONTRACTOR_CONFIRMED',
      verifiedBy: 'Site Supervisor',
      notes: 'Worker checked in on site via mobile GPS & QR.',
    };
    setAttendanceRecords((prev) => [newRecord, ...prev]);
  };

  const handleCheckOut = (recordId: string) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAttendanceRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              checkOutTime: nowTime,
              hoursWorked: 8.0,
              notes: `${r.notes} | Full day shift completed.`,
            }
          : r
      )
    );
  };

  const handleBridgeFarmActivity = (activity: any) => {
    const newJ = {
      id: `job-from-farm-${Date.now().toString(36)}`,
      title: `${activity.crop} - ${activity.activityName}`,
      employer: 'Ravi Kumar (Farmer)',
      employerType: 'FARMER',
      jobType: activity.activityName.includes('Spray') ? 'SPRAYING' : 'HARVESTING',
      location: `Ravi Farm, ${activity.plot}`,
      distanceKm: 2.0,
      startDate: activity.scheduledDate,
      endDate: activity.scheduledDate,
      startTime: '07:00',
      endTime: '17:00',
      workersRequired: activity.workersRequired,
      dailyRate: activity.estimatedDailyRate,
      description: `Automated requirement dispatched from Farm Planner for ${activity.activityName}.`,
      requiredSkill: activity.requiredSkill,
      minExpYears: 1,
      certificationRequired: activity.requiredSkill.includes('Sprayer'),
      status: 'PUBLISHED',
      staffingStats: {
        required: activity.workersRequired,
        applied: 0,
        shortlisted: 0,
        offered: 0,
        accepted: 0,
        shortage: activity.workersRequired,
      },
    };

    setJobs((prev) => [newJ, ...prev]);
    setActiveTab('jobs');
  };

  const totalEarnings = workHistory.reduce((s, h) => s + h.earnings, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 text-white border-b border-teal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 border-b border-teal-800/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1">
              ← Return to Main Grid
            </Link>
            <span className="text-slate-600">|</span>
            <span className="text-teal-200 font-semibold">Rural Workforce & Skills Hub</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-300">
            <Link href="/marketplace" className="hover:text-white transition flex items-center gap-1">
              <Sprout className="w-3.5 h-3.5" /> B2B Marketplace
            </Link>
            <Link href="/logistics" className="hover:text-white transition flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" /> Logistics
            </Link>
            <Link href="/financial" className="hover:text-white transition flex items-center gap-1">
              <Landmark className="w-3.5 h-3.5" /> Financial Hub
            </Link>
            <Link href="/knowledge" className="hover:text-white transition flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Knowledge Hub
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-2 border border-teal-500/30">
                <Users className="w-3.5 h-3.5" /> Milestone 19 — Rural Workforce & Skills Marketplace
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                🛠️ Rural Workforce, Jobs & Skills Grid
              </h1>
              <p className="mt-2 text-sm text-teal-100/80 max-w-2xl">
                Verified skill passports • Agricultural jobs & harvest crews • Deterministic worker matching •
                Daily attendance & digital verification • Milestone payouts & work history
              </p>
            </div>

            {/* Persona Switcher */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="bg-teal-950/80 border border-teal-600/40 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs text-teal-200">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Verified Rural Employment Infrastructure</span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-1.5 flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium px-1">Role:</span>
                <select
                  value={activeRole}
                  onChange={(e) => setActiveRole(e.target.value as WorkforceRole)}
                  className="bg-slate-900 border border-slate-700 text-teal-300 rounded px-2.5 py-1 font-semibold focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="WORKER">👨‍🌾 Skilled Worker (Laxman Naik)</option>
                  <option value="CONTRACTOR">🏢 Contractor (M. Anjaneyulu)</option>
                  <option value="FARMER">🌾 Farmer Employer (Ravi Kumar)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-teal-800/60 overflow-x-auto">
          <div className="flex space-x-1 py-2">
            {[
              { id: 'profile', label: '👨‍🌾 Worker Passport', icon: UserCheck, count: `${skills.length} Skills` },
              { id: 'jobs', label: '💼 Job Discovery', icon: Briefcase, count: `${jobs.length} Active` },
              { id: 'post-job', label: '📢 Bulk Staffing Cockpit', icon: Users, count: 'Post & Staff' },
              { id: 'applications-offers', label: '📩 Applications & Offers', icon: Send, count: `${offers.length} Offers` },
              { id: 'attendance', label: '⏱️ Daily Attendance', icon: Clock, count: `${attendanceRecords.length} Today` },
              { id: 'earnings-history', label: '💰 Earnings & History', icon: TrendingUp, count: `₹${totalEarnings.toLocaleString()}` },
              { id: 'farm-bridge', label: '🌾 Farm Planner Bridge', icon: Sprout, count: `${farmActivities.length} Activities` },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as WorkforceTab)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'text-teal-200 hover:bg-teal-800/40 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      isActive ? 'bg-teal-800 text-teal-100' : 'bg-teal-950/60 text-teal-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* TAB 1: WORKER PASSPORT & PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Profile Overview Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-teal-100 border border-teal-300 flex items-center justify-center text-2xl font-bold text-teal-800">
                    👨‍🌾
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-slate-900">{workerProfile.name}</h2>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3" /> Aadhaar Verified
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {workerProfile.village}, {workerProfile.mandal}, {workerProfile.district} • Radius: {workerProfile.serviceRadiusKm} km
                    </p>
                    <p className="text-xs text-slate-600 mt-2 max-w-2xl">{workerProfile.bio}</p>
                  </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                    <div className="flex items-center justify-center gap-1 text-amber-500 font-extrabold text-lg">
                      <Star className="w-4 h-4 fill-amber-400" /> {workerProfile.rating}
                    </div>
                    <div className="text-[11px] text-slate-500">Rating (92 Reviews)</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                    <div className="text-lg font-extrabold text-teal-700">{workerProfile.completedJobs}</div>
                    <div className="text-[11px] text-slate-500">Jobs Completed</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                    <div className="text-lg font-extrabold text-emerald-700">{workerProfile.reliabilityRate}%</div>
                    <div className="text-[11px] text-slate-500">Reliability Rate</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                    <div className="text-lg font-extrabold text-slate-800">₹{workerProfile.expectedDailyRate}</div>
                    <div className="text-[11px] text-slate-500">Expected / Day</div>
                  </div>
                </div>
              </div>

              {/* Status Bar */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-600">Work Status:</span>
                  <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs font-bold">
                    {['LOOKING_FOR_WORK', 'AVAILABLE', 'BUSY'].map((st) => (
                      <button
                        key={st}
                        onClick={() => setWorkerProfile((p) => ({ ...p, availabilityStatus: st }))}
                        className={`px-3 py-1 rounded-md transition ${
                          workerProfile.availabilityStatus === st
                            ? 'bg-teal-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {st.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-3">
                  <span>Daily Rate: ₹{workerProfile.expectedDailyRate}</span>
                  <span>•</span>
                  <span>Hourly Rate: ₹{workerProfile.expectedHourlyRate}/hr</span>
                </div>
              </div>
            </div>

            {/* Skills & Certifications 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Verified Skills */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-teal-600" /> Verified Skill Passport
                  </h3>
                  <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                    {skills.length} Certified
                  </span>
                </div>

                <div className="space-y-3">
                  {skills.map((sk) => (
                    <div
                      key={sk.id}
                      className="p-3 rounded-xl border border-slate-200 hover:border-teal-300 transition bg-slate-50/60 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-sm">{sk.name}</span>
                          {sk.isPrimary && (
                            <span className="text-[10px] bg-teal-100 text-teal-800 font-extrabold px-1.5 py-0.5 rounded">
                              PRIMARY
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {sk.category} • {sk.years} Years Experience
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            sk.level === 'EXPERT'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : sk.level === 'ADVANCED'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {sk.level}
                        </span>
                        {sk.verified && (
                          <div className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-1 mt-1">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications & Diplomas */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-emerald-600" /> Government & Institutional Certifications
                  </h3>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {certifications.length} Active
                  </span>
                </div>

                <div className="space-y-3">
                  {certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-3 rounded-xl border border-slate-200 hover:border-emerald-300 transition bg-emerald-50/20"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-slate-800 text-xs">{cert.name}</h4>
                          <p className="text-[11px] text-slate-500 mt-1">{cert.issuer}</p>
                          <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 font-mono">
                            <span>Lic: {cert.certNumber}</span>
                            <span>Expires: {cert.expiryDate}</span>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                          <Check className="w-3 h-3" /> {cert.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: JOB DISCOVERY & WORKER APPLY */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">💼 Agricultural Jobs & Work Opportunities</h2>
                <p className="text-xs text-slate-500">
                  Showing active verified jobs within {workerProfile.serviceRadiusKm} km of {workerProfile.village}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPostJobModal(true)}
                  className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Post New Job Opportunity
                </button>
              </div>
            </div>

            {/* Job Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded-md text-[10px] font-extrabold uppercase tracking-wide">
                        {job.jobType}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        ₹{job.dailyRate} / day
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm mb-1 leading-snug">{job.title}</h3>
                    <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400" /> {job.employer}
                    </p>

                    <p className="text-xs text-slate-600 line-clamp-2 mb-4">{job.description}</p>

                    <div className="space-y-1.5 py-3 border-t border-slate-100 text-xs text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> Distance:
                        </span>
                        <span className="font-semibold text-slate-800">{job.distanceKm} km away</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> Dates:
                        </span>
                        <span className="font-semibold text-slate-800">
                          {job.startDate} to {job.endDate || 'Single day'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" /> Crew Required:
                        </span>
                        <span className="font-extrabold text-teal-700">
                          {job.workersRequired} Workers ({job.staffingStats?.shortage || 0} Open)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setApplyExpectedWage(job.dailyRate.toString());
                        setShowApplyModal(true);
                      }}
                      className="w-full py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Apply for Job (₹{job.dailyRate}/day)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: POST JOB & BULK STAFFING COCKPIT */}
        {activeTab === 'post-job' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">📢 Bulk Staffing Pipeline & Workforce Allocation</h2>
                  <p className="text-xs text-slate-500">
                    Real-time recruitment funnel for contractors, FPOs, cooperatives, and farm operations
                  </p>
                </div>
                <button
                  onClick={() => setShowPostJobModal(true)}
                  className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Create New Job Requirement
                </button>
              </div>

              {/* Staffing Overview Pipeline */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 py-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <div className="text-xl font-extrabold text-slate-900">28</div>
                  <div className="text-[11px] text-slate-500">Workers Required</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-center">
                  <div className="text-xl font-extrabold text-blue-700">48</div>
                  <div className="text-[11px] text-blue-600">Total Applied</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 text-center">
                  <div className="text-xl font-extrabold text-purple-700">31</div>
                  <div className="text-[11px] text-purple-600">Shortlisted</div>
                </div>
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center">
                  <div className="text-xl font-extrabold text-amber-700">28</div>
                  <div className="text-[11px] text-amber-600">Offers Dispatched</div>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-center">
                  <div className="text-xl font-extrabold text-emerald-700">25</div>
                  <div className="text-[11px] text-emerald-600">Accepted & Confirmed</div>
                </div>
                <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-center">
                  <div className="text-xl font-extrabold text-rose-700">3</div>
                  <div className="text-[11px] text-rose-600">Active Shortage</div>
                </div>
              </div>
            </div>

            {/* Active Staffing Projects Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 bg-slate-50/80 border-b border-slate-200">
                <h3 className="font-bold text-slate-800 text-xs">Active Employer Job Requirements</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {jobs.map((j) => (
                  <div key={j.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{j.title}</span>
                        <span className="text-[10px] bg-slate-100 font-extrabold text-slate-600 px-2 py-0.5 rounded">
                          {j.jobType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        📍 {j.location} • Dates: {j.startDate} to {j.endDate} • Wage: ₹{j.dailyRate}/day
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Mini Staffing Progress Gauge */}
                      <div className="text-right">
                        <div className="text-xs font-extrabold text-slate-800">
                          {j.staffingStats?.accepted || 0} / {j.workersRequired} Staffed
                        </div>
                        <div className="w-32 bg-slate-100 rounded-full h-2 mt-1">
                          <div
                            className="bg-teal-600 h-2 rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                ((j.staffingStats?.accepted || 0) / j.workersRequired) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          j.staffingStats?.shortage === 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {j.staffingStats?.shortage === 0 ? 'Fully Staffed' : `${j.staffingStats?.shortage} Shortage`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: APPLICATIONS & OFFERS */}
        {activeTab === 'applications-offers' && (
          <div className="space-y-6">
            {/* Binding Job Offers Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Formal Binding Job Offers Received
              </h3>
              <div className="space-y-3">
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{offer.jobTitle}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            offer.status === 'ACCEPTED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {offer.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Employer: {offer.employer} • Start: {offer.startDate} to {offer.endDate}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{offer.message}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-extrabold text-emerald-700">₹{offer.payAmount} / day</div>
                        <div className="text-[10px] text-slate-400">Expires {offer.expiresAt}</div>
                      </div>

                      {offer.status === 'OFFERED' && (
                        <button
                          onClick={() => handleAcceptOffer(offer.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Accept Offer
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submitted Applications */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Submitted Job Applications</h3>
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-xs">{app.jobTitle}</h4>
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Applied On: {app.appliedAt} • Expected Wage: ₹{app.expectedPay}/day
                      </p>
                      <p className="text-xs text-slate-600 mt-1">{app.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DAILY ATTENDANCE CONSOLE */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">⏱️ Daily Attendance & Site Check-in</h2>
                  <p className="text-xs text-slate-500">
                    Tamper-proof digital check-in with supervisor confirmation and OTP verification
                  </p>
                </div>
              </div>

              {/* Active Assignments Ready for Check-in */}
              <div className="space-y-3 mb-6">
                {assignments.map((asgn) => (
                  <div
                    key={asgn.id}
                    className="p-4 rounded-xl border border-teal-200 bg-teal-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{asgn.jobTitle}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Employer: {asgn.employer} • Assigned Date: {asgn.startDate}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCheckIn(asgn.id)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                    >
                      <Clock className="w-3.5 h-3.5" /> Check-in for Today (07:00 AM)
                    </button>
                  </div>
                ))}
              </div>

              {/* Attendance Log Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-bold text-slate-600">Date</th>
                      <th className="px-3 py-2 text-left font-bold text-slate-600">Check-In</th>
                      <th className="px-3 py-2 text-left font-bold text-slate-600">Check-Out</th>
                      <th className="px-3 py-2 text-left font-bold text-slate-600">Hours</th>
                      <th className="px-3 py-2 text-left font-bold text-slate-600">Verification</th>
                      <th className="px-3 py-2 text-left font-bold text-slate-600">Status</th>
                      <th className="px-3 py-2 text-right font-bold text-slate-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attendanceRecords.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/50">
                        <td className="px-3 py-2.5 font-bold text-slate-800">{r.date}</td>
                        <td className="px-3 py-2.5 text-slate-600">{r.checkInTime}</td>
                        <td className="px-3 py-2.5 text-slate-600">{r.checkOutTime || '— In Progress —'}</td>
                        <td className="px-3 py-2.5 font-bold text-teal-700">{r.hoursWorked} hrs</td>
                        <td className="px-3 py-2.5 text-slate-600">
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                            <ShieldCheck className="w-3 h-3" /> {r.method}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                            {r.status}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          {!r.checkOutTime && (
                            <button
                              onClick={() => handleCheckOut(r.id)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-[11px] font-bold"
                            >
                              Check-Out
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: EARNINGS & WORK HISTORY */}
        {activeTab === 'earnings-history' && (
          <div className="space-y-6">
            {/* Earnings Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div className="text-xs text-slate-500 mb-1">Total Verified Earnings</div>
                <div className="text-2xl font-extrabold text-emerald-700">₹{totalEarnings.toLocaleString()}</div>
                <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1 font-semibold">
                  <TrendingUp className="w-3 h-3" /> Auto-settled via Escrow
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div className="text-xs text-slate-500 mb-1">Completed Assignments</div>
                <div className="text-2xl font-extrabold text-slate-800">{workHistory.length} Jobs</div>
                <div className="text-[11px] text-slate-400 mt-1">100% Completion Record</div>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div className="text-xs text-slate-500 mb-1">Average Review Rating</div>
                <div className="text-2xl font-extrabold text-amber-500 flex items-center gap-1">
                  <Star className="w-5 h-5 fill-amber-400" /> 4.9 / 5.0
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Based on 92 employer ratings</div>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <div className="text-xs text-slate-500 mb-1">Total Verified Hours</div>
                <div className="text-2xl font-extrabold text-teal-700">
                  {workHistory.reduce((s, h) => s + h.hoursWorked, 0)} hrs
                </div>
                <div className="text-[11px] text-teal-600 mt-1 font-semibold">Across 10 field days</div>
              </div>
            </div>

            {/* Verifiable Work History Ledger */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Verifiable Employment & Project History</h3>
              <div className="space-y-3">
                {workHistory.map((hist) => (
                  <div
                    key={hist.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-teal-300 transition bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{hist.jobTitle}</h4>
                        <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400" /> {hist.rating}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Employer: {hist.employer} • {hist.startDate} to {hist.endDate} ({hist.daysWorked} Days • {hist.hoursWorked} hrs)
                      </p>
                      <p className="text-xs text-slate-500 mt-1 italic">"{hist.feedback}"</p>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-extrabold text-emerald-700">₹{hist.earnings.toLocaleString()}</div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Settled
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: FARM PLANNER BRIDGE */}
        {activeTab === 'farm-bridge' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">🌾 Farm Planner → Workforce Generation Bridge</h2>
                  <p className="text-xs text-slate-500">
                    Automatically convert planned cultivation milestones (Sowing, Spraying, Harvest) into instant Workforce Job Postings
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {farmActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                          {act.crop}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{act.activityName}</h4>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Plot: {act.plot} • Scheduled Date: {act.scheduledDate}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Requirement: {act.workersRequired}x {act.requiredSkill} @ ₹{act.estimatedDailyRate}/day
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleBridgeFarmActivity(act)}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Convert to Job Posting & Find Workers
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Apply For Job */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">Apply for Job Opportunity</h3>
            <p className="text-xs text-slate-500 mb-4">{selectedJob?.title}</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Expected Daily Wage (₹)</label>
                <input
                  type="number"
                  value={applyExpectedWage}
                  onChange={(e) => setApplyExpectedWage(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Application Pitch & Experience Notes</label>
                <textarea
                  rows={3}
                  value={applyPitch}
                  onChange={(e) => setApplyPitch(e.target.value)}
                  placeholder="Mention your relevant skill proficiency, years of experience, or equipment availability..."
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="bg-teal-50 p-3 rounded-xl border border-teal-200 text-xs text-teal-800">
                ⭐ Your verified profile ({workerProfile.rating} Rating, {workerProfile.completedJobs} Jobs) and verified skill passport will be presented to the employer.
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowApplyModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApplySubmit}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Post New Job */}
      {showPostJobModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">Create New Job Requirement</h3>
            <p className="text-xs text-slate-500 mb-4">Post agricultural work opportunity to verified local workforce</p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Cotton Harvesting Work Crew"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Job Category</label>
                  <select
                    value={newJobType}
                    onChange={(e) => setNewJobType(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="HARVESTING">Harvesting</option>
                    <option value="SPRAYING">Spraying</option>
                    <option value="SOWING">Sowing</option>
                    <option value="IRRIGATION">Irrigation</option>
                    <option value="TRACTOR_OPERATION">Tractor Operation</option>
                    <option value="AGRICULTURAL_LABOR">General Field Labor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Workers Required</label>
                  <input
                    type="number"
                    value={newJobWorkers}
                    onChange={(e) => setNewJobWorkers(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Wage Offer (₹)</label>
                  <input
                    type="number"
                    value={newJobDailyRate}
                    onChange={(e) => setNewJobDailyRate(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newJobStartDate}
                    onChange={(e) => setNewJobStartDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Job Description & Site Details</label>
                <textarea
                  rows={2}
                  value={newJobDesc}
                  onChange={(e) => setNewJobDesc(e.target.value)}
                  placeholder="Describe location landmarks, timings, transport arrangement..."
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowPostJobModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateJob}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Publish Job Opportunity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
