import React from 'react'
import { stylesheet, classes } from 'typestyle'

/* Core ========================================================================================= */
import { addTableContent } from '../../__aeki__/add-view'

/* Components =================================================================================== */
import { Box } from '../../__aeki__/components/box/box.component'

/* Styles ======================================================================================= */
import { p8 } from '../../__aeki__/styles/styleset/padding/p8'
import { pt16 } from '../../__aeki__/styles/styleset/padding/pt16'

const View = (props: any) => {
  const { data, refresh } = props

  return (
    <>
      {data.length > 0 && (
        <Box rounded className={classes(STYLES.container, p8, pt16)} baseline="none">
        </Box>
      )}
    </>
  )
}

const STYLES = stylesheet({
  container: {
    overflow: 'hidden'
  }
})

addTableContent('{{id}}', View)
