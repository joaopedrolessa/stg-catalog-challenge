export interface Product {
  uuid: string;           // Campo real da tabela
  price: number;
  image_url: string;
  category: string;
  quantity: number;
  created_at: string;
  
  // Campos derivados para compatibilidade
  id?: string;
  name?: string;
  description?: string;
}
