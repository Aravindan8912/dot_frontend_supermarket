export interface OrderDisplayItem {
  name: string;
  quantity: number;
}

export interface OrderDisplay {
  orderNumber: string;
  customerName: string;
  items: OrderDisplayItem[];
  total: number;
  status: string;
  date: string | Date;
}
