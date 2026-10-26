import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import spanish from '../src/data/translations/es.js';
import projects from '../src/data/projects.js';

test('Spanish covers every translated component label, placeholder and accessible description', () => {
  const directory = new URL('../src/components/', import.meta.url);
  for (const name of readdirSync(directory).filter(name => name.endsWith('.astro'))) {
    const source = readFileSync(new URL(name, directory), 'utf8');
    for (const [, key] of source.matchAll(/data-i18n(?:-(?:aria|alt|placeholder))?="([^"]+)"/g)) {
      assert.ok(typeof spanish[key] === 'string' && spanish[key].trim(), `${name}: missing Spanish copy for ${key}`);
    }
  }
});

test('every additional project has complete Spanish content, including concept details', () => {
  for (const project of projects.additional) {
    for (const key of Object.keys(project.en)) {
      assert.ok(typeof project.es?.[key] === 'string' && project.es[key].trim(), `${project.id}: missing Spanish ${key}`);
    }
  }
});

test('Spanish dynamic messages preserve their substitution placeholders', () => {
  for (const [key, placeholders] of Object.entries({
    namedIntroduction: ['name'], socialProfileLabel: ['name'], openProjectSite: ['name'], projectsShown: ['count', 'total'],
  })) {
    assert.deepEqual([...spanish[key].matchAll(/\{(\w+)\}/g)].map(match => match[1]), placeholders, key);
  }
});
