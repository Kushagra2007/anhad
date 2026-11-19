import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createApp } from './server.js';
import {
  COMPETITIONS,
  FEST_START_DATE,
  filterCompetitions,
  filterSchedule,
  formatCountdown,
  getFaqsByTopic,
  validateFeedback
} from './js/fest-logic.js';

function request(port, reqPath) {
  return new Promise((resolve, reject) => {
    const req = http.get({ hostname: '127.0.0.1', port, path: reqPath }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(chunks)
        });
      });
    });
    req.on('error', reject);
  });
}

test('Express static server serves index.html, styles, scripts, ANHAD logo PNGs, and blocks config files', async () => {
  const app = createApp();
  const server = await new Promise((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });
  const { port } = server.address();

  try {
    const home = await request(port, '/');
    assert.equal(home.status, 200);
    const html = home.body.toString('utf8');
    assert.match(html, /ANHAD '26/);
    assert.match(html, /src="assets\/anhad-logo\.png"/);
    assert.match(html, /src="assets\/student-council-logo\.png"/);
    assert.match(html, /desk-art-backdrop/);
    assert.match(html, /spine-crease-overlay/);
    assert.equal(html.includes('gcet-seal-wrapper'), false);
    assert.equal(html.includes('farman-seal'), false);

    const logoGold = await request(port, '/assets/anhad-logo.png');
    assert.equal(logoGold.status, 200);
    assert.match(logoGold.headers['content-type'] || '', /image\/png/);
    assert.ok(logoGold.body.length > 10000);

    const logoParchment = await request(port, '/assets/anhad-logo-parchment.png');
    assert.equal(logoParchment.status, 200);
    assert.match(logoParchment.headers['content-type'] || '', /image\/png/);

    const logoCouncil = await request(port, '/assets/student-council-logo.png');
    assert.equal(logoCouncil.status, 200);
    assert.match(logoCouncil.headers['content-type'] || '', /image\/png/);
    assert.ok(logoCouncil.body.length > 10000);

    const deskBg = await request(port, '/assets/desk-backdrop.jpg');
    assert.equal(deskBg.status, 200);
    assert.match(deskBg.headers['content-type'] || '', /image\/jpeg/);
    assert.ok(deskBg.body.length > 20000);

    const scrollFrame = await request(port, '/assets/scroll-frame.jpg');
    assert.equal(scrollFrame.status, 200);
    assert.match(scrollFrame.headers['content-type'] || '', /image\/jpeg/);
    assert.ok(scrollFrame.body.length > 20000);
    assert.equal(html.includes('src="/assets/'), false);

    const logic = await request(port, '/js/fest-logic.js');
    assert.equal(logic.status, 200);

    const blocked = await request(port, '/server.js');
    assert.equal(blocked.status, 404);

    const blockedPkg = await request(port, '/package.json');
    assert.equal(blockedPkg.status, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('filterCompetitions filters accurately by category and preserves full set for all', () => {
  assert.equal(filterCompetitions('all').length, COMPETITIONS.length);
  const poetry = filterCompetitions('poetry');
  assert.equal(poetry.length, 3);
  assert.ok(poetry.every((c) => c.category === 'poetry'));
  const debate = filterCompetitions('debate');
  assert.equal(debate.length, 2);
});

test('filterSchedule filters by day, category, and free-text query', () => {
  const all = filterSchedule();
  assert.equal(all.length, 15);
  const day2 = filterSchedule({ day: 'day2' });
  assert.equal(day2.length, 5);
  const sufi = filterSchedule({ day: 'day2', query: 'sufi' });
  assert.equal(sufi.length, 1);
  assert.match(sufi[0].title, /Sufi Night/i);
  const exhibits = filterSchedule({ category: 'exhibit' });
  assert.equal(exhibits.length, 2);
});

test('getFaqsByTopic returns grouped topic items and falls back cleanly', () => {
  const travel = getFaqsByTopic('travel');
  assert.equal(travel.topicKey, 'travel');
  assert.ok(travel.items.length >= 3);
  const fallback = getFaqsByTopic('unknown-topic');
  assert.equal(fallback.topicKey, 'registration');
});

test('formatCountdown returns formatted countdown before start and live label after start', () => {
  const before = new Date('2026-11-24T10:00:00+05:30');
  assert.equal(formatCountdown(before, FEST_START_DATE), '2d · 0h · 0m');
  const after = new Date('2026-11-26T12:00:00+05:30');
  assert.match(formatCountdown(after, FEST_START_DATE), /Live Now/);
});

test('validateFeedback enforces name, valid email, and minimum message length', () => {
  assert.equal(validateFeedback({ name: 'A', email: 'a@b.com', message: 'Hello world message' }).valid, false);
  assert.equal(validateFeedback({ name: 'Aarav', email: 'not-an-email', message: 'Hello world message' }).valid, false);
  assert.equal(validateFeedback({ name: 'Aarav', email: 'aarav@gcet.edu', message: 'Short' }).valid, false);
  assert.equal(validateFeedback({ name: 'Aarav', email: 'aarav@gcet.edu', message: 'Can external colleges join Day 2?' }).valid, true);
});
