/* Controllers ================================================================================== */
import * as Controller from '../../__aeki__/controller'

/* Helpers ====================================================================================== */
import { send } from '../../__aeki__/helper/response'
import { HTTP_STATUS } from '../../__aeki__/helper/response.constants'

/* Core ========================================================================================= */
import { Route } from '../../__aeki__/core/route'
import { BaseManager } from '../../__aeki__/core/base/base-manager'

/**
 * /a/{{id}}
 * /n/{{id}}
 */
export default new Route({
  name: '{{id}}',
  methods: {
    get: [
      {
        handler: {
          n: {
            callback: async (request, reply) => {
              send(HTTP_STATUS.OK, { isSsr: true, base: BaseManager.find('MODEL') }, reply)
            },
          },
          a: {
            callback: async (request: any, reply: any) => {
              const { id } = request.params
              const result = await Controller.rows.get({ query: { id } })

              send(HTTP_STATUS.OK, result, reply)
            },
          },
        },
      },
    ],
  },
})