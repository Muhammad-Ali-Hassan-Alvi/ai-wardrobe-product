import {
  createRepositories,
  type IUserRepository,
} from "../db/repositories";

export class UserService {
  constructor(private readonly users: IUserRepository) {}

  static create() {
    const repos = createRepositories();
    return new UserService(repos.user);
  }

  getByAuthId(_authId: string) {
    throw new Error("UserService.getByAuthId — Sprint 1");
  }
}
