import imageCompression from 'browser-image-compression';
import heic2any from 'heic2any';

/**
 * 이미지 파일을 압축합니다.
 *
 * - 이미지 파일의 용량이 1MB 이상인 경우에만 압축을 수행합니다.
 * - HEIC/HEIF 형식의 이미지는 JPEG로 변환한 후 압축합니다.
 * - 압축 결과물은 image/jpeg 형식이고 파일 크기가 1MB 이하임을 보장합니다.
 *
 * @param file 압축할 이미지 파일
 * @returns 압축된 이미지 파일 (1MB 미만이거나 이미지가 아닌 경우 원본 파일 반환)
 */
export async function compressImage(file: File): Promise<File> {
  // 이미지 파일이 아니거나 1MB 미만이면 압축하지 않음
  if (!file.type.startsWith('image/') || file.size / 1024 / 1024 < 1) {
    return file;
  }

  let imageFile = file;

  // HEIC/HEIF 이미지는 별도 처리
  if (file.type === 'image/heic' || file.type === 'image/heif') {
    const blob = (await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 1,
    })) as Blob;

    imageFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpeg'), {
      type: 'image/jpeg',
    });
  }

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 3840,
    useWebWorker: true, // 백그라운드 스레드 사용 여부
    preserveExif: false, // 이미지 메타데이터 유지 여부
    fileType: 'image/jpeg', // 출력 이미지 형식
  };

  const compressedImageFile = await imageCompression(imageFile, options);

  return compressedImageFile;
}
