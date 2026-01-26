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
  const [originalImages, setOriginalImages] = useState<Array<{ url: string; index: number }>>([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    images: [] as FormImageListItem[],
  });

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const data = await noticesApi.getNoticeById(noticeId);
        
        // 원본 이미지 URL만 저장 (비교용)
        const originalUrls = (data.images || []).map(img => img.url);
        setOriginalImages(originalUrls.map((url, idx) => ({ url, index: idx })));
        
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
      // 원본 이미지 URL 목록
      const originalUrls = originalImages.map(img => img.url);
      
      // 현재 존재하는 이미지들의 URL
      const currentExistingUrls = formData.images
        .filter((img): img is Extract<FormImageListItem, { type: 'exists' }> => 
          img.type === 'exists'
        )
        .map(img => img.url);

      // 삭제된 이미지 URL 찾기 (원본 공지사항에는 있었지만 현재는 없는 것)
      const deletedUrls = originalUrls.filter(url => !currentExistingUrls.includes(url));

      console.log('=== Image Tracking ===');
      console.log('Original URLs:', originalUrls);
      console.log('Current URLs:', currentExistingUrls);
      console.log('Deleted URLs:', deletedUrls);

      // 기존 이미지들 새로운 위치 정보
      let existsIndex = 0;
      const existsWithIndex = formData.images
        .map((img) => {
          if (img.type === 'exists') {
            return { url: img.url, index: existsIndex++ };
          }
          return null;
        })
        .filter((item): item is { url: string; index: number } => item !== null);

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

      // 새 이미지들의 인덱스 (전체 이미지 배열에서의 위치)
      const newImageIndexes: number[] = [];
      formData.images.forEach((img, index) => {
        if (img.type === 'new') {
          newImageIndexes.push(index);
        }
      });

      // undefined 제거를 위한 필터링
      const requestData: any = {
        title: formData.title,
        content: formData.content,
        exists: existsWithIndex, // 필수 필드
        imageIndexes: [], // 기본값은 빈 배열
      };

      // 옵셔널 필드는 값이 있을 때만 추가
      if (deletedUrls.length > 0) {
        requestData.deletes = deletedUrls;
      }
      
      // 새 이미지가 있을 때만 newImages와 imageIndexes 추가
      if (newBase64Images.length > 0) {
        requestData.newImages = newBase64Images;
        // imageIndexes를 0부터 시작하는 연속된 숫자로
        requestData.imageIndexes = Array.from({ length: newBase64Images.length }, (_, i) => i);
      }

      console.log('Update request data:', JSON.stringify(requestData, null, 2));
      console.log('- Deleted images:', deletedUrls);
      console.log('- Existing images with new positions:', existsWithIndex);
      console.log('- New images:', newBase64Images.length);
      console.log('- Original imageIndexes (positions in full array):', newImageIndexes);
      console.log('- Sent imageIndexes:', requestData.imageIndexes);

      console.log('Update request data:', JSON.stringify(requestData, null, 2));
      console.log('- Deleted images:', deletedUrls);
      console.log('- Existing images with new positions:', existsWithIndex);
      console.log('- New images:', newBase64Images.length);
      console.log('- New image indexes:', newImageIndexes);

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