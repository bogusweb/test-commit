import { externalSchematic, Tree, SchematicContext, Rule, chain } from '@angular-devkit/schematics';
import { Schema as ComponentSchema } from '@schematics/angular/component/schema';
import * as path from 'path';
import { Observable, of } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';
import { getJSON, setJSON, getJSONFromFS, readFile, writeFile } from '../utils/files';
import { observify, isFunction } from '../utils/helpers';
import { Schema } from './schema';

function toTree(ruleOrTree: Rule | any, tree: Tree, context: SchematicContext): Tree {
  return isFunction(ruleOrTree) ? ruleOrTree(tree, context) : (ruleOrTree as any);
}

function removeLibFiles(tree: Tree): Tree {
  tree.actions
    .filter(action => !!action.path.match(/\.component|\.service/))
    .forEach(action => tree.delete(action.path));

  return tree;
}

function addSpectator(options: Schema, tree: Tree, context: SchematicContext, scopeWithName: string): Observable<Tree> {
  const module = tree.actions.find(action => !!action.path.match(/\.module\.ts/));
  if (!module) {
    return of(tree);
  }
  const component = externalSchematic('@ngneat/spectator', 'spectator-component', {
    path: path.dirname(module.path),
    name: options.name,
    skipImport: true,
    flat: true,
    inlineStyle: true,
    inlineTemplate: true,
    project: scopeWithName
  } as ComponentSchema);
  const service = externalSchematic('@ngneat/spectator', 'spectator-service', {
    path: path.dirname(module.path),
    name: options.name
  });

  const spectator = chain([component, service]);

  return observify<Tree>(toTree(spectator(tree, context), tree, context));
}

function updateTsConfig(host: Tree, name: string, libPath: string): Tree {
  const tsConfigPath = 'tsconfig.json';
  // take tsConfig from the fs because we do not need angular's changes.
  const tsConfig = getJSONFromFS(tsConfigPath);
  const paths = {
    [name]: [`${libPath}/src/public-api.ts`]
  };

  tsConfig.compilerOptions.paths = { ...tsConfig.compilerOptions.paths, ...paths };

  return setJSON(host, tsConfigPath, tsConfig);
}

function updateKarmaConfig(host: Tree, libPath: string): Tree {
  const karmaPath = `${libPath}/karma.conf.js`;
  if (host.exists(karmaPath)) {
    let karma = readFile(host, karmaPath);
    karma = karma.replace(/browsers:.*/, `browsers: [process.env.CI ? 'ChromeHeadless' : 'Chrome'],`);
    karma = karma.replace(/singleRun:.*/, `singleRun: process.env.CI,`);
    writeFile(karmaPath, karma, host);
  }

  return host;
}

function packageJSONExtensions(options: Schema) {
  const repoUrl = options.repositoryUrl || `https://github.com/${options.name}`;

  return {
    version: '1.0.0',
    keywords: ['angular', 'angular 2', options.name],
    license: 'MIT',
    publishConfig: {
      access: 'public'
    },
    bugs: {
      url: `${repoUrl}/issue`
    },
    homepage: `${repoUrl}#readme`,
    repository: {
      type: 'git',
      url: `${repoUrl}`
    }
  };
}

function updatePackageJSON(options: Schema, libPath: string, tree: Tree): Tree {
  const packageJSONPath = `${libPath}/package.json`;

  if (!tree.exists(packageJSONPath)) {
    return tree;
  }
  const pkg = getJSON(tree, packageJSONPath);

  return setJSON(tree, packageJSONPath, { ...pkg, ...packageJSONExtensions(options) });
}

export function createLib(
  options: Schema,
  scopeWithName: string,
  libPath: string,
  tree: Tree,
  context: SchematicContext
): Observable<Tree> {
  const libRule = externalSchematic('@schematics/angular', 'library', { ...options, name: scopeWithName });
  const libTree$ = observify<Tree>(toTree(libRule(tree, context), tree, context));

  return libTree$.pipe(
    tap(tree => updatePackageJSON(options, libPath, tree)),
    map(removeLibFiles),
    map(libTree => updateTsConfig(libTree, scopeWithName, libPath)),
    map(libTree => updateKarmaConfig(libTree, libPath)),
    switchMap(libTree => addSpectator(options, libTree, context, scopeWithName))
  );
}
