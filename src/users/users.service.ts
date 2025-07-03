import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';

@Injectable()
export class UsersService {
  private users = [
    { id: 1, name: 'John Doe', email: 'john@gmail.com',role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@gmail.com', role: 'user' },
    { id: 3, name: 'Alice Johnson', email: 'alice1@gmail.com', role: 'user' },
    { id: 4, name: 'Bob Brown', email: 'bob@gmail.com', role: 'admin' },
  ];

  findAll(role?: 'admin' | 'user') {
    if (role) {
      const rolesArray = this.users.filter(user => user.role === role);
      if (rolesArray.length === 0) {
        throw new NotFoundException(`No users found with role ${role}`);
      }
      return rolesArray;
    }
    return this.users;
  }  
  findOne(id: number) {
    const user = this.users.find(user => user.id === id);
    if(!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }
  create(user: CreateUserDto) {
    const newUser = { id: this.users.length + 1, ...user };
    this.users.push(newUser);
    return newUser; 
  }
  update(id: number, userUpdate: UpdateUserDto) {
    const user = this.findOne(id);
    if (user) {
      Object.assign(user, userUpdate);
      return user;
    }
    return null;
  }
  remove(id: number) {
    const index = this.users.findIndex(user => user.id === id);
    if (index > -1) {
      return this.users.splice(index, 1)[0];
    }
    return null;
  }
  replace(id: number, user: CreateUserDto) {
    const existingUser = this.findOne(id);
    if (existingUser) {
      const updatedUser = { id, ...user };
      const index = this.users.findIndex(u => u.id === id);
      this.users[index] = updatedUser;
      return updatedUser;
    }
    return null;
  }
}
