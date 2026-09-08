import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

export type CommerceProductCategory =
  | 'TOOLS'
  | 'HARDWARE'
  | 'SPARE_PARTS'
  | 'ELECTRICAL'
  | 'PLUMBING'
  | 'CONSTRUCTION'
  | 'FARM_EQUIPMENT'
  | 'MACHINERY_PARTS'
  | 'SAFETY'
  | 'PACKAGING'
  | 'HOUSEHOLD'
  | 'GENERAL'
  | 'OTHER';

export interface CommerceProduct {
  id: string;
  name: string;
  description?: string | null;
  category: CommerceProductCategory;
  brand?: string | null;
  model?: string | null;
  sku?: string | null;
  unit: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class CommerceProductService {
  private products = new Map<string, CommerceProduct>([
    [
      'prod-001',
      {
        id: 'prod-001',
        name: 'John Deere Spin-on Engine Oil Filter',
        description: 'OEM high-efficiency cellulose micro-glass spin-on filter (Part No: RE519643)',
        category: 'SPARE_PARTS',
        brand: 'John Deere',
        model: '5310 / 5050D',
        sku: 'JD-FLT-5310',
        unit: 'PIECE',
        status: 'ACTIVE',
        createdAt: new Date('2026-08-01T10:00:00Z'),
        updatedAt: new Date('2026-08-01T10:00:00Z'),
      },
    ],
    [
      'prod-002',
      {
        id: 'prod-002',
        name: 'Finolex 3-inch Flexible Agricultural Delivery Pipe (100ft)',
        description: 'Heavy duty woven braided PVC discharge hose for submersible & diesel pumps',
        category: 'PLUMBING',
        brand: 'Finolex',
        model: 'Kisan Flex 3-inch',
        sku: 'FIN-PIPE-3IN',
        unit: 'PIECE',
        status: 'ACTIVE',
        createdAt: new Date('2026-08-05T10:00:00Z'),
        updatedAt: new Date('2026-08-05T10:00:00Z'),
      },
    ],
    [
      'prod-003',
      {
        id: 'prod-003',
        name: 'Aspee 12-Nozzle Brass Spray Boom Kit',
        description: 'Ceramic cone nozzles with anti-drip check valves and 12-meter manifold',
        category: 'FARM_EQUIPMENT',
        brand: 'Aspee',
        model: 'HTP-12B',
        sku: 'ASP-BOM-12',
        unit: 'SET',
        status: 'ACTIVE',
        createdAt: new Date('2026-08-10T10:00:00Z'),
        updatedAt: new Date('2026-08-10T10:00:00Z'),
      },
    ],
    [
      'prod-004',
      {
        id: 'prod-004',
        name: 'Havells 7.5 HP Submersible Control Panel with Auto-Switch',
        description: 'Direct-on-line starter with dry-run protection, phase preventer & digital volt meter',
        category: 'ELECTRICAL',
        brand: 'Havells',
        model: 'DOL-750-AP',
        sku: 'HAV-CP-750',
        unit: 'PIECE',
        status: 'ACTIVE',
        createdAt: new Date('2026-08-12T10:00:00Z'),
        updatedAt: new Date('2026-08-12T10:00:00Z'),
      },
    ],
  ]);

  async createProduct(data: {
    name: string;
    description?: string;
    category?: CommerceProductCategory;
    brand?: string;
    model?: string;
    sku?: string;
    unit?: string;
  }): Promise<CommerceProduct> {
    if (!data.name) {
      throw new BadRequestException('Product name is required');
    }

    const id = `prod-${Date.now().toString().slice(-6)}`;
    const product: CommerceProduct = {
      id,
      name: data.name,
      description: data.description || null,
      category: data.category || 'GENERAL',
      brand: data.brand || null,
      model: data.model || null,
      sku: data.sku || `SKU-${Date.now().toString().slice(-6)}`,
      unit: data.unit || 'PIECE',
      status: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.products.set(id, product);
    return product;
  }

  async getProductById(id: string): Promise<CommerceProduct> {
    const product = this.products.get(id);
    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found`);
    }
    return product;
  }

  async listProducts(filter?: {
    category?: CommerceProductCategory;
    brand?: string;
    search?: string;
  }): Promise<CommerceProduct[]> {
    let list = Array.from(this.products.values());
    if (filter?.category) {
      list = list.filter((p) => p.category === filter.category);
    }
    if (filter?.brand) {
      list = list.filter((p) => p.brand?.toLowerCase() === filter.brand?.toLowerCase());
    }
    if (filter?.search) {
      const s = filter.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.brand?.toLowerCase().includes(s) ||
          p.model?.toLowerCase().includes(s),
      );
    }
    return list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
