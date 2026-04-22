import { Agentation } from 'agentation';

export const AgentationTool = () => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Agentation
      copyToClipboard={true}
      onCopy={(markdown) => {
        console.log('📋 Agentation 주석이 복사되었습니다');
        console.log(markdown);
      }}
      onAnnotationAdd={(annotation) => {
        console.log(' 주석 추가:', {
          element: annotation.element,
          comment: annotation.comment,
          cssClasses: annotation.cssClasses,
        });
      }}
      onAnnotationDelete={(annotation) => {
        console.log(' 주석 삭제:', annotation.element);
      }}
      onAnnotationUpdate={(annotation) => {
        console.log(' 주석 수정:', annotation.element);
      }}
      onAnnotationsClear={(annotations) => {
        console.log(' 모든 주석 클리어:', annotations.length, '개');
      }}
    />
  );
};
