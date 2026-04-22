function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`
        flex flex-col gap-4 bg-white rounded-xl p-5
        ${className}
    `}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`
        flex justify-between items-center
        ${className}
    `}
      {...props}
    />
  );
}

export { Card, CardHeader };
