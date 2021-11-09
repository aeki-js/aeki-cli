import React, { useContext, useEffect } from 'react'
import { classes } from 'typestyle'

/* Context ====================================================================================== */
import { NavigationContext } from '../../__aeki__/contexts/navigation'

/* Core ========================================================================================= */
import { addSnippet } from '../../__aeki__/core/snippet-manager'

/* Hooks ======================================================================================== */
import useFetch from '../../__aeki__/hooks/use-fetch'

/* Components =================================================================================== */
import { Snippet, SnippetHead, SnippetBody } from '../../__aeki__/modules/layouts/snippet'

/* Styles ======================================================================================= */
import { mt8 } from '../../__aeki__/styles/styleset/margin/mt8'

export default addSnippet('{{componentName}}', (props: any) => {
  const { title } = props
  const { navigation, layout, schema } = useContext(NavigationContext)

  const apiUrl = `${process.env.REACT_APP_API_URL}/a/snippets/{{id}}`
  const [data, $data] = useFetch({}, { url: apiUrl })

  useEffect(() => {
    if (data.mounted) {
      $data.get()
    }
  }, [data.mounted])

  return (
    <Snippet>
      <SnippetHead title={title} />
      <SnippetBody>{'{{componentName}}'}</SnippetBody>
    </Snippet>
  )
})
