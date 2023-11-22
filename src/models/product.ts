import { Schema, model, Model } from "mongoose";

export interface IProduct {
  name: string;
  price: number;
  _id: string;
}

class ProductModel {
  private model: Model<IProduct>;

  constructor() {
    const productSchema = new Schema<IProduct>({
      name: { type: String, required: true },
      price: { type: Number, required: true },
    });

    this.model = model<IProduct>("Product", productSchema);
  }

  public async createProduct(data: IProduct): Promise<IProduct> {
    return this.model.create(data);
  }

  public async getProducts(name = ""): Promise<IProduct[]> {
    return this.model.find({ name: { $regex: ".*" + name + ".*" } });
  }

  public async findProductByName(name: string): Promise<IProduct> {
    return this.model.findOne({ name });
  }

  public async getProductById(id: string): Promise<IProduct | null> {
    return this.model.findById(id);
  }

  public async updateProduct(
    id: string,
    data: Partial<IProduct>
  ): Promise<IProduct | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  public async deleteProduct(id: string): Promise<IProduct | null> {
    return this.model.findByIdAndDelete(id);
  }
}

export default new ProductModel();
