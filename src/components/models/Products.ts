import type { IProduct } from '../../types';

// МОДЕЛЬ — слой данных. Хранит товары и бизнес-правила.
// Ничего не знает про DOM и внешний вид приложения.
export class Products {
  // Данные закрыты: снаружи их можно менять только через методы модели.
  protected items: IProduct[] = [];

  // Загрузить каталог целиком (в проектной работе сюда придут данные с сервера).
  setItems(items: IProduct[]): void {
    this.items = items;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItem(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

// Бизнес-операция: провести поступление товара (пополнить остаток).
  receive(id: string, amount: number): void {
    const item = this.getItem(id);
    if (!item) {
      console.log(`Товар с id "${id}" не найден`);
      return;
    }
    if (!Number.isInteger(amount) || amount <= 0) {
      console.log('Количество должно быть положительным целым числом');
      return;
    }
    item.stock += amount;
  }   

  getOutOfStock(): IProduct[] {
    const productIsOutList: IProduct[] = this.items.filter(el=>el.stock===0);
    return productIsOutList;
  }
} 