import Image from "next/image";

type UserCardProps = {
  imageSrc: string;
  name: string;
  variant?: "header" | "contact" | "detail";
};

const variants = {
  header: {
    container: "flex items-center gap-3.5 lg:flex-col lg:gap-8",
    image: "size-9 lg:size-16",
    name: "text-sm font-bold leading-5 text-primary-foreground lg:text-xl lg:leading-6",
  },
  contact: {
    container: "flex w-full items-center gap-2 p-2",
    image: "size-12",
    name: "text-center text-sm leading-5 text-foreground",
  },
  detail: {
    container: "flex w-full flex-col items-center gap-2",
    image: "size-16",
    name: "text-center text-sm font-bold leading-5 text-foreground lg:text-base",
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
