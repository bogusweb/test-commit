import {SchematicContext, Tree, chain, Rule, noop} from "@angular-devkit/schematics";
import {Observable} from 'rxjs';
import {installDependencies} from './add-dependencies';
import {addFiles} from './add-root-files';
import {createLib} from './create-lib';
import {Schema} from './schema';
import {updatePackageJson} from './update-package-json';

function rulify(obj: Tree | Observable<Tree> | Rule | null): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return typeof obj === 'function' ? obj(tree, context) : obj;
  }
}

function getLibPath(scopeWithName: string) {
  return `projects/${scopeWithName}`.replace('@', '');
}

function splitScopeFromName(options: Schema): Schema {
  if(!options.scope && options.name.includes('/')) {
    const splittedNameAndScope = options.name.split('/');
    options.scope = splittedNameAndScope[0];
    options.name = splittedNameAndScope[1];
  }
  return options;
}

export function lib(options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    if(tree.exists('README.md')) {
      tree.delete('README.md');
    }

    options = splitScopeFromName(options);

    const scopeWithName = options.scope ? `${options.scope}/${options.name}` : options.name;
    const libPath = getLibPath(scopeWithName);

    updatePackageJson(tree, libPath, scopeWithName, options);
    installDependencies(tree, _context, options);

    const libRule = options.skipLib ?
      noop() :
      rulify(createLib(options, scopeWithName, libPath, tree, _context));

    const filesRule = addFiles(options, scopeWithName, tree);

    return chain([libRule, filesRule]);
  };
}
