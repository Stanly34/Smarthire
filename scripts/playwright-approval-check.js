const { chromium } = require('playwright');

const baseUrl = 'http://127.0.0.1:5173';

async function fieldByLabel(page, label) {
  const labelLocator = page.locator(`label:has-text("${label}")`).first();
  const field = labelLocator.locator('xpath=following-sibling::*[self::input or self::select][1]');
  return field;
}

async function fillByLabel(page, label, value) {
  await (await fieldByLabel(page, label)).fill(value);
}

async function selectByLabel(page, label, value) {
  await (await fieldByLabel(page, label)).selectOption(value);
}

async function main() {
  const email = `approval.ui.${Date.now()}@test.com`;
  const password = 'student123';
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.error('[browser console error]', msg.text());
    }
  });

  try {
    await page.goto(`${baseUrl}/register/student`, { waitUntil: 'networkidle' });

    await fillByLabel(page, 'Full Name', 'Approval UI Student');
    await fillByLabel(page, 'Email Address', email);
    await fillByLabel(page, 'Password', password);
    await fillByLabel(page, 'Phone', '9999999999');
    await selectByLabel(page, 'Department', 'Computer Science');
    await selectByLabel(page, 'Year of Study', '3');
    await fillByLabel(page, 'CGPA', '8.5');
    await page.getByRole('button', { name: 'Create Account' }).click();

    await page.getByText('Registration successful! Please wait for admin approval before logging in.').waitFor({ timeout: 10000 });

    await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });
    await fillByLabel(page, 'Email Address', email);
    await fillByLabel(page, 'Password', password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByText('pending admin approval', { exact: false }).waitFor({ timeout: 10000 });

    await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });
    await fillByLabel(page, 'Email Address', 'admin@smarthire.com');
    await fillByLabel(page, 'Password', 'admin123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('**/admin', { timeout: 10000 });
    await page.goto(`${baseUrl}/admin/students`, { waitUntil: 'networkidle' });
    await page.getByText(email).waitFor({ timeout: 10000 });

    const approveResponsePromise = page.waitForResponse((response) =>
      response.url().includes('/api/admin/approve-user/') && response.request().method() === 'PUT'
    );

    const studentRow = page.locator('tbody tr').filter({ hasText: email });
    await studentRow.getByRole('button', { name: 'Approve' }).click();
    const approveResponse = await approveResponsePromise;

    if (!approveResponse.ok()) {
      throw new Error(`Approve request failed with status ${approveResponse.status()}`);
    }

    await studentRow.getByText('Approved').waitFor({ timeout: 10000 });

    await page.getByRole('button', { name: 'Logout' }).click();
    await page.waitForURL('**/', { timeout: 10000 });

    await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });
    await fillByLabel(page, 'Email Address', email);
    await fillByLabel(page, 'Password', password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('**/student', { timeout: 10000 });

    console.log(JSON.stringify({
      status: 'ok',
      email,
      approvalResponseStatus: approveResponse.status(),
      finalUrl: page.url(),
    }, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
