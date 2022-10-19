import { Button } from '@mantine/core';

type SignInButtonProps = {
    onClick : () => void
}

export const SignInButton = (props : SignInButtonProps) => {
    return(
        <Button onClick = {props.onClick} variant="outline" radius="xl" size="lg" compact>
        INICIAR SESIÓN
        </Button>
    );
}
