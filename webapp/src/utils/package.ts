import {Tree} from '@angular-devkit/schematics';
import {getJSON, setJSON} from './files';

type dependencies = 'dependencies' | 'devDependencies' | 'peerDependencies';

/**
 * Adds a package to the package.json
 */
export function addPackageToPackageJsonFactory(host: Tree, type: dependencies): (pkg: string, version: string) => void {
  return (pkg: string, version: string) => {
    const json = getPackageJson(host);

    if (!json[type]) {
      json[type] = {};
    }

    if (!json[type][pkg]) {
      json[type][pkg] = version;
    }

    return setPackageJson(host, json);
  }
}

export function getPackageJson(host: Tree) {
  return getJSON(host, 'package.json');
}

export function setPackageJson(host: Tree, packageJSON: Object) {
  return setJSON(host, 'package.json', packageJSON);
}
