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

/* ==================== 정렬 알고리즘 ==================== */

// 1. 버블 정렬
async function bubbleSort() {
    const bars = document.getElementsByClassName('bar');
    const n = array.length;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            bars[j].classList.add('comparing');
            bars[j + 1].classList.add('comparing');
            await delay();

            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                bars[j].style.height = `${(array[j] / Math.max(...array, 100)) * 100}%`;
                bars[j + 1].style.height = `${(array[j + 1] / Math.max(...array, 100)) * 100}%`;

                addStepToTable(`값 교환 (${array[j+1]} ↔ ${array[j]})`, 'swap');
            }

            bars[j].classList.remove('comparing');
            bars[j + 1].classList.remove('comparing');
        }
        bars[n - i - 1].classList.add('sorted');
    }
    bars[0].classList.add('sorted');
}

// 2. 선택 정렬
async function selectionSort() {
    const bars = document.getElementsByClassName('bar');
    const n = array.length;

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
            bars[i].style.height = `${(array[i] / Math.max(...array, 100)) * 100}%`;
            bars[minIdx].style.height = `${(array[minIdx] / Math.max(...array, 100)) * 100}%`;

            addStepToTable(`최솟값 교환 (${array[i]} 위치 이동)`, 'swap');
        }

        for (let k = i; k < n; k++) bars[k].classList.remove('comparing', 'selected');
        bars[i].classList.add('sorted');
    }
}

// 3. 삽입 정렬
async function insertionSort() {
    const bars = document.getElementsByClassName('bar');
    const n = array.length;
    bars[0].classList.add('sorted');

    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;

        bars[i].classList.add('selected');
        await delay();

        while (j >= 0 && array[j] > key) {
            bars[j].classList.add('comparing');
            array[j + 1] = array[j];
            bars[j + 1].style.height = `${(array[j] / Math.max(...array, 100)) * 100}%`;
            await delay();
            bars[j].classList.remove('comparing');
            j--;
        }

        array[j + 1] = key;
        bars[j + 1].style.height = `${(key / Math.max(...array, 100)) * 100}%`;
        bars[i].classList.remove('selected');

        addStepToTable(`원소 삽입 (${key})`, 'insert');

        for (let k = 0; k <= i; k++) bars[k].classList.add('sorted');
    }
}

// 4. 병합 정렬
async function merge(start, mid, end) {
    const bars = document.getElementsByClassName('bar');
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
        bars[k].style.height = `${(array[k] / Math.max(...array, 100)) * 100}%`;
        bars[k].classList.remove('comparing');
        bars[k].classList.add('sorted');
    }

    addStepToTable(`부분 병합 완료 (${start}~${end} 구간)`, 'compare');
}

async function mergeSortHelper(start, end) {
    if (start >= end) return;
    const mid = Math.floor((start + end) / 2);
    await mergeSortHelper(start, mid);
    await mergeSortHelper(mid + 1, end);
    await merge(start, mid, end);
}

async function mergeSort() {
    await mergeSortHelper(0, array.length - 1);
}

// 5. 퀵 정렬
async function partition(low, high) {
    const bars = document.getElementsByClassName('bar');
    const pivot = array[high];
    bars[high].classList.add('selected');

    let i = low - 1;

    for (let j = low; j < high; j++) {
        bars[j].classList.add('comparing');
        await delay();

        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            bars[i].style.height = `${(array[i] / Math.max(...array, 100)) * 100}%`;
            bars[j].style.height = `${(array[j] / Math.max(...array, 100)) * 100}%`;
        }
        bars[j].classList.remove('comparing');
    }

    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    bars[i + 1].style.height = `${(array[i + 1] / Math.max(...array, 100)) * 100}%`;
    bars[high].style.height = `${(array[high] / Math.max(...array, 100)) * 100}%`;
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
