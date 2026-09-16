import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import * as path from 'path';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

// 32 Scenarios from templates-catalog.html
export const EMAIL_TEMPLATE_SCENARIOS = [
  // 1. Welcome & Registration
  { templateKey: 'welcome-registration', name: 'Welcome / Registration', category: 'Account / Registration', description: 'Welcomes newly registered users, activates their account, and initiates their personalized onboarding journey.', subject: 'Welcome to SkillSync! Get Started with Your Learning Journey', defaultVars: { category_tag: 'WELCOME & ONBOARDING', eyebrow_badge: "✓ YOU'RE OFFICIALLY IN", headline_prefix: 'Welcome to', headline_highlight: 'SkillSync', hero_description: 'Your SkillSync citizen account is now active. Complete your diagnostic profile to receive an AI-curated competency roadmap.', cta_text: 'Start My Skill Journey →', cta_url: 'http://localhost:5173/onboarding', status_badge_text: 'ACTIVE' } },
  { templateKey: 'account-approved', name: 'Account Approved', category: 'Account / Registration', description: 'Notifies learners or enterprise users that their registration application has been reviewed and approved by administrators.', subject: 'Great News! Your SkillSync Account Has Been Approved', defaultVars: { category_tag: 'ACCOUNT VERIFICATION', eyebrow_badge: '✓ ACCESS GRANTED', headline_prefix: 'Account', headline_highlight: 'Approved', hero_description: 'Your identity and institutional credentials have been verified. You now have full access to SkillSync learning catalogues.', cta_text: 'Access Portal Dashboard →', cta_url: 'http://localhost:5173/login', status_badge_text: 'VERIFIED' } },
  { templateKey: 'role-changed', name: 'Role Changed / Permission Update', category: 'Account / Registration', description: 'Alerts users when their system role has been modified (e.g., promoted to Trainer or Institutional Admin).', subject: 'Security Notice: Your SkillSync Account Role Has Been Updated', defaultVars: { category_tag: 'SECURITY & ACCESS', eyebrow_badge: 'SECURITY ALERT', headline_prefix: 'Role Updated to', headline_highlight: 'TRAINER', hero_description: 'Your organizational administrator has updated your platform role and granted expanded access privileges.', cta_text: 'Review Permissions →', cta_url: 'http://localhost:5173/dashboard', status_badge_text: 'UPDATED' } },
  { templateKey: 'password-reset', name: 'Password Reset', category: 'Account / Registration', description: 'Dispatches secure, time-sensitive authentication reset tokens for forgotten account credentials.', subject: 'Action Required: Reset Your SkillSync Account Password', defaultVars: { category_tag: 'AUTHENTICATION', eyebrow_badge: 'ACTION REQUIRED', headline_prefix: 'Reset Your', headline_highlight: 'Password', hero_description: 'We received a request to reset your password. If you initiated this request, click below to set a new password.', cta_text: 'Reset Password →', cta_url: 'http://localhost:5173/login?action=reset', status_badge_text: 'SECURITY NOTICE' } },

  // 2. Learning & Courses
  { templateKey: 'course-assigned', name: 'Course Assigned', category: 'Learning', description: 'Informs learners that a mandatory or recommended course has been provisioned to their training profile.', subject: 'New Course Assigned: Start Building Your Core Competencies', defaultVars: { category_tag: 'COURSE ASSIGNMENT', eyebrow_badge: 'NEW ENROLLMENT', headline_prefix: 'New Course', headline_highlight: 'Assigned', hero_description: 'A new competency curriculum has been enrolled into your learning queue. Begin coursework at your convenience.', cta_text: 'Open Course Overview →', cta_url: 'http://localhost:5173/my-learning', status_badge_text: 'ENROLLED' } },
  { templateKey: 'course-deadline', name: 'Course Deadline Approaching', category: 'Learning', description: 'Urgent reminder when an enrolled course or mandatory training module is due within 48-72 hours.', subject: 'Time-Sensitive: Your Course Completion Deadline is Approaching', defaultVars: { category_tag: 'DEADLINE REMINDER', eyebrow_badge: '48 HOURS REMAINING', headline_prefix: 'Milestone', headline_highlight: 'Approaching', hero_description: 'Your enrolled course milestone is approaching its submission window. Complete remaining lessons to earn your verified badge.', cta_text: 'Resume Coursework →', cta_url: 'http://localhost:5173/my-learning', status_badge_text: 'ACTION REQUIRED' } },
  { templateKey: 'course-completed', name: 'Course Completed', category: 'Learning', description: 'Celebratory confirmation of 100% course curriculum completion, awarding points and unlocking credentials.', subject: 'Congratulations! You Have Successfully Completed Your Course', defaultVars: { category_tag: 'ACHIEVEMENT UNLOCKED', eyebrow_badge: '100% COMPLETE', headline_prefix: 'Curriculum', headline_highlight: 'Mastered', hero_description: 'Outstanding work! You have finished all interactive modules and diagnostic challenges in your enrolled track.', cta_text: 'Claim Your Certificate →', cta_url: 'http://localhost:5173/certificates', status_badge_text: 'COMPLETED' } },
  { templateKey: 'learning-path-updated', name: 'Learning Path Updated', category: 'Learning', description: 'Notifies users when new elective modules or industry competency tracks are added to their active pathway.', subject: 'Curriculum Update: New Modules Added to Your Learning Path', defaultVars: { category_tag: 'ROADMAP EVOLUTION', eyebrow_badge: 'PATHWAY UPDATED', headline_prefix: 'Roadmap', headline_highlight: 'Refined', hero_description: 'Your personalized learning path has incorporated updated national standards and elective industry modules.', cta_text: 'Explore Updated Path →', cta_url: 'http://localhost:5173/learning-path', status_badge_text: 'REFINED' } },

  // 3. Live Training & Sessions
  { templateKey: 'training-registered', name: 'Training Registration Confirmed', category: 'Training', description: 'Confirms seat reservation in a live instructor-led workshop or virtual capacity bootcamp.', subject: 'Seat Confirmed: You Are Registered for Live Masterclass', defaultVars: { category_tag: 'LIVE WORKSHOP', eyebrow_badge: 'SEAT RESERVED', headline_prefix: 'Registration', headline_highlight: 'Confirmed', hero_description: 'Your seat has been locked for the upcoming live masterclass. Add the event to your calendar and review prep materials.', cta_text: 'View Session Details →', cta_url: 'http://localhost:5173/my-learning', status_badge_text: 'CONFIRMED' } },
  { templateKey: 'training-reminder', name: 'Training Reminder (24h / 1h)', category: 'Training', description: 'Automated reminder dispatched prior to live training commencement with direct video conference links.', subject: 'Reminder: Live Training Session Starts in 24 Hours', defaultVars: { category_tag: 'SESSION REMINDER', eyebrow_badge: 'STARTS TOMORROW', headline_prefix: 'Upcoming', headline_highlight: 'Masterclass', hero_description: 'Get ready for your live interactive workshop. Join 5 minutes early to test your audio and sandbox environment.', cta_text: 'Join Live Room →', cta_url: 'https://meet.skillsync.edu/live-session', status_badge_text: 'REMINDER' } },
  { templateKey: 'training-rescheduled', name: 'Training Rescheduled', category: 'Training', description: 'Advises enrolled attendees of a timing, date, or trainer adjustment for an upcoming live session.', subject: 'Schedule Adjustment: Your Live Training Has Been Rescheduled', defaultVars: { category_tag: 'SCHEDULE UPDATE', eyebrow_badge: 'NEW TIMING', headline_prefix: 'Session', headline_highlight: 'Rescheduled', hero_description: 'The faculty has adjusted the timing for your workshop to accommodate extended hands-on lab exercises.', cta_text: 'Update Calendar →', cta_url: 'http://localhost:5173/my-learning', status_badge_text: 'RESCHEDULED' } },
  { templateKey: 'training-cancelled', name: 'Training Cancelled', category: 'Training', description: 'Notifies users of an emergency session cancellation and automatically refunds seat credits.', subject: 'Important Notice: Live Training Session Cancelled', defaultVars: { category_tag: 'CANCELLATION NOTICE', eyebrow_badge: 'SESSION CANCELLED', headline_prefix: 'Workshop', headline_highlight: 'Cancelled', hero_description: 'Due to unforeseen faculty circumstances, this live cohort has been postponed. We will notify you when dates reopen.', cta_text: 'Browse Alternative Sessions →', cta_url: 'http://localhost:5173/courses', status_badge_text: 'CANCELLED' } },
  { templateKey: 'trainer-assigned', name: 'Trainer Assigned to Cohort', category: 'Training', description: 'Notifies verified educators that they have been designated as lead instructor for a training cohort.', subject: 'Instructor Assignment: You Have Been Assigned to Lead a New Cohort', defaultVars: { category_tag: 'FACULTY DISPATCH', eyebrow_badge: 'COHORT ASSIGNED', headline_prefix: 'Instructor', headline_highlight: 'Designation', hero_description: 'You have been designated as the primary faculty member for an upcoming capacity building cohort.', cta_text: 'Open Trainer Cohort →', cta_url: 'http://localhost:5173/trainer/dashboard', status_badge_text: 'ASSIGNED' } },

  // 4. Assessment & Diagnostics
  { templateKey: 'assessment-assigned', name: 'Assessment Assigned', category: 'Assessment', description: 'Alerts a learner that a proctored diagnostic exam or milestone assessment is ready to take.', subject: 'New Diagnostic Assessment Ready: Measure Your Competencies', defaultVars: { category_tag: 'EVALUATION BENCHMARK', eyebrow_badge: 'BENCHMARK READY', headline_prefix: 'Diagnostic', headline_highlight: 'Assigned', hero_description: 'A structured evaluation has been provisioned to benchmark your current problem-solving fluency.', cta_text: 'Begin Assessment →', cta_url: 'http://localhost:5173/assessments', status_badge_text: 'READY' } },
  { templateKey: 'assessment-deadline', name: 'Assessment Deadline Warning', category: 'Assessment', description: 'Urgent notice that a diagnostic evaluation window will expire shortly.', subject: 'Urgent: Your SkillSync Assessment Window Closes Soon', defaultVars: { category_tag: 'DEADLINE ALERT', eyebrow_badge: 'EXPIRES SOON', headline_prefix: 'Assessment', headline_highlight: 'Deadline', hero_description: 'Your proctored diagnostic exam window expires in 24 hours. Ensure you have a quiet workspace and submit your answers.', cta_text: 'Launch Exam →', cta_url: 'http://localhost:5173/assessments', status_badge_text: 'URGENT' } },
  { templateKey: 'assessment-result', name: 'Assessment Result Published', category: 'Assessment', description: 'Delivers full rubric breakdown, score percentage, and passing credential confirmation upon exam grading.', subject: 'Assessment Results Released: See Your Verified Performance', defaultVars: { category_tag: 'SCORECARD RELEASED', eyebrow_badge: 'EVALUATION COMPLETE', headline_prefix: 'Scorecard', headline_highlight: 'Published', hero_description: 'Your diagnostic results are available. Review your performance breakdown across algorithmic and systems reasoning.', cta_text: 'Review Scorecard →', cta_url: 'http://localhost:5173/assessments', status_badge_text: 'PASSED' } },

  // 5. Competency & Skill Intelligence
  { templateKey: 'skill-gap-detected', name: 'Skill Gap Detected', category: 'Competency', description: 'Diagnostic intelligence notification pinpointing specific technical deficits and recommending targeted remedial courses.', subject: 'Action Recommended: SkillSync Identified Priority Skill Gaps', defaultVars: { category_tag: 'DIAGNOSTIC RADAR', eyebrow_badge: 'DEFICIT IDENTIFIED', headline_prefix: 'Skill Gap', headline_highlight: 'Detected', hero_description: 'Our engine identified priority capability gaps between your current benchmark and target role expectations.', cta_text: 'View Remedial Plan →', cta_url: 'http://localhost:5173/skill-gaps', status_badge_text: 'ACTION REQUIRED' } },
  { templateKey: 'competency-improved', name: 'Competency Rating Improved', category: 'Competency', description: 'Celebrates measurable benchmark gains when a learner advances from Beginner to Intermediate or Expert.', subject: 'Level Up! Your Competency Rating Has Significantly Increased', defaultVars: { category_tag: 'CAPABILITY GROWTH', eyebrow_badge: 'LEVEL UP', headline_prefix: 'Competency', headline_highlight: 'Elevated', hero_description: 'Congratulations! Your recent code submissions and assessments have elevated your competency level.', cta_text: 'Inspect Competency Radar →', cta_url: 'http://localhost:5173/competencies', status_badge_text: 'ADVANCED' } },
  { templateKey: 'recommended-learning-path', name: 'Recommended Learning Path', category: 'Competency', description: 'Delivers tailored career recommendations aligning with target sector demands and company profiles.', subject: 'Personalized Career Recommendation: Explore Your Next Learning Step', defaultVars: { category_tag: 'CAREER RECOMMENDATIONS', eyebrow_badge: 'TAILORED FOR YOU', headline_prefix: 'Curated', headline_highlight: 'Pathway', hero_description: 'Based on your diagnostic profile and target aspirations, our competency engine has formulated a custom learning trajectory.', cta_text: 'Explore Recommended Path →', cta_url: 'http://localhost:5173/recommendations', status_badge_text: 'CURATED' } },

  // 6. Certification & Credentials
  { templateKey: 'certificate-generated', name: 'Certificate Issued', category: 'Certification', description: 'Delivers official cryptographically verifiable SkillSync certificate with download credentials.', subject: 'Certificate Issued: Your Verified Credential is Ready', defaultVars: { category_tag: 'OFFICIAL CREDENTIAL', eyebrow_badge: 'CERTIFICATE ISSUED', headline_prefix: 'Verified', headline_highlight: 'Credential', hero_description: 'Your formal Certificate of Competency has been minted with verifiable cryptographic proof.', cta_text: 'Download & Verify Certificate →', cta_url: 'http://localhost:5173/certificates', status_badge_text: 'VERIFIED CREDENTIAL' } },
  { templateKey: 'certificate-verification', name: 'Certificate Verification Inquiry', category: 'Certification', description: 'Confirms external institutional or employer verification of a student credential.', subject: 'Verification Confirmation: Your SkillSync Credential Was Verified', defaultVars: { category_tag: 'PUBLIC VERIFICATION', eyebrow_badge: 'CREDENTIAL AUDITED', headline_prefix: 'Certificate', headline_highlight: 'Verified', hero_description: 'A third-party enterprise or hiring partner has successfully verified your digital competency credential.', cta_text: 'View Public Record →', cta_url: 'http://localhost:5173/certificates', status_badge_text: 'VERIFIED' } },
  { templateKey: 'certificate-expiry', name: 'Certificate Renewal Reminder', category: 'Certification', description: 'Reminds professionals that their compliance or technology certification requires annual renewal.', subject: 'Renewal Notice: Your SkillSync Certification Expires in 30 Days', defaultVars: { category_tag: 'RENEWAL REMINDER', eyebrow_badge: 'EXPIRES SOON', headline_prefix: 'Certification', headline_highlight: 'Renewal', hero_description: 'Your verified technology certification is approaching its annual expiration. Take the renewal assessment to maintain active standing.', cta_text: 'Take Renewal Exam →', cta_url: 'http://localhost:5173/assessments', status_badge_text: 'RENEWAL REQUIRED' } },

  // 7. Trainer Notifications
  { templateKey: 'trainer-new-learner', name: 'New Learner Enrolled in Course', category: 'Trainer', description: 'Notifies instructors when new students join their specialized cohorts.', subject: 'Cohort Growth: New Learner Enrolled in Your Course', defaultVars: { category_tag: 'COHORT ROSTER', eyebrow_badge: 'NEW ENROLLMENT', headline_prefix: 'New', headline_highlight: 'Trainee', hero_description: 'A new citizen learner has registered for your interactive curriculum track. Review their baseline diagnostic in your cohort list.', cta_text: 'View Learner Roster →', cta_url: 'http://localhost:5173/trainer/dashboard', status_badge_text: 'NEW STUDENT' } },
  { templateKey: 'trainer-learner-at-risk', name: 'Learner At Risk Notification', category: 'Trainer', description: 'Predictive alert warning instructors when a learner shows falling velocity or repeated failed quiz attempts.', subject: 'Intervention Alert: A Learner Requires Mentorship Assistance', defaultVars: { category_tag: 'EARLY INTERVENTION', eyebrow_badge: 'ASSISTANCE NEEDED', headline_prefix: 'Learner', headline_highlight: 'At Risk', hero_description: 'Early intervention radar detected that a student in your cohort has stalled on Module 3. Reach out with personalized mentorship.', cta_text: 'Schedule Office Hours →', cta_url: 'http://localhost:5173/trainer/dashboard', status_badge_text: 'ATTENTION' } },
  { templateKey: 'trainer-feedback-received', name: 'Student Feedback Received', category: 'Trainer', description: 'Summarizes student survey feedback, net promoter scores, and ratings following completed workshops.', subject: 'Cohort Feedback: Learners Rated Your Recent Masterclass', defaultVars: { category_tag: 'FACULTY INSIGHTS', eyebrow_badge: 'FEEDBACK RECORDED', headline_prefix: 'Workshop', headline_highlight: 'Feedback', hero_description: 'Learners have submitted post-session evaluations. Your session achieved an average rating of 4.9/5.0 with exceptional reviews.', cta_text: 'Read Full Feedback →', cta_url: 'http://localhost:5173/trainer/dashboard', status_badge_text: '4.9 ★ RATING' } },

  // 8. Admin & Institutional Alerts
  { templateKey: 'admin-new-user-approval', name: 'New User Awaiting Approval', category: 'Admin', description: 'Alerts platform administrators that new institutional trainers or trainees require verification.', subject: 'Admin Action: New User Registration Awaiting Verification', defaultVars: { category_tag: 'INSTITUTIONAL GOVERNANCE', eyebrow_badge: 'APPROVAL PENDING', headline_prefix: 'Verification', headline_highlight: 'Pending', hero_description: 'A new user has submitted enterprise credentials requiring administrative vetting before elevated portal access is unlocked.', cta_text: 'Review User Account →', cta_url: 'http://localhost:5173/admin/users', status_badge_text: 'PENDING' } },
  { templateKey: 'admin-training-registration', name: 'Training Cohort Full Notification', category: 'Admin', description: 'Notifies administrators when a high-demand cohort reaches 100% capacity.', subject: 'Capacity Alert: Training Cohort Has Reached Maximum Enrollment', defaultVars: { category_tag: 'CAPACITY ALERT', eyebrow_badge: 'MAX CAPACITY', headline_prefix: 'Cohort', headline_highlight: 'Filled', hero_description: 'The upcoming live container security training has reached 100% registered capacity. Consider opening a second cohort.', cta_text: 'Manage Cohort Quota →', cta_url: 'http://localhost:5173/admin/dashboard', status_badge_text: '100% FULL' } },
  { templateKey: 'admin-content-review', name: 'Course Content Pending Review', category: 'Admin', description: 'Dispatched to administrators when a trainer submits a new curriculum or assessment for QA validation.', subject: 'Curriculum Audit: New Course Modules Submitted for Review', defaultVars: { category_tag: 'CURRICULUM AUDIT', eyebrow_badge: 'QA REVIEW PENDING', headline_prefix: 'Curriculum', headline_highlight: 'Audit', hero_description: 'A faculty member has finalized new syllabus modules and assessments. Review learning objectives and approve publication.', cta_text: 'Audit Course Draft →', cta_url: 'http://localhost:5173/admin/courses', status_badge_text: 'NEEDS AUDIT' } },
  { templateKey: 'admin-dataset-review', name: 'Bulk Dataset Pending Ingestion', category: 'Admin', description: 'Alerts administrators that a bulk Excel catalogue or telemetry dataset is queued for processing.', subject: 'Data Ingestion: Bulk Course Catalogue Queued for Processing', defaultVars: { category_tag: 'SYSTEM INGESTION', eyebrow_badge: 'BATCH PENDING', headline_prefix: 'Catalogue', headline_highlight: 'Ingestion', hero_description: 'A bulk institutional Excel course catalogue has been placed in staging. Review schema mapping and commit ingest.', cta_text: 'Inspect Batch Queue →', cta_url: 'http://localhost:5173/admin/courses', status_badge_text: 'STAGING READY' } },
  { templateKey: 'admin-system-alert', name: 'System Security & Telemetry Alert', category: 'Admin', description: 'Critical operational alert for platform administrators reporting abnormal activity, error rate spikes, or SLA risks.', subject: 'Priority Alert: System Telemetry Warning Detected', defaultVars: { category_tag: 'OPERATIONAL TELEMETRY', eyebrow_badge: 'PRIORITY 1 ALERT', headline_prefix: 'System', headline_highlight: 'Warning', hero_description: 'Security or rate-limit thresholds were flagged in the last 15 minutes. Review audit logs and active session proxies.', cta_text: 'View Audit Logs →', cta_url: 'http://localhost:5173/admin/audit-logs', status_badge_text: 'CRITICAL ALERT' } },
];

async function main() {
  console.log('--- Starting SkillSync Idempotent Seed Process ---');

  // 1. Seed Core Administrative Accounts
  const adminPasswordHash = await argon2.hash('Demo@12345');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@capacityconnect.demo' },
    update: {
      name: 'Dr. Rajesh Verma',
      role: 'ADMIN',
      status: 'ACTIVE',
      onboardingCompleted: true,
      onboardingStatus: 'COMPLETED',
      firstLoginRequired: false,
    },
    create: {
      email: 'admin@capacityconnect.demo',
      name: 'Dr. Rajesh Verma',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      onboardingCompleted: true,
      onboardingStatus: 'COMPLETED',
      firstLoginRequired: false,
    },
  });

  await prisma.profile.upsert({
    where: { userId: adminUser.id },
    update: {
      designation: 'Chief Capacity Director & System Architect',
      department: 'National Skill & Competency Directorate',
      sector: 'IT',
      domain: 'Digital Governance',
      experience: 16,
      skills: 'Executive Governance, System Design, Capacity Analytics',
    },
    create: {
      userId: adminUser.id,
      designation: 'Chief Capacity Director & System Architect',
      department: 'National Skill & Competency Directorate',
      sector: 'IT',
      domain: 'Digital Governance',
      experience: 16,
      skills: 'Executive Governance, System Design, Capacity Analytics',
      interests: 'Public Digital Infrastructure, AI Ingestion, Security',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
  });

  // Secondary admin alias
  await prisma.user.upsert({
    where: { email: 'admin@skillsync.demo' },
    update: {
      name: 'SkillSync Master Admin',
      role: 'ADMIN',
      status: 'ACTIVE',
      onboardingCompleted: true,
      onboardingStatus: 'COMPLETED',
      firstLoginRequired: false,
    },
    create: {
      email: 'admin@skillsync.demo',
      name: 'SkillSync Master Admin',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      onboardingCompleted: true,
      onboardingStatus: 'COMPLETED',
      firstLoginRequired: false,
    },
  });

  // 2. Read 75 Synthetic Demo Users from Excel
  const excelPath = path.resolve(__dirname, '../../SkillSync_Demo_Users_and_Credentials.xlsx');
  console.log(`Loading demo users workbook from: ${excelPath}`);

  const workbook = XLSX.readFile(excelPath);
  const rawUsers = XLSX.utils.sheet_to_json<any>(workbook.Sheets['All Users']);
  console.log(`Found ${rawUsers.length} synthetic user records in 'All Users' sheet.`);

  const seededUsersMap = new Map<string, any>();

  for (const row of rawUsers) {
    const rawRole = (row.role || 'TRAINEE').toUpperCase().trim();
    const role = rawRole === 'TRAINER' ? 'TRAINER' : 'TRAINEE';
    const email = String(row.email).trim().toLowerCase();
    const name = String(row.name).trim();
    const rawPass = String(row.password).trim();
    const userIdTag = String(row.user_id).trim();

    // Secure password hashing
    const passwordHash = await argon2.hash(rawPass);

    const userRecord = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        role,
        status: 'ACTIVE',
        onboardingCompleted: true,
        onboardingStatus: 'COMPLETED',
        firstLoginRequired: false,
      },
      create: {
        email,
        name,
        passwordHash,
        role,
        status: 'ACTIVE',
        onboardingCompleted: true,
        onboardingStatus: 'COMPLETED',
        firstLoginRequired: false,
      },
    });

    seededUsersMap.set(userIdTag, userRecord);
    seededUsersMap.set(email, userRecord);

    // Profile upsert
    await prisma.profile.upsert({
      where: { userId: userRecord.id },
      update: {
        employeeId: userIdTag,
        sector: row.sector || 'IT',
        domain: row.domain || 'Computer Science',
        targetRole: row.target_role || (role === 'TRAINER' ? 'Technical Lead' : 'Software Engineer'),
        experience: parseInt(row.experience_years, 10) || 1,
        skills: row.skills || 'Python, SQL, Modern Web',
        learningGoal: row.learning_goal || 'Build verified job-ready competencies',
        preferredLearning: row.preferred_learning || 'Blended',
        designation: row.target_role || (role === 'TRAINER' ? 'Senior Technical Trainer' : 'Software Fellow'),
        department: `${row.domain || 'Technology'} Division`,
      },
      create: {
        userId: userRecord.id,
        employeeId: userIdTag,
        sector: row.sector || 'IT',
        domain: row.domain || 'Computer Science',
        targetRole: row.target_role || (role === 'TRAINER' ? 'Technical Lead' : 'Software Engineer'),
        experience: parseInt(row.experience_years, 10) || 1,
        skills: row.skills || 'Python, SQL, Modern Web',
        interests: 'Artificial Intelligence, Distributed Systems, Cloud Ops, Full Stack',
        learningGoal: row.learning_goal || 'Build verified job-ready competencies',
        preferredLearning: row.preferred_learning || 'Blended',
        designation: row.target_role || (role === 'TRAINER' ? 'Senior Technical Trainer' : 'Software Fellow'),
        department: `${row.domain || 'Technology'} Division`,
        photoUrl:
          role === 'TRAINER'
            ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      },
    });
  }

  console.log(`Seeded and verified ${rawUsers.length} synthetic user profiles.`);

  // 3. Seed Sample Courses & Establish Trainer Relationships
  const trainerVikram = seededUsersMap.get('trainer001@skillsync.demo') || adminUser;
  const trainerSunita = seededUsersMap.get('trainer002@skillsync.demo') || adminUser;

  const coreCourses = [
    {
      title: 'High-Throughput Full Stack & Distributed Architecture',
      description: 'Master modular TypeScript, NestJS microservices, Postgres transaction pools, and zero-trust proxies.',
      category: 'Software Engineering',
      sector: 'IT',
      domain: 'Computer Science',
      skills: 'TypeScript, NestJS, PostgreSQL, Zero-Trust',
      competencies: 'Distributed Design, Transaction Security',
      level: 'INTERMEDIATE',
      durationHours: 24,
      trainerId: trainerVikram.id,
      thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=80',
    },
    {
      title: 'Machine Learning Pipelines & Predictive Modeling',
      description: 'Practical training on supervised regression, gradient boosting (XGBoost), model drift tracking, and Scikit-Learn pipelines.',
      category: 'Data & AI',
      sector: 'IT',
      domain: 'Data Science',
      skills: 'Python, Machine Learning, Scikit-Learn, Pandas',
      competencies: 'Predictive Modeling, Statistical Validation',
      level: 'INTERMEDIATE',
      durationHours: 18,
      trainerId: trainerVikram.id,
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80',
    },
    {
      title: 'Cloud Container Orchestration & Kubernetes Reliability',
      description: 'Hands-on cluster operations: multi-stage Docker builds, StatefulSets, Ingress routing, and Prometheus telemetry.',
      category: 'Cloud & DevOps',
      sector: 'IT',
      domain: 'Cloud Computing',
      skills: 'Docker, Kubernetes, Prometheus, CI/CD',
      competencies: 'High Availability Ops, SRE Telemetry',
      level: 'ADVANCED',
      durationHours: 20,
      trainerId: trainerSunita.id,
      thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&auto=format&fit=crop&q=80',
    },
  ];

  const seededCourses: any[] = [];
  for (const c of coreCourses) {
    let existing = await prisma.course.findFirst({ where: { title: c.title } });
    if (!existing) {
      existing = await prisma.course.create({
        data: {
          ...c,
          department: 'Capacity Building & Digital Learning',
          learningObjectives: 'Core system mastery and verified diagnostic competence',
          status: 'PUBLISHED',
        },
      });
    }
    seededCourses.push(existing);
  }

  // 4. Seed Rich Relational Data for 5 Showcase Accounts
  // SHOWCASE STUDENT 1: Aarav Sharma (student001@skillsync.demo)
  const student1 = seededUsersMap.get('student001@skillsync.demo');
  if (student1 && seededCourses.length >= 3) {
    // Enroll in Course 1 with 78% progress
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: student1.id, courseId: seededCourses[0].id } },
      update: { progress: 78, status: 'IN_PROGRESS' },
      create: { userId: student1.id, courseId: seededCourses[0].id, progress: 78, status: 'IN_PROGRESS' },
    });

    // Enroll in Course 2 with 100% progress (Completed)
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: student1.id, courseId: seededCourses[1].id } },
      update: { progress: 100, status: 'COMPLETED', completedAt: new Date() },
      create: { userId: student1.id, courseId: seededCourses[1].id, progress: 100, status: 'COMPLETED', completedAt: new Date() },
    });

    // Create Assessment and Certificate for Course 2
    let assessment = await prisma.assessment.findFirst({ where: { courseId: seededCourses[1].id } });
    if (!assessment) {
      assessment = await prisma.assessment.create({
        data: {
          courseId: seededCourses[1].id,
          title: 'Machine Learning Foundations Benchmark',
          description: 'Comprehensive evaluation of predictive feature extraction and regression metrics.',
          passingScore: 70,
          isPublished: true,
        },
      });
    }

    let attempt = await prisma.assessmentAttempt.findFirst({
      where: { userId: student1.id, assessmentId: assessment.id },
    });
    if (!attempt) {
      attempt = await prisma.assessmentAttempt.create({
        data: {
          userId: student1.id,
          assessmentId: assessment.id,
          score: 88.5,
          passed: true,
        },
      });
    }

    await prisma.certificate.upsert({
      where: { attemptId: attempt.id },
      update: {},
      create: {
        certificateCode: 'SS-2026-STU001-ML',
        userId: student1.id,
        courseId: seededCourses[1].id,
        attemptId: attempt.id,
      },
    });

    // Notifications
    await prisma.notification.createMany({
      data: [
        { userId: student1.id, type: 'COURSE', title: 'Course Enrolled', message: 'You have been enrolled in High-Throughput Full Stack Systems.' },
        { userId: student1.id, type: 'CERTIFICATE', title: 'Certificate Issued', message: 'Your verified credential for Machine Learning Foundations is ready.' },
      ],
    });
  }

  // SHOWCASE STUDENT 2: Ananya Verma (student002@skillsync.demo)
  const student2 = seededUsersMap.get('student002@skillsync.demo');
  if (student2 && seededCourses.length >= 2) {
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: student2.id, courseId: seededCourses[1].id } },
      update: { progress: 35, status: 'IN_PROGRESS' },
      create: { userId: student2.id, courseId: seededCourses[1].id, progress: 35, status: 'IN_PROGRESS' },
    });
  }

  // SHOWCASE STUDENT 3: Aditya Singh (student003@skillsync.demo)
  const student3 = seededUsersMap.get('student003@skillsync.demo');
  if (student3 && seededCourses.length >= 3) {
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: student3.id, courseId: seededCourses[2].id } },
      update: { progress: 100, status: 'COMPLETED' },
      create: { userId: student3.id, courseId: seededCourses[2].id, progress: 100, status: 'COMPLETED' },
    });
  }

  // 5. Seed 32 Universal Email Template Configurations
  console.log('Seeding 32 Universal Email Template configurations...');
  for (const t of EMAIL_TEMPLATE_SCENARIOS) {
    await prisma.emailTemplateConfig.upsert({
      where: { templateKey: t.templateKey },
      update: {
        name: t.name,
        category: t.category,
        description: t.description,
        subject: t.subject,
        defaultVariables: JSON.stringify(t.defaultVars),
      },
      create: {
        templateKey: t.templateKey,
        name: t.name,
        category: t.category,
        description: t.description,
        subject: t.subject,
        emailjsTemplateId: 'template_v4oblec',
        enabled: true,
        automaticEnabled: true,
        adminEnabled: true,
        requiredVariables: JSON.stringify(['user_name', 'user_email']),
        defaultVariables: JSON.stringify(t.defaultVars),
      },
    });
  }

  // 6. Seed Synthetic Email History Logs (Pre-populating Admin Email Center)
  console.log('Pre-populating synthetic email logs for demonstration...');
  const existingLogCount = await prisma.emailLog.count();
  if (existingLogCount === 0) {
    const demoLogs = [
      {
        recipientUserId: student1?.id,
        recipientEmail: 'student001@skillsync.demo',
        recipientRole: 'TRAINEE',
        templateKey: 'welcome-registration',
        category: 'Account / Registration',
        subject: 'Welcome to SkillSync! Get Started with Your Learning Journey',
        status: 'SENT',
        triggerType: 'AUTOMATIC',
        provider: 'EmailJS',
        providerMessageId: 'msg_emjs_891024',
        variables: JSON.stringify({ user_name: 'Aarav Sharma', user_email: 'student001@skillsync.demo', status_badge_text: 'ACTIVE' }),
        sentAt: new Date(Date.now() - 3600000 * 24 * 3),
      },
      {
        recipientUserId: student1?.id,
        recipientEmail: 'student001@skillsync.demo',
        recipientRole: 'TRAINEE',
        templateKey: 'course-assigned',
        category: 'Learning',
        subject: 'New Course Assigned: Start Building Your Core Competencies',
        status: 'SENT',
        triggerType: 'AUTOMATIC',
        provider: 'EmailJS',
        providerMessageId: 'msg_emjs_891089',
        variables: JSON.stringify({ user_name: 'Aarav Sharma', user_email: 'student001@skillsync.demo', course_name: 'High-Throughput Full Stack Systems' }),
        sentAt: new Date(Date.now() - 3600000 * 24 * 2),
      },
      {
        recipientUserId: student1?.id,
        recipientEmail: 'student001@skillsync.demo',
        recipientRole: 'TRAINEE',
        templateKey: 'assessment-result',
        category: 'Assessment',
        subject: 'Assessment Results Released: See Your Verified Performance',
        status: 'SENT',
        triggerType: 'AUTOMATIC',
        provider: 'EmailJS',
        providerMessageId: 'msg_emjs_891142',
        variables: JSON.stringify({ user_name: 'Aarav Sharma', user_email: 'student001@skillsync.demo', score: '88.5%', status_badge_text: 'PASSED' }),
        sentAt: new Date(Date.now() - 3600000 * 18),
      },
      {
        recipientUserId: student1?.id,
        recipientEmail: 'student001@skillsync.demo',
        recipientRole: 'TRAINEE',
        templateKey: 'certificate-generated',
        category: 'Certification',
        subject: 'Certificate Issued: Your Verified Credential is Ready',
        status: 'SENT',
        triggerType: 'AUTOMATIC',
        provider: 'EmailJS',
        providerMessageId: 'msg_emjs_891199',
        variables: JSON.stringify({ user_name: 'Aarav Sharma', user_email: 'student001@skillsync.demo', certificate_code: 'SS-2026-STU001-ML' }),
        sentAt: new Date(Date.now() - 3600000 * 12),
      },
      {
        recipientUserId: student2?.id,
        recipientEmail: 'student002@skillsync.demo',
        recipientRole: 'TRAINEE',
        templateKey: 'welcome-registration',
        category: 'Account / Registration',
        subject: 'Welcome to SkillSync! Get Started with Your Learning Journey',
        status: 'SENT',
        triggerType: 'AUTOMATIC',
        provider: 'EmailJS',
        providerMessageId: 'msg_emjs_891255',
        variables: JSON.stringify({ user_name: 'Ananya Verma', user_email: 'student002@skillsync.demo' }),
        sentAt: new Date(Date.now() - 3600000 * 20),
      },
      {
        recipientUserId: student2?.id,
        recipientEmail: 'student002@skillsync.demo',
        recipientRole: 'TRAINEE',
        templateKey: 'skill-gap-detected',
        category: 'Competency',
        subject: 'Action Recommended: SkillSync Identified Priority Skill Gaps',
        status: 'SENT',
        triggerType: 'AUTOMATIC',
        provider: 'EmailJS',
        providerMessageId: 'msg_emjs_891301',
        variables: JSON.stringify({ user_name: 'Ananya Verma', user_email: 'student002@skillsync.demo', gap_count: '2' }),
        sentAt: new Date(Date.now() - 3600000 * 8),
      },
      {
        recipientUserId: trainerVikram?.id,
        recipientEmail: 'trainer001@skillsync.demo',
        recipientRole: 'TRAINER',
        templateKey: 'trainer-new-learner',
        category: 'Trainer',
        subject: 'Cohort Growth: New Learner Enrolled in Your Course',
        status: 'SENT',
        triggerType: 'AUTOMATIC',
        provider: 'EmailJS',
        providerMessageId: 'msg_emjs_891340',
        variables: JSON.stringify({ user_name: 'Dr. Vikram Sharma', user_email: 'trainer001@skillsync.demo', learner_name: 'Aarav Sharma' }),
        sentAt: new Date(Date.now() - 3600000 * 6),
      },
      {
        recipientUserId: student3?.id,
        recipientEmail: 'student003@skillsync.demo',
        recipientRole: 'TRAINEE',
        templateKey: 'course-deadline',
        category: 'Learning',
        subject: 'Time-Sensitive: Your Course Completion Deadline is Approaching',
        status: 'FAILED',
        triggerType: 'AUTOMATIC',
        provider: 'EmailJS',
        errorMessage: 'Temporary SMTP gateway timeout (421)',
        retryCount: 2,
        variables: JSON.stringify({ user_name: 'Aditya Singh', user_email: 'student003@skillsync.demo', course_name: 'Kubernetes Reliability' }),
        sentAt: null,
      },
      {
        recipientUserId: student3?.id,
        recipientEmail: 'student003@skillsync.demo',
        recipientRole: 'TRAINEE',
        templateKey: 'course-deadline',
        category: 'Learning',
        subject: 'Time-Sensitive: Your Course Completion Deadline is Approaching',
        status: 'RETRYING',
        triggerType: 'AUTOMATIC',
        provider: 'EmailJS',
        errorMessage: 'Pending scheduled retry attempt 3',
        retryCount: 2,
        variables: JSON.stringify({ user_name: 'Aditya Singh', user_email: 'student003@skillsync.demo', course_name: 'Kubernetes Reliability' }),
        sentAt: null,
      },
    ];

    for (const log of demoLogs) {
      if (log.recipientUserId) {
        await prisma.emailLog.create({ data: log });
      }
    }
    console.log(`Pre-populated ${demoLogs.length} synthetic email logs.`);
  }

  console.log('--- Database Seeding Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });