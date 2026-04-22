import React, { type JSX } from 'react';
import clsx from 'clsx';

/**
 * @deprecated tailwind css 속성을 사용하세요
 */
export type TypographyVariant =
  | 'heading01'
  | 'heading02'
  | 'title01'
  | 'title02'
  | 'body01'
  | 'body02'
  | 'body03'
  | 'caption01'
  | 'caption02';

/**
 * @deprecated tailwind css 속성을 사용하세요
 */
interface TypographyProps {
  variant?: TypographyVariant;
  className?: string;
  dangerouslySetInnerHTML?: { __html: string };
  children?: React.ReactNode;
}

/**
 * @deprecated tailwind css 속성을 사용하세요
 */
const variantConfig: Record<
  TypographyVariant,
  { tag: keyof JSX.IntrinsicElements; className: string }
> = {
  heading01: { tag: 'h1', className: 'font-bold text-[40px] leading-[150%]' },
  heading02: { tag: 'h2', className: 'font-bold text-[28px] leading-[150%]' },
  title01: { tag: 'h3', className: 'font-bold text-[20px] leading-[150%]' },
  title02: { tag: 'h4', className: 'font-semibold text-[20px] leading-[150%]' },
  body01: { tag: 'p', className: 'font-normal text-[20px] leading-[150%]' },
  body02: { tag: 'p', className: 'font-semibold text-[16px] leading-[150%]' },
  body03: { tag: 'p', className: 'font-normal text-[16px] leading-[150%]' },
  caption01: { tag: 'span', className: 'font-semibold text-[12px] leading-[150%]' },
  caption02: { tag: 'span', className: 'font-normal text-[12px] leading-[150%]' },
};

/**
 * @deprecated tailwind css 속성을 사용하세요
 */
export const Typography = ({
  variant = 'body01',
  className,
  children,
  dangerouslySetInnerHTML,
}: TypographyProps) => {
  const { tag: Tag, className: vClass } = variantConfig[variant];
  return (
    <Tag
      className={clsx('font-pretendard', vClass, className)}
      {...(dangerouslySetInnerHTML ? { dangerouslySetInnerHTML } : {})}
    >
      {children}
    </Tag>
  );
};
