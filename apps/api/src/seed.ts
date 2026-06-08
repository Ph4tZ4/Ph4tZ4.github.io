import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from './config/db.js';
import { Portfolio } from './models/Portfolio.js';
import { User } from './models/User.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
// repo root is two levels up from apps/api/src
const repoRoot = join(__dirname, '..', '..', '..');

function findBackupFile(): string | null {
  const files = readdirSync(repoRoot).filter(
    (f) => f.startsWith('pikanomwaan-portfolio-backup-') && f.endsWith('.json'),
  );
  if (files.length === 0) return null;
  // pick the most recent by the trailing timestamp
  files.sort();
  return join(repoRoot, files[files.length - 1]);
}

async function seed(): Promise<void> {
  await connectDB();

  let data: Record<string, unknown> = {};
  const backup = findBackupFile();
  if (backup) {
    console.log(`[seed] Using backup: ${backup}`);
    data = JSON.parse(readFileSync(backup, 'utf8'));
  } else {
    console.log('[seed] No backup file found, seeding minimal defaults.');
  }

  const payload = {
    key: 'main',
    about: data.about ?? {},
    skills: Array.isArray(data.skills) ? data.skills : [],
    projects: Array.isArray((data as any).projects) ? (data as any).projects : [],
    certificates: Array.isArray((data as any).certificates) ? (data as any).certificates : [],
  };

  await Portfolio.findOneAndUpdate({ key: 'main' }, { $set: payload }, { upsert: true, new: true });
  console.log('[seed] Portfolio document upserted.');

  const existingAdmin = await User.findOne({ username: 'admin' }).lean();
  if (!existingAdmin) {
    const hash = await bcrypt.hash('admin123', 10);
    await User.create({ username: 'admin', password: hash });
    console.log('[seed] Default admin user created (username: admin, password: admin123). Change the password after first login.');
  } else {
    console.log('[seed] Admin user already exists.');
  }

  await disconnectDB();
  process.exit(0);
}

seed().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
