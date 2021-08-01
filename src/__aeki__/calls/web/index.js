/**
 * Copyright 2021 AEKI <admin@aeki.dev>
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import inquirer from 'inquirer'
import tmp from 'tmp'
import path from 'path'
import chalk from 'chalk'
import os from 'os'
import {
  copyHard,
  readFile,
  writeFile,
  setSpinner,
  addToStash,
  exportStash,
  removeFromStash,
  checkInStash,
} from '../../core/index.js'

export const addRoute = async () => {
  const questions = [
    {
      type: 'input',
      name: 'id',
      message: 'Enter an identifier for this route',
      async validate(value) {
        const destination = `${path.resolve('.')}`
        const stash = await checkInStash(destination, 'web', { name: value, type: 'route' })

        if (!value) {
          return 'You must enter an identifier'
        }

        if (stash) {
          return `The route, ${chalk.bold(value)}, already exists`
        }

        return true
      },
    },
    {
      type: 'input',
      name: 'componentName',
      message: 'Enter a name of the main component',
      async validate(value) {
        if (!value) {
          return 'You must enter a name'
        }

        return true
      },
    },
    {
      type: 'input',
      name: 'path',
      message: 'Enter a path for this route (ex. /a/path/to/id)',
      validate: (value) => {
        if (!value) {
          return 'You must enter a path'
        }

        return true
      }
    },
    {
      type: 'list',
      name: 'type',
      message: 'What is the type of this route?',
      default: 'default',
      choices: ['default'],
    },
  ]
  const tmpDir = tmp.dirSync()
  const answers = await inquirer.prompt(questions)
  const destination = `${path.resolve('.')}`
  const dirname = `${path.dirname(import.meta.url).replace(os.platform() === 'win32' ? 'file:///' : 'file://', '')}`

  await setSpinner(
    async () => {
      await copyHard(`${dirname}/templates/route.${answers.type}`, `${tmpDir.name}/${answers.id}`)

      let baseFile = await readFile(`${tmpDir.name}/${answers.id}/index.tsx`)
      baseFile = baseFile.replace(/{{componentName}}/g, answers.componentName)
      baseFile = baseFile.replace(/{{path}}/g, answers.path)


      await writeFile(`${tmpDir.name}/${answers.id}/index.tsx`, baseFile)

      let stash = await addToStash(
        destination,
        'web',
        {
          type: 'route',
          name: answers.id,
          path: answers.path,
          componentName: answers.componentName,
        },
        async () => {
          await copyHard(`${tmpDir.name}/${answers.id}`, `${destination}/web/src/routes/${answers.id}`)
        }
      )

      await exportStash(
        destination,
        tmpDir,
        dirname,
        stash,
        'web',
        'route',
        async (indexFile) => {
          let components = ''
          let pages = stash.filter(item => item.type === 'route')
          pages = pages.sort((a, b) => {
            const count1 = (a.path.match(/\//g) || []).length
            const count2 = (b.path.match(/\//g) || []).length
            if (count1 > count2)
              return -1
            if (count1 < count2)
              return 1

            return 1
          })

          pages.map(item => {

            components += `      <AsyncPage path={'${item.path}'} name={'${item.name}'} state={state} ${item.path === '/' ? 'exact' : ''}/>\n`

          })

          return indexFile.replace('{{components}}', components)
        }
      )
    },
    `Creating a route:  ${chalk.bold(answers.id)}`,
    `Created a route: ${chalk.bold(answers.id)}`,
  )
}

export const removeRoute = async () => {
  const questions = [
    {
      type: 'input',
      name: 'id',
      message: 'Enter an identifier for the route you wish to remove',
      async validate(value) {
        const destination = `${path.resolve('.')}`
        const stash = await checkInStash(destination, 'web', { name: value, type: 'route' })

        if (!value) {
          return 'You must enter an identifier'
        }

        if (!stash) {
          return `The route, ${chalk.bold(value)}, does not exists`
        }

        return true
      },
    },
    {
      type: 'confirm',
      name: 'confirmation',
      message: 'Are you sure to remove?'
    }
  ]

  const tmpDir = tmp.dirSync()
  const answers = await inquirer.prompt(questions)
  const destination = `${path.resolve('.')}`
  const dirname = `${path.dirname(import.meta.url).replace(os.platform() === 'win32' ? 'file:///' : 'file://', '')}`

  const stash = await removeFromStash(destination, 'web', { type: 'route', id: answers.id })

  await exportStash(
    destination,
    tmpDir,
    dirname,
    stash,
    'web',
    'route',
    async (indexFile) => {
      let components = ''
      stash.map(item => {
        if (item.type === 'route') {
          components += `      <AsyncPage path={'${item.path}'} name={'${item.name}'} state={state} />\n`
        }
      })

      return indexFile.replace('{{components}}', components)
    }
  )
}

export const addModal = async () => {
  const questions = [
    {
      type: 'input',
      name: 'id',
      message: 'Enter an identifier for this modal',
      async validate(value) {
        const destination = `${path.resolve('.')}`
        const stash = await checkInStash(destination, 'web', { name: value, type: 'modal' })

        if (!value) {
          return 'You must enter an identifier'
        }

        if (stash) {
          return `The modal, ${chalk.bold(value)}, already exists`
        }

        return true
      },
    },
    {
      type: 'input',
      name: 'componentName',
      message: 'Enter a name of the main component',
      async validate(value) {
        if (!value) {
          return 'You must enter a name'
        }

        return true
      },
    },
    {
      type: 'list',
      name: 'type',
      message: 'What is the type of this modal?',
      default: 'default',
      choices: ['default'],
    },
  ]
  const tmpDir = tmp.dirSync()
  const answers = await inquirer.prompt(questions)
  const destination = `${path.resolve('.')}`
  const dirname = `${path.dirname(import.meta.url).replace(os.platform() === 'win32' ? 'file:///' : 'file://', '')}`

  await setSpinner(
    async () => {
      await copyHard(`${dirname}/templates/modal.${answers.type}`, `${tmpDir.name}/${answers.id}`)

      let baseFile = await readFile(`${tmpDir.name}/${answers.id}/index.tsx`)
      baseFile = baseFile.replace(/{{componentName}}/g, answers.componentName)


      await writeFile(`${tmpDir.name}/${answers.id}/index.tsx`, baseFile)

      let stash = await addToStash(
        destination,
        'web',
        {
          type: 'modal',
          name: answers.id,
          componentName: answers.componentName,
        },
        async () => {
          await copyHard(`${tmpDir.name}/${answers.id}`, `${destination}/web/src/modals/${answers.id}`)
        }
      )

      await exportStash(
        destination,
        tmpDir,
        dirname,
        stash,
        'web',
        'modal',
        async () => {
          return null
        }
      )
    },
    `Creating a modal:  ${chalk.bold(answers.id)}`,
    `Created a modal: ${chalk.bold(answers.id)}`,
  )
}

export const removeModal = async () => {
  const questions = [
    {
      type: 'input',
      name: 'id',
      message: 'Enter an identifier for the modal you wish to remove',
      async validate(value) {
        const destination = `${path.resolve('.')}`
        const stash = await checkInStash(destination, 'web', { name: value, type: 'modal' })

        if (!value) {
          return 'You must enter an identifier'
        }

        if (!stash) {
          return `The modal, ${chalk.bold(value)}, does not exists`
        }

        return true
      },
    },
    {
      type: 'confirm',
      name: 'confirmation',
      message: 'Are you sure to remove?'
    }
  ]

  const tmpDir = tmp.dirSync()
  const answers = await inquirer.prompt(questions)
  const destination = `${path.resolve('.')}`
  const dirname = `${path.dirname(import.meta.url).replace(os.platform() === 'win32' ? 'file:///' : 'file://', '')}`

  const stash = await removeFromStash(destination, 'web', { type: 'modal', id: answers.id })

  await exportStash(
    destination,
    tmpDir,
    dirname,
    stash,
    'web',
    'modal',
    async () => {
      return null
    }
  )
}

export const addSnippet = async () => {
  const questions = [
    {
      type: 'input',
      name: 'id',
      message: 'Enter an identifier for this snippet',
      async validate(value) {
        const destination = `${path.resolve('.')}`
        const stash = await checkInStash(destination, 'web', { name: value, type: 'snippet' })

        if (!value) {
          return 'You must enter an identifier'
        }

        if (stash) {
          return `The snippet, ${chalk.bold(value)}, already exists`
        }

        return true
      },
    },
    {
      type: 'input',
      name: 'componentName',
      message: 'Enter a name of the main component',
      async validate(value) {
        if (!value) {
          return 'You must enter a name'
        }

        return true
      },
    },
    {
      type: 'list',
      name: 'type',
      message: 'What is the type of this snippet?',
      default: 'default',
      choices: ['default'],
    },
  ]
  const tmpDir = tmp.dirSync()
  const answers = await inquirer.prompt(questions)
  const destination = `${path.resolve('.')}`
  const dirname = `${path.dirname(import.meta.url).replace(os.platform() === 'win32' ? 'file:///' : 'file://', '')}`

  console.log(answers)
  await setSpinner(
    async () => {
      await copyHard(`${dirname}/templates/snippet.${answers.type}`, `${tmpDir.name}/${answers.id}`)

      let baseFile = await readFile(`${tmpDir.name}/${answers.id}/index.tsx`)
      baseFile = baseFile.replace(/{{id}}/g, answers.id)
      baseFile = baseFile.replace(/{{componentName}}/g, answers.componentName)


      await writeFile(`${tmpDir.name}/${answers.id}/index.tsx`, baseFile)

      let stash = await addToStash(
        destination,
        'web',
        {
          type: 'snippet',
          name: answers.id,
          componentName: answers.componentName,
        },
        async () => {
          await copyHard(`${tmpDir.name}/${answers.id}`, `${destination}/web/src/snippets/${answers.id}`)
        }
      )

      await exportStash(
        destination,
        tmpDir,
        dirname,
        stash,
        'web',
        'snippet'
      )
    },
    `Creating a snippet:  ${chalk.bold(answers.id)}`,
    `Created a snippet: ${chalk.bold(answers.id)}`,
  )
}

export const removeSnippet = async () => {
  const questions = [
    {
      type: 'input',
      name: 'id',
      message: 'Enter an identifier for the snippet you wish to remove',
      async validate(value) {
        const destination = `${path.resolve('.')}`
        const stash = await checkInStash(destination, 'web', { name: value, type: 'snippet' })

        if (!value) {
          return 'You must enter an identifier'
        }

        if (!stash) {
          return `The snippet, ${chalk.bold(value)}, does not exists`
        }

        return true
      },
    },
    {
      type: 'confirm',
      name: 'confirmation',
      message: 'Are you sure to remove?'
    }
  ]

  const tmpDir = tmp.dirSync()
  const answers = await inquirer.prompt(questions)
  const destination = `${path.resolve('.')}`
  const dirname = `${path.dirname(import.meta.url).replace(os.platform() === 'win32' ? 'file:///' : 'file://', '')}`

  const stash = await removeFromStash(destination, 'web', { type: 'snippet', id: answers.id })

  await exportStash(
    destination,
    tmpDir,
    dirname,
    stash,
    'web',
    'snippet',
  )
}

export const addView = async () => {
  const questions = [
    {
      type: 'input',
      name: 'id',
      message: 'Enter an identifier for this view',
      async validate(value) {
        const destination = `${path.resolve('.')}`
        const stash = await checkInStash(destination, 'web', { name: value, type: 'view' })

        if (!value) {
          return 'You must enter an identifier'
        }

        if (stash) {
          return `The view, ${chalk.bold(value)}, already exists`
        }

        return true
      },
    },
    {
      type: 'input',
      name: 'componentName',
      message: 'Enter a name of the main component',
      async validate(value) {
        if (!value) {
          return 'You must enter a name'
        }

        return true
      },
    },
    {
      type: 'list',
      name: 'type',
      message: 'What is the type of this view?',
      default: 'default',
      choices: ['default', 'table-content'],
    },
  ]
  const tmpDir = tmp.dirSync()
  const answers = await inquirer.prompt(questions)
  const destination = `${path.resolve('.')}`
  const dirname = `${path.dirname(import.meta.url).replace('file://', '')}`

  await setSpinner(
    async () => {
      await copyHard(`${dirname}/templates/view.${answers.type}`, `${tmpDir.name}/${answers.id}`)

      let baseFile = await readFile(`${tmpDir.name}/${answers.id}/index.tsx`)
      baseFile = baseFile.replace(/{{id}}/g, answers.name)
      baseFile = baseFile.replace(/{{componentName}}/g, answers.componentName)


      await writeFile(`${tmpDir.name}/${answers.id}/index.tsx`, baseFile)

      let stash = await addToStash(
        destination,
        'web',
        {
          type: 'view',
          name: answers.id,
          path: answers.path,
          componentName: answers.componentName,
        },
        async () => {
          await copyHard(`${tmpDir.name}/${answers.id}`, `${destination}/web/src/views/${answers.id}`)
        }
      )

      await exportStash(
        destination,
        tmpDir,
        dirname,
        stash,
        'web',
        'view'
      )
    },
    `Creating a view: ${chalk.bold(answers.id)}`,
    `Created a view: ${chalk.bold(answers.id)}`,
  )
}