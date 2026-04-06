import { readFileSync, existsSync } from 'fs';
import { resolve, dirname, join } from 'path';

export interface RepoEntry {
  name: string;
  path: string;
  tags?: string[];
}

export interface IntegrationNetworkSolutions {
  command: string;
  accountEnvVar: string;
  siteEnvVar?: string;
  requiredEnvVars?: string[];
}

export interface IntegrationWordPress {
  command: string;
  siteEnvVar: string;
  accountEnvVar?: string;
  requiredEnvVars?: string[];
}

export interface IntegrationCopilot {
  command?: string;
  requiredEnvVars?: string[];
}

export interface Integrations {
  networkSolutions?: IntegrationNetworkSolutions;
  wordpress?: IntegrationWordPress;
  copilot?: IntegrationCopilot;
}

export interface AuroraConfig {
  version: string;
  repos: RepoEntry[];
  integrations?: Integrations;
  _manifestPath: string;
}

export function loadConfig(options: { manifest?: string } = {}): AuroraConfig {
  const manifestPath = findManifest(options.manifest);

  if (!manifestPath) {
    return {
      version: '1.0.0',
      repos: [],
      _manifestPath: '',
    };
  }

  const raw = readFileSync(manifestPath, 'utf-8');
  let data: Record<string, unknown>;

  try {
    data = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    throw new Error(`aurora: failed to parse manifest at ${manifestPath}`);
  }

  const manifestDir = dirname(manifestPath);

  const repos: RepoEntry[] = [];
  const rawRepos = (data.repos as Array<Record<string, unknown>> | undefined) ?? [];
  for (const r of rawRepos) {
    const name = String(r.name ?? '');
    const rawPath = String(r.path ?? '');
    const absolutePath = resolve(manifestDir, rawPath);
    const tags = Array.isArray(r.tags) ? (r.tags as string[]) : [];
    repos.push({ name, path: absolutePath, tags });
  }

  const integrations = normalizeIntegrations(
    data.integrations as Record<string, unknown> | undefined,
    manifestDir
  );

  return {
    version: String(data.version ?? '1.0.0'),
    repos,
    integrations,
    _manifestPath: manifestPath,
  };
}

function findManifest(override?: string): string | null {
  if (override) {
    const p = resolve(override);
    if (!existsSync(p)) throw new Error(`aurora: manifest not found at ${p}`);
    return p;
  }

  let dir = process.cwd();
  for (let i = 0; i < 10; i++) {
    const candidate = join(dir, 'aurora.ecosystem.json');
    if (existsSync(candidate)) return candidate;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  return null;
}

function normalizeIntegrations(
  raw: Record<string, unknown> | undefined,
  _manifestDir: string
): Integrations | undefined {
  if (!raw) return undefined;

  const integrations: Integrations = {};

  const ns = raw.networkSolutions as Record<string, unknown> | undefined;
  if (ns) {
    integrations.networkSolutions = {
      command: String(ns.command ?? 'node scripts/network-solutions.js'),
      accountEnvVar: String(ns.accountEnvVar ?? 'NETWORK_SOLUTIONS_ACCOUNT'),
      siteEnvVar: ns.siteEnvVar ? String(ns.siteEnvVar) : undefined,
      requiredEnvVars: Array.isArray(ns.requiredEnvVars)
        ? (ns.requiredEnvVars as string[])
        : [],
    };
  }

  const wp = raw.wordpress as Record<string, unknown> | undefined;
  if (wp) {
    integrations.wordpress = {
      command: String(wp.command ?? 'node scripts/wordpress.js'),
      siteEnvVar: String(wp.siteEnvVar ?? 'WORDPRESS_SITE_URL'),
      accountEnvVar: wp.accountEnvVar ? String(wp.accountEnvVar) : undefined,
      requiredEnvVars: Array.isArray(wp.requiredEnvVars)
        ? (wp.requiredEnvVars as string[])
        : [],
    };
  }

  const cp = raw.copilot as Record<string, unknown> | undefined;
  if (cp) {
    integrations.copilot = {
      command: cp.command ? String(cp.command) : undefined,
      requiredEnvVars: Array.isArray(cp.requiredEnvVars)
        ? (cp.requiredEnvVars as string[])
        : [],
    };
  }

  return Object.keys(integrations).length > 0 ? integrations : undefined;
}

export function checkRequiredEnvVars(vars: string[]): string[] {
  return vars.filter((v) => !process.env[v]);
}
