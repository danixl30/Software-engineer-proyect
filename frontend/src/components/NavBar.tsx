import {
    ActionIcon,
    AppShell,
    Avatar,
    Button,
    Center,
    Grid,
    Header,
    SimpleGrid,
    Space,
    Text,
    Title,
    UnstyledButton,
} from '@mantine/core'
import { ReactNode } from 'react'
import { UseNavigation } from '../core/abstractions/navigation/navigation'
import { UserState } from '../global-state/user/UserContext'
import { LOGIN_PAGE } from '../login/page/route'
import { MAIN_PAGE } from '../main/page/route'
import { REGISTER_PAGE } from '../register/page/route'

export type NavBarProps = {
    children: ReactNode | ReactNode[]
    navigation: UseNavigation
    userState: UserState
}

type IconAppProps = {
    navigation: UseNavigation
}

const IconApp = (props: IconAppProps) => {
    return (
        <>
            <UnstyledButton onClick={() => props.navigation.goTo(MAIN_PAGE)}>
                <Title order={1}>Rabbit Buy</Title>
            </UnstyledButton>
        </>
    )
}

const NotUserBar = (props: NavBarProps) => {
    const { navigation, userState } = props
    return (
        <>
            <Grid>
                <Grid.Col span={3}>
                    <IconApp navigation={navigation} />
                </Grid.Col>
                <Grid.Col span="auto"></Grid.Col>
                <Grid.Col span={3}></Grid.Col>
                <Grid.Col span={3}>
                    <Center>
                        <Button onClick={() => navigation.goTo(LOGIN_PAGE)}>
                            Login
                        </Button>
                        <Space w="md" />
                        <Button onClick={() => navigation.goTo(REGISTER_PAGE)}>
                            Registrarse
                        </Button>
                    </Center>
                </Grid.Col>
            </Grid>
        </>
    )
}

const ClientBar = (props: NavBarProps) => {
    const { navigation, userState } = props
    return (
        <>
            <Grid>
                <Grid.Col span={3}>
                    <IconApp navigation={navigation} />
                </Grid.Col>
                <Grid.Col span="auto"></Grid.Col>
                <Grid.Col span={3}></Grid.Col>
                <Grid.Col span={3}>
                    <Center style={{ padding: 0 }}>
                        <SimpleGrid cols={2} spacing={0} style={{ padding: 0 }}>
                            <ActionIcon>
                                <Avatar radius="xl" />
                            </ActionIcon>
                            <SimpleGrid
                                cols={1}
                                verticalSpacing={0}
                                spacing="xs"
                            >
                                <Title order={5}>
                                    {userState.user?.username}
                                </Title>
                                <Text>{userState.user?.email}</Text>
                            </SimpleGrid>
                        </SimpleGrid>
                    </Center>
                </Grid.Col>
            </Grid>
        </>
    )
}

export const NavBar = (props: NavBarProps) => {
    const { userState } = props
    return (
        <>
            <AppShell
                header={
                    <Header height={70} p="md">
                        {!userState.user && <NotUserBar {...props} />}
                        {userState.user && userState.user.role === 'USER' && (
                            <ClientBar {...props} />
                        )}
                    </Header>
                }
            >
                {props.children}
            </AppShell>
        </>
    )
}
