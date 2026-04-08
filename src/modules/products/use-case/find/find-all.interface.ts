export interface IFindAllProductsUseCaseResponse {
    id: string;
    name: string;
    tag: string;
    price: number;
    stock: number;
    imageUrl: string | null;
    category: {
        id: string;
        name: string;
        tag: string;
    };
}
