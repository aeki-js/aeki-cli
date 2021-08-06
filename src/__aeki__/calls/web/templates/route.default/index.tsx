import React, { FC, useEffect } from 'react'
import { stylesheet } from 'typestyle'

/* Hooks ======================================================================================== */
import useFetch from '../../__aeki__/hooks/use-fetch'

/* Components =================================================================================== */
import AppLayout, { MAX_WIDTH } from './layout'
import { Box } from '../../__aeki__/components/box/box.component'
import { FooterContent } from '../../components/footer'

const {{ componentName }}: FC < any > = (props: any) => {
  const { inject, eject } = props
  const injection = inject()

  const [contents, $contents] = useFetch<any>(
    Object.keys(injection).length
      ? injection
      : {},
    {
      url: `${process.env.REACT_APP_API}{{path}}`,
    },
  )

  useEffect(() => {
    return () => {
      eject()
    }
  }, [])

  useEffect(() => {
    if (contents.mounted && Object.keys(injection).length === 0) {
      $contents.get()
    }
  }, [contents.mounted])

  return (
    <AppLayout.render
      content={
        <Box className={STYLES.container} baseline="surface" row flex>
          <Box className={STYLES.container}>
            <Box className={STYLES.containerInner}>
              <Box
                baseline='none'
                minWidth='100%'
                minHeight={320}
                rounded
              />
            </Box>
          </Box>
          <Box className={STYLES.containerFooter} baseline='background'>
            <FooterContent />
          </Box>
        </Box>
      }
    />
  )
}

/* Styles ======================================================================================= */
const STYLES = stylesheet({
  container: {
    width: '100%',
  },
  containerInner: {
    maxWidth: MAX_WIDTH,
    padding: '60px 8px',
    margin: '0 auto',
  },
  containerFooter: {
    padding: '40px 12px 12px 12px'
  }
})

export default {{ componentName }}
