
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

const parseSection = (config, sectionName, prefix = '') => {
  let output = ''
  const section = flat(config[sectionName])
  for (const key in section) {
    output += `\n${prefix}${`${`${sectionName}`.toUpperCase()}`.toUpperCase()}_${`${key}`.toUpperCase()}=${section[key]}`
  }

  return output
}

export const init = async () => {
  const destination = `${path.resolve('.')}`

  let config = await readFile(`${destination}/aeki.config.json`)
  config = JSON.parse(config)

  await setSpinner(
    async () => {
      await runCommand(`git clone ${config.github.api} && git checkout develop && git pull`)

      let apiEnvTemplate = parseSection(config, 'project')
      apiEnvTemplate += parseSection(config, 'secure')
      apiEnvTemplate += parseSection(config, 'api')
      apiEnvTemplate += parseSection(config, 'web')
      apiEnvTemplate += parseSection(config, 'mongodb')
      apiEnvTemplate += parseSection(config, 'google')
      apiEnvTemplate += parseSection(config, 'sendgrid')
      apiEnvTemplate += parseSection(config, 'digital_ocean')

      await writeFile(`${destination}/api/.env`, apiEnvTemplate)
      await runCommand(`cd api && npm install`)
    },
    `Initializing ${chalk.green('api')}`,
    `Initialized ${chalk.green('api')}`
  )

  await setSpinner(
    async () => {
      await runCommand(`git clone ${config.github.web} && git checkout develop && git pull`)

      let webEnvTemplate = parseSection(config, 'project', 'REACT_APP_')
      webEnvTemplate += parseSection(config, 'api', 'REACT_APP_')
      webEnvTemplate += parseSection(config, 'web', 'REACT_APP_')
      webEnvTemplate += parseSection(config, 'google', 'REACT_APP_')
      webEnvTemplate += parseSection(config, 'digital_ocean', 'REACT_APP_')
      webEnvTemplate += parseSection(config, 'microsoft', 'REACT_APP_')

      await writeFile(`${destination}/web/.env`, webEnvTemplate)
      await runCommand(`cd web && npm install`)
    },
    `Initializing ${chalk.green('web')}`,
    `Initialized ${chalk.green('web')}`
  )

  await setSpinner(
    async () => {
      await runCommand(`git clone ${config.github.seed} && git checkout develop && git pull`)

      let seedEnvTemplate = parseSection(config, 'project')
      seedEnvTemplate += parseSection(config, 'secure')
      seedEnvTemplate += parseSection(config, 'api')
      seedEnvTemplate += parseSection(config, 'web')
      seedEnvTemplate += parseSection(config, 'mongodb')
      seedEnvTemplate += parseSection(config, 'google')
      seedEnvTemplate += parseSection(config, 'sendgrid')
      seedEnvTemplate += parseSection(config, 'digital_ocean')

      await writeFile(`${destination}/seed/.env`, seedEnvTemplate)
      await runCommand(`cd seed && npm install`)
    },
    `Initializing ${chalk.green('seed')}`,
    `Initialized ${chalk.green('seed')}`
  )
}