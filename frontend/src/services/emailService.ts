/**
 * SkillSync Email Service (Frontend / Browser)
 * Uses @emailjs/browser to send emails directly from the browser,
 * bypassing the non-browser restriction on EmailJS's free tier.
 */
import emailjs from '@emailjs/browser';

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || 'service_2rnemfk';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_v4oblec';
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || 'DBW1hp3Wo6IoLBt6q';

/** Base variables always sent with every email */
const baseVars = () => ({
  eyebrow_badge:    'SKILLSYNC INTELLIGENCE',
  category_tag:     'PLATFORM NOTIFICATION',
  cta_url:          'http://localhost:5173/login',
  cta_text:         'Access SkillSync →',
  alert_title:      'Account Notice',
  alert_message:    'Log in to your SkillSync account to review your personalised dashboard.',
  detail_label_1:   'Platform',
  detail_val_1:     'SkillSync',
  detail_label_2:   'Status',
  detail_val_2:     'Active',
  status_badge_text:'ACTIVE',
  headline_prefix:  'Welcome to',
});

export interface EmailRecipient {
  name:  string;
  email: string;
  role?: string;
}

/**
 * Sends an email via EmailJS Browser SDK.
 * All variables merge with sensible defaults so no placeholder is left blank.
 */
export async function sendEmail(
  recipient: EmailRecipient,
  customVars: Record<string, string> = {},
): Promise<void> {
  const params: Record<string, string> = {
    ...baseVars(),
    to_email:          recipient.email,
    user_name:         recipient.name,
    user_email:        recipient.email,
    headline_highlight: recipient.name.split(' ')[0] || 'Learner',
    ...customVars,
  };

  await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, { publicKey: PUBLIC_KEY });
}

/** Sends a welcome email immediately after onboarding is completed */
export async function sendWelcomeEmail(user: EmailRecipient): Promise<void> {
  return sendEmail(user, {
    category_tag:      'WELCOME',
    eyebrow_badge:     'WELCOME TO SKILLSYNC',
    headline_prefix:   'Welcome aboard,',
    headline_highlight: user.name.split(' ')[0] || 'Learner',
    hero_description:  `Congratulations ${user.name}! Your SkillSync account is now active and your personalised learning roadmap is ready. Start your learning journey today.`,
    cta_text:          'Launch My Dashboard →',
    cta_url:           'http://localhost:5173/login',
    alert_title:       '🎓 Onboarding Complete',
    alert_message:     'Your profile, skill assessment and career roadmap have been saved. Your recommended courses are waiting!',
    detail_label_1:    'Account Email',
    detail_val_1:      user.email,
    detail_label_2:    'Platform Status',
    detail_val_2:      'Active & Ready',
    status_badge_text: 'ONBOARDED',
  });
}
