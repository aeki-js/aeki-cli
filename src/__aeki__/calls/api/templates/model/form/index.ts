import Base from '../base'

/* Core ========================================================================================= */
import { Actions } from '../../../__aeki__/core/base/action'
import { Operator } from '../../../__aeki__/core/operators'
import { Fields } from '../../../__aeki__/core/base/fields'
import { Lookup } from '../../../__aeki__/core/base/lookup'
import { Snippets } from '../../../__aeki__/core/base/snippets'

Base.setForm({
  viewId: null,
  primaryKey: null,
  secondaryKey: null,

  /* Form / Fields ============================================================================== */
  fields: [
    Fields.Text({
      label: 'Name',
      name: 'name',
    }),
  ],

  /* Form / Sections ============================================================================ */
  sections: [],

  /* Form / Lookups ============================================================================= */
  lookups: [],

  /* View / Snippets ============================================================================ */
  snippets: [
    Snippets.Row(
      Snippets.Column(
        Snippets.FormView()
      )
    )
  ],

  /* View / Actions ============================================================================= */
  actions: [
    Actions.form({
      label: 'Save',
      type: 'save',
      primary: true,
    }),
  ],
})
