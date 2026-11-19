#!/usr/bin/env node
// Check whether this machine is ready to export Android APKs from Godot.
// Reports what is present and what is missing. Exit 0 always;
// --strict exits 1 when anything is missing.
// Usage: node check-android-env.mjs [--json] [--strict]
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const strict = args.includes('--strict');

const checks = [];
function check(name, ok, detail, fix) {
  checks.push({ name, ok, detail, fix: ok ? undefined : fix });
}

// 1. Java (OpenJDK 17 recommended by the Godot Android docs)
let javaDetail = 'java not found on PATH';
let javaOk = false;
try {
  const out = execFileSync('java', ['-version'], { stdio: ['ignore', 'pipe', 'pipe'] })
    .toString() || '';
  // java -version prints to stderr; execFileSync captures stdout, so re-run merged:
  const merged = execFileSync('sh', ['-c', 'java -version 2>&1']).toString();
  const m = merged.match(/version "(\d+)/);
  if (m) {
    const major = Number(m[1]);
    javaDetail = `Java ${major} detected`;
    javaOk = major >= 17;
    if (!javaOk) javaDetail += ' (need 17 or newer; 17 recommended)';
  } else {
    javaDetail = `java found but version unparsed: ${merged.split('\n')[0]}`;
  }
} catch { /* not installed */ }
check('Java JDK 17+', javaOk, javaDetail,
  'Install OpenJDK 17. The Godot 4.7 Android docs recommend JDK 17 for stability.');

// 2. Android SDK location
const sdkRoot = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || '';
check('Android SDK path', sdkRoot.length > 0 && existsSync(sdkRoot),
  sdkRoot ? `ANDROID_HOME=${sdkRoot}` : 'ANDROID_HOME / ANDROID_SDK_ROOT not set',
  'Install the Android SDK and export ANDROID_HOME pointing at it.');

function sdkHas(rel) {
  return sdkRoot.length > 0 && existsSync(join(sdkRoot, rel));
}

// 3. SDK packages per the Godot 4.7 docs
check('platform-tools (adb)', sdkHas(join('platform-tools', 'adb')),
  sdkRoot ? 'platform-tools/adb present' : 'checked after SDK path',
  'sdkmanager "platform-tools"');
check('platforms;android-35', sdkHas(join('platforms', 'android-35')),
  sdkRoot ? 'platforms/android-35 present' : 'checked after SDK path',
  'sdkmanager "platforms;android-35"');
check('build-tools;35.0.1', sdkHas(join('build-tools', '35.0.1')),
  sdkRoot ? 'build-tools/35.0.1 present' : 'checked after SDK path',
  'sdkmanager "build-tools;35.0.1"');
check('cmdline-tools', sdkHas(join('cmdline-tools')),
  sdkRoot ? 'cmdline-tools present' : 'checked after SDK path',
  'sdkmanager "cmdline-tools;latest"');

let ndkDetail = 'checked after SDK path';
let ndkOk = false;
if (sdkRoot && existsSync(join(sdkRoot, 'ndk'))) {
  const ndks = readdirSync(join(sdkRoot, 'ndk'));
  ndkOk = ndks.some((v) => v.startsWith('28.'));
  ndkDetail = ndks.length ? `NDK versions present: ${ndks.join(', ')}` : 'no NDK installed';
  if (ndkOk) ndkDetail += ' (r28 family OK per Godot 4.7 docs)';
}
check('NDK r28b', ndkOk, ndkDetail, 'sdkmanager "ndk;28.1.13356709"');

// 4. Godot editor on PATH (optional but useful)
let godotOk = false;
let godotDetail = 'godot not found on PATH';
try {
  const out = execFileSync('sh', ['-c', 'godot --version 2>&1 || godot4 --version 2>&1']).toString().trim();
  godotOk = out.length > 0;
  godotDetail = `godot --version: ${out.split('\n')[0]}`;
} catch { /* not on PATH; fine, the editor also runs uninstalled */ }
check('Godot editor reachable', godotOk, godotDetail,
  'Download Godot 4.7.x from https://godotengine.org/download/ (no install needed; PATH entry optional).');

const missing = checks.filter((c) => !c.ok);

if (asJson) {
  console.log(JSON.stringify({ ok: missing.length === 0, checks }, null, 2));
} else {
  console.log('Godot Android export environment check');
  console.log('(requirements from the Godot 4.7 docs: https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_android.html)\n');
  for (const c of checks) {
    console.log(`  ${c.ok ? 'OK  ' : 'MISS'} ${c.name}: ${c.detail}`);
    if (!c.ok && c.fix) console.log(`       fix: ${c.fix}`);
  }
  console.log(missing.length === 0
    ? '\nAll checks passed. Set the Java and Android SDK paths in Godot Editor Settings, then export.'
    : `\n${missing.length} item(s) missing.`);
}

if (strict && missing.length > 0) process.exit(1);
