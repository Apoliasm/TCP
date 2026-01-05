type UserAvatarProps = {
  name?: string;
  imageUrl?: string | null;
  size?: number; // px
  onClick?: () => void;
};

export default function UserInfoButton({
  name,
  imageUrl,
  size = 36,
  onClick,
}: UserAvatarProps) {
  const initial = name?.charAt(0).toUpperCase() ?? "?";

  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center rounded-full overflow-hidden bg-gray-200 text-gray-700 font-medium hover:ring-2 hover:ring-gray-300 transition"
      style={{
        width: size,
        height: size,
      }}
      aria-label="user menu"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="user avatar"
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-sm">{initial}</span>
      )}
    </button>
  );
}
