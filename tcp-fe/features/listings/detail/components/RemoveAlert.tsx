export function RemoveAlert({ handleDeleteCancel, handleDeleteConfirm, isDeleting }: { handleDeleteCancel: () => void, handleDeleteConfirm: () => void, isDeleting: boolean }) {
    return (
        <div className="fixed inset-0 flex backdrop-blur-sm items-center justify-center z-50">
            <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                <h2 className="text-xl font-bold mb-4">게시글 삭제</h2>
                <p className="text-gray-600 mb-6">
                    정말로 이 게시글을 삭제하시겠습니까? 삭제된 게시글은 복구할 수 없습니다.
                </p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={handleDeleteCancel}
                        disabled={isDeleting}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleDeleteConfirm}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
                    >
                        {isDeleting ? "삭제 중..." : "삭제"}
                    </button>
                </div>
            </div>
        </div>
    )
}