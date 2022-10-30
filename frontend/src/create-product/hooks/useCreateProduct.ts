import { useState, useEffect } from 'react'
import { UseNavigation } from '../../core/abstractions/navigation/navigation'
import { UseSession } from '../../core/abstractions/session/session'
import { UseToast } from '../../core/abstractions/toast/toast'
import { PROFILE_PAGE } from '../../profile/page/route'
import { UseProductService } from '../../services/abstractions/product/product-service'
import { Optional } from '../../utils/types/optional'

export const useCreateProduct = (
    toast: UseToast,
    productService: UseProductService,
    session: UseSession,
    navigation: UseNavigation,
) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [existence, setExistence] = useState(0)
    const [price, setPrice] = useState(0)
    const [currency, setCurrency] = useState('')
    const [image, setImage] = useState<File>()
    const [loading, setLoading] = useState(false)

    const [errorName, setErrorName] = useState('')
    const [errorCurrency, setErrorCurrency] = useState('')

    const onChangeName = (value: string) => setName(value)
    const onChangeDescription = (value: string) => setDescription(value)
    const onChangeCurrency = (value: string) => setCurrency(value)
    const onChangeExistence = (value: number) => {
        if (value < 0) {
            toast.error('Existencia invalida')
            setExistence(0)
            return
        }
        setExistence(value)
    }
    const onChangePrice = (value: number) => {
        if (value < 0) {
            toast.error('Precio invalido')
            setPrice(0)
            return
        }
        setPrice(value)
    }
    const onChangeImage = (image: Optional<File>) => {
        if (!image) {
            setImage(undefined)
            return
        }
        if (!image.type.toLowerCase().includes('image')) {
            toast.error('Debe ser una imagen')
            return
        }
        setImage(image)
    }

    const onSubmit = async () => {
        if (!submitable) {
            toast.warning('Datos invalidos')
            return
        }
        setLoading(true)
        const onResult = toast.pending('Procesando...')
        try {
            await productService.create(session.getSession()!!, {
                name,
                description,
                price,
                image,
                currency,
                existence,
            })
            onResult('Producto creado satisfactoriamente', 'success')
            navigation.goTo(PROFILE_PAGE)
        } catch (e) {
            onResult('Error al crear el producto', 'error')
        }
        setLoading(false)
    }

    useEffect(() => {
        if (name && name.length < 5) setErrorName('Nombre muy corto')
        else setErrorName('')
    }, [name])

    useEffect(() => {
        if (currency && currency.length < 3)
            setErrorCurrency('Debe ser de 3 caracteres')
        else if (currency.length > 3) setErrorCurrency('Muy largo...')
        else setErrorCurrency('')
    }, [currency])

    const submitable =
        name &&
        currency &&
        price >= 0 &&
        existence >= 0 &&
        !errorName &&
        !errorCurrency &&
        image

    return {
        name,
        description,
        price,
        currency,
        existence,
        image,
        onChangeName,
        onChangeImage,
        onChangePrice,
        onChangeCurrency,
        onChangeDescription,
        onChangeExistence,
        submitable,
        errorName,
        errorCurrency,
        loading,
        onSubmit,
    }
}
