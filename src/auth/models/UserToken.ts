export interface UserToken {
  acess_token: string;
  cart?:{
    id: string;
    items:{
      id: string;
      name: string;
      price: number;
      quantity:number;
      img: string;
    }[]
  };
}
