import { Prisma, PrismaClient, Role, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IGeneralSettings, ILogin, ILoginUpdate, IRole, IUser, IUserView } from "../interface/authInterface"
import { JWT_SECRET } from "../secrets";
// import { sendAdminRegistrationEmail } from "../utils/mail";
import { deleteFile, getFileName, uploadFile } from "../utils/upload";

const prisma = new PrismaClient();



export const registerUser = async (data: IUser, isCreate: boolean) => {
  if (isCreate) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) throw new Error("User with this email already exists");

    // await sendAdminRegistrationEmail(data.email, data.lastName as string, "Admin")
    // hash password
    const hashedPassword = await bcrypt.hash("12345", 10);

    return prisma.user.create({
      data: {
        fullName: data.fullName ?? null,
        email: data.email ?? null,
        roleId: data.roleId ?? null,
        department: data.department ?? null,
        phoneNumber: data.phoneNumber ?? null,
        status: data.status ?? null,
        assignedProjectId: data.assignedProjectId ?? null,
        password: hashedPassword
      } as Prisma.UserCreateInput
    });
  } else {
    return prisma.user.update({
      where: { userId: data.userId },
      data: {
        fullName: data.fullName ?? null,
        email: data.email ?? null,
        roleId: data.roleId ?? null,
        department: data.department ?? null,
        phoneNumber: data.phoneNumber ?? null,
        status: data.status ?? null,
        assignedProjectId: data.assignedProjectId ?? null,
        updateAt: new Date(),
      },
    });
  }
};


export const getUserById = async (userId: string): Promise<Array<IUserView>> => {
  // Fetch user data from the database
  const users: IUserView[] = await prisma.$queryRaw`
    SELECT * FROM user_view WHERE userId = ${userId}
  `;

  return users;
};

export const getAllUser = async (): Promise<Array<IUserView>> => {
  const users: IUserView[] = await prisma.$queryRaw`
    SELECT * FROM user_view
  `;
  return users;
}

export const removeUser = async (userId: string): Promise<User> => {
  // console.log(userId, "remove")
  let user = await prisma.user.delete({ where: { userId } })
  return user
}

export const updateLoginUser = async (data: ILoginUpdate) => {
  if (data.password) {
    // hash password
    data.password = await bcrypt.hash(data.password, 10);
    await prisma.user.update({
      where: { userId: data.userId },
      data: {
        fullName: data.fullName ?? null,
        email: data.email ?? null,
        phoneNumber: data.phoneNumber ?? null,
        roleId: data.roleId ?? null,
        password: data.password ?? null,
        updateAt: new Date(),
      },
    });
  } else {
    await prisma.user.update({
      where: { userId: data.userId },
      data: {
        fullName: data.fullName ?? null,
        email: data.email ?? null,
        phoneNumber: data.phoneNumber ?? null,
        roleId: data.roleId ?? null,
        updateAt: new Date(),
      },
    });
  }
};





export const registerGeneralSettings = async (data: IGeneralSettings, isCreate: boolean) => {
  try {
    if (isCreate) {
      return prisma.generalSettings.create({
        data: {
          organizationName: data.organizationName ?? null,
          contactEmail: data.contactEmail ?? null,
          contactPhone: data.contactPhone ?? null,
          website: data.website ?? null,
          organizationLogo: data.organizationLogo ?? null,
          defaultCurrency: data.defaultCurrency ?? null,
          defaultTimeZone: data.defaultTimeZone ?? null,
          dateRetentionPolicy: data.dateRetentionPolicy ?? null,
          auditLogRetention: data.auditLogRetention ?? null,
          emailNotification: data.emailNotification ?? null,
          maintenanceAlert: data.maintenanceAlert ?? null,
        } as Prisma.GeneralSettingsCreateInput

      });
    } else {
      return prisma.generalSettings.update({
        where: { generalSettingsId: data.generalSettingsId },
        data: {
          organizationName: data.organizationName ?? null,
          contactEmail: data.contactEmail ?? null,
          contactPhone: data.contactPhone ?? null,
          website: data.website ?? null,
          organizationLogo: data.organizationLogo ?? null,
          defaultCurrency: data.defaultCurrency ?? null,
          defaultTimeZone: data.defaultTimeZone ?? null,
          dateRetentionPolicy: data.dateRetentionPolicy ?? null,
          auditLogRetention: data.auditLogRetention ?? null,
          emailNotification: data.emailNotification ?? null,
          maintenanceAlert: data.maintenanceAlert ?? null,
        }
      })
    }

  } catch (error: any) {
    // console.log(error, "error")
    throw new Error(error.message);
  }
};

export const getGeneralSettings = async (): Promise<IGeneralSettings> => {
  const generalSettings: IGeneralSettings[] = await prisma.$queryRaw`
    SELECT * FROM generalsettings
  `;
  return generalSettings[0];
}

export const registerRole = async (data: IRole, isCreate: boolean) => {
  const roleData = {
    roleName: data.roleName ?? null,
    description: data.description ?? null,
    permission: data.permission ?? null
  };

  if (isCreate) {
    return prisma.role.create({ data: roleData });
  }

  return prisma.role.update({
    where: { roleId: data.roleId },
    data: roleData,
  });
};

export const getAllRole = async (): Promise<Array<Role>> => {
  const role: Role[] = await prisma.$queryRaw`
  SELECT * FROM role
`;
  return role
}


export const loginUser = async (data: ILogin) => {

  // console.log(data)

  const user: IUserView[] = await prisma.$queryRaw`
  SELECT * FROM user_view WHERE email = ${data.email}
`;
  // console.log(user)
  if (user.length < 1) throw new Error("Invalid credentials");

  // if (user[0].status == 0) throw new Error("Your Account is not approved, pleas contact the admin");

  const isPasswordValid = await bcrypt.compare(data.password, user[0].password as string);

  // console.log("IsValid", isPasswordValid)
  if (!isPasswordValid) throw new Error("Invalid credentials");

  // Update last login time and status
  if (user[0].status === "Inactive") {
    await prisma.user.update({
      where: { userId: user[0].userId },
      data: {
        loginLast: new Date(),
        status: "Active",
        updateAt: new Date()
      },
    });
  }

  return jwt.sign(user[0], JWT_SECRET as string, { expiresIn: "2h" });
};

export const changePassword = async (userId: string, oldPassword: string, newPassword: string, confirmPassword: string) => {
  // Fetch user by ID
  const user = await prisma.user.findUnique({ where: { userId } });
  if (!user) {
    throw new Error("User not found.");
  }

  // Check if old password matches
  const passwordMatch = await bcrypt.compare(oldPassword, user.password as string);
  if (!passwordMatch) {
    throw new Error("Old password is incorrect.");
  }

  // Validate new password
  if (newPassword !== confirmPassword) {
    throw new Error("New password and confirm password do not match.");
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update user password
  await prisma.user.update({
    where: { userId },
    data: { password: hashedPassword },
  });

  return { message: "Password changed successfully." };
};

export const updateProfilePicture = async (userId: string, base64String: string, mimeType: string) => {
  if (!base64String || !mimeType) {
    throw new Error("Profile picture and MIME type are required.");
  }

  const user = await prisma.user.findUnique({ where: { userId } })

  if (user?.profilePic) {
    const filePath = getFileName(user.profilePic)
    await deleteFile(filePath)
  }

  let uploadUrl = await uploadFile(base64String, mimeType)

  // Update user profile picture
  const updatedUser = await prisma.user.update({
    where: { userId },
    data: {
      profilePic: uploadUrl,
      profilePicMimeType: mimeType,
    },
    select: { userId: true, profilePicMimeType: true, profilePic: true },
  });

  return { message: "Profile picture updated successfully.", data: updatedUser };
};
export const deleteCloudFile = async (url: string) => {
  try {
    if (url) {
      const filePath = getFileName(url)
      await deleteFile(filePath)
    }
  } catch (error: any) {
    // console.error("Error deleting file:", error);
    throw new Error("Error deleting file");
  }
};

export const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("User with this email does not exist");
  }

  const defaultPassword = await bcrypt.hash("12345", 10);

  await prisma.user.update({
    where: { email },
    data: {
      password: defaultPassword,
      updateAt: new Date(),
    },
  });
};

