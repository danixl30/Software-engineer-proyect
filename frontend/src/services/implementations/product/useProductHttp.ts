import { UseHttp } from '../../../core/abstractions/http/http'
import { UseProductService } from '../../abstractions/product/product-service'
import { Product } from '../../abstractions/product/types/product'
import { ProductDetail } from '../../abstractions/product/types/product-detail'

export const useProductServiceHttp = (http: UseHttp): UseProductService => {
    const get = async (page: number): Promise<Product[]> => {
        const { job } = http.get<any, { products: Product[] }>({
            url: `/product/list/${page}`,
        })
        const data = await job()
        return data.body?.products || []
    }

    const getByTerm = async (
        term: string,
        page: number,
    ): Promise<Product[]> => {
        const { job } = http.get<any, { products: Product[] }>({
            url: `/product/search`,
            queries: {
                term,
                page: String(page),
            },
        })
        const data = await job()
        return data.body?.products || []
    }

    const getDetail = async (id: string): Promise<ProductDetail> => {
        const { job } = http.get<any, ProductDetail>({
            url: `/product/${id}`,
        })
        const data = await job()
        return data.body!!
    }

    return {
        get,
        getDetail,
        getByTerm,
    }
}
