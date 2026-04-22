import DOMPurify from 'dompurify';
import { type ClassValue } from 'clsx';

interface HighlightedTextProps {
  children: string;
  className?: ClassValue;
}

/**
 * 검색 결과에서 Highlighted된 텍스트를 반환합니다
 * @children 검색어 텍스트를 입력하세요
 * @returns <em>태그가 하이라이팅 된 <span> 검색어 태그가 반환됩니다
 */
function HighlightedText({ children, className, ...props }: HighlightedTextProps) {
  return (
    <span
      className={`
        [&_em]:font-semibold [&_em]:not-italic [&_em]:bg-blue-05 [&_em]:rounded-md [&_em]:px-0.5
        ${className},
      `}
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(children),
      }}
      {...props}
    />
  );
}

export { HighlightedText };
