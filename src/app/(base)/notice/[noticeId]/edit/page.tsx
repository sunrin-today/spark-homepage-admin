'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, X, File } from 'lucide-react';
import { noticesApi } from '@/lib/api/notice';
import { InputWrapper } from '@/components/ui/input/InputWrapper';
import BaseInput from '@/components/ui/input/Input';
import { TextareaInput } from '@/components/ui/input/TextareaInput';
import { DetailImageGrid } from '@/components/image/DetailImageGrid';
import { FormImageListItem } from '@/lib/types/common';

const MAX_IMAGES = 10;
const MAX_CONTENT_LENGTH = 300;

export default function NoticeEditPage() {
  const router = useRouter();
  const params = useParams();
  const noticeId = params.noticeId as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    images: [] as FormImageListItem[],
  });

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const data = await noticesApi.getNoticeById(noticeId);
        setFormData({
          title: data.title || '',
          content: data.content || '',
          images:
            data.imageUrls?.map((url) => ({
              id: crypto.randomUUID(),
              type: 'exists' as const,
              url,
            })) || [],
        });
      } catch (error) {
        console.error('Failed to fetch notice:', error);
        alert('공지사항을 불러오는데 실패했습니다.');
        router.push('/notice');
      } finally {
        setLoading(false);
      }
    };

    if (noticeId) {
      fetchNotice();
    }
  }, [noticeId, router]);

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
      // 기존 이미지 url 배열
      const existingImages = formData.images
        .filter((img): img is Extract<FormImageListItem, { type: 'exists' }> => 
          img.type === 'exists'
        )
        .map((img) => img.url);

      // 새 이미지를 base64로 변환
      const newImagePromises = formData.images
        .filter((img): img is Extract<FormImageListItem, { type: 'new' }> => 
          img.type === 'new'
        )
        .map((img) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(img.file);
          });
        });

      const newBase64Images = await Promise.all(newImagePromises);

      // 기존 이미지 + 새 이미지 합치기
      const allImages = [...existingImages, ...newBase64Images];

      const requestData: any = {
        title: formData.title,
        content: formData.content,
      };

      if (allImages.length > 0) {
        requestData.images = allImages;
      }

      await noticesApi.updateNotice(noticeId, requestData);

      alert('수정되었습니다.');
      router.push(`/notice/${noticeId}`);
    } catch (error) {
      console.error('Failed to update notice:', error);
      alert('수정에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-700 hover:text-gray-900"
            aria-label="뒤로가기"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">공지사항 수정하기</h1>
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
            <div className="text-center mt-2">
              <span className="text-sm text-gray-500">
                {formData.content.length} / {MAX_CONTENT_LENGTH}
              </span>
            </div>
          </InputWrapper>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-2"
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