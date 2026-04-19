const fs = require('fs');
const path = require('path');
const {
  ADMIN_CREDENTIAL,
  DEMO_COMPANIES,
  DEMO_STUDENTS,
} = require('./lib/demoCredentialsData');

const outputFile = path.join(process.cwd(), 'seed-data', 'users.md');

function escapeCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|');
}

const lines = [];
lines.push('# Seeded Login Credentials');
lines.push('');
lines.push('This file lists the demo accounts created by `scripts/seed_users.js`.');
lines.push('');
lines.push('## Summary');
lines.push('');
lines.push(`- Admin accounts: 1`);
lines.push(`- Student accounts: ${DEMO_STUDENTS.length}`);
lines.push(`- Company accounts: ${DEMO_COMPANIES.length}`);
lines.push('');
lines.push('## Admin Login');
lines.push('');
lines.push(`- Email: \`${ADMIN_CREDENTIAL.email}\``);
lines.push(`- Password: \`${ADMIN_CREDENTIAL.password}\``);
lines.push('');
lines.push('## Student Logins');
lines.push('');
lines.push('| # | Name | Email | Password |');
lines.push('| --- | --- | --- | --- |');

DEMO_STUDENTS.forEach((student, index) => {
  lines.push(
    `| ${index + 1} | ${escapeCell(student.full_name)} | ${student.email} | ${student.password} |`
  );
});

lines.push('');
lines.push('## Company Logins');
lines.push('');
lines.push('| # | Company | Email | Password |');
lines.push('| --- | --- | --- | --- |');

DEMO_COMPANIES.forEach((company, index) => {
  lines.push(
    `| ${index + 1} | ${escapeCell(company.company_name)} | ${company.email} | ${company.password} |`
  );
});

lines.push('');

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, lines.join('\n'));
console.log(outputFile);
