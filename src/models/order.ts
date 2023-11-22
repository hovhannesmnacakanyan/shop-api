import mongoose, { Schema, model, Model } from "mongoose";

interface IOrderProduct {
  productId: {
    type: Schema.Types.ObjectId;
    ref: "Product";
  };
  quantity: number;
}

export interface IOrder {
  products: IOrderProduct[];
  totalPrice: number;
  userId: {
    type: Schema.Types.ObjectId;
    ref: "User";
  };
  _id: string;
}

class OrderModel {
  private model: Model<IOrder>;

  constructor() {
    const orderSchema = new Schema<IOrder>(
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        products: [
          {
            productId: {
              type: Schema.Types.ObjectId,
              ref: "Product",
              required: true,
            },
            quantity: { type: Number, required: true },
          },
        ],
        totalPrice: { type: Number, required: true },
      },
      { timestamps: true }
    );

    this.model = model<IOrder>("Order", orderSchema);
  }

  public async createOrder(data: IOrder): Promise<IOrder> {
    return this.model.create(data);
  }

  public async getOrders(name = ""): Promise<IOrder[]> {
    return this.model.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "products",
        },
      },
      {
        $match: {
          "user.username": { $regex: ".*" + name + ".*" },
        },
      },
    ]);
  }

  public async getUserOrders(userId: string): Promise<IOrder[]> {
    return this.model.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "products",
        },
      },
    ]);
  }

  public async getOrderById(id: string): Promise<IOrder | null> {
    return this.model.findById(id).populate("products.productId");
  }

  public async updateOrder(
    id: string,
    data: Partial<IOrder>
  ): Promise<IOrder | null> {
    return this.model
      .findByIdAndUpdate(id, data, { new: true })
      .populate("products.productId");
  }

  public async deleteOrder(id: string): Promise<IOrder | null> {
    return this.model.findByIdAndDelete(id);
  }
}

export default new OrderModel();
