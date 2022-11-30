import { Decimal } from "@prisma/client/runtime";

export type ProductDTO = {
  name: string;
  price: number;
  quantity: number;
  slug: string;
  img: string;
  sold: number;
  discount: number;
  description: string;
  categoryId: string;
  id?: string;
  cart?: string[];
};
