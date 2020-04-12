import {
  UnitTestTree,
  SchematicTestRunner,
} from '@angular-devkit/schematics/testing';

export const defaultWorkspaceOptions = {
  name: 'workspace',
  newProjectRoot: 'projects',
  version: '8.0.0',
  defaultProject: 'bar',
};

export function createWorkspace(
    schematicRunner: SchematicTestRunner,
    appTree: UnitTestTree,
    workspaceOptions = defaultWorkspaceOptions,
) {
  appTree = schematicRunner.runExternalSchematic(
      '@schematics/angular',
      'workspace',
      workspaceOptions
  );

  return appTree;
}
