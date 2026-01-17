'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Upload, X, Save } from 'lucide-react';
import { noticesApi } from '@/lib/api/notice';

const MAX_IMAGES = 10;
const MAX_CONTENT_LENGTH = 300;

export default function NoticeAddPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    images: [] as string[],
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = MAX_IMAGES - formData.images.length;
    if (remainingSlots <= 0) {
      alert(`이미지는 최대 ${MAX_IMAGES}개까지 업로드할 수 있습니다.`);
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, reader.result as string],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

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
      const requestData: any = {
        title: formData.title,
        content: formData.content,
      };
      
      // 이미지가 있을 때만 images 필드 추가
      // (500에러가 images 필드가 빈 배열로 요청이 보내져서 나는 건 아닐까 해서 추가함 - 이 때문은 아닌 것 같음)
      if (formData.images.length > 0) {
        requestData.images = formData.images;
      }
      
      console.log('Sending notice data:', requestData);
      
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
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-700 hover:text-gray-900"
            aria-label="뒤로가기"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">공지사항 추가하기</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-600 mb-2">제목</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="제목을 입력해주세요..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-3">
              이미지 추가하기
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* 업로드된 이미지들 */}
              {formData.images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-[16/10] rounded-lg overflow-hidden bg-gray-900 group"
                >
                  <img
                    src={image}
                    alt={`업로드 이미지 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white">
                    <Upload className="w-6 h-6 mb-2" />
                    <span className="text-sm">
                      클릭하거나 드래그하여 파일을 업로드해주세요.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}

              {formData.images.length < MAX_IMAGES && (
                <label className="relative aspect-[16/10] border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors cursor-pointer flex flex-col items-center justify-center bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Upload className="w-6 h-6 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">
                    클릭하거나 드래그하여 파일을 업로드해주세요.
                  </span>
                </label>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * 최대 {MAX_IMAGES}개의 이미지를 업로드할 수 있습니다.
            </p>
          </div>

          <div className="relative">
            <label className="block text-sm text-gray-600 mb-2">설명</label>
            <div className="relative">
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                placeholder="설명을 입력해주세요..."
                rows={6}
                maxLength={MAX_CONTENT_LENGTH}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 transition-colors resize-none"
              />
              {formData.content && (
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, content: '' }))
                  }
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="text-center mt-2">
              <span className="text-sm text-gray-500">
                {formData.content.length} / {MAX_CONTENT_LENGTH}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
                type="submit"
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={submitting}
                >
                <Save className="w-5 h-5" />
                {submitting ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}