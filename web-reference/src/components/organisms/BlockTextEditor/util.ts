type BlockNoteContentItem = { type?: string; text?: string; styles?: Record<string, unknown> };
type BlockNoteBlock = { content?: BlockNoteContentItem[]; children?: BlockNoteBlock[] };

/**
 * BlockNote JSON이면 평문으로 변환, 아니면 그대로 반환합니다.
 * 검색 API의 highlightedContent(평문)나 게시판 API의 BlockNote JSON 모두 안전하게 표시할 때 사용하세요.
 */
export function blockNoteContentToPreview(content: string, maxLength = 120): string {
  if (!content || typeof content !== 'string') return '';

  try {
    const parsed = JSON.parse(content) as unknown;
    if (!Array.isArray(parsed)) return content;

    const parts: string[] = [];
    for (const block of parsed as BlockNoteBlock[]) {
      const line = block.content
        ?.map((c) => c.text ?? '')
        .join('')
        .trim();
      if (line) parts.push(line);
      if (block.children?.length) {
        parts.push(
          block.children
            .flatMap((b) => b.content?.map((c) => c.text ?? '') ?? [])
            .join('')
            .trim(),
        );
      }
    }
    const text = parts.join(' ').trim();
    if (!text) return content;
    return text.length <= maxLength ? text : `${text.slice(0, maxLength)}…`;
  } catch {
    return content;
  }
}

/**
 * 게시글 본문의 첫 번째 줄을 텍스트 형식으로 반환합니다.
 *
 * @param {string} content - 컨텐츠 본문 전체를 `string` 타입으로 전달하세요.
 * @returns {string} - 컨텐츠의 첫 번째 줄을 `string` 타입으로 반환합니다.
 */
export function getBlockTextEditorContentPreview(content: string) {
  try {
    const blocks = JSON.parse(content) as BlockNoteBlock[];

    if (!blocks || !Array.isArray(blocks)) return '';

    for (let i = 0; i < blocks.length; i++) {
      const line = blocks[i].content
        ?.map((c: BlockNoteContentItem) => c.text ?? '')
        .join('')
        .trim();
      if (line) return line;
    }
  } catch {
    // JSON이 아니면(검색 결과 평문 등) 그대로 반환
    return content;
  }
  return '미리보기가 없습니다';
}
