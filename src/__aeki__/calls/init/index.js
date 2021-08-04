
import path from 'path'
import chalk from 'chalk'
import os from 'os'
import {
  readFile,
  writeFile,
  setSpinner,
  flat,
  cloneRepo,
  runCommand,
} from '../../core/index.js'

const KEYS_TO_ENV = {
  'api': [
    'project',
    'secure',
    'api',
    'web',
    'mongodb',
    'google',
    'sendgrid',
    'digital_ocean'
  ],
  'web': [
    'project',
    'api',
    'web',
    'google',
    'digital_ocean',
    'microsoft',
  ],
  'seed': [
    'project',
    'secure',
    'api',
    'web',
    'mongodb',
    'google',
    'sendgrid',
    'digital_ocean'
  ]
}

const parseSection = (config, sectionName, prefix = '') => {
  let output = ''
  const section = flat(config[sectionName])

  for (const key in section) {
    output += `${prefix}${`${`${sectionName}`.toUpperCase()}`.toUpperCase()}_${`${key}`.toUpperCase()}=${section[key]}\n`
  }

  return output
}

export const init = async () => {
  const destination = `${path.resolve('.')}`
  const questions = [
    {
      type: 'input',
      name: 'username',
      message: 'Github Username',
      async validate(value) {
        if (!value) {
          return 'You must enter an username'
        }

        return true
      },
    },
    {
      type: 'password',
      name: 'password',
      message: 'Passsword',
      async validate(value) {
        if (!value) {
          return 'You must enter a password'
        }

        return true
      },
    },
  ]


  const answers = await inquirer.prompt(questions)
  let config = await readFile(`${destination}/aeki.config.json`)
  config = JSON.parse(config)

  await setSpinner(
    async () => {
      await runCommand(`git clone ${config.github.api.replace(`https://`, `https://${answers.username}:${answers.password}@`)} && cd api && git checkout development && git pull`)

      let apiEnvTemplate = ''

      KEYS_TO_ENV.api.map((key) => {
        apiEnvTemplate += parseSection(config, key)
      })

      await writeFile(`${destination}/api/.env`, apiEnvTemplate)
      await runCommand(`cd api && npm install`)
    },
    `Initializing ${chalk.green('api')}\n`,
    `Initialized ${chalk.green('api')}\n`
  )

  await setSpinner(
    async () => {
      await runCommand(`git clone ${config.github.web.replace(`https://`, `https://${answers.username}:${answers.password}@`)} && cd web && git checkout development && git pull`)

      let webEnvTemplate = ''

      KEYS_TO_ENV.web.map((key) => {
        webEnvTemplate += parseSection(config, key, 'REACT_APP_')
      })

      await writeFile(`${destination}/web/.env`, webEnvTemplate)
      await runCommand(`cd web && npm install`)
    },
    `Initializing ${chalk.green('web')}\n`,
    `Initialized ${chalk.green('web')}\n`
  )

  await setSpinner(
    async () => {
      await runCommand(`git clone ${config.github.seed.replace(`https://`, `https://${answers.username}:${answers.password}@`)} && cd seed && git checkout development && git pull`)

      let seedEnvTemplate = ''

      KEYS_TO_ENV.seed.map((key) => {
        seedEnvTemplate += parseSection(config, key)
      })

      await writeFile(`${destination}/seed/.env`, seedEnvTemplate)
      await runCommand(`cd seed && npm install`)
    },
    `Initializing ${chalk.green('seed')}\n`,
    `Initialized ${chalk.green('seed')}\n`
  )
}