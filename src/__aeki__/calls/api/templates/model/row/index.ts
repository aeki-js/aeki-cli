import Base from '../base'

/* Core ========================================================================================= */
import { Actions } from '../../../__aeki__/core/base/action'
import { Lookup } from '../../../__aeki__/core/base/lookup'
import { Operator } from '../../../__aeki__/core/operators'
import { Snippets } from '../../../__aeki__/core/base/snippets'

Base.setRow({
  viewId: null,
  primaryKey: null,
  secondaryKey: null,
  isEditable: true,

  /* Row / Lookups ============================================================================== */
  lookups: [],

  /* View / Snippets ============================================================================ */
  snippets: [Snippets.Row(Snippets.Column(Snippets.RowView()))],

  /* View / Actions ============================================================================= */
  actions: [
    Actions.row({
      label: 'Delete',
      description: 'Are you sure to delete?',
      type: 'request',
      to: new Operator.internal(['get', ['base', 'helper.routes.delete/table/row']]),
      icon: 'delete',
      hidden: new Operator.internal(['not-equal', [['permission', 'd'], true]]),
    }),
  ],
})
