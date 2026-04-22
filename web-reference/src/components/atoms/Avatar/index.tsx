import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const DEFAULT_AVATAR = '/img/avatar-default.svg';

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  className?: string;
}

export default function Avatar({ src, className, ...props }: AvatarProps) {
  /**
   * 이미지 로딩 실패 시 기본 아바타 이미지로 대체합니다.
   */
  const [imgSrc, setImgSrc] = React.useState(src && src !== '' ? src : DEFAULT_AVATAR);

  return (
    <img
      src={imgSrc}
      alt='프로필 이미지'
      className={twMerge(clsx('aspect-square h-12 w-12 rounded-full object-cover', className))}
      onError={() => setImgSrc(DEFAULT_AVATAR)}
      {...props}
    />
  );
}
