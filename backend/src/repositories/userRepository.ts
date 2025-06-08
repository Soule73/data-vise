import User from '../models/User';

const userRepository = {
  async findByEmail(email: string) {
    return User.findOne({ email });
  },
  async findById(id: string) {
    return User.findById(id);
  },
  async create(userData: any) {
    return User.create(userData);
  },
  async updateById(id: string, update: any) {
    return User.findByIdAndUpdate(id, update, { new: true });
  },
  async deleteById(id: string) {
    return User.findByIdAndDelete(id);
  },
  async countByRole(roleId: string) {
    return User.countDocuments({ roleId });
  },
};

export default userRepository;
