const ARRAY_SIZE = 30;
let array = [];
let isSorting = false;

// DOM 요소 참조
const barContainer = document.getElementById('bar-container');
const algorithmSelect = document.getElementById('algorithm-select');
const speedRange = document.getElementById('speed-range');
const generateBtn = document.getElementById('generate-btn');
const startBtn = document.getElementById('start-btn');
const descTitle = document.getElementById('desc-title');
const descContent = document.getElementById('desc-content');
const descComplexity = document.getElementById('desc-complexity');

// 알고리즘별 설명 데이터 (병합, 퀵 정렬 추가)
const algorithmData = {
    bubble: {
        title: "버블 정렬 (Bubble Sort)",
        description: "인접한 두 원소를 비교하여 크기가 순서대로 들어있지 않으면 서로 교환하는 방식입니다. 한 회전이 끝나면 가장 큰 원소가 마지막 위치로 이동합니다.",
        complexity: "O(n²)"
    },
    selection: {
        title: "선택 정렬 (Selection Sort)",
        description: "전체 원소 중에서 최솟값을 찾아 맨 앞에 놓인 값과 교환하는 과정을 반복하는 방식입니다.",
        complexity: "O(n²)"
    },
    insertion: {
        title: "삽입 정렬 (Insertion Sort)",
        description: "두 번째 원소부터 시작하여 차례대로 앞쪽의 이미 정렬된 부분과 비교하여 자신의 위치를 찾아 삽입하는 방식입니다.",
        complexity: "O(n²)"
    },
    merge: {
        title: "병합 정렬 (Merge Sort)",
        description: "배열을 절반으로 나누어 각각 정렬한 후, 다시 병합하면서 전체를 정렬하는 분할 정복 알고리즘입니다.",
        complexity: "O(n log n)"
    },
    quick: {
        title: "퀵 정렬 (Quick Sort)",
        description: "피벗(Pivot)을 선정하여 피벗보다 작은 값과 큰 값으로 분할하며 정렬을 수행하는 효율적인 분할 정복 알고리즘입니다.",
        complexity: "O(n log n)"
    }
};

// 딜레이 함수
const delay = () => {
    const speed = 510 - speedRange.value;
    return new Promise(resolve => setTimeout(resolve, speed));
};

// 랜덤 배열 생성 및 화면 렌더링
function generateRandomArray() {
    if (isSorting) return;
    array = [];
    barContainer.innerHTML = '';

    for (let i = 0; i < ARRAY_SIZE; i++) {
        const value = Math.floor(Math.random() * 90) + 10;
        array.push(value);

        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${value}%`;
        barContainer.appendChild(bar);
    }
}

// 알고리즘 설명 업데이트
function updateDescription() {
    const selected = algorithmSelect.value;
    const info = algorithmData[selected];
    descTitle.textContent = info.title;
    descContent.textContent = info.description;
    descComplexity.textContent = info.complexity;
}

// UI 상태 토글
function setControlsDisabled(disabled) {
    isSorting = disabled;
    generateBtn.disabled = disabled;
    startBtn.disabled = disabled;
    algorithmSelect.disabled = disabled;
}

/* ==================== 정렬 알고리즘 로직 ==================== */

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
                bars[j].style.height = `${array[j]}%`;
                bars[j + 1].style.height = `${array[j + 1]}%`;
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
            bars[i].style.height = `${array[i]}%`;
            bars[minIdx].style.height = `${array[minIdx]}%`;
        }

        for (let k = i; k < n; k++) {
            bars[k].classList.remove('comparing', 'selected');
        }
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
            bars[j + 1].style.height = `${array[j]}%`;
            await delay();

            bars[j].classList.remove('comparing');
            j--;
        }

        array[j + 1] = key;
        bars[j + 1].style.height = `${key}%`;
        bars[i].classList.remove('selected');

        for (let k = 0; k <= i; k++) {
            bars[k].classList.add('sorted');
        }
    }
}

// 4. 병합 정렬 (Merge Sort)
async function merge(start, mid, end) {
    const bars = document.getElementsByClassName('bar');
    const temp = [];
    let i = start;
    let j = mid + 1;

    while (i <= mid && j <= end) {
        bars[i].classList.add('comparing');
        bars[j].classList.add('comparing');
        await delay();

        if (array[i] <= array[j]) {
            temp.push(array[i++]);
        } else {
            temp.push(array[j++]);
        }
    }

    while (i <= mid) temp.push(array[i++]);
    while (j <= end) temp.push(array[j++]);

    for (let k = start; k <= end; k++) {
        array[k] = temp[k - start];
        bars[k].style.height = `${array[k]}%`;
        bars[k].classList.remove('comparing');
        bars[k].classList.add('sorted');
        await delay();
    }
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

// 5. 퀵 정렬 (Quick Sort)
async function partition(low, high) {
    const bars = document.getElementsByClassName('bar');
    const pivot = array[high];
    bars[high].classList.add('selected'); // 피벗 표시

    let i = low - 1;

    for (let j = low; j < high; j++) {
        bars[j].classList.add('comparing');
        await delay();

        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            bars[i].style.height = `${array[i]}%`;
            bars[j].style.height = `${array[j]}%`;
        }
        bars[j].classList.remove('comparing');
    }

    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    bars[i + 1].style.height = `${array[i + 1]}%`;
    bars[high].style.height = `${array[high]}%`;
    bars[high].classList.remove('selected');
    bars[i + 1].classList.add('sorted');

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

// 정렬 시작 핸들러
async function startSort() {
    setControlsDisabled(true);

    const selectedAlgorithm = algorithmSelect.value;
    if (selectedAlgorithm === 'bubble') await bubbleSort();
    else if (selectedAlgorithm === 'selection') await selectionSort();
    else if (selectedAlgorithm === 'insertion') await insertionSort();
    else if (selectedAlgorithm === 'merge') await mergeSort();
    else if (selectedAlgorithm === 'quick') await quickSort();

    setControlsDisabled(false);
}

// 이벤트 리스너 등록
generateBtn.addEventListener('click', generateRandomArray);
startBtn.addEventListener('click', startSort);
algorithmSelect.addEventListener('change', updateDescription);

// 초기화
generateRandomArray();
updateDescription();
