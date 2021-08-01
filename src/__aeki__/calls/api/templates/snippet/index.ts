/* Core ========================================================================================= */
import { Route } from '../../__aeki__/core/route'

/* Controllers ================================================================================== */
import * as Controller from '../../__aeki__/controller'

/* Helpers ====================================================================================== */
import { send } from '../../__aeki__/helper/response'
import { HTTP_STATUS } from '../../__aeki__/helper/response.constants'

/* Hooks ======================================================================================== */
import { filter } from '../../__aeki__/hooks/filter'

/**
 * /a/snippets/{{id}} 
 */
export default new Route({
  name: 'snippets/{{id}}',
  methods: {
    get: [
      {
        handler: {
          a: {
            callback: async (request, reply) => {
              const { queries } = request

              const result = await Controller.rows.index(queries)

              send(HTTP_STATUS.OK, result, reply)
            },
          },
        },
      },
    ],
  },
  plugins: [filter],
})