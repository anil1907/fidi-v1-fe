import { 
  type User, 
  type InsertUser, 
  type Client, 
  type InsertClient,
  type Template,
  type InsertTemplate,
  type DietPlan,
  type InsertDietPlan,
  type Appointment,
  type InsertAppointment
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Client methods
  getClients(params?: { search?: string; page?: number; pageSize?: number }): Promise<{ clients: Client[]; total: number }>;
  getClient(id: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, client: Partial<InsertClient>): Promise<Client | undefined>;
  deleteClient(id: string): Promise<boolean>;

  // Template methods
  getTemplates(): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: string, template: Partial<InsertTemplate>): Promise<Template | undefined>;
  deleteTemplate(id: string): Promise<boolean>;

  // Diet Plan methods
  getPlans(params?: { clientId?: string }): Promise<DietPlan[]>;
  getPlan(id: string): Promise<DietPlan | undefined>;
  createPlan(plan: InsertDietPlan): Promise<DietPlan>;
  updatePlan(id: string, plan: Partial<InsertDietPlan>): Promise<DietPlan | undefined>;
  deletePlan(id: string): Promise<boolean>;

  // Appointment methods
  getAppointments(params?: { clientId?: string; from?: string; to?: string }): Promise<Appointment[]>;
  getAppointment(id: string): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private clients: Map<string, Client>;
  private templates: Map<string, Template>;
  private plans: Map<string, DietPlan>;
  private appointments: Map<string, Appointment>;

  constructor() {
    this.users = new Map();
    this.clients = new Map();
    this.templates = new Map();
    this.plans = new Map();
    this.appointments = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Client methods
  async getClients(params?: { search?: string; page?: number; pageSize?: number }): Promise<{ clients: Client[]; total: number }> {
    let clients = Array.from(this.clients.values());
    
    if (params?.search) {
      // Normalize and prepare search term for better Unicode and Turkish character handling
      const normalizeText = (text: string) => text.normalize('NFC').toLowerCase().trim();
      const search = normalizeText(params.search);
      
      clients = clients.filter(client => {
        const firstName = normalizeText(client.firstName);
        const lastName = normalizeText(client.lastName);
        const fullName = normalizeText(`${client.firstName} ${client.lastName}`);
        const email = client.email ? normalizeText(client.email) : '';
        const phone = client.phone || '';
        
        return firstName.includes(search) ||
               lastName.includes(search) ||
               fullName.includes(search) ||
               email.includes(search) ||
               phone.includes(search);
      });
    }

    const total = clients.length;
    
    if (params?.page && params?.pageSize) {
      const start = (params.page - 1) * params.pageSize;
      clients = clients.slice(start, start + params.pageSize);
    }

    return { clients, total };
  }

  async getClient(id: string): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = randomUUID();
    const now = new Date();
    const client: Client = { 
      ...insertClient, 
      id,
      email: insertClient.email ?? null,
      phone: insertClient.phone ?? null,
      birthDate: insertClient.birthDate ?? null,
      notes: insertClient.notes ?? null,
      goals: insertClient.goals ?? null,
      createdAt: now,
      updatedAt: now
    };
    this.clients.set(id, client);
    return client;
  }

  async updateClient(id: string, updateData: Partial<InsertClient>): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;

    const updatedClient = { 
      ...client, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  async deleteClient(id: string): Promise<boolean> {
    return this.clients.delete(id);
  }

  // Template methods
  async getTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = randomUUID();
    const now = new Date();
    const template: Template = { 
      ...insertTemplate, 
      id,
      description: insertTemplate.description ?? null,
      createdAt: now,
      updatedAt: now
    };
    this.templates.set(id, template);
    return template;
  }

  async updateTemplate(id: string, updateData: Partial<InsertTemplate>): Promise<Template | undefined> {
    const template = this.templates.get(id);
    if (!template) return undefined;

    const updatedTemplate = { 
      ...template, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.templates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  async deleteTemplate(id: string): Promise<boolean> {
    return this.templates.delete(id);
  }

  // Diet Plan methods
  async getPlans(params?: { clientId?: string }): Promise<DietPlan[]> {
    let plans = Array.from(this.plans.values());
    
    if (params?.clientId) {
      plans = plans.filter(plan => plan.clientId === params.clientId);
    }

    return plans;
  }

  async getPlan(id: string): Promise<DietPlan | undefined> {
    return this.plans.get(id);
  }

  async createPlan(insertPlan: InsertDietPlan): Promise<DietPlan> {
    const id = randomUUID();
    const now = new Date();
    const plan: DietPlan = { 
      ...insertPlan, 
      id,
      notes: insertPlan.notes ?? null,
      createdAt: now,
      updatedAt: now
    };
    this.plans.set(id, plan);
    return plan;
  }

  async updatePlan(id: string, updateData: Partial<InsertDietPlan>): Promise<DietPlan | undefined> {
    const plan = this.plans.get(id);
    if (!plan) return undefined;

    const updatedPlan = { 
      ...plan, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.plans.set(id, updatedPlan);
    return updatedPlan;
  }

  async deletePlan(id: string): Promise<boolean> {
    return this.plans.delete(id);
  }

  // Appointment methods
  async getAppointments(params?: { clientId?: string; from?: string; to?: string }): Promise<Appointment[]> {
    let appointments = Array.from(this.appointments.values());
    
    if (params?.clientId) {
      appointments = appointments.filter(apt => apt.clientId === params.clientId);
    }

    if (params?.from || params?.to) {
      appointments = appointments.filter(apt => {
        const aptDate = apt.startsAt;
        if (params.from && aptDate < new Date(params.from)) return false;
        if (params.to && aptDate > new Date(params.to)) return false;
        return true;
      });
    }

    return appointments.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
  }

  async getAppointment(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const now = new Date();
    const appointment: Appointment = { 
      ...insertAppointment, 
      id,
      description: insertAppointment.description ?? null,
      status: insertAppointment.status ?? "scheduled",
      createdAt: now,
      updatedAt: now
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointment(id: string, updateData: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;

    const updatedAppointment = { 
      ...appointment, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  async deleteAppointment(id: string): Promise<boolean> {
    return this.appointments.delete(id);
  }
}

export const storage = new MemStorage();
