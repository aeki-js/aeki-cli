/* Components =================================================================================== */
import { AppLayoutClass } from '../../__aeki__/components/app-layout'
import { HEADER } from '../../__aeki__/components/app-layout/app-layout.constants'
import { Header } from '../../__aeki__/modules/layouts/header'

/* App Layout Init ============================================================================== */
export const MAX_WIDTH = 1044
const AppLayout = new AppLayoutClass()

AppLayout.setConfig({
  menubar: {
    active: false,
  },
  navbar: {
    active: false,
  },
  toolbar: {
    active: false,
  },
  header: {
    active: true,
  },
})

AppLayout.set(HEADER, Header)

export default AppLayout
