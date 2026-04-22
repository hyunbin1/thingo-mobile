const fs = require("fs");

const msg = fs
  .readFileSync(process.env.HUSKY_GIT_PARAMS || ".git/COMMIT_EDITMSG", "utf-8")
  .trim();

const commitRegex = /^<(Feat|Fix|Docs|Style|Refactor|Test|Chore)> .+/;

if (!commitRegex.test(msg)) {
  console.error(
    "\nerror: 커밋 메시지 형식이 올바르지 않습니다.\n" +
      "형식 예시: <Feat> 로그인 기능 추가\n" +
      "허용 타입: Feat, Fix, Docs, Style, Refactor, Test, Chore\n",
  );
  process.exit(1);
}
