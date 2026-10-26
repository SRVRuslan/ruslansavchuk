import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import spanish from '../src/data/translations/es.js';
import german from '../src/data/translations/de.js';
import portuguese from '../src/data/translations/pt.js';
import projects from '../src/data/projects.js';

for (const [language, dictionary, code] of [['Spanish', spanish, 'es'], ['German', german, 'de'], ['Portuguese', portuguese, 'pt']]) {
  test(`${language} covers every translated component label, placeholder and accessible description`, () => {
    const directory = new URL('../src/components/', import.meta.url);
    for (const name of readdirSync(directory).filter(name => name.endsWith('.astro'))) {
      const source = readFileSync(new URL(name, directory), 'utf8');
      for (const [, key] of source.matchAll(/data-i18n(?:-(?:aria|alt|placeholder))?="([^"]+)"/g)) {
        assert.ok(typeof dictionary[key] === 'string' && dictionary[key].trim(), `${name}: missing ${language} copy for ${key}`);
      }
    }
  });

  test(`every additional project has complete ${language} content, including concept details`, () => {
    for (const project of projects.additional) {
      for (const key of Object.keys(project.en)) {
        assert.ok(typeof project[code]?.[key] === 'string' && project[code][key].trim(), `${project.id}: missing ${language} ${key}`);
      }
    }
  });

  test(`${language} dynamic messages preserve their substitution placeholders`, () => {
    for (const [key, placeholders] of Object.entries({
      namedIntroduction: ['name'], socialProfileLabel: ['name'], openProjectSite: ['name'], projectsShown: ['count', 'total'],
    })) {
      assert.deepEqual([...dictionary[key].matchAll(/\{(\w+)\}/g)].map(match => match[1]), placeholders, key);
    }
  });
}

for (const [language, dictionary] of [['German', german], ['Portuguese', portuguese]]) {
  test(`${language} and Spanish have the same complete translation key set`, () => {
    assert.deepEqual(Object.keys(dictionary).sort(), Object.keys(spanish).sort());
  });
}
