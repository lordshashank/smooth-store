import { BackendFileType } from "@/types/dealTypes";
import { FileType } from "@/types/driveTypes";

type Response = {
  success: boolean;
  files: FileType[];
};

export const postDeal = async (
  userAccount: string,
  deals: BackendFileType[],
  renewDealsLength: number
) => {
  const dbResponse = await fetch(
    `${
      process.env.NEXT_PUBLIC_BACKEND_URL
    }/users/${userAccount.toLowerCase()}/file/create?renewDealsLength=${renewDealsLength}`,
    {
      method: "POST",
      // mode: "no-cors",
      body: JSON.stringify({
        deals: deals,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
  // console.log(dbResponse);
  const dbResData = await dbResponse.json();
  return dbResData as Response;
};
