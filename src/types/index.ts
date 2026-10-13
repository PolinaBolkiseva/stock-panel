// Доменная сущность приложения — «товар на складе».
export interface IProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
} 