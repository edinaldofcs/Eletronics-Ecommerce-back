export type SaleDTO = {
  id: string;
  userId: string;
  ProductSale?: string[];
};

export type ProductSale = {
  id: string;
  productId: string;
  saleId: string;
  quantity: number;
};
