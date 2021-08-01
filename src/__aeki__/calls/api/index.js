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

export const addModel = async () => {
  const tmpDir = tmp.dirSync()
  const destination = `${path.resolve('.')}`
  const dirname = `${path.dirname(import.meta.url).replace(os.platform() === 'win32' ? 'file:///' : 'file://', '')}`

  const questions = [
    {
      type: 'input',
      name: 'id',
      message: 'Enter an identifier for this model',
      async validate(value) {
        const destination = `${path.resolve('.')}`
        const stash = await checkInStash(destination, 'api', { name: value, type: 'model' })

        if (!value) {
          return 'You must enter an identifier'
        }

        if (stash) {
          return `The model, ${chalk.bold(value)}, already exists`
        }

        return true
      },
    },
    {
      type: 'input',
      name: 'groups',
      message: 'Enter group(s) for this model (seperate by comma)',
      default: 'admin'
    },
    {
      type: 'input',
      name: 'nameSingular',
      message: 'Enter singular name for this model',
      default: 'Post'
    },
    {
      type: 'input',
      name: 'namePlural',
      message: 'Enter plural name for this model',
      default: 'Posts'
    },
  ]

  const answers = await inquirer.prompt(questions)

  await setSpinner(
    async () => {
      await copyHard(`${dirname}/templates/model`, `${tmpDir.name}/${answers.id}`)

      let baseFile = await readFile(`${tmpDir.name}/${answers.id}/base/index.ts`)
      baseFile = baseFile.replace('{{id}}', answers.id)
      baseFile = baseFile.replace('{{groups}}', answers.groups)
      baseFile = baseFile.replace('{{name.singular}}', answers.nameSingular)
      baseFile = baseFile.replace('{{name.plural}}', answers.namePlural)

      await writeFile(`${tmpDir.name}/${answers.id}/base/index.ts`, baseFile)

      let stash = await addToStash(
        destination,
        'api',
        {
          type: 'model',
          name: answers.id
        },
        async () => {
          await copyHard(`${tmpDir.name}/${answers.id}`, `${destination}/api/src/models/${answers.id}`)
        }
      )

      await exportStash(destination, tmpDir, dirname, stash, 'api', 'model')
    },
    `Creating a model:  ${chalk.bold(answers.id)}`,
    `Created a model: ${chalk.bold(answers.id)}`,
  )
}

export const removeModel = async () => {
  const questions = [
    {
      type: 'input',
      name: 'id',
      message: 'Enter an identifier for the model you wish to remove',
      async validate(value) {
        const destination = `${path.resolve('.')}`
        const stash = await checkInStash(destination, 'api', { name: value, type: 'model' })

        if (!value) {
          return 'You must enter an identifier'
        }

        if (!stash) {
          return `The model, ${chalk.bold(value)}, does not exists`
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

  const stash = await removeFromStash(destination, 'api', { type: 'model', id: answers.id })
  await exportStash(destination, tmpDir, dirname, stash, 'api', 'model')
}

export const addRoute = async () => {
  const tmpDir = tmp.dirSync()
  const destination = `${path.resolve('.')}`
  const dirname = `${path.dirname(import.meta.url).replace(os.platform() === 'win32' ? 'file:///' : 'file://', '')}`
  const config = await readFile(`${destination}/aeki.config.json`)

  if (!config) {
    console.log('You must run commands on project root')
    return
  }

  const questions = [
    {
      type: 'input',
      name: 'id',
      message: 'Enter an identifier for this route',
      async validate(value) {
        const destination = `${path.resolve('.')}`
        const stash = await checkInStash(destination, 'api', { name: value, type: 'route' })

        if (!value) {
          return 'You must enter an identifier'
        }

        if (stash) {
          return `The route, ${chalk.bold(value)}, already exists`
        }

        return true
      },
    },
  ]

  const answers = await inquirer.prompt(questions)

  await setSpinner(
    async () => {
      await copyHard(`${dirname}/templates/route`, `${tmpDir.name}/${answers.id}`)

      let targetFile = await readFile(`${tmpDir.name}/${answers.id}/index.ts`)
      targetFile = targetFile.replace(/{{id}}/g, answers.id)

      await writeFile(`${tmpDir.name}/${answers.id}/index.ts`, targetFile)

      let stash = await addToStash(
        destination,
        'api',
        {
          type: 'route',
          name: answers.id
        },
        async () => {
          await copyHard(`${tmpDir.name}/${answers.id}`, `${destination}/api/src/routes/${answers.id}`)
        }
      )

      await exportStash(destination, tmpDir, dirname, stash, 'api', 'route')
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
        const stash = await checkInStash(destination, 'api', { name: value, type: 'route' })

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

  const stash = await removeFromStash(destination, 'api', { type: 'route', id: answers.id })
  await exportStash(destination, tmpDir, dirname, stash, 'api', 'route')
}

export const addSnippet = async () => {
  const tmpDir = tmp.dirSync()
  const destination = `${path.resolve('.')}`
  const dirname = `${path.dirname(import.meta.url).replace(os.platform() === 'win32' ? 'file:///' : 'file://', '')}`
  const config = await readFile(`${destination}/aeki.config.json`)

  if (!config) {
    console.log('You must run commands on project root')
    return
  }

  const questions = [
    {
      type: 'input',
      name: 'id',
      message: 'Enter an identifier for this snippet',
      async validate(value) {
        const destination = `${path.resolve('.')}`
        const stash = await checkInStash(destination, 'api', { name: value, type: 'snippet' })

        if (!value) {
          return 'You must enter an identifier'
        }

        if (stash) {
          return `The snippet, ${chalk.bold(value)}, already exists`
        }

        return true
      },
    },
  ]

  const answers = await inquirer.prompt(questions)

  await setSpinner(
    async () => {
      await copyHard(`${dirname}/templates/snippet`, `${tmpDir.name}/${answers.id}`)

      let targetFile = await readFile(`${tmpDir.name}/${answers.id}/index.ts`)
      targetFile = targetFile.replace(/{{id}}/g, answers.id)

      await writeFile(`${tmpDir.name}/${answers.id}/index.ts`, targetFile)

      let stash = await addToStash(
        destination,
        'api',
        {
          type: 'snippet',
          name: answers.id
        },
        async () => {
          await copyHard(`${tmpDir.name}/${answers.id}`, `${destination}/api/src/snippets/${answers.id}`)
        }
      )

      await exportStash(destination, tmpDir, dirname, stash, 'api', 'snippet')
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
        const stash = await checkInStash(destination, 'api', { name: value, type: 'snippet' })

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

  const stash = await removeFromStash(destination, 'api', { type: 'snippet', id: answers.id })
  await exportStash(destination, tmpDir, dirname, stash, 'api', 'snippet')
}

export const addGroup = async () => {
  const questions = [
    {
      type: 'input',
      name: 'id',
      message: 'Enter an identifier for this virtual group',
      async validate(value) {
        const destination = `${path.resolve('.')}`
        const stash = await checkInStash(destination, 'api', { name: value, type: 'group' })

        if (!value) {
          return 'You must enter an identifier'
        }

        if (stash) {
          return `The group, ${chalk.bold(value)}, already exists`
        }

        return true
      },
    },
    {
      type: 'input',
      name: 'name',
      message: 'Enter a name for this virtual group',
      async validate(value) {
        if (!value) {
          return 'You must enter a anme'
        }

        return true
      },
    },
  ]

  const tmpDir = tmp.dirSync()
  const answers = await inquirer.prompt(questions)
  const destination = `${path.resolve('.')}`
  const dirname = `${path.dirname(import.meta.url).replace(os.platform() === 'win32' ? 'file:///' : 'file://', '')}`

  await setSpinner(
    async () => {
      let stash = await addToStash(
        destination,
        'api',
        {
          type: 'group',
          name: answers.id,
          value: {
            generalInformation: {
              name: answers.name
            }
          }
        },
      )
    },
    `Creating a route:  ${chalk.bold(answers.id)}`,
    `Created a route: ${chalk.bold(answers.id)}`,
  )
}

export const removeGroup = async () => {
  const questions = [
    {
      type: 'input',
      name: 'id',
      message: 'Enter an identifier for the group you wish to remove',
      async validate(value) {
        const destination = `${path.resolve('.')}`
        const stash = await checkInStash(destination, 'api', { name: value, type: 'group' })

        if (!value) {
          return 'You must enter an identifier'
        }

        if (!stash) {
          return `The group, ${chalk.bold(value)}, does not exists`
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

  const stash = await removeFromStash(destination, 'api', { type: 'group', id: answers.id })
}