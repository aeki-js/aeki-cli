/* Core ========================================================================================= */
import { Base } from '../../../__aeki__/core/base'

export default new Base({
  id: '{{id}}',
  groups: '{{groups}}',
  icon: 'folder',
  name: {
    singular: '{{name.singular}}',
    plural: '{{name.plural}}',
  },
  primaryKey: 'body.name',
  order: 0,
})
