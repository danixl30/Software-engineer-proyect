import { UseNavigation } from '../core/abstractions/navigation/navigation'
import { UseSession } from '../core/abstractions/session/session'
import { UserState } from '../global-state/user/UserContext'
import { MAIN_PAGE } from '../main/page/route'
import { UseUserService } from '../services/abstractions/user/user-service'

export const AuthGuard =
    (
        state: UserState,
        userService: UseUserService,
        session: UseSession,
        navigation: UseNavigation,
    ) =>
    () => {
        const init = () => {
            if (!session.getSession()) {
                return
            }
            if (state.user?.id) return
            getUser()
        }

        const getUser = async () => {
            try {
                const user = await userService.getUser(session.getSession()!!)
                state.putUser(user)
            } catch (e) {
                session.deleteSession()
                navigation.goTo(MAIN_PAGE)
            }
        }
        init()
    }
