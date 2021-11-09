import Base from '../base'

/* Core ========================================================================================= */
import { Actions } from '../../../__aeki__/core/base/action'
import { Filters } from '../../../__aeki__/core/base/filters'
import { Header } from '../../../__aeki__/core/base/header'
import { Lookup } from '../../../__aeki__/core/base/lookup'
import { Operator } from '../../../__aeki__/core/operators'
import { Snippets } from '../../../__aeki__/core/base/snippets'

Base.setTable({
  viewId: null,
  primaryKey: null,
  secondaryKey: null,

  /* Table / limit ============================================================================== */
  limit: 10,

  /* Table / Filters ============================================================================ */
  filters: [
    Filters.Search({ keys: ['body.name'] }),
    Filters.Sort({
      value: {
        name: 'createdAt',
        label: 'Created At',
        direction: -1,
      },
      options: [
        {
          name: 'createdAt',
          label: 'Created At',
        },
      ],
    }),
  ],

  /* Table / Heders ============================================================================= */
  headers: [
    Header({
      name: 'body.name',
      label: 'Name',
      style: {
        width: 1,
        minWidth: 150,
      },
    }),
  ],

  /* Table / Select ============================================================================= */
  select: [],

  /* Table / Lookups ============================================================================ */
  lookups: [],

  /* View / Snippets ============================================================================ */
  snippets: [Snippets.Row(Snippets.Column(Snippets.TableView()))],

  /* View / Actions ============================================================================= */
  actions: [
    Actions.table({
      label: new Operator.internal(['get', ['base', 'name.singular']]),
      type: 'link',
      to: 'new',
      icon: 'add',
      primary: true,
      hidden: new Operator.internal(['not-equal', [['permission', 'w'], true]]),
    }),
    Actions.tableRow({
      label: 'Delete',
      description: 'Are you sure to delete?',
      type: 'request',
      to: new Operator.internal(['get', ['base', 'helper.routes.delete/table/row']]),
      hidden: new Operator.internal(['not-equal', [['permission', 'd'], true]]),
      icon: 'delete',
    }),
  ],
})
