'use client'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-5 p-24">
      <div className="w-full text-center">
        <h2 className="text-3xl font-bold">
          자바스크립트를 제대로 배워봅시다.
        </h2>
        <p>
          처음부터 너무 딥하게 배우면 평생 공부만 해야하고, 너무 대충 배우면
          처음부터 다시 공부해야 합니다.
        </p>
      </div>
      <div className="w-full text-center">
        <h2 className="text-3xl font-bold">
          난이도별로 나누어 체계적으로 학습합니다.
        </h2>
        <p>
          프로그래밍 언어는 단계적으로 배워야 합니다. 사용하지 않을 문법을
          초장에 공부하는 것은 의미가 없습니다.
        </p>
        <p>왜 배우는지 알고 배울때 비로소 의미가 생깁니다.</p>
      </div>
      <div className="w-full text-center">
        <h2 className="text-3xl font-bold">
          당신이 배운 것을 글로 풀어 쓸 수 있나요?
        </h2>
        <p>아는 것이란 곧 나만의 글로 풀어낼 수 있다는 것입니다.</p>
        <p>당신이 이해한 내용 을 글로 적어 우리에게 공유해주세요.</p>
      </div>
      <div className="w-full text-center">
        <p>그럼 함께 공부해볼까요?</p>
        <button>학습하러 가기!</button>
      </div>
    </main>
  )
}
