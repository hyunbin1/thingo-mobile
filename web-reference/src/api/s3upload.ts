import apiClient from './apiClient';

export const DOMAIN_VALUES = [
  'COMMUNITY_POST',
  'PROFILE_IMAGE',
  'DEPARTMENT_LOGO',
  'DEPARTMENT_SCHEDULE',
  'STUDENT_COUNCIL_NOTICE',
] as const;

export type UploadDomain = (typeof DOMAIN_VALUES)[number];

type S3UploadResponse = { success: boolean; data: string };

export const uploadS3 = async (file: File, domain: UploadDomain): Promise<string> => {
  const form = new FormData();
  form.append('file', file);
  form.append('domain', domain);

  const { data } = await apiClient.post<S3UploadResponse>('/s3/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data.data;
};
