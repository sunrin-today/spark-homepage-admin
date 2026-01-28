'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { X, File } from 'lucide-react';
import { InputWrapper } from '@/components/ui/input/InputWrapper';
import BaseInput from '@/components/ui/input/Input';
import { TextareaInput } from '@/components/ui/input/TextareaInput';
import { DetailImageGrid } from '@/components/image/DetailImageGrid';
import { FormImageListItem } from '@/lib/types/common';
import PageHeader from '@/components/layout/page/PageHeader';
import { useModal } from '@/contexts/ModalContexts';
import ConfirmModal from '@/components/ui/modal/ConfirmModal';
import { useNotice } from '@/lib/queries/notices/queries';
import { useUpdateNotice } from '@/lib/queries/notices/mutations';

const MAX_IMAGES = 10;
const MAX_CONTENT_LENGTH = 300;

export default function NoticeEditPage() {
  const params = useParams();
  const noticeId = params.noticeId as string;
  const { open, close } = useModal();

  const { data: noticeDetail, isLoading } = useNotice(noticeId);
  
  const [originalImages, setOriginalImages] = useState<string[]>([]);
  const updateNoticeMutation = useUpdateNotice(noticeId, originalImages);

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
          const currentImages = formData.images;
          
          const exists = currentImages
            .map((img: FormImageListItem, index: number) => 
              img.type === 'exists' 
                ? { url: img.url, index } 
                : null
            )
            .filter((item): item is { url: string; index: number } => item !== null);

          const deletes = originalImages.filter(
            url => !exists.some((item: { url: string; index: number }) => item.url === url)
          );

          const newImages = currentImages
            .filter((img: FormImageListItem): img is Extract<FormImageListItem, { type: 'new' }> => 
              img.type === 'new'
            )
            .map((img: Extract<FormImageListItem, { type: 'new' }>) => img.file);

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

          updateNoticeMutation.mutate(requestData as any);
          close();
        }}
      />
    );
  };

  if (!noticeDetail) {
    return (
      <div className="px-8 py-12 gap-[10px] flex flex-col">
        <PageHeader title="공지사항 수정" isBackButton />
        <div className="flex items-center justify-center py-20">
          <div className="text-gray">공지사항을 찾을 수 없습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-12 gap-[10px] flex flex-col">
      <PageHeader title="공지사항 수정" isBackButton />

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
            onClick={() => window.history.back()}
            className="px-2 py-1.5 text-gray transition-colors flex items-center gap-2"
            disabled={updateNoticeMutation.isPending}
          >
            <X className="w-5 h-5" />
            취소
          </button>
          <button
            type="submit"
            className={`px-2 py-1.5 ${
              updateNoticeMutation.isPending ? 'bg-black/50 cursor-not-allowed' : 'bg-black'
            } text-white rounded-lg flex items-center gap-2`}
            disabled={updateNoticeMutation.isPending}
          >
            <File className="w-5 h-5" />
            {updateNoticeMutation.isPending ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>
    </div>
  );
}