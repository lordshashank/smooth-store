"use client";
import DriveFiles from "@/components/DriveFiles";
import NewFolderModal from "@/components/NewFolderModal";
import { useFolderFiles } from "@/hooks/useFolderFiles";
import { useSearchParams } from "next/navigation";
import Skeleton from "@/components/ui/Skeleton";
import { useRenewDeals } from "@/hooks/useRenewDeals";

const Drive = ({ params: { folderId } }: { params: { folderId: string } }) => {
  const { isLoading } = useFolderFiles(folderId);
  const SearchParams = useSearchParams();
  const newFolder = SearchParams.get("new");
  useRenewDeals();

  if (isLoading) return <Skeleton />;
  return (
    <>
      <DriveFiles folderId={folderId} />
      {newFolder === "true" && <NewFolderModal />}
    </>
  );
};

export default Drive;
