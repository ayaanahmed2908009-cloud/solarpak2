import { 
  users, type User, type InsertUser,
  projects, type Project, type InsertProject,
  donations, type Donation, type InsertDonation,
  impactStories, type ImpactStory, type InsertImpactStory,
  testimonials, type Testimonial, type InsertTestimonial,
  stats, type Stats, type InsertStats,
  subscribers, type Subscriber, type InsertSubscriber
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  updateStripeCustomerId(userId: number, customerId: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  updateUserRole(id: number, role: string): Promise<User | undefined>;
  updateUserMembership(id: number, tier: string): Promise<User | undefined>;
  updateUserDonationStats(id: number, amount: number): Promise<User | undefined>;

  // Project operations
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProjectFunding(id: number, additionalAmount: number): Promise<Project | undefined>;

  // Donation operations
  getDonations(): Promise<Donation[]>;
  getDonation(id: number): Promise<Donation | undefined>;
  createDonation(donation: InsertDonation): Promise<Donation>;
  updateDonationStatus(id: number, status: string, paymentIntentId?: string): Promise<Donation | undefined>;

  // Impact story operations
  getImpactStories(): Promise<ImpactStory[]>;
  getImpactStory(id: number): Promise<ImpactStory | undefined>;
  createImpactStory(story: InsertImpactStory): Promise<ImpactStory>;

  // Testimonial operations
  getTestimonials(): Promise<Testimonial[]>;
  getTestimonial(id: number): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;

  // Stats operations
  getStats(): Promise<Stats | undefined>;
  updateStats(newStats: Partial<Stats>): Promise<Stats | undefined>;
  incrementStatsHomesHelped(additionalHomes: number): Promise<Stats | undefined>;
  incrementStatsSolarPanels(additionalPanels: number): Promise<Stats | undefined>;

  // Newsletter operations
  addSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private donations: Map<number, Donation>;
  private impactStories: Map<number, ImpactStory>;
  private testimonials: Map<number, Testimonial>;
  private statsData: Stats | undefined;
  private subscribers: Map<number, Subscriber>;
  private adminAccountsCreated: boolean = false;
  private currentIds: {
    users: number;
    projects: number;
    donations: number;
    impactStories: number;
    testimonials: number;
    stats: number;
    subscribers: number;
  };

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.donations = new Map();
    this.impactStories = new Map();
    this.testimonials = new Map();
    this.subscribers = new Map();
    this.currentIds = {
      users: 1,
      projects: 1,
      donations: 1,
      impactStories: 1,
      testimonials: 1,
      stats: 1,
      subscribers: 1
    };

    // Initialize with some default data
    this.seedData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const now = new Date();
    
    // Ensure required fields have default values and convert undefined to null
    const user: User = { 
      id,
      email: insertUser.email,
      password: insertUser.password || null,
      fullName: insertUser.fullName || null,
      username: insertUser.username || null,
      profileImageUrl: insertUser.profileImageUrl || null,
      provider: insertUser.provider || 'local',
      providerId: insertUser.providerId || null,
      stripeCustomerId: null,
      isVerified: false,
      role: insertUser.role || 'user',
      membershipTier: insertUser.membershipTier || 'none',
      totalDonated: insertUser.totalDonated || 0,
      lastDonationDate: insertUser.lastDonationDate || null,
      createdAt: now,
      updatedAt: now
    };
    
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date()
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async updateStripeCustomerId(userId: number, customerId: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser = {
      ...user,
      stripeCustomerId: customerId,
      updatedAt: new Date()
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async updateUserRole(id: number, role: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = {
      ...user,
      role,
      updatedAt: new Date()
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async updateUserMembership(id: number, tier: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = {
      ...user,
      membershipTier: tier,
      updatedAt: new Date()
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async updateUserDonationStats(id: number, amount: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    // Calculate new total donated amount
    const totalDonated = (user.totalDonated || 0) + amount;
    
    // Determine membership tier based on total donation amount
    let membershipTier = user.membershipTier || 'none';
    
    // Membership thresholds should match those on the membership page
    if (totalDonated >= 1000) {
      membershipTier = 'platinum';
    } else if (totalDonated >= 500) {
      membershipTier = 'gold';
    } else if (totalDonated >= 250) {
      membershipTier = 'silver';
    } else if (totalDonated >= 50) {
      membershipTier = 'bronze';
    }
    
    // Update user with new donation stats and membership tier
    const updatedUser = {
      ...user,
      role: user.role === 'admin' ? 'admin' : 'member', // Become a member after donation
      totalDonated,
      membershipTier,
      lastDonationDate: new Date(),
      updatedAt: new Date()
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Project operations
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentIds.projects++;
    const timestamp = new Date();
    const project: Project = { 
      id,
      name: insertProject.name,
      description: insertProject.description,
      location: insertProject.location,
      imageUrl: insertProject.imageUrl,
      totalFundingGoal: insertProject.totalFundingGoal,
      currentFunding: 0,
      isActive: true,
      createdAt: timestamp
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProjectFunding(id: number, additionalAmount: number): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    const updatedProject = {
      ...project,
      currentFunding: project.currentFunding + additionalAmount
    };
    this.projects.set(id, updatedProject);

    // Update overall stats
    await this.updateStats({
      amountRaised: (this.statsData?.amountRaised || 0) + additionalAmount
    });

    return updatedProject;
  }

  // Donation operations
  async getDonations(): Promise<Donation[]> {
    return Array.from(this.donations.values());
  }

  async getDonation(id: number): Promise<Donation | undefined> {
    return this.donations.get(id);
  }

  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const id = this.currentIds.donations++;
    const timestamp = new Date();
    const donation: Donation = { 
      ...insertDonation, 
      id, 
      projectId: insertDonation.projectId ?? null,
      isRecurring: insertDonation.isRecurring ?? false,
      paymentStatus: 'pending',
      paymentIntentId: null,
      createdAt: timestamp
    };
    this.donations.set(id, donation);
    return donation;
  }

  async updateDonationStatus(id: number, status: string, paymentIntentId?: string): Promise<Donation | undefined> {
    const donation = this.donations.get(id);
    if (!donation) return undefined;

    const updatedDonation = {
      ...donation,
      paymentStatus: status,
      paymentIntentId: paymentIntentId || donation.paymentIntentId
    };
    this.donations.set(id, updatedDonation);

    // If donation is successful
    if (status === 'succeeded') {
      // Update project funding if specific project was selected
      if (donation.projectId) {
        await this.updateProjectFunding(donation.projectId, donation.amount);
      }
      
      // Find the user by email and update their membership status
      const userByEmail = await this.getUserByEmail(donation.email);
      if (userByEmail) {
        // Update user's donation stats and membership tier
        await this.updateUserDonationStats(userByEmail.id, donation.amount);
      }
    }

    return updatedDonation;
  }

  // Impact story operations
  async getImpactStories(): Promise<ImpactStory[]> {
    return Array.from(this.impactStories.values());
  }

  async getImpactStory(id: number): Promise<ImpactStory | undefined> {
    return this.impactStories.get(id);
  }

  async createImpactStory(insertStory: InsertImpactStory): Promise<ImpactStory> {
    const id = this.currentIds.impactStories++;
    const timestamp = new Date();
    const story: ImpactStory = { ...insertStory, id, createdAt: timestamp };
    this.impactStories.set(id, story);
    return story;
  }

  // Testimonial operations
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentIds.testimonials++;
    const timestamp = new Date();
    const testimonial: Testimonial = { ...insertTestimonial, id, createdAt: timestamp };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  // Stats operations
  async getStats(): Promise<Stats | undefined> {
    return this.statsData;
  }

  async updateStats(newStats: Partial<Stats>): Promise<Stats | undefined> {
    if (!this.statsData) return undefined;

    this.statsData = {
      ...this.statsData,
      ...newStats,
      updatedAt: new Date()
    };
    return this.statsData;
  }

  async incrementStatsHomesHelped(additionalHomes: number): Promise<Stats | undefined> {
    if (!this.statsData) return undefined;

    this.statsData = {
      ...this.statsData,
      homesHelped: this.statsData.homesHelped + additionalHomes,
      peopleImpacted: this.statsData.peopleImpacted + (additionalHomes * 5), // Assuming average of 5 people per home
      updatedAt: new Date()
    };
    return this.statsData;
  }

  async incrementStatsSolarPanels(additionalPanels: number): Promise<Stats | undefined> {
    if (!this.statsData) return undefined;

    this.statsData = {
      ...this.statsData,
      solarPanelsInstalled: this.statsData.solarPanelsInstalled + additionalPanels,
      co2Reduced: this.statsData.co2Reduced + (additionalPanels * 2), // Assuming 2 tons per panel annually
      cleanEnergy: this.statsData.cleanEnergy + (additionalPanels * 3), // Assuming 3 MWh per panel annually
      updatedAt: new Date()
    };
    return this.statsData;
  }

  // Newsletter operations
  async addSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const id = this.currentIds.subscribers++;
    const timestamp = new Date();
    const subscriber: Subscriber = { ...insertSubscriber, id, createdAt: timestamp };
    this.subscribers.set(id, subscriber);
    return subscriber;
  }
  
  // Create admin accounts
  private async createAdminAccounts() {
    // Avoid creating admin accounts multiple times
    if (this.adminAccountsCreated) return;
    
    try {
      // Import the hashing function from auth.ts
      const { hashPassword } = await import('./auth');
      
      // Create admin account: Ayaan
      const ayaanPasswordHash = await hashPassword('12345');
      const ayaanUser: User = {
        id: this.currentIds.users++,
        email: 'ayaan@solarlightpakistan.org',
        password: ayaanPasswordHash,
        fullName: 'Ayaan Administrator',
        username: 'Ayaan',
        profileImageUrl: null,
        provider: 'local',
        providerId: null,
        stripeCustomerId: null,
        isVerified: true,
        role: 'admin',
        membershipTier: 'platinum',
        totalDonated: 5000,
        lastDonationDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.users.set(ayaanUser.id, ayaanUser);
      
      // Create test admin account: test1
      const test1PasswordHash = await hashPassword('654321');
      const test1User: User = {
        id: this.currentIds.users++,
        email: 'test1@solarlightpakistan.org',
        password: test1PasswordHash,
        fullName: 'Test Administrator',
        username: 'test1',
        profileImageUrl: null,
        provider: 'local',
        providerId: null,
        stripeCustomerId: null,
        isVerified: true,
        role: 'admin',
        membershipTier: 'platinum',
        totalDonated: 5000,
        lastDonationDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.users.set(test1User.id, test1User);
      
      // Mark as created
      this.adminAccountsCreated = true;
      console.log('Admin accounts created successfully');
    } catch (error) {
      console.error("Failed to create admin accounts:", error);
    }
  }

  // Seed with initial data
  private async seedData() {
    // Create admin accounts
    await this.createAdminAccounts();
    
    // Seed stats
    const timestamp = new Date();
    this.statsData = {
      id: 1,
      hoursWithoutPower: 12,
      temperature: 35,
      homesHelped: 5,
      solarPanelsInstalled: 5,
      co2Reduced: 10,
      peopleImpacted: 30,
      cleanEnergy: 15,
      amountRaised: 5000,
      goal: 200000,
      updatedAt: timestamp
    };

    // Seed projects
    const projects: InsertProject[] = [
      {
        name: "Bringing Light to Khairpur Mirs Sindh",
        description: "Bringing solar power to families in Khairpur Mirs, Sindh facing 12+ hour power outages daily in extreme heat conditions.",
        location: "Khairpur Mirs, Sindh, Pakistan",
        imageUrl: "",
        totalFundingGoal: 10000,
        isActive: true
      }
    ];

    projects.forEach(project => {
      const id = this.currentIds.projects++;
      this.projects.set(id, {
        ...project,
        id,
        currentFunding: 0, // Set to 0% funding progress
        isActive: project.isActive ?? true,
        createdAt: timestamp
      });
    });

    // Seed impact stories
    const impactStories: InsertImpactStory[] = [
      {
        title: "The Ahmed Family",
        description: "After receiving solar panels, the Ahmed family can now power their home consistently. Their children can study at night, and they no longer worry about food spoiling in their refrigerator.",
        location: "Lahore, Pakistan",
        imageUrl: "",
      },
      {
        title: "Community School",
        description: "A local school serving 120 students now has reliable electricity throughout the day. Students can use computers and attend classes without interruption, even during the hottest months.",
        location: "Multan, Pakistan",
        imageUrl: "",
      },
      {
        title: "Local Clinic",
        description: "A healthcare facility serving rural communities now has 24/7 electricity. They can refrigerate vaccines, use medical equipment, and treat patients during evening hours.",
        location: "Peshawar, Pakistan",
        imageUrl: "",
      }
    ];

    impactStories.forEach(story => {
      const id = this.currentIds.impactStories++;
      this.impactStories.set(id, {
        ...story,
        id,
        createdAt: timestamp
      });
    });

    // Seed testimonials
    const testimonials: InsertTestimonial[] = [
      {
        name: "Farhan Ahmed",
        location: "Karachi, Pakistan",
        message: "The solar panels have completely changed our lives. My children can now study at night, and we can keep our home cool during the hottest days. We no longer have to worry about the grid going down.",
        imageUrl: "",
        rating: 5
      }
    ];

    testimonials.forEach(testimonial => {
      const id = this.currentIds.testimonials++;
      this.testimonials.set(id, {
        ...testimonial,
        id,
        createdAt: timestamp
      });
    });
  }
}

export const storage = new MemStorage();