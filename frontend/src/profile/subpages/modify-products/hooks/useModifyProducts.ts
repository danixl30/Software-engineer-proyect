import { useEffect, useState } from 'react'
import { UseSession } from '../../../../core/abstractions/session/session'
import { UseToast } from '../../../../core/abstractions/toast/toast'
import { UseProductService } from '../../../../services/abstractions/product/product-service'
import { Product } from '../../../../services/abstractions/product/types/product'
import { Optional } from '../../../../utils/types/optional'

export const useModifyProducts = (
    session: UseSession,
    productService: UseProductService,
    toast: UseToast,
) => {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [selected, setSelected] = useState<Optional<Product>>(null)
    const [isTop, setIsTop] = useState(false)
    const [openModal, setOpenModal] = useState(false)

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [existence, setExistence] = useState(0)
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState<File>()

    const [errorName, setErrorName] = useState('')

    const onChangeName = (value: string) => setName(value)
    const onChangeDescription = (value: string) => setDescription(value)
    const onChangeExistence = (value: number) => {
        if (value < 0) {
            toast.error('Existencia inválida')
            setExistence(0)
            return
        }
        setExistence(value)
    }
    const onChangePrice = (value: number) => {
        if (value < 0) {
            toast.error('Precio inválido')
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

    useEffect(() => {
        if (name && name.length < 5) setErrorName('Nombre muy corto')
        else if (name && name.length > 20) setErrorName('Nombre muy largo')
        else setErrorName('')
    }, [name])

    const getProducts = async () => {
        setLoading(true)
        try {
            const data = await productService.getByProvider(
                session.getSession()!!,
                {
                    page,
                },
            )
            if (data.length === 0) setIsTop(true)
            setProducts([...products, ...data])
        } catch (e) {
            toast.error('Error al obtener productos')
        }
        setLoading(false)
    }

    const getDetail = async () => {
        setLoading(true)
        try {
            const data = await productService.getDetail(selected?.id || '')
            setName(data.name)
            setDescription(data.description)
            setExistence(data.existence)
            setPrice(data.price)
        } catch (e) {
            toast.error('Error al obtener productos')
        }
        setLoading(false)
    }

    useEffect(() => {
        if (selected) getDetail()
    }, [selected])

    const incrementPage = () => {
        setPage(page + 1)
    }

    const selectProduct = (pro: Optional<Product>) => {
        setOpenModal(true)
        setSelected(pro)
    }

    const closeModal = () => {
        setName('')
        setDescription('')
        setExistence(0)
        setPrice(0)
        setSelected(null)
        setImage(undefined)
        setOpenModal(false)
    }

    useEffect(() => {
        getProducts()
    }, [page])

    return {
        selectProduct,
        selected,
        incrementPage,
        loading,
        products,
        isTop,
        closeModal,
        openModal,
        onChangeName,
        onChangePrice,
        onChangeImage,
        onChangeExistence,
        onChangeDescription,
        errorName,
        name,
        description,
        price,
        image,
        existence,
    }
}