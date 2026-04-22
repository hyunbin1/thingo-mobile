import React, { useState } from 'react';
import ImageInput from '../../../atoms/Input/ImageInput';

interface Props {
  onChange: (file: File) => void;
  label?: string;
  defaultImg?: string | null;
}

const ProfileImageUploader = ({ onChange, label = '프로필', defaultImg = null }: Props) => {
  const [preview, setPreview] = useState<string | null>(defaultImg);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectURL = URL.createObjectURL(file);
    setPreview(objectURL);
    onChange(file);
  };

  return (
    <div className='w-fit'>
      <div className='flex items-center gap-6'>
        <label className='text-grey-80 text-md text-body04 whitespace-nowrap md:text-xl'>
          {label}
        </label>
      </div>
      <ImageInput imageUrl={preview} onImageChange={handleChange} />
    </div>
  );
};

export default ProfileImageUploader;
