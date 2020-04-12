import {noop} from '@angular-devkit/schematics';
import * as fromDevkit from '@angular-devkit/schematics';
import {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import {Schema} from '../lib/schema';
import {createWorkspace} from './fixtures/workspace';

const collectionPath = path.join(__dirname, '../collection.json');

describe('lib', () => {
  const schematicRunner = new SchematicTestRunner('schematics', collectionPath);
  let options: Schema;
  let appTree: UnitTestTree;

  beforeEach(() => {
    options = { name: 'transloco', ci: 'travis' };
    spyOn(fromDevkit, 'externalSchematic').and.returnValue(noop);
    appTree = createWorkspace(schematicRunner, appTree);
  });

  describe('package.json', () => {
    let json;
    beforeEach( async () => {
      const runner = new SchematicTestRunner('schematics', collectionPath);
      const tree = await runner.runSchematicAsync('lib', options, appTree).toPromise();

      json = JSON.parse(tree.readContent(`package.json`));
    });

    it('should add devDependencies', () => {
      expect(json.devDependencies).toMatchSnapshot();
    });

    it('should add scripts', () => {
      expect(json.scripts).toMatchSnapshot();
    });

    it('should add husky', () => {
      expect(json.husky).toMatchSnapshot();
    });

    it('should add config', () => {
      expect(json.config).toMatchSnapshot();
    });

    it('should add lint-staged', () => {
      expect(json['lint-staged']).toMatchSnapshot();
    });

  });

  describe('files', () => {
    let tree;
    beforeEach( async () => {
      const runner = new SchematicTestRunner('schematics', collectionPath);
      tree = await runner.runSchematicAsync('lib', options, appTree).toPromise();
    });

    it('should create README.md', () => {
      const content = tree.readContent(`README.md`);
      expect(content).toMatchSnapshot();
    });

    it('should create LICENSE', () => {
      expect(tree.files.includes('/LICENSE')).toBeTruthy();
    });

    it('should create a logo', () => {
      expect(tree.files.includes('/logo.svg')).toBeTruthy();
    });

    it('should create CODE_OF_CONDUCT.md', () => {
      const content = tree.readContent(`CODE_OF_CONDUCT.md`);
      expect(content).toMatchSnapshot();
    });

    it('should create commitlint.config.js', () => {
      const content = tree.readContent(`commitlint.config.js`);
      expect(content).toMatchSnapshot();
    });

    it('should create CONTRIBUTING.md', () => {
      const content = tree.readContent(`CONTRIBUTING.md`);
      expect(content).toMatchSnapshot();
    });

    it('should create ISSUE_TEMPLATE.md', () => {
      const content = tree.readContent(`ISSUE_TEMPLATE.md`);
      expect(content).toMatchSnapshot();
    });

    it('should create prettier.config.js', () => {
      const content = tree.readContent(`prettier.config.js`);
      expect(content).toMatchSnapshot();
    });

    it('should create PULL_REQUESTS.md', () => {
      const content = tree.readContent(`PULL_REQUESTS.md`);
      expect(content).toMatchSnapshot();
    });

  });

  describe('with scope', () => {
    let json;
    let tree;
    options = {...options, scope: '@ngneat'};

    beforeEach( async () => {
      const runner = new SchematicTestRunner('schematics', collectionPath);
      tree = await runner.runSchematicAsync('lib', options, appTree).toPromise();
      json = JSON.parse(tree.readContent(`package.json`));
    });

    it('should have scope name in README.md', () => {
      const content = tree.readContent(`README.md`);
      expect(content).toMatchSnapshot();
    });

    it('should add scripts with scope name', () => {
      expect(json.scripts).toMatchSnapshot();
    });

  });

  fdescribe('with scope in name', () => {
    let json;
    let tree;
    options = {...options, name: `@ngneat/${options.name}`};

    beforeEach( async () => {
      const runner = new SchematicTestRunner('schematics', collectionPath);
      tree = await runner.runSchematicAsync('lib', options, appTree).toPromise();
      json = JSON.parse(tree.readContent(`package.json`));
    });

    it('should have scope name in README.md', () => {
      const content = tree.readContent(`README.md`);
      expect(content).toMatchSnapshot();
    });

    it('should add scripts with scope name', () => {
      expect(json.scripts).toMatchSnapshot();
    });

  });

  describe('CI', () => {
    let runner;
    beforeEach( async () => {
      runner = new SchematicTestRunner('schematics', collectionPath);
    });

    it('should create PULL_REQUESTS.md', async () => {
      options = {...options, ci: 'travis'};
      const tree = await runner.runSchematicAsync('lib', options, appTree).toPromise();
      const content = tree.readContent(`.travis.yml`);
      expect(content).toMatchSnapshot();
    });

  });


});
