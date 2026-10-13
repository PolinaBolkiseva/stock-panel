// Доменная сущность приложения — «товар на складе».
export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

// Данные, которые карточка умеет показывать.
export interface IProductCard {
  title: string;
  price: number;
  stock: number;
}

// Причина (вид) поступления товара.
export type TReceiptReason = 'supplier' | 'customer-return'; 

// Ошибки валидации по полям документа: у каждого поля — свой текст.
// Если поле заполнено верно, его ключа в объекте просто нет.
export type TReceiptErrors = Partial<Record<'reason' | 'quantity', string>>;
