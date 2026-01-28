'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, File } from 'lucide-react';
import { noticesApi } from '@/lib/api/notice';
import { InputWrapper } from '@/components/ui/input/InputWrapper';
import BaseInput from '@/components/ui/input/Input';
import { TextareaInput } from '@/components/ui/input/TextareaInput';
import { DetailImageGrid } from '@/components/image/DetailImageGrid';
import { FormImageListItem } from '@/lib/types/common';
import PageHeader from '@/components/layout/page/PageHeader';

const MAX_IMAGES = 10;
const MAX_CONTENT_LENGTH = 300;

export default function NoticeAddPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    images: [] as FormImageListItem[],
  });

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

    setSubmitting(true);

    try {
      // FormImageListItem에서 File 객체 추출
      const imageFiles = formData.images
        .filter((img): img is Extract<FormImageListItem, { type: 'new' }> => 
          img.type === 'new'
        )
        .map(img => img.file);

      const requestData = {
        title: formData.title,
        content: formData.content,
        imageFiles: imageFiles.length > 0 ? imageFiles : undefined,
      };

      await noticesApi.createNotice(requestData);

      alert('등록되었습니다.');
      router.push('/notice');
    } catch (error) {
      console.error('Failed to create notice:', error);
      alert('등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="mb-8">
          <PageHeader title="공지사항 추가하기" isBackButton />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputWrapper label="제목" htmlFor="title">
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

          <InputWrapper label="이미지" htmlFor="images">
            <DetailImageGrid
              value={formData.images}
              onChange={(images) =>
                setFormData((prev) => ({ ...prev, images }))
              }
              max={MAX_IMAGES}
            />
          </InputWrapper>

          <InputWrapper label="설명" htmlFor="content">
            <TextareaInput
              name="content"
              value={formData.content}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, content: value }))
              }
              placeholder="설명을 입력해주세요..."
              required
              maxLength={MAX_CONTENT_LENGTH}
            />
          </InputWrapper>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 text-gray transition-colors flex items-center gap-2"
              disabled={submitting}
            >
              <X className="w-5 h-5" />
              취소
            </button>
            <button
              type="submit"
              className={`px-6 py-3 ${
                submitting ? 'bg-black/50 cursor-not-allowed' : 'bg-black'
              } text-white rounded-lg flex items-center gap-2`}
              disabled={submitting}
            >
              <File className="w-5 h-5" />
              {submitting ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}