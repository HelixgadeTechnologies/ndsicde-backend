export interface IUser {
    userId: string
    fullName?: string | null;
    email?: string;
    roleId?: string | null;
    department?: string | null;
    phoneNumber?: string | null;
    status?: string | null;
    assignedProjectId?: string | null;
    address?: string | null;
    community?: string | null;
    state?: string | null;
    localGovernmentArea?: string | null;
    profilePic?: string | null;
    password?: string | null;
    loginLast?: string | null;
    createAt?: string | null;
    updateAt?: string | null;
}

export interface IUserView {
  userId: string;
  fullName?: string;
  email?: string;
  address?: string;
  phoneNumber?: string;
  roleId?: string;
  roleName?: string;
  status?: string;
  assignedProjectId?: string;
  department?: string;
  community?: string;
  state?: string;
  localGovernmentArea?: string;
  profilePic?: string;
  password?: string;
  profilePicMimeType?: string;
  loginLast?: Date;
  createAt?: Date;
  updateAt?: Date;
}


export interface ISignUpAdmin {
    userId: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phoneNumber: string;
    roleId: string | null;
    trusts: string | null;
    status?: number | null;
}
export interface ILoginUpdate {
    userId: string
    fullName?: string | null;
    email?: string;
    phoneNumber?: string | null;
    roleId?: string | null;
    password?: string | null;
}



export interface ILogin {
    email: string;
    password: string;
}



export interface IUserClient {
    userId: number;
    firstName?: string | null;
    lastName?: string | null;
    email?: string;
    address?: string | null;
    phoneNumber?: string | null;
    role?: string | null;
    status?: number | null;
    community?: string | null;
    state?: string | null;
    localGovernmentArea?: string | null;
    profilePic?: string | null; // Buffer for Prisma bytes, string for converted hex
    profilePicMimeType?: string | null;
    password?: string | null;
}

export interface IRole {
    roleId: string;
    roleName?: string;
    description?: string;
    permission?: string;
    createAt?: string;
    updateAt?: string;
}

export interface IGeneralSettings {
    generalSettingsId: string;
    organizationName?: string;
    contactEmail?: string;
    contactPhone?: string;
    website?: string;
    organizationLogo?: string;
    defaultCurrency?: string;
    defaultTimeZone?: string;
    dateRetentionPolicy?: string;
    auditLogRetention?: string;
    emailNotification?: boolean;
    maintenanceAlert?: boolean;
    createAt?: Date;
    updateAt?: Date;
}
