import { Tree } from '@angular-devkit/schematics';
import { getPackageJson, setPackageJson } from '../utils/package';
import { Schema } from './schema';

function scriptsToAdd(libPath: string, libName: string, skipLib: boolean) {
  const depthFromRootLib = libName
    .split('/')
    .map(_ => '..')
    .join('/');
  const basicScripts = {
    'contributors:add': 'all-contributors add',
    'hooks:pre-commit': 'node hooks/pre-commit.js',
    commit: 'git-cz',
    'release:first': 'npm run release -- --first-release'
  };
  if (skipLib) {
    return {
      ...basicScripts,
      release: 'standard-version && npm run build',
      'test:headless': 'cross-env CI=true npm run test'
    };
  }
  return {
    ...basicScripts,
    'build:lib': `ng build ${libName}`,
    'test:lib': `ng test ${libName}`,
    release: `cd ${libPath} && standard-version --infile ${depthFromRootLib}/../CHANGELOG.md`,
    'test:lib:headless': 'cross-env CI=true npm run test:lib'
  };
}

const husky = {
  hooks: {
    'commit-msg': 'commitlint -e $GIT_PARAMS',
    'pre-commit': 'npm run hooks:pre-commit && lint-staged',
    'pre-push': 'npm run test:headless'
  }
};

const config = {
  commitizen: {
    path: 'cz-conventional-changelog'
  }
};

const lintStaged = {
  '*.{js,json,css,scss,ts,html,component.html}': ['prettier --write', 'git add']
};

export function updatePackageJson(host: Tree, libPath: string, libName: string, options: Schema) {
  const json = getPackageJson(host);

  json['scripts'] = {
    ...json.scripts,
    ...scriptsToAdd(libPath, libName, options.skipLib)
  };
  json['husky'] = husky;
  json['config'] = config;
  json['lint-staged'] = lintStaged;
  setPackageJson(host, json);
}
