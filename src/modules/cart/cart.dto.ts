import { Decimal } from "@prisma/client/runtime";

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
  price: Decimal;
  id: string;
};
