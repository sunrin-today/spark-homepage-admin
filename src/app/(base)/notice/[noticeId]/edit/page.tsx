'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { X, File } from 'lucide-react';
import { InputWrapper } from '@/components/ui/input/InputWrapper';
import BaseInput from '@/components/ui/input/Input';
import { TextareaInput } from '@/components/ui/input/TextareaInput';
import { DetailImageGrid } from '@/components/image/DetailImageGrid';
import { FormImageListItem } from '@/lib/types/common';
import { useNotice } from '@/lib/queries/notices/queries';
import { useUpdateNotice } from '@/lib/queries/notices/mutations';
import PageHeader from '@/components/layout/page/PageHeader';
import { useModal } from '@/contexts/ModalContexts';
import ConfirmModal from '@/components/ui/modal/ConfirmModal';

const MAX_IMAGES = 10;
const MAX_CONTENT_LENGTH = 300;

export default function NoticeEditPage() {
  const router = useRouter();
  const params = useParams();
  const noticeId = params.noticeId as string;
  const { open, close } = useModal();

  const { data: noticeDetail } = useNotice(noticeId);
  
  const [originalImages, setOriginalImages] = useState<string[]>([]);
  const { mutate: updateNotice, isPending } = useUpdateNotice(noticeId, originalImages);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    images: [] as FormImageListItem[],
  });

  useEffect(() => {
    if (noticeDetail) {
      const mappedImages: FormImageListItem[] = (noticeDetail.images || [])
        .sort((a, b) => a.index - b.index)
        .map((img, idx) => ({
          id: `${img.url}-${idx}`,
          type: 'exists' as const,
          url: img.url,
        }));

      setOriginalImages(noticeDetail.images?.map(i => i.url) || []);
      setFormData({
        title: noticeDetail.title || '',
        content: noticeDetail.content || '',
        images: mappedImages,
      });
    }
  }, [noticeDetail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!formData.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    if (formData.content.length > MAX_CONTENT_LENGTH) {
      alert(`내용은 최대 ${MAX_CONTENT_LENGTH}자까지 입력할 수 있습니다.`);
      return;
    }

    open(
      <ConfirmModal
        title="수정 저장 하실건가요?"
        message="예를 누르실 경우 바로 수정된 내용이 적용됨을 명심하세요."
        onClose={close}
        onConfirm={() => {
          try {
            // formData.images 사용
            const currentImages = formData.images;
            
            // exists: 현재 남아있는 기존 이미지들의 위치 정보
            const exists = currentImages
              .map((img: FormImageListItem, index: number) => 
                img.type === 'exists' 
                  ? { url: img.url, index } 
                  : null
              )
              .filter((item): item is { url: string; index: number } => item !== null);

            // deletes: 원본에는 있었지만 현재 없는 이미지들
            const deletes = originalImages.filter(
              url => !exists.some((item: { url: string; index: number }) => item.url === url)
            );

            // newImages: 새로 추가된 File 객체들
            const newImages = currentImages
              .filter((img: FormImageListItem): img is Extract<FormImageListItem, { type: 'new' }> => 
                img.type === 'new'
              )
              .map((img: Extract<FormImageListItem, { type: 'new' }>) => img.file);

            // imageIndexes: 새 이미지들이 들어갈 위치
            const imageIndexes = currentImages
              .map((img: FormImageListItem, index: number) => img.type === 'new' ? index : null)
              .filter((index): index is number => index !== null);

            const requestData = {
              title: formData.title,
              content: formData.content,
              exists,
              deletes,
              newImages,
              imageIndexes,
            };

            updateNotice(requestData as any, {
              onSuccess: () => {
                alert('수정되었습니다.');
                router.push(`/notice/${noticeId}`);
                close();
              },
              onError: (error: any) => {
                console.error('Update Error:', error.response?.data);
                alert('수정 실패: ' + (error.response?.data?.message || '알 수 없는 오류'));
                close();
              }
            });
          } catch (error) {
            alert('오류가 발생했습니다.');
            close();
          }
        }}
      />
    );
  };


  console.log('=== Current Render State ===');
  console.log('formData.images:', formData.images);
  console.log('formData.images count:', formData.images.length);

  return (
    <div className="px-8 py-12 gap-[10px] flex flex-col">
      <PageHeader title="공지사항 수정" isBackButton />

      {noticeDetail && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputWrapper label="제목" htmlFor="title" className="max-w-[400px]">
            <BaseInput
              name="title"
              value={formData.title}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, title: value }))
              }
              placeholder="제목을 입력해주세요..."
              required
            />
          </InputWrapper>

          <InputWrapper label="이미지" htmlFor="images" className="max-w-[810px]">
            <DetailImageGrid
              value={formData.images}
              onChange={(images) => {
                console.log('DetailImageGrid onChange called with:', images);
                setFormData((prev) => ({ ...prev, images }));
              }}
              max={MAX_IMAGES}
            />
          </InputWrapper>

          <InputWrapper label="설명" htmlFor="content" className="max-w-[400px]">
            <TextareaInput
              name="content"
              value={formData.content}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, content: value }))
              }
              placeholder="설명을 입력해주세요..."
              required
              maxLength={MAX_CONTENT_LENGTH}
              className='h-[188px]'
            />
          </InputWrapper>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-2 py-1.5 text-gray transition-colors flex items-center gap-2"
              disabled={isPending}
            >
              <X className="w-5 h-5" />
              취소
            </button>
            <button
              type="submit"
              className={`px-2 py-1.5 ${
                isPending ? 'bg-black/50 cursor-not-allowed' : 'bg-black'
              } text-white rounded-lg flex items-center gap-2`}
              disabled={isPending}
            >
              <File className="w-5 h-5" />
              {isPending ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}