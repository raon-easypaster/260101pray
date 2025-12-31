// Auto-resize textarea
const textareas = document.querySelectorAll('textarea');
textareas.forEach(textarea => {
    textarea.addEventListener('input', autoResize, false);
});

function autoResize() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
}

function saveImage() {
    const card = document.querySelector("#prayer-card");
    const filename = `2026_Prayer_Card_${getCurrentDateString()}.png`;

    const btn = document.getElementById('save-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '저장 중...';
    btn.disabled = true;

    // 1. 캡쳐 전처리: textarea를 div로 변환 (글자 잘림 방지)
    const textareas = card.querySelectorAll('textarea');
    const originalStyles = []; // 복구용 스타일 저장

    textareas.forEach((textarea, index) => {
        const div = document.createElement('div');
        div.className = textarea.className;
        div.style.cssText = window.getComputedStyle(textarea).cssText;

        // 중요: div로 변환 시 스타일 강제 조정
        div.style.height = 'auto';
        div.style.minHeight = textarea.style.minHeight;
        div.style.whiteSpace = 'pre-wrap'; // 줄바꿈 유지
        div.style.overflow = 'visible';
        div.innerText = textarea.value; // 내용 복사

        // 텍스트가 비어있으면 공백 유지 (레이아웃 틀어짐 방지)
        if (!div.innerText.trim()) {
            div.innerHTML = '&nbsp;';
            div.style.minHeight = '80px'; // 기본 높이 유지
        }

        // 기존 textarea 숨기고 div 삽입
        textarea.style.display = 'none';
        textarea.parentNode.insertBefore(div, textarea);

        // 나중에 복구하기 위해 식별 클래스 추가
        div.classList.add('temp-capture-div');
    });

    // 2. html2canvas 실행
    html2canvas(card, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true,
        allowTaint: true,
        onclone: (clonedDoc) => {
            // 복제된 문서에서 추가적인 스타일 조정이 필요하면 여기서 수행
        }
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL("image/png");
        link.click();

        cleanup();
    }).catch(err => {
        console.error("Image save failed:", err);
        alert("이미지 저장에 실패했습니다.");
        cleanup();
    });

    // 3. 복구 함수
    function cleanup() {
        const tempDivs = card.querySelectorAll('.temp-capture-div');
        tempDivs.forEach(div => div.remove());

        textareas.forEach(textarea => {
            textarea.style.display = 'block';
        });

        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function getCurrentDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

// ---------------------------------------------------------
// AppSheet / Google Sheets Submission Logic
// ---------------------------------------------------------
async function submitToEmail() {
    const username = document.getElementById('username').value.trim();
    if (!username) {
        alert("작성자 성함을 입력해주세요.");
        document.getElementById('username').focus();
        return;
    }

    const targetEmail = "galeb76@naver.com";

    const confirmMsg = `${username}님의 기도제목을 전송하시겠습니까?\n(새 창이 열리면 전송 확인을 진행해주세요)`;
    if (!confirm(confirmMsg)) return;

    // 동적으로 폼 생성
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `https://formsubmit.co/${targetEmail}`;
    form.target = '_blank'; // 새 탭에서 열기 (보안 및 캡차 해결용)

    // 데이터 필드 설정
    const fields = {
        '_subject': `[2026 기도카드] ${username}님의 기도제목`,
        '_template': 'table',
        '_captcha': 'false', // 가능한 경우 캡차 생략 (첫 전송시는 무시될 수 있음)
        '성함': username,
        '나를위한기도': document.getElementById('q1').value,
        '성장을위한기도': document.getElementById('q2').value,
        '관계를위한기도': document.getElementById('q3').value,
        '세상을위한기도': document.getElementById('q4').value,
        '특별한기도제목': document.getElementById('q5').value
    };

    // 폼에 입력값 추가
    for (const key in fields) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = fields[key];
        form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}
