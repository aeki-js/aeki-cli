#!/usr/bin/env node
/**
 * Copyright 2021 AEKI <admin@aeki.dev>
 *
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */
import meow from 'meow'
import chalk from 'chalk'

import { appName, checkProjectPath } from './core/index.js'
import { init } from './calls/init/index.js'
import * as api from './calls/api/index.js'
import * as web from './calls/web/index.js'

const helpText = `
  ${chalk.bold("Usage:")} ${appName} [command] [options]
  
  ${chalk.bold("Options:")}
    -h, --help         Show usage information    
  
  ${chalk.bold("Commands:")}
    init                  Initialize ${appName} project
  
    api:model:add         Add a model to api stack
    api:model:remove      Remove a model to api stack
    api:route:add         Add a route to api stack
    api:route:remove      Remove a route from api stack
    api:snippet:add       Add a snippet to api stack
    api:snippet:remove    Remove a snippet from api stack
 
    web:route:add         Add a route to web stack
    web:route:remove      Remove a route from web stack
    web:snippet:add       Add a snippet to web stack
    web:snippet:remove    Remove a snippet from web stack
 `

// x api:route:add         Add a route to api stack
// x api:route:remove      Remove a route from api stack
// x api:snippet:add       Add a snippet to api stack
// x api:snippet:remove    Remove a snippet from api stack

// x web:route:add         Add a route to web stack
// x web:route:remove      Remove a route from web stack
// x web:snippet:add       Add a snippet to web stack
// x web:snippet:remove    Remove a snippet from web stack
// x web:component:add     Add a component to web stack
// x web:component:remove  Remove a component from web stack
// x web:modal:add         Add a modal to web stack
// x web:modal:remove      Remove a modal from web stack

// x seed:script:add       Add a script to seed stack
// x seed:script:remove    Remove a script from seed stack

// x sync:shared           Sync api stack shared codes to all stacks
// x sync:models           Sync api stack models to seed stack

const cli = meow(helpText, {
  importMeta: import.meta,
  string: ['lang'],
  boolean: ['help', 'version'],
  alias: { h: 'help', v: 'version' }
})

const main = async () => {
  switch (cli.input[0]) {
    default:
      if (await checkProjectPath()) {
        switch (cli.input[0]) {
          case 'init':
            init()
            break;
          case 'api:model:add':
            api.addModel()
            break;
          case 'api:model:remove':
            api.removeModel()
            break;
          case 'api:snippet:add':
            api.addSnippet()
            break;
          case 'api:snippet:remove':
            api.removeSnippet()
            break;
          // case 'route:add':
          //   api.addRoute()
          //   break;
          // case 'route:remove':
          //   api.removeRoute()
          //   break;
          // case 'group:add':
          //   api.addGroup()
          //   break;
          // case 'group:remove':
          //   api.removeGroup()
          //   break;

          case 'web:route:add':
            web.addRoute()
            break;
          case 'web:route:remove':
            web.removeRoute()
            break;
          case 'web:snippet:add':
            web.addSnippet()
            break;
          case 'web:snippet:remove':
            web.removeSnippet()
            break;

          // case 'modal:add':
          //   web.addModal()
          //   break;
          // case 'modal:remove':
          //   web.removeModal()
          //   break;
          // case 'view:add':
          //   web.addView()
          //   break;
          // case 'view:remove':
          //   web.removeView()
          //   break;
          // case 'script:add':
          //   seed.addScript()
          //   break;
          // case 'script:remove':
          //   seed.removeScript()
          //   break;
          // case 'sync:models':
          //   seed.syncModels()
          //   break;
          default:
            console.log(chalk.red((`   ${cli.input[0]} command does not exist.`)))
            console.log(helpText)
        }
      } else {
        if (cli.input[0]) {
          console.log(chalk.red((`   ${chalk.bold(cli.input[0])} must be called at project root.`)))
        } else {
          console.log(helpText)
        }
      }
  }
}

main()