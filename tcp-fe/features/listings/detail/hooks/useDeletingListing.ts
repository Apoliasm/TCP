// hooks/useDeleteListing.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { deleteListing } from "@/lib/api/listings/mutations";
import { useState } from "react";

export function useDeleteListing(listingId: number, userId?: number) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isDeleting, setIsDeleting] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteListing(listingId, userId),
    onSuccess: () => {
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["listing", listingId] });
      // 목록 페이지로 이동
      router.push("/listing");
    },
    onError: (error: Error) => {
      alert(error.message || "게시글 삭제에 실패했습니다.");
      setIsDeleting(false);
    },
  });



  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    deleteMutation.mutate();
  };

 

  return {
    isDeleting,
    handleDeleteConfirm
  };
}