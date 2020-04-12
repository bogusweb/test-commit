import {SchematicContext, Tree} from '@angular-devkit/schematics';
import {NodePackageInstallTask} from '@angular-devkit/schematics/tasks';
import {addPackageToPackageJsonFactory} from '../utils/package';
import { Schema } from './schema';

const deps = [
  {
    name: '@commitlint/cli',
    version: '8.1.0'
  },
  {
    name: '@commitlint/config-angular',
    version: '^8.1.0'
  },
  {
    name: '@commitlint/config-conventional',
    version: '^8.1.0'
  },
  {
    name: 'git-cz',
    version: '^3.2.1'
  },
  {
    name: 'all-contributors-cli',
    version: '^6.8.1'
  },
  {
    name: 'lint-staged',
    version: '^9.2.0'
  },
  {
    name: 'prettier',
    version: '^1.18.2'
  },
  {
    name: 'standard-version',
    version: '^6.0.1'
  },
  {
    name: 'husky',
    version: '^3.0.1'
  },
  {
    name: 'cross-env',
    version: '^5.2.0'
  },
];

export function installDependencies(host: Tree, context: SchematicContext, options: Schema) {
  const addPackageToPackageJson = addPackageToPackageJsonFactory(host, 'devDependencies');
  if(!options.skipLib) {
    deps.push({
      name: '@ngneat/spectator',
      version: '^4.11.1'
    });
  }
  deps.forEach(dep => {
    addPackageToPackageJson(dep.name, dep.version);
  });

  context.addTask(new NodePackageInstallTask());
}
