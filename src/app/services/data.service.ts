import { Injectable } from '@angular/core';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import auth from '@feathersjs/authentication-client';
import * as io from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { Product } from '../models/product';
import { Category } from '../models/category';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  client: any;

  resources: string[];

  currentUserSubject = new BehaviorSubject<User>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  constructor() {
    const socket = io('localhost:3030');
    this.client = feathers();
    this.client.configure(socketio(socket));
    this.client.configure(auth());

    this.resources = ['users', 'products', 'categories', 'orders'];
    this.setupEventListeners();
    this.getResources();
  }

  setupEventListeners() {
    for (const resource of this.resources) {
      this.client.service(resource).on('created', (data) => {
        console.log('created', data);
        const result = [...this[`${resource}Subject`].value];
        result.push(data);
        this[`${resource}Subject`].next(result);
      });
      this.client.service(resource).on('updated', (data) => {
        const result = [...this[`${resource}Subject`].value];
        const index = result.findIndex((r) => r._id === data._id);
        result[index] = data;
        this[`${resource}Subject`].next(result);
      });
      this.client.service(resource).on('patched', (data) => {
        console.log('patched', data);
        const result = [...this[`${resource}Subject`].value];
        const index = result.findIndex((r) => r._id === data._id);
        result[index] = data;
        this[`${resource}Subject`].next(result);
      });
      this.client.service(resource).on('removed', (data) => {
        const result = [...this[`${resource}Subject`].value];
        const index = result.findIndex((r) => r._id === data._id);
        result.splice(index, 1);
        this[`${resource}Subject`].next(result);
      });
    }
  }

  async getResources(params = { query: { $limit: 100 } }) {
    if (this.isLoggedIn) {
      for (const resource of this.resources) {
        const { data } = await this.client.service(resource).find(params);
        this[`${resource}Subject`].next(data);
      }
    }
  }

  async createResource(serviceName, resource) {
    return await this.client.service(serviceName).create(resource);
  }

  async updateResource(serviceName, resource) {
    return await this.client.service(serviceName).patch(resource._id, resource);
  }

  async removeResource(serviceName, resource) {
    return await this.client.service(serviceName).remove(resource._id);
  }

  async getAuth() {
    try {
      const auth = await this.client.reAuthenticate();
      this.currentUserSubject.next(auth.user);
      this.getResources();
      return auth;
    } catch (error) {
      return null;
    }
  }

  get isLoggedIn() {
    return this.currentUserSubject.value !== null;
  }

  get isLoggedIn$() {
    return this.currentUser$.pipe(map((user) => user !== null));
  }

  async login(params) {
    const auth = await this.client.authenticate(params);
    this.currentUserSubject.next(auth.user);
    this.getResources();
    return auth;
  }

  async logout() {
    this.currentUserSubject.next(null);
    return this.client.logout();
  }
}
