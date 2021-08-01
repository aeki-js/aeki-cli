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
  runCommand,
  setSpinner,
  addToStash,
  exportStash,
  removeFromStash,
  checkInStash,
  writeFile,
} from '../../core/index.js'

export const addScript = async () => {
  const tmpDir = tmp.dirSync()
  const destination = `${path.resolve('.')}`
  const dirname = `${path.dirname(import.meta.url).replace(os.platform() === 'win32' ? 'file:///' : 'file://', '')}`

  const questions = [
    {
      type: 'input',
      name: 'id',
      message: 'Enter an identifier for this script',
      async validate(value) {
        const destination = `${path.resolve('.')}`
        const stash = await checkInStash(destination, 'seed', { name: value, type: 'script' })

        if (!value) {
          return 'You must enter an identifier'
        }

        if (stash) {
          return `The script, ${chalk.bold(value)}, already exists`
        }

        return true
      },
    }
  ]

  const answers = await inquirer.prompt(questions)

  await copyHard(`${dirname}/templates/script`, `${tmpDir.name}/${answers.id}`)

  let baseFile = await readFile(`${tmpDir.name}/${answers.id}/index.ts`)

  baseFile = baseFile.replace('{{id}}', answers.id)


  await writeFile(`${tmpDir.name}/${answers.id}/index.ts`, baseFile)

  await setSpinner(
    async () => {

      let stash = await addToStash(
        destination,
        'seed',
        {
          type: 'script',
          name: answers.id
        },
        async () => {
          await copyHard(`${tmpDir.name}/${answers.id}`, `${destination}/seed/src/scripts/${answers.id}`)
        }
      )

      await exportStash(destination, tmpDir, dirname, stash, 'seed', 'script')
    },
    `Creating a script:  ${chalk.bold(answers.id)}`,
    `Created a script: ${chalk.bold(answers.id)}`,
  )
}

export const removeScript = async () => {
  const questions = [
    {
      type: 'input',
      name: 'id',
      message: 'Enter an identifier for the script you wish to remove',
      async validate(value) {
        const destination = `${path.resolve('.')}`
        const stash = await checkInStash(destination, 'seed', { name: value, type: 'script' })

        if (!value) {
          return 'You must enter an identifier'
        }

        if (!stash) {
          return `The script, ${chalk.bold(value)}, does not exists`
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

  const stash = await removeFromStash(destination, 'seed', { type: 'script', id: answers.id })
  await exportStash(destination, tmpDir, dirname, stash, 'seed', 'script')
}

export const syncModels = async () => {
  const tmpDir = tmp.dirSync()
  const destination = `${path.resolve('.')}`
  const dirname = `${path.dirname(import.meta.url).replace(os.platform() === 'win32' ? 'file:///' : 'file://', '')}`

  await copyHard(`${destination}/api/src/models`, `${destination}/seed/src/models`)
}