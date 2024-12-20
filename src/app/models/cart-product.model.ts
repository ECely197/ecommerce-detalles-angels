import { Producto } from "./product.model";

export interface CartProduct extends Producto {
    quantity: number;
    _v?: Date
}