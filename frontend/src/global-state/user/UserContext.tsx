import { createContext, useState, ReactNode } from 'react'
import { Optional } from '../../utils/types/optional'
import { User } from './types/user'

export type UserState = {
    user: Optional<User>
    putUser(user: User): void
    deleteUser(): void
}

export const UserContext = createContext<Optional<UserState>>(undefined)

export type UserStateProviderProps = {
    children: ReactNode | ReactNode[]
}

export const UserStateProvider = (props: UserStateProviderProps) => {
    const [user, setUser] = useState<User>()

    const putUser = (user: User) => setUser(user)

    const deleteUser = () => setUser(undefined)

    return (
        <UserContext.Provider
            value={{
                user,
                putUser,
                deleteUser,
            }}
        >
            {props.children}
        </UserContext.Provider>
    )
}
