/**
 * Copyright 2021 AEKI <admin@aeki.dev>
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import chalk from 'chalk'
import fs from 'fs'
import ncp from 'ncp'
import ora from 'ora'
import path from 'path'
import clone from 'git-clone'
import rimraf from 'rimraf'
import { exec } from 'child_process'

export const asyncCall = (callback) => new Promise((resolve) => {
  callback(resolve)
})

export const callAsync = (callback) => new Promise((resolve) => {
  callback(resolve)
})

export const appName = chalk.yellow.bold('AEKI')

export const setSpinner = async (cb, text, finishedText) => {
  const spinner = ora(text).start();
  await cb()
  spinner.succeed(finishedText)
}

/**
 * Clone a git repository to a destination
 *
 * @param {string} url
 * @param {string} destination
 */
export const cloneRepo = async (url, destination) => {
  await asyncCall((resolve) => {
    clone(url, destination, [], (err) => {
      if (err) {
        console.log(err)
        throw new Error(err)
      }
      resolve()
    })
  })
}


/**
 * Copy a directory to a destination recursively
 *
 * @param {string} source
 * @param {string} destination
 */
export const copyHard = async (source, destination) => {
  await asyncCall((resolve) => {
    ncp(source, destination, (err) => {
      if (err) {
        resolve(null)
      }

      resolve()
    })
  })
}

/**
 * Run system commands
 *
 * @param {string} command
 */
export const runCommand = async (command) => {
  await asyncCall((resolve) => {
    let ps = exec(command, { stdio: 'inherit' }, (err) => {
      if (err) {
        throw new Error(err)
      }
      resolve()
    })

    ps.stdout.pipe(process.stdout)
    ps.stdin.pipe(process.stdin)
  })
}

/**
 * Read file
 *
 * @param {string} source
 */
export const readFile = async (source) => {
  return await asyncCall((resolve) => {
    let file = null
    fs.readFile(source, 'utf8', (err, file) => {
      if (err) {
        resolve(null)
      }
      resolve(file)
    })
  })
}

/**
 * Write file
 *
 * @param {string} destination
 * @param {string} data
 */
export const writeFile = async (destination, data) => {
  await asyncCall((resolve) => {
    fs.writeFile(destination, data, 'utf8', (err) => {
      if (err) {
        throw new Error(err)
      }

      resolve()
    })
  })
}

export const removeHard = async (pathname) => {
  await asyncCall((resolve) => {
    rimraf(pathname, {}, (err) => {
      if (err) {
        throw new Error(err)
      }

      resolve()
    })
  })
}

export const getStash = async (destination, stack) => {
  let stash = await readFile(`${destination}/${stack}/src/__aeki__/.stash`)
  stash = JSON.parse(stash)

  return stash
}

export const checkInStash = async (destination, stack, item) => {
  let stash = await readFile(`${destination}/${stack}/src/__aeki__/.stash`)
  stash = JSON.parse(stash)

  return stash.some(a => a.name === item.name && a.type === item.type)
}

export const addToStash = async (destination, stack, item, cb) => {
  let stash = await readFile(`${destination}/${stack}/src/__aeki__/.stash`)
  stash = JSON.parse(stash)

  if (stash) {
    if (!stash.some(a => a.name === item.name)) {
      stash.push(item)

      await writeFile(`${destination}/${stack}/src/__aeki__/.stash`, JSON.stringify(stash, null, 2))
    }
  }

  if (cb) {
    await cb()
  }

  return stash
}

export const removeFromStash = async (destination, stack, item, cb) => {
  let stash = await readFile(`${destination}/${stack}/src/__aeki__/.stash`)
  stash = JSON.parse(stash)

  if (stash) {
    if (!stash.some(a => a.name === item.name)) {
      const index = stash.findIndex(a => a.name === item.id)

      if (index > -1) {
        stash.splice(index, 1)
        removeHard(`${destination}/${stack}/src/${item.type}s/${item.id}`)
      }

      await writeFile(`${destination}/${stack}/src/__aeki__/.stash`, JSON.stringify(stash, null, 2))
    }
  }

  if (cb) {
    await cb()
  }

  return stash
}

export const exportStash = async (destination, tmpDir, dirname, stash, stack, type, handler) => {
  const extension = stack === 'web' ? 'tsx' : 'ts'

  await copyHard(`${dirname}/templates/index.${type}.${extension}`, `${tmpDir.name}/index.${type}.${extension}`)

  let typeIndexFile = await readFile(`${tmpDir.name}/index.${type}.${extension}`)

  if (!handler) {

    stash.map(item => {
      if (item.type === type) {
        typeIndexFile += `\nimport './${item.name}'`
      }
    })
  } else {
    typeIndexFile = await handler(typeIndexFile)
  }

  if (typeIndexFile) {
    await writeFile(`${tmpDir.name}/index.${type}.${extension}`, typeIndexFile)
    await copyHard(`${tmpDir.name}/index.${type}.${extension}`, `${destination}/${stack}/src/${type}s/index.${extension}`)
  }
}

export const flat = (obj) => {
  const output = {}

  for (const i in obj) {
    if (!obj.hasOwnProperty(i)) continue

    if (typeof obj[i] == 'object' && obj[i] !== null) {
      if (isArray(obj[i])) {
        output[i] = obj[i]
      } else {
        const flattenObj = flat(obj[i])

        if (Object.keys(flattenObj).length === 0) {
          output[i] = flattenObj
        } else {
          for (const x in flattenObj) {
            if (!flattenObj.hasOwnProperty(x)) continue

            output[i + '_' + x] = flattenObj[x]
          }
        }
      }
    } else {
      output[i] = obj[i]
    }
  }

  return output
}

export const checkProjectPath = async () => {
  const destination = `${path.resolve('.')}`
  const config = await readFile(`${destination}/aeki.config.json`)

  return !!config
}