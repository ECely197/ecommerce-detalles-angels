import { Product } from "./product.model";

export interface CartProduct extends Product {
    quantity: number;
    _v?: Date
}