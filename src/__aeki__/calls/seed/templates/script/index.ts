import { Db } from "mongodb"

/* Core ========================================================================================= */
import { Script } from "../../__aeki__/core.seed/script"
import { Service } from '../../__aeki__/core/service'
import { rows } from '../../__aeki__/controller'

new Script({
    id: '{{id}}',
    callback: async (db: Db) => {
        // Your implementation here
    }
})