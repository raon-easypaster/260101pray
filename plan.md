

---

## 1. 기도제목 카드 웹 코드 (HTML/JS)

이 코드는 사용자가 내용을 입력하고 '이미지로 저장' 버튼을 누르면, 브라우저에서 즉시 이미지 파일로 내려받을 수 있게 설계되었습니다.

> **참고:** 이미지 저장 기능을 위해 `html2canvas` 라이브러리를 사용합니다.

HTML

```
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>2026 새해 기도제목 카드</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <style>
        body { font-family: 'Arial', sans-serif; background-color: #f4f4f9; display: flex; flex-direction: column; align-items: center; padding: 20px; }
        #prayer-card { width: 400px; padding: 30px; background: white; border-radius: 15px; box-shadow: 0 10px 20px rgba(0,0,0,0.1); border: 2px solid #e0e0e0; }
        h2 { text-align: center; color: #333; margin-bottom: 20px; }
        .section { margin-bottom: 15px; }
        label { font-weight: bold; display: block; margin-bottom: 5px; color: #555; }
        textarea { width: 100%; border: 1px solid #ddd; border-radius: 5px; padding: 8px; resize: none; font-size: 14px; box-sizing: border-box; }
        button { margin-top: 20px; padding: 10px 20px; background-color: #6c5ce7; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }
        button:hover { background-color: #5b4bc4; }
    </style>
</head>
<body>

    <div id="prayer-card">
        <h2>🙏 2024 기도제목 카드</h2>
        
        <div class="section">
            <label>1. 개인의 기도제목</label>
            <textarea id="q1" rows="2" placeholder="내용을 입력하세요..."></textarea>
        </div>
        <div class="section">
            <label>2. 성장을 위한 기도제목</label>
            <textarea id="q2" rows="2"></textarea>
        </div>
        <div class="section">
            <label>3. 관계를 위한 기도제목</label>
            <textarea id="q3" rows="2"></textarea>
        </div>
        <div class="section">
            <label>4. 세상을 위한 기도제목</label>
            <textarea id="q4" rows="2"></textarea>
        </div>
        <div class="section">
            <label>5. 특별한 기도제목</label>
            <textarea id="q5" rows="2"></textarea>
        </div>
    </div>

    <button onclick="saveImage()">이미지로 저장하기</button>

    <script>
        function saveImage() {
            // 이미지 저장 전 구글 설문지로 데이터 전송 (아래 가이드 참고)
            sendToGoogleForm();

            // 카드 영역을 이미지로 변환
            html2canvas(document.querySelector("#prayer-card")).then(canvas => {
                let link = document.createElement('a');
                link.download = '새해기도제목.png';
                link.href = canvas.toDataURL();
                link.click();
            });
        }

        function sendToGoogleForm() {
            // 구글 설문지 연동 로직이 들어갈 자리
            console.log("데이터 전송 시도...");
        }
    </script>
</body>
</html>
```

---

## 2. 구글 설문지(Google Forms)와 연결하는 방법

웹 페이지에서 입력한 내용을 구글 설문지로 바로 보내려면 **'사전 채워진 링크(Pre-filled link)'**의 원리를 이용해야 합니다.

### 단계별 설정 방법

1. **구글 설문지 만들기:**
    
    - 웹 항목과 동일하게 5개의 질문(단답형 또는 장문형)을 만듭니다.
        
2. **입력 ID(Entry ID) 확인하기:**
    
    - 설문지 우측 상단 '더보기(⋮)' -> **'미리 채워진 링크 가져오기'** 클릭.
        
    - 각 항목에 임의의 값을 입력하고 하단의 '링크 가져오기' 클릭.
        
    - 복사된 링크 주소를 메모장에 붙여넣으면 `entry.12345678=값` 형태의 ID들을 확인할 수 있습니다.
        
3. **자바스크립트 연동:**
    
    - 위 코드의 `sendToGoogleForm()` 함수 안에 아래와 같은 방식의 코드를 추가합니다.
        

JavaScript

```
function sendToGoogleForm() {
    const q1 = document.getElementById('q1').value;
    const q2 = document.getElementById('q2').value;
    // ... 나머지 값들도 가져오기

    const formURL = "https://docs.google.com/forms/d/e/[설문지ID]/formResponse";
    const formData = new FormData();
    
    // 확인한 entry ID를 입력하세요
    formData.append("entry.111111", q1); 
    formData.append("entry.222222", q2);
    // ...

    fetch(formURL, {
        method: "POST",
        mode: "no-cors",
        body: formData
    }).then(() => {
        alert("기도제목이 서버에 기록되었습니다!");
    });
}
```

---

## 💡 팁: 더 예쁘게 만들려면?

- **배경 이미지:** `#prayer-card` 스타일에 `background-image`를 넣어 은은한 종이 질감이나 신년 이미지를 추가해 보세요.
    
- **폰트:** 구글 폰트(Google Fonts)에서 '나눔명조'나 '나눔펜글씨'를 적용하면 훨씬 따뜻한 느낌이 납니다.
    

혹시 구글 설문지의 **`entry ID`를 찾는 과정**이 구체적으로 더 궁금하신가요? 아니면 **디자인을 더 화려하게** 바꾸고 싶으신가요? 말씀해 주시면 추가로 도와드릴게요!