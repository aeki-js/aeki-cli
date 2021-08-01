import React from 'react'
import { classes, stylesheet } from 'typestyle'

/* Components =================================================================================== */
import { Box } from '../../__aeki__/components/box/box.component'
import { Button } from '../../__aeki__/components/button'
import { Modal } from '../../__aeki__/components/modal'
import { Text } from '../../__aeki__/components/text/text.component'

/* Styles ======================================================================================= */
import { createMediaQuery } from '../../__aeki__/components/style-class/style-class.utils'
import { mr8 } from '../../__aeki__/styles/styleset/margin/mr8'
import { p12 } from '../../__aeki__/styles/styleset/padding/p12'
import { pb0 } from '../../__aeki__/styles/styleset/padding/pb0'
import { pt0 } from '../../__aeki__/styles/styleset/padding/pt0'

Modal.add('{{componentName}}', (props: { label?: string, handleContentClick?: any }) => {
  const { label, handleContentClick } = props

  return (
    <Box onClick={handleContentClick} rounded minWidth={320}>
      <Box className={classes(p12, pb0)} baseline="none">
        <Text>{label}</Text>
      </Box>
      <Box className={classes(STYLES.container, p12, pt0)} baseline="none" spaceBetween fullWidth>
        <Box />
        <Box baseline="none" spaceBetween>
          <Box />
          <Box column>
            <Button
              className={mr8}
              onClick={Modal.pop}
              label="Close"
              baseline="background"
              size="sm"
              square
            />
            <Button
              onClick={() => { }}
              label={'Confirm'}
              baseline="primary"
              size="sm"
              type={'button'}
              square
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
})

const STYLES = stylesheet({
  container: {
    maxHeight: 420,
    overflow: 'auto',
    ...createMediaQuery['sm']({
      maxHeight: 360,
    }),
  },
})
