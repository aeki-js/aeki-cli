import React, { useContext, useEffect } from 'react'
import { useHistory, withRouter } from 'react-router-dom'
import { stylesheet, classes } from 'typestyle'

/* Hooks ======================================================================================== */
import useFetch from '../../__aeki__/hooks/use-fetch'

/* Common ======================================================================================= */
import { NavigationContext } from '../../__aeki__/contexts/navigation'
import { addView } from '../../__aeki__/add-view'
import { get } from '../../__aeki__/utils/get'

/* Constants ==================================================================================== */
import { NAVBAR_WIDTH } from '../../__aeki__/components/app-layout/app-layout.constants'

/* Components =================================================================================== */
import { BodyHead } from '../../__aeki__/modules/layouts/body-head'
import { Box } from '../../__aeki__/components/box/box.component'

/* Styles ======================================================================================= */
import { pb120 } from '../../__aeki__/styles/styleset/padding/pb120'
import { pl12 } from '../../__aeki__/styles/styleset/padding/pl12'
import { pr12 } from '../../__aeki__/styles/styleset/padding/pr12'
import { pt72 } from '../../__aeki__/styles/styleset/padding/pt72'
import { r0 } from '../../__aeki__/styles/styleset/right/r0'
import { z5 } from '../../__aeki__/styles/styleset/z-index/z5'

const View = (props: any) => {
  const { head, match } = props
  const { rowId, groupId } = match.params
  const history = useHistory()
  const apiUrl = `${process.env.REACT_APP_API_URL}${history.location.pathname}`

  const [row, $row] = useFetch(
    {
      body: {
        type: '',
      },
    },
    { url: apiUrl, search: { lookups: [{ key: 'createdBy' }, { key: 'group' }] } },
  )

  const appLayoutContext: any = useContext(props.context)
  const { navigation } = useContext(NavigationContext)

  const base = get('payload.base', navigation, 'object')

  const isNavbarShowing =
    appLayoutContext.components.navbar.active && appLayoutContext.components.navbar.visible

  useEffect(() => {
    if (row.mounted && Object.keys(base).length > 0) {
      $row.get({ url: apiUrl, search: {} })
    }
  }, [row.mounted, base])

  return (
    <>
      <Box
        className={classes(z5, r0, isNavbarShowing ? STYLES.containerWithNav : STYLES.container)}
        fixed
      >
        <BodyHead {...head} />
      </Box>
      <Box
        className={classes(pl12, pr12, pt72, pb120)}
        baseline="none"
        onlyContrast={false}
        fullWidth
        relative
        flex
        row
      >
        hello
      </Box>
    </>
  )
}

const STYLES = stylesheet({
  container: {
    width: 'calc(100% - 0px)',
  },
  containerWithNav: {
    width: `calc(100% - ${NAVBAR_WIDTH}px)`,
  },
})

addView('{{id}}', withRouter(View))
