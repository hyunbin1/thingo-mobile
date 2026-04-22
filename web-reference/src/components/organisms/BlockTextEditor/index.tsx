import { filterSuggestionItems, type BlockNoteEditor } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/mantine';
import {
  getDefaultReactSlashMenuItems,
  SuggestionMenuController,
  useCreateBlockNote,
} from '@blocknote/react';
import { useEffect } from 'react';
import { ko } from '@blocknote/core/locales';
import { DOMAIN_VALUES, uploadS3, type UploadDomain } from '../../../api/s3upload';
import { compressImage } from '../../../utils/imageCompression';

interface BlockTextEditor {
  /**
   * editor 인스턴스를 참조할 함수를 입력하세요. onEditorReady를 아래와 같이 useCallback으로 memoization해야 성능 저하가 발생하지 않습니다. 읽기 전용 모드인 경우 입력하지 마세요.
   *
   * ```tsx
   * const editorRef = useRef<BlockNoteEditor | null>(null);
   *
   * const handleEditorReady = useCallback((editor: BlockNoteEditor) => {
   *   editorRef.current = editor;
   * }, []);
   *
   * return <BlockTextEditor onEditorReady={handleEditorReady} />
   * ```
   *
   * editor에 focus 해야 되는 경우 다음과 같이 입력하십시오.
   *
   * ```tsx
   * editorRef.current?.focus();
   * ```
   *
   * editor의 값을 불러와야 하는 경우 다음과 같이 입력하세요.
   *
   * ```tsx
   * // JSON
   * JSON.stringify(editorRef.current?.document);
   *
   * // HTML
   * editorRef.current?.blocksToFullHTML(editorRef.current.document);
   * editorRef.current?.blocksToHTMLLossy(editorRef.current.document);
   * ```
   */
  onEditorReady?: (editor: BlockNoteEditor) => void;

  /**
   * 읽기 전용 모드를 활성화합니다. `true`일 경우 사용자가 게시글을 수정할 수 없습니다. 텍스트 에디터로 사용할 경우 값을 넣지 마세요.
   */
  readOnly?: boolean;

  /**
   * 게시글 수정 모드 또는 읽기 모드인 경우 initialContent를 입력하세요. initialContent는 `json`형식이고 `string`타입이어야합니다.
   */
  initialContent?: string;

  /**
   * 게시글의 도메인을 선택합니다. 커뮤니티 게이글, 학과 일정 게시글, 학과 공지 게시글 중 하나를 선택합니다. `COMMUNITY_POST` `enum`을 이용하세요. 읽기 전용 모드인 경우 입력하지 마세요.
   */
  domain?: UploadDomain;
}

/**
 * BlockTextEditor
 *
 * 오픈 소스 BlockNote 기반 텍스트 에디터 입니다.
 *
 * @param onEditorReady? editor 인스턴스를 참조할 함수를 입력하세요.
 * @param readOnly? 읽기 전용 모드 여부를 입력하세요.
 * @param initialContent? 게시글 수정 모드 혹은 읽기 모드에서 사용할 컨텐츠를 입력하세요.
 * @returns JSX.Element
 */
export default function BlockTextEditor({
  onEditorReady,
  readOnly = false,
  initialContent,
  domain = DOMAIN_VALUES[0],
}: BlockTextEditor) {
  /**
   * 파일 업로드 함수입니다. 업로드할 수 있는 파일의 최대 용량은 `1MB` 입니다.
   * 사진 파일을 받는 경우, 사진 파일의 용량이 1mb보다 크면 사진 압축을 진행합니다. 사진 압축 결과물은 image/jpeg 형식이고 파일 크기가 1mb 이하임을 보장합니다.
   *
   * @param file 업로드할 파일을 선택하세요.
   * @returns 업로드된 파일의 s3 주소가 `return`됩니다.
   */
  async function uploadFile(file: File) {
    const compressedFile = await compressImage(file);
    return await uploadS3(compressedFile, domain);
  }

  /**
   * 에디터 인스턴스를 생성합니다.
   */
  const editor = useCreateBlockNote({
    dictionary: {
      ...ko,
      placeholders: {
        ...ko.placeholders,
        // default: '"/" 기능을 사용해 보세요',
      },
    },
    uploadFile,
  });

  /**
   * initialContent가 있으면 에디터에 삽입합니다.
   */
  useEffect(() => {
    if (initialContent) {
      try {
        const parsed = JSON.parse(initialContent);
        if (Array.isArray(parsed)) {
          editor.replaceBlocks(editor.document, parsed);
        }
      } catch (e) {
        console.error('BlockTextEditor.tsx', e);
      }
    }
  }, [initialContent, editor]);

  /**
   * 생성된 에디터 인스턴스를 부모로 전달합니다. 읽기 전용 모드에서는 동작하지 않습니다
   */
  useEffect(() => {
    if (onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  /**
   * 에디터의 `/` 메뉴를 커스터마이징합니다
   */
  const hiddenItems = ['비디오', '오디오', '파일', 'Video', 'Audio', 'File'];

  return (
    <BlockNoteView
      editor={editor}
      editable={!readOnly}
      theme='light'
      slashMenu={false}
      className={readOnly ? '[&_.bn-editor]:!p-0' : ''} // 좌우 padding 제거
    >
      <SuggestionMenuController
        triggerCharacter='/'
        getItems={async (query) => {
          const defaultItems = getDefaultReactSlashMenuItems(editor);
          const filteredItems = defaultItems.filter((item) => !hiddenItems.includes(item.title));
          return filterSuggestionItems(filteredItems, query);
        }}
      />
    </BlockNoteView>
  );
}
