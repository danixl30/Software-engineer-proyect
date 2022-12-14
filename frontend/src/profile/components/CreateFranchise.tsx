import { Card, Center, Space, Title } from '@mantine/core'
import { BuildingStore } from 'tabler-icons-react'
import { useHoverStyles } from '../../hooks/useHoverStyles'

export type CreateFranchiseCardProps = {
    onClick?: () => void
}

export const CreateFranchiseCard = (props: CreateFranchiseCardProps) => {
    const { classes } = useHoverStyles()
    return (
        <>
            <Card
                className={classes.hoverEffectHard}
                onClick={props.onClick}
                shadow="sm"
                p="lg"
                radius="md"
                withBorder
            >
                <Center>
                    <BuildingStore
                        size={100}
                        strokeWidth={1}
                        color={'#000000'}
                    />
                </Center>
                <Space h="md" />
                <Center>
                    <Title order={4}>Crear franquicia</Title>
                </Center>
            </Card>
        </>
    )
}
