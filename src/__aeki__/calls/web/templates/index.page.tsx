/** Caution - This file is managed by aeki */
import React from 'react'
import loadable from '@loadable/component'
import { Route, useHistory } from 'react-router-dom'

export const AsyncPage = (props: {
  name: string
  path?: string
  injection?: any
  public?: boolean
  component?: any
  exact?: boolean
  state?: any
}) => {
  const { path, injection, name, component, exact, state = {} } = props
  const history = useHistory()
  const Component = component || loadable(() => import(`./${name}`))

  function inject() {
    if (history.location.search.includes('auth=1')) {
      return {}
    }

    if (typeof globalThis.window !== undefined) {
      if ((globalThis.window as any) && (globalThis.window as any).__aeki__) {
        const injection = { ...(globalThis.window as any).__aeki__ }
        return injection || state
      }
    }

    return state
  }

  return (
    <Route
      path={path}
      exact={exact}
      component={() => {
        return (
          <Component
            injection={injection}
            inject={inject}
            eject={() => {
              ; (window as any).__aeki__ = null
            }}
          />
        )
      }}
    />
  )
}

export default (state: any) => {
  return (
    <>
      {{ components }}
    </>
  )
}