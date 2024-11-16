"use server";

import { revalidatePath } from "next/cache";

export const getTotalStorage = async (account: string) => {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/user/${account.toLowerCase()}/total-storage`
    );
    revalidatePath("/drive/folders/parent");
    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      const error = new Error("An error occurred while fetching the data.");

      throw error;
    }
  } catch (err) {
    console.log(err);
  }
};

export const getFolderFiles = async (
  userAccount: string,
  folder_id: string
) => {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/users/${userAccount.toLowerCase()}/folder-files/${folder_id}`
    );
    revalidatePath(`/drive/folders/${folder_id}`);
    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      const error = new Error("An error occurred while fetching the data.");

      throw error;
    }
  } catch (err) {
    console.log(err);
  }
};

export const getAllFiles = async (account: string) => {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/user/${account.toLowerCase()}/files/all`
    );
    revalidatePath("/drive/all-files");
    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      const error = new Error("An error occurred while fetching the data.");

      throw error;
    }
  } catch (err) {
    console.log(err);
  }
};

export const getStarredData = async (account: string) => {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/user/${account.toLowerCase()}/starred`
    );
    revalidatePath("/drive/starred");
    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      const error = new Error("An error occurred while fetching the data.");

      throw error;
    }
  } catch (err) {
    console.log(err);
  }
};
export const getExpiredFiles = async (account: string) => {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/user/${account.toLowerCase()}/files/expired`
    );
    revalidatePath("/drive/expired");
    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      const error = new Error("An error occurred while fetching the data.");

      throw error;
    }
  } catch (err) {
    console.log(err);
  }
};

export const createFolder = async (
  parentId: string,
  userAccount: string,
  folderName: string
) => {
  if (!folderName) return { error: "Enter Folder Name!" };
  try {
    const data = await fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL
      }/users/${userAccount.toLowerCase()}/folder/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ folderName, parentId }),
      }
    );
    const response = await data.json();
    return response;
  } catch (err) {
    console.log(err);
  }
};
