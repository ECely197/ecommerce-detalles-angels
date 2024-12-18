export interface Product {
    _id: string;
    name: string;
    price: number;
    category?: {
        _id: string;
        name: string;
        __v?: number;
    };
    image: string;
    __v?: number;
}