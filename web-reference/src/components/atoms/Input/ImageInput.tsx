import React, { useState } from 'react';
import { colors } from '../../../styles/color';

interface ProfileImageInputProps {
  imageUrl: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageInput = ({ imageUrl, onImageChange }: ProfileImageInputProps) => {
  const [error, setError] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 확장자 체크
    const fileName = file.name.toLowerCase();
    const validExtensions = ['.png', '.jpg', '.jpeg'];
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'));

    if (!validExtensions.includes(fileExtension)) {
      setError(true);
      e.target.value = '';
      return;
    }
    setError(false);
    onImageChange(e);
  };

  return (
    <div className='flex flex-col'>
      <label htmlFor='profile-image' className='cursor-pointer'>
        <div
          className='mt-3 h-24 w-24 overflow-hidden rounded-xl border-1 md:h-32 md:w-32'
          style={{ borderColor: colors.grey10 }}
        >
          {imageUrl && imageUrl !== '' ? (
            <img src={imageUrl} alt='프로필' className='h-full w-full object-cover' />
          ) : (
            <div className='text-grey-20 flex h-full w-full items-center justify-center text-xs md:text-sm'>
              이미지 업로드
            </div>
          )}
        </div>
      </label>
      <input
        id='profile-image'
        type='file'
        accept='image/png,image/jpeg,image/jpg'
        className='hidden'
        onChange={handleFileChange}
      />
      {error && (
        <div className='text-error mt-2 ml-1 flex flex-col text-xs'>
          <p>파일 형식이 맞지 않습니다.</p>
        </div>
      )}
      <div className='text-grey-40 mt-2 ml-1 flex flex-col text-[10px]'>
        <p>png, jpg, jpeg 파일만 업로드 가능합니다.</p>
      </div>
    </div>
  );
};

export default ImageInput;
