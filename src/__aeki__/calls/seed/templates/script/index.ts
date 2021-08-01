import { Db } from "mongodb"
import { Script } from "../../__aeki__/core/script"

new Script({
    id: '{{id}}',
    callback: async (db: Db) => {
        // Your implementation here
    }
})