// Доменная сущность приложения — «товар на складе».
export interface IProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
} 

// Данные, которые карточка умеет показывать.
export interface IProductCard {
  title: string;
  price: number;
  stock: number;
}