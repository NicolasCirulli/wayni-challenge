import Image from "next/image";

type UserCardProps = {
  imageSrc: string;
  name: string;
  variant?: "header" | "contact";
};

const variants = {
  header: {
    container: "flex items-center gap-[14px] lg:gap-[32px] lg:flex-col",
    image: "size-[34px] lg:size-[64px]",
    name: "text-[15px] leading-[18px] font-bold text-primary-foreground lg:text-[20px] lg:leading-[24px]",
  },
  contact: {
    container: "flex w-20 shrink-0 flex-col items-center gap-4",
    image: "size-[65px]",
    name: "w-full truncate text-center text-sm leading-[17px] text-foreground",
  },
} as const;

export function UserCard({
  imageSrc,
  name,
  variant = "contact",
}: UserCardProps) {
  const styles = variants[variant];

  return (
    <div className={styles.container}>
      <Image
        src={imageSrc}
        alt=""
        width={64}
        height={64}
        className={`${styles.image} shrink-0 rounded-full object-cover`}
      />
      <span className={styles.name}>{name}</span>
    </div>
  );
}
