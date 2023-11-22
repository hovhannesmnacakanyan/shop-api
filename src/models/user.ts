import { Schema, model, Model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
  _id: string;
  username: string;
  password: string;
  validPassword(password: string): Promise<boolean>;
}

class UserModel {
  private model: Model<IUser>;

  constructor() {
    const userSchema = new Schema<IUser>({
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
    });

    userSchema.pre("save", async function (next) {
      try {
        if (!this.isModified("password")) {
          next();
        }

        if (this.password) {
          const salt = await bcrypt.genSalt(10);
          this.password = await bcrypt.hash(this.password, salt);
        }

        next();
      } catch (error) {
        next(error);
      }
    });

    userSchema.methods.validPassword = async function (password) {
      try {
        return await bcrypt.compare(password, this.password);
      } catch (err) {
        throw new Error(err);
      }
    };
    this.model = model<IUser>("User", userSchema);
  }

  public async register(data: IUser): Promise<IUser> {
    return this.model.create(data);
  }

  public async getUsers(): Promise<IUser[]> {
    const users = this.model.find();

    return users;
  }

  public async findUserByUsername(username): Promise<IUser> {
    return this.model.findOne({ username });
  }

  public async getUserById(id: string): Promise<IUser | null> {
    return this.model.findById(id);
  }

  public async updateUser(
    id: string,
    data: Partial<IUser>
  ): Promise<IUser | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  public async deleteUser(id: string): Promise<IUser | null> {
    return this.model.findByIdAndDelete(id);
  }
}

export default new UserModel();
