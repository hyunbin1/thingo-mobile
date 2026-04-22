import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BlockTextEditor from '../../../components/organisms/BlockTextEditor';
import type { BlockNoteEditor } from '@blocknote/core';
import NavigationUp from '../../../components/molecules/NavigationUp';
import { getBlockTextEditorContentPreview } from '../../../components/organisms/BlockTextEditor/util';
import { getBoardDetail, updatePost } from '../../../api/board';
import { DOMAIN_VALUES } from '../../../api/s3upload';
import { ChevronDownIcon } from '@/components/atoms/Icon';
type Category = 'FREE' | 'NOTICE';
const CATEGORY_LABEL: Record<Category, string> = {
  FREE: '자유게시판',
  NOTICE: '정보게시판',
};

/**
 * 게시글 수정 페이지
 *
 * 기존 게시글을 수정하는 페이지입니다.
 * 제목과 본문을 수정할 수 있으며, 수정 전 확인 모달을 표시합니다.
 */
export default function BoardEdit() {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<BlockNoteEditor>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [initialContent, setInitialContent] = useState('');

  // 수정사항 존재 여부
  const [isDirty, setIsDirty] = useState(false);

  // 제목/본문 입력 여부 (완료 버튼 스타일용)
  const [hasTitle, setHasTitle] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  // 카테고리
  const [selectedCategory, setSelectedCategory] = useState<Category>('FREE');
  const options: Category[] = ['FREE', 'NOTICE'];

  /**
   * 게시글이 수정 모드여야하고, 현재 uuid와 content를 editor에 반영합니다
   */
  useEffect(() => {
    if (!uuid) return;
    (async () => {
      try {
        const res = await getBoardDetail(uuid);
        setInitialContent(res.content);
        setTitle(res.title);
        setSelectedCategory((res.communityCategory as Category) ?? 'FREE');
        setHasTitle(!!res.title?.trim());
        const hasInitialContent = !!res.content?.trim() && res.content !== '[]';
        setHasContent(hasInitialContent);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [uuid]);

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
   * 게시글 수정 요청 함수입니다. 제목 또는 본문이 없는 경우 동작하지 않습니다.
   */
  const handleUploadPost = async () => {
    if (isSaving || !uuid) return;

    const parsedTitle = title.trim() ?? '';
    const content = JSON.stringify(editorRef.current?.document);
    const contentPreview = getBlockTextEditorContentPreview(content);

    if (!parsedTitle) return alert('제목을 입력하세요');
    if (editorRef.current?.isEmpty) return alert('본문을 입력하세요');

    setIsSaving(true);
    try {
      await updatePost(uuid, parsedTitle, content, contentPreview, true, selectedCategory);
      setIsDirty(false);
      navigate(-1);
    } catch (e) {
      console.error('BoardEdit.tsx', e);
    } finally {
      setIsSaving(false);
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
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
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
            <ChevronDownIcon width={20} height={20} />
          </span>
        </div>

        {/* 에디터 */}
        <div
          className='border-grey-10 mt-4 min-h-120 cursor-text rounded-lg border px-4 py-2'
          onClick={handleFocusEditor}
        >
          <div className='overflow-visible py-2' ref={editorWrapperRef}>
            <BlockTextEditor
              onEditorReady={handleEditorReady}
              domain={DOMAIN_VALUES[0]}
              initialContent={initialContent}
            />
          </div>
        </div>

        {/* 완료 버튼 */}
        <div className='mt-4 mb-10'>
          <button
            className={`text-body05 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg ${hasTitle && hasContent ? 'bg-mju-primary text-white' : 'bg-grey-02 text-grey-40'} disabled:cursor-not-allowed disabled:opacity-70`}
            onClick={handleUploadPost}
            disabled={isSaving}
          >
            {isSaving ? (
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
