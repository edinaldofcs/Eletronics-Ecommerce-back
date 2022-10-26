export type CartDTO = { 
  id?: string;
  userId: string;
  productId: string;
  quantity?: number;  
};


export type CartProductDTO = { 
  name: string;
  img: string;
  quantity: number;
  price: number;
  id: string;
};


export type CheckoutDTO = {
  price_data: {
    currency: string,
    product_data: {
      name: string,
    },
    unit_amount_decimal: string,
  },
  quantity: number,
}