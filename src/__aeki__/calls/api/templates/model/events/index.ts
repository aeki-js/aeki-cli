import Base from '../base'

/* Core ========================================================================================= */
import { Events } from '../../../__aeki__/core/base/events'

/* Controller =================================================================================== */
import { users } from '../../../__aeki__/controller'

Base.setEvents([
  Events.beforeCreateAndUpdate({
    callback: async (request, reply) => {
      const { body, params } = request

      return request
    },
  })
])