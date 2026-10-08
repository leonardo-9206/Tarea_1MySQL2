// ==========================================================================
// PRODUCT MODEL INTERFACE (TYPESCRIPT TYPE SAFETY)
// ==========================================================================

export interface Product {
  id?: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  brand?: string | null;
  img?: string | null;
  active?: boolean;
}
