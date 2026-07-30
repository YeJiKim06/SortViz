// 기존 변수 및 DOM 선언부에 추가
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = document.getElementById('theme-icon');
const themeText = document.getElementById('theme-text');

// 테마 상태 토글 처리
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    if (currentTheme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        themeIcon.textContent = '☀️';
        themeText.textContent = '라이트 모드';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.textContent = '🌙';
        themeText.textContent = '다크 모드';
    }
}

// 이벤트 리스너 등록에 추가
themeToggleBtn.addEventListener('click', toggleTheme);

const barContainer = document.getElementById('bar-container');
const algorithmSelect = document.getElementById('algorithm-select');
const speedRange = document.getElementById('speed-range');
const generateBtn = document.getElementById('generate-btn');
const startBtn = document.getElementById('start-btn');
const descTitle = document.getElementById('desc-title');
const descContent = document.getElementById('desc-content');
const descComplexity = document.getElementById('desc-complexity');

const customArrayInput = document.getElementById('custom-array-input');
const applyArrayBtn = document.getElementById('apply-array-btn');

// 표 관련 DOM 요소
const stepTableBody = document.getElementById('step-table-body');
const clearTableBtn = document.getElementById('clear-table-btn');

let array = [];
let isSorting = false;
let stepCount = 0;

const algorithmData = {
    bubble: {
        title: "버블 정렬 (Bubble Sort)",
        description: "인접한 두 원소를 비교하여 크기가 순서대로 들어있지 않으면 서로 교환하는 방식입니다.",
        complexity: "O(n²)"
    },
    selection: {
        title: "선택 정렬 (Selection Sort)",
        description: "전체 원소 중에서 최솟값을 찾아 맨 앞에 놓인 값과 교환하는 과정을 반복하는 방식입니다.",
        complexity: "O(n²)"
    },
    insertion: {
        title: "삽입 정렬 (Insertion Sort)",
        description: "두 번째 원소부터 시작하여 앞쪽의 정렬된 부분과 비교해 위치를 찾아 삽입하는 방식입니다.",
        complexity: "O(n²)"
    },
    merge: {
        title: "병합 정렬 (Merge Sort)",
        description: "배열을 절반으로 나누어 각각 정렬한 후 병합하는 분할 정복 알고리즘입니다.",
        complexity: "O(n log n)"
    },
    quick: {
        title: "퀵 정렬 (Quick Sort)",
        description: "피벗(Pivot)을 기준으로 작은 값과 큰 값을 분할하여 정렬하는 알고리즘입니다.",
        complexity: "O(n log n)"
    }
};

const delay = () => {
    const speed = 510 - speedRange.value;
    return new Promise(resolve => setTimeout(resolve, speed));
};

// 표에 새로운 스텝 추가하는 함수
function addStepToTable(actionText, badgeClass) {
    if (stepCount === 0) {
        stepTableBody.innerHTML = ''; // 안내 문구 삭제
    }
    stepCount++;

    const row = document.createElement('tr');
    row.classList.add('new-step');

    const formattedArray = `[ ${array.join(', ')} ]`;

    row.innerHTML = `
        <td>#${stepCount}</td>
        <td><span class="action-badge ${badgeClass}">${actionText}</span></td>
        <td>${formattedArray}</td>
    `;

    stepTableBody.prepend(row); // 최근 스텝이 상단에 올라오도록 추가
}

// 표 초기화
function clearStepTable() {
    if (isSorting) return;
    stepCount = 0;
    stepTableBody.innerHTML = `
        <tr>
            <td colspan="3" class="empty-msg">정렬이 시작되면 이 곳에 단계별 기록이 표시됩니다.</td>
        </tr>
    `;
}

// 막대 그래프 렌더링
function renderBars(targetArray) {
    barContainer.innerHTML = '';
    const maxVal = Math.max(...targetArray, 100);

    targetArray.forEach(value => {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        const heightPercent = (value / maxVal) * 100;
        bar.style.height = `${Math.max(heightPercent, 5)}%`;
        barContainer.appendChild(bar);
    });
}

function generateRandomArray() {
    if (isSorting) return;
    array = [];
    const ARRAY_SIZE = 20; // 표 보기 적합하도록 20개로 조정

    for (let i = 0; i < ARRAY_SIZE; i++) {
        array.push(Math.floor(Math.random() * 90) + 10);
    }
    renderBars(array);
    clearStepTable();
}

function applyCustomArray() {
    if (isSorting) return;

    const inputVal = customArrayInput.value.trim();
    if (!inputVal) return alert("숫자를 입력해 주세요.");

    const parsedArray = inputVal
        .split(/[\s,]+/)
        .map(Number)
        .filter(n => !isNaN(n) && n > 0);

    if (parsedArray.length < 2) return alert("2개 이상의 올바른 숫자를 입력해 주세요.");
    if (parsedArray.length > 30) return alert("표와 시각화를 위해 30개 이하로 입력해 주세요.");

    array = parsedArray;
    renderBars(array);
    clearStepTable();
}

function updateDescription() {
    const selected = algorithmSelect.value;
    const info = algorithmData[selected];
    descTitle.textContent = info.title;
    descContent.textContent = info.description;
    descComplexity.textContent = info.complexity;
}

function setControlsDisabled(disabled) {
    isSorting = disabled;
    generateBtn.disabled = disabled;
    startBtn.disabled = disabled;
    algorithmSelect.disabled = disabled;
    applyArrayBtn.disabled = disabled;
    customArrayInput.disabled = disabled;
    clearTableBtn.disabled = disabled;
}

// 기존 변수 및 DOM 참조는 유지...

// 막대 생성/업데이트 시 숫자 레이블을 함께 다루는 공통 함수
function createBarElement(value, maxVal) {
    const bar = document.createElement('div');
    bar.classList.add('bar');
    
    const heightPercent = (value / maxVal) * 100;
    bar.style.height = `${Math.max(heightPercent, 8)}%`; // 글자 표시를 위해 최소 높이 8%로 상향

    const valueSpan = document.createElement('span');
    valueSpan.classList.add('bar-value');
    valueSpan.textContent = value;
    bar.appendChild(valueSpan);

    return bar;
}

// 특정 막대의 높이와 내부 숫자를 변경하는 헬퍼 함수
function updateBarHeight(bar, value, maxVal) {
    const heightPercent = (value / maxVal) * 100;
    bar.style.height = `${Math.max(heightPercent, 8)}%`;
    
    let valueSpan = bar.querySelector('.bar-value');
    if (!valueSpan) {
        valueSpan = document.createElement('span');
        valueSpan.classList.add('bar-value');
        bar.appendChild(valueSpan);
    }
    valueSpan.textContent = value;
}

// 막대 그래프 렌더링
function renderBars(targetArray) {
    barContainer.innerHTML = '';
    const maxVal = Math.max(...targetArray, 100);

    targetArray.forEach(value => {
        const bar = createBarElement(value, maxVal);
        barContainer.appendChild(bar);
    });
}

/* ==================== 정렬 알고리즘 내 업데이트 방식 ==================== */

// 1. 버블 정렬 중 Swap 부분 예시
async function bubbleSort() {
    const bars = document.getElementsByClassName('bar');
    const n = array.length;
    const maxVal = Math.max(...array, 100);

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            bars[j].classList.add('comparing');
            bars[j + 1].classList.add('comparing');
            await delay();

            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                
                // updateBarHeight 헬퍼 함수 사용
                updateBarHeight(bars[j], array[j], maxVal);
                updateBarHeight(bars[j + 1], array[j + 1], maxVal);

                addStepToTable(`값 교환 (${array[j+1]} ↔ ${array[j]})`, 'swap');
            }

            bars[j].classList.remove('comparing');
            bars[j + 1].classList.remove('comparing');
        }
        bars[n - i - 1].classList.add('sorted');
    }
    bars[0].classList.add('sorted');
}

// 2. 선택 정렬 중 Swap 예시
async function selectionSort() {
    const bars = document.getElementsByClassName('bar');
    const n = array.length;
    const maxVal = Math.max(...array, 100);

    for (let i = 0; i < n; i++) {
        let minIdx = i;
        bars[i].classList.add('selected');

        for (let j = i + 1; j < n; j++) {
            bars[j].classList.add('comparing');
            await delay();

            if (array[j] < array[minIdx]) {
                if (minIdx !== i) bars[minIdx].classList.remove('selected');
                minIdx = j;
                bars[minIdx].classList.add('selected');
            } else {
                bars[j].classList.remove('comparing');
            }
        }

        if (minIdx !== i) {
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
            
            updateBarHeight(bars[i], array[i], maxVal);
            updateBarHeight(bars[minIdx], array[minIdx], maxVal);

            addStepToTable(`최솟값 교환 (${array[i]} 위치 이동)`, 'swap');
        }

        for (let k = i; k < n; k++) bars[k].classList.remove('comparing', 'selected');
        bars[i].classList.add('sorted');
    }
}

// 3. 삽입 정렬 중 위치 변경 예시
async function insertionSort() {
    const bars = document.getElementsByClassName('bar');
    const n = array.length;
    const maxVal = Math.max(...array, 100);
    bars[0].classList.add('sorted');

    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;

        bars[i].classList.add('selected');
        await delay();

        while (j >= 0 && array[j] > key) {
            bars[j].classList.add('comparing');
            array[j + 1] = array[j];
            
            updateBarHeight(bars[j + 1], array[j], maxVal);
            await delay();
            
            bars[j].classList.remove('comparing');
            j--;
        }

        array[j + 1] = key;
        updateBarHeight(bars[j + 1], key, maxVal);
        bars[i].classList.remove('selected');

        addStepToTable(`원소 삽입 (${key})`, 'insert');

        for (let k = 0; k <= i; k++) bars[k].classList.add('sorted');
    }
}

// 4. 병합 정렬 중 갱신 예시
async function merge(start, mid, end) {
    const bars = document.getElementsByClassName('bar');
    const maxVal = Math.max(...array, 100);
    const temp = [];
    let i = start, j = mid + 1;

    while (i <= mid && j <= end) {
        bars[i].classList.add('comparing');
        bars[j].classList.add('comparing');
        await delay();

        if (array[i] <= array[j]) temp.push(array[i++]);
        else temp.push(array[j++]);
    }

    while (i <= mid) temp.push(array[i++]);
    while (j <= end) temp.push(array[j++]);

    for (let k = start; k <= end; k++) {
        array[k] = temp[k - start];
        updateBarHeight(bars[k], array[k], maxVal);
        bars[k].classList.remove('comparing');
        bars[k].classList.add('sorted');
    }

    addStepToTable(`부분 병합 완료 (${start}~${end} 구간)`, 'compare');
}

// 5. 퀵 정렬 중 Swap 예시
async function partition(low, high) {
    const bars = document.getElementsByClassName('bar');
    const maxVal = Math.max(...array, 100);
    const pivot = array[high];
    bars[high].classList.add('selected');

    let i = low - 1;

    for (let j = low; j < high; j++) {
        bars[j].classList.add('comparing');
        await delay();

        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            updateBarHeight(bars[i], array[i], maxVal);
            updateBarHeight(bars[j], array[j], maxVal);
        }
        bars[j].classList.remove('comparing');
    }

    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    updateBarHeight(bars[i + 1], array[i + 1], maxVal);
    updateBarHeight(bars[high], array[high], maxVal);
    
    bars[high].classList.remove('selected');
    bars[i + 1].classList.add('sorted');

    addStepToTable(`피벗(${pivot}) 정렬 완료`, 'swap');

    return i + 1;
}

async function quickSortHelper(low, high) {
    if (low < high) {
        const pivotIdx = await partition(low, high);
        await quickSortHelper(low, pivotIdx - 1);
        await quickSortHelper(pivotIdx + 1, high);
    } else if (low >= 0 && high >= 0 && low < array.length) {
        const bars = document.getElementsByClassName('bar');
        bars[low].classList.add('sorted');
    }
}

async function quickSort() {
    await quickSortHelper(0, array.length - 1);
}

/* ============================================================ */

async function startSort() {
    setControlsDisabled(true);
    clearStepTable();

    addStepToTable("정렬 시작 (초기 상태)", "compare");

    const selectedAlgorithm = algorithmSelect.value;
    if (selectedAlgorithm === 'bubble') await bubbleSort();
    else if (selectedAlgorithm === 'selection') await selectionSort();
    else if (selectedAlgorithm === 'insertion') await insertionSort();
    else if (selectedAlgorithm === 'merge') await mergeSort();
    else if (selectedAlgorithm === 'quick') await quickSort();

    addStepToTable("정렬 완전 완료 🎉", "complete");
    setControlsDisabled(false);
}

// 이벤트 리스너
generateBtn.addEventListener('click', generateRandomArray);
startBtn.addEventListener('click', startSort);
algorithmSelect.addEventListener('change', updateDescription);
applyArrayBtn.addEventListener('click', applyCustomArray);
clearTableBtn.addEventListener('click', clearStepTable);

// 초기화
generateRandomArray();
updateDescription();
