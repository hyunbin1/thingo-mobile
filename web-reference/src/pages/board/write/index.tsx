import { useCallback, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BlockTextEditor from '../../../components/organisms/BlockTextEditor';
import type { BlockNoteEditor } from '@blocknote/core';
import NavigationUp from '../../../components/molecules/NavigationUp';
import { getBlockTextEditorContentPreview } from '../../../components/organisms/BlockTextEditor/util';
import { postBoard } from '../../../api/board';
import { DOMAIN_VALUES } from '../../../api/s3upload';
import { useAuthStore } from '@/store/useAuthStore';
import LoginErrorPage from '@/pages/LoginError';
import { ChevronDownIcon } from '@/components/atoms/Icon';

type Category = 'FREE' | 'NOTICE';
const CATEGORY_LABEL: Record<Category, string> = {
  FREE: '자유게시판',
  NOTICE: '정보게시판',
};

/**
 * 게시글 작성 페이지
 *
 * 새로운 게시글을 작성하는 페이지입니다.
 * 카테고리 선택(자유게시판/정보게시판), 제목, 본문을 입력할 수 있습니다.
 */
export default function BoardWrite() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const titleRef = useRef<HTMLInputElement>(null);
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<BlockNoteEditor>(null);

  const [isLoading, setIsLoading] = useState(false);

  // 수정사항 존재 여부
  const [isDirty, setIsDirty] = useState(false);

  // 제목/본문 입력 여부 (완료 버튼 스타일용)
  const [hasTitle, setHasTitle] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  // 카테고리
  const [selectedCategory, setSelectedCategory] = useState<Category>('FREE');
  const options: Category[] = ['FREE', 'NOTICE'];

  /**
   * 에디터 인스턴스를 불러옵니다.
   */
  const handleEditorReady = useCallback((editor: BlockNoteEditor) => {
    editorRef.current = editor;

    editor.onChange(() => {
      setIsDirty(true);
      setHasContent(!editor.isEmpty);
    });
  }, []);

  /**
   * 브라우저 새로고침 / 탭 닫기 / 외부 이동 시 경고
   */
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  /**
   * 상단 뒤로가기 눌렀을 때 확인
   */
  const handleBack = () => {
    if (isDirty) {
      const ok = window.confirm('작성 중인 내용이 사라집니다. 나가시겠습니까?');
      if (!ok) return;
    }
    navigate(-1);
  };

  /**
   * 게시글 업로드 요청
   */
  const handleUploadPost = async () => {
    if (isLoading) return;

    const title = titleRef.current?.value.trim() ?? '';
    const content = JSON.stringify(editorRef.current?.document);
    const contentPreview = getBlockTextEditorContentPreview(content);

    if (!title) {
      alert('제목을 입력하세요');
      return;
    }

    if (editorRef.current?.isEmpty) {
      alert('본문을 입력하세요');
      return;
    }

    setIsLoading(true);
    try {
      const newPostUuid = await postBoard(title, selectedCategory, content, contentPreview, true);
      setIsDirty(false);
      navigate(`/board/${newPostUuid}`, { replace: true });
    } catch (e) {
      console.error('BoardWrite.tsx', e);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * editor의 블록 외부를 클릭했을 때 마지막 줄로 커서 이동
   */
  const handleFocusEditor = (e: React.MouseEvent<HTMLDivElement>) => {
    const editor = editorRef.current;

    if (!editor) return;
    if (editorWrapperRef.current?.contains(e.target as Node)) return;

    const blocks = editor.document;

    if (blocks.length > 0) {
      const lastBlock = blocks[blocks.length - 1];
      editor.setTextCursorPosition(lastBlock.id, 'end');
    }

    editor.focus();
  };

  if (!user) {
    return (
      <div>
        <header className='flex h-15 items-center px-5'>
          <NavigationUp onClick={handleBack} />
        </header>
        <div className='px-5'>
          <LoginErrorPage />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 상단 네비게이션 */}
      <header className='flex h-15 items-center px-5'>
        <NavigationUp onClick={handleBack} />
      </header>

      <div className='px-5'>
        {/* 제목 입력 */}
        <input
          className='border-grey-10 text-body03 placeholder:text-grey-20 w-full rounded-lg border px-3 py-2'
          placeholder='제목'
          ref={titleRef}
          onChange={(e) => {
            setIsDirty(true);
            setHasTitle(!!e.target.value.trim());
          }}
        />

        {/* 카테고리 선택 (브라우저 기본 select) */}
        <div className='relative mt-2.5'>
          <select
            className='border-grey-10 text-body03 text-blue-20 w-full appearance-none rounded-lg border px-3 py-2 pr-10'
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value as Category);
              setIsDirty(true);
            }}
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {CATEGORY_LABEL[option]}
              </option>
            ))}
          </select>
          <span className='text-grey-40 pointer-events-none absolute top-1/2 right-3 -translate-y-1/2'>
            <ChevronDownIcon className='text-grey-30' />
          </span>
        </div>

        {/* 에디터 */}
        <div
          className='border-grey-10 mt-4 min-h-120 cursor-text rounded-lg border px-4 py-2'
          onClick={handleFocusEditor}
        >
          <div className='overflow-visible py-2' ref={editorWrapperRef}>
            <BlockTextEditor onEditorReady={handleEditorReady} domain={DOMAIN_VALUES[0]} />
          </div>
        </div>

        {/* 완료 버튼 */}
        <div className='mt-4 mb-10'>
          <button
            className={`text-body05 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg ${hasTitle && hasContent ? 'bg-mju-primary text-white' : 'bg-grey-02 text-grey-40'} disabled:cursor-not-allowed disabled:opacity-70`}
            onClick={handleUploadPost}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className='border-grey-20 border-t-mju-primary h-4 w-4 shrink-0 animate-spin rounded-full border-2' />
                <span>저장 중...</span>
              </>
            ) : (
              '완료'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
