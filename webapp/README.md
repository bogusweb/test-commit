<p align="center">
 <img width="20%" height="20%" src="./logo.svg">
</p>

> Lets you focus on the stuff that matters

<br />

[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)]()
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)
[![ngneat](https://img.shields.io/badge/@-ngneat-383636?style=flat-square&labelColor=8f68d4)](https://github.com/ngneat/)



<br >

![Demo](demo.gif)

<br >

Schematics that wrap the Angular generate library schematics and provide all the standard boilerplate you need in order to create a neat Angular open-source project.


## Usage

```
ng add @ngneat/lib @scope/toaster
```

Several files were created. Let's go over them:

### Files

- CODE_OF_CONDUCT.md
- CONTRIBUTING.md
- ISSUE_TEMPLATE.md
- LICENSE.md
- PULL_REQUEST_TEMPLATE.md
- README.md

### Tools

[Prettier](https://prettier.io/), [Commitizen](https://github.com/commitizen/cz-cli), [Standard Version](https://github.com/conventional-changelog/standard-version), [Travis](https://travis-ci.org/), [Spectator](https://github.com/ngneat/spectator), [All Contributors](https://allcontributors.org/)

### Scripts

- `build:lib` - Builds the library
- `test:lib` - Runs tests
- `test:lib:headless` - Runs tests in headless mode with Chrome
- `release` - Releases a new version. This will bump the library's version, and update the `CHANGE_LOG` file based on the commit message
- `release:first` - Creates the first release
- `commit` - Creates a new commit message based on Angular commit messgae convention
- `contributors:add` - Adds a new contributor to the `README` file

### Hooks

- `pre-commit`: Runs prettier on the staged files, and verifies that they don't contain `debugger`, `fit`, or `fdescribe`
- `pre-push`: Runs the `test:lib:headless` command

### Extras

- Running the `add` command  updates the `tsconfig.json` file so that you can import any files from the npm path (`@scope/name`) rather than from relative paths.

- It also populates the library's `package.json` with the initial required information. Make sure you verify the data is accurate before proceeding.
 
## Basic Working Flow

1. Develop
2. Write specs
3. Run `npm run test:lib`,
4. Run `npm run commit`, and choose `fix` or `feature`
5. Run `npm run release`
6. Run `npm run build:lib`
7. Go to the `dist` directory, and run `npm publish`

## Skipping the Library Creation

The schematics provide the --skip-lib flag for cases where we want to generate everything except the library.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/itayod"><img src="https://avatars2.githubusercontent.com/u/6719615?v=4" width="100px;" alt=""/><br /><sub><b>Itay Oded</b></sub></a><br /><a href="https://github.com/@ngneat/lib/commits?author=itayod" title="Code">💻</a></td>
    <td align="center"><a href="https://www.netbasal.com"><img src="https://avatars1.githubusercontent.com/u/6745730?v=4" width="100px;" alt=""/><br /><sub><b>Netanel Basal</b></sub></a><br /><a href="https://github.com/@ngneat/lib/commits?author=NetanelBasal" title="Documentation">📖</a> <a href="#ideas-NetanelBasal" title="Ideas, Planning, & Feedback">🤔</a> <a href="#projectManagement-NetanelBasal" title="Project Management">📆</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
