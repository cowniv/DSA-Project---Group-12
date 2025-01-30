import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { div, s } from 'framer-motion/client';
import CustomButton from '../components/CustomButton';
import NavButtons from '../components/NavButtons';

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);
  const [currentAlgorithm, setCurrentAlgorithm] = useState('');
  const [comparing, setComparing] = useState([]);
  const [sorting, setSorting] = useState(false);
  const [arrayLength, setArrayLength] = useState(8);
  const [animationSpeed, setAnimationSpeed] = useState(300);
  const [currentMin, setCurrentMin] = useState(null);
  const [mergingGroups, setMergingGroups] = useState([]);
  const [timeoutId, setTimeoutId] = useState(null);  // Store the timeout ID
  const [shouldSort, setShouldSort] = useState(true);

  const swapSound = new Audio('/audio/swap.mp3')

  const generateArray = (length = arrayLength) => {
    const newArray = Array.from({ length }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
  };

  const handleArrayLengthChange = (e) => {
    const newLength = parseInt(e.target.value);
    setArrayLength(newLength);
    generateArray(newLength);
  };

  const handleAnimationSpeedChange = (e) => {
    const newSpeed = parseInt(e.target.value);
    setAnimationSpeed(newSpeed);
  };

  const delay = (ms) => {
    return new Promise(resolve => {
      const id = setTimeout(() => resolve(), ms);
      setTimeoutId(id);  // Store the timeout ID
    });
  };

  const bubbleSort = async () => {
    setSorting(true);
    setCurrentAlgorithm('Bubble Sort');
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      if (!shouldSort) {
        clearTimeout(timeoutId);  // Cancel any ongoing timeout
        return;
      }
      for (let j = 0; j < n - i - 1; j++) {
        if (!shouldSort) {
          clearTimeout(timeoutId);  // Cancel any ongoing timeout
          return;
        }
        setComparing([j, j + 1]);
        await delay(animationSpeed);

        if (arr[j] > arr[j + 1]) {
          swapSound.play();

          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
        }
      }
    }
    setComparing([]);
    setSorting(false);
    setCurrentAlgorithm('');
    setShouldSort(true);
  };

  useEffect(() => {
    const audio = new Audio('/audio/sorting.mp3');
    audio.volume = 0.3
    audio.loop = true; 
    audio.play();

    return () => {
      audio.pause();
    };
  }, []);

  const selectionSort = async () => {
    setSorting(true);
    setCurrentAlgorithm('Selection Sort');
    const arr = [...array];
    const n = arr.length;
  
    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      setCurrentMin(minIndex);
  
      for (let j = i + 1; j < n; j++) {
        setComparing([minIndex, j]);
        await delay(animationSpeed);
  
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      }
  
      if (minIndex !== i) {
        // Perform the swap
        const tempArr = [...arr];
        tempArr[i] = arr[minIndex];
        tempArr[minIndex] = arr[i];
        setArray(tempArr);
  
        // Play the swap sound when the swap occurs
        swapSound.play();
  
        await delay(animationSpeed);
  
        // Update the array after the swap
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        setArray([...arr]);
      }
  
      setCurrentMin(null);
    }
  
    setComparing([]);
    setSorting(false);
  };

  const insertionSort = async () => {
    restartGame()
    setSorting(true);
    setCurrentAlgorithm('Insertion Sort');
    const arr = [...array];
    const n = arr.length;
  
    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;
      let insertPosition = j + 1;
  
      while (j >= 0 && arr[j] > key) {
        setComparing([j, j + 1]);
        await delay(animationSpeed);
  
        // Swap elements
        arr[j + 1] = arr[j];
  
        // Play the swap sound
        swapSound.play();
  
        insertPosition = j;
        j--;
  
        const tempArr = [...arr];
        tempArr[insertPosition] = key;
        setArray(tempArr);
      }
  
      arr[insertPosition] = key;
      setArray([...arr]);
      await delay(animationSpeed);
    }
  
    setComparing([]);
    setSorting(false);
  };
  

  const mergeSort = async () => {
    setSorting(true);
    setCurrentAlgorithm('Merge Sort');
    const arr = [...array];
  
    const merge = async (start, mid, end) => {
      const leftArray = arr.slice(start, mid + 1);
      const rightArray = arr.slice(mid + 1, end + 1);
      
      setMergingGroups([
        { start, end: mid },
        { start: mid + 1, end }
      ]);
      await delay(animationSpeed);
  
      let i = 0, j = 0, k = start;
      
      while (i < leftArray.length && j < rightArray.length) {
        setComparing([start + i, mid + 1 + j]);
        await delay(animationSpeed);
  
        if (leftArray[i] <= rightArray[j]) {
          arr[k] = leftArray[i];
          // Play the swap sound after moving element from leftArray
          swapSound.play();
          i++;
        } else {
          arr[k] = rightArray[j];
          // Play the swap sound after moving element from rightArray
          swapSound.play();
          j++;
        }
        setArray([...arr]);
        k++;
      }
  
      while (i < leftArray.length) {
        arr[k] = leftArray[i];
        // Play the swap sound after moving element from leftArray
        swapSound.play();
        setArray([...arr]);
        i++;
        k++;
        await delay(animationSpeed);
      }
  
      while (j < rightArray.length) {
        arr[k] = rightArray[j];
        // Play the swap sound after moving element from rightArray
        swapSound.play();
        setArray([...arr]);
        j++;
        k++;
        await delay(animationSpeed);
      }
    };
  
    const mergeSortRecursive = async (start, end) => {
      if (start >= end) return;
  
      const mid = Math.floor((start + end) / 2);
      await mergeSortRecursive(start, mid);
      await mergeSortRecursive(mid + 1, end);
      await merge(start, mid, end);
    };
  
    await mergeSortRecursive(0, arr.length - 1);
    setMergingGroups([]);
    setComparing([]);
    setSorting(false);
  };
  

  const quickSort = async () => {
    setSorting(true);
    setCurrentAlgorithm('Quick Sort');
    const arr = [...array];
  
    const partition = async (arr, low, high) => {
      let pivot = arr[high];
      let i = low - 1;
  
      for (let j = low; j < high; j++) {
        setComparing([i + 1, j]);
        await delay(animationSpeed);
  
        if (arr[j] < pivot) {
          i++;
          // Swap the elements
          [arr[i], arr[j]] = [arr[j], arr[i]];
          // Play the swap sound after swapping
          swapSound.play();
          setArray([...arr]);
        }
      }
  
      // Swap pivot into the correct position
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      // Play the swap sound for the pivot swap
      swapSound.play();
      setArray([...arr]);
      return i + 1;
    };
  
    const quickSortRecursive = async (arr, low, high) => {
      if (low < high) {
        let pivotIndex = await partition(arr, low, high);
        await quickSortRecursive(arr, low, pivotIndex - 1);
        await quickSortRecursive(arr, pivotIndex + 1, high);
      }
      return arr;
    };
  
    await quickSortRecursive(arr, 0, arr.length - 1);
    setComparing([]);
    setSorting(false);
  };
  

  const heapSort = async () => {
    setSorting(true);
    setCurrentAlgorithm('Heap Sort');
    const arr = [...array];
  
    const heapify = async (arr, n, i) => {
      let largest = i;
      let left = 2 * i + 1;
      let right = 2 * i + 2;
  
      if (left < n) {
        setComparing([largest, left]);
        await delay(animationSpeed);
        if (arr[left] > arr[largest]) {
          largest = left;
        }
      }
  
      if (right < n) {
        setComparing([largest, right]);
        await delay(animationSpeed);
        if (arr[right] > arr[largest]) {
          largest = right;
        }
      }
  
      if (largest !== i) {
        // Perform the swap
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        setArray([...arr]);
        // Play the swap sound after each swap
        swapSound.play();
        await heapify(arr, n, largest);
      }
    };
  
    const heapSortAlgorithm = async () => {
      let n = arr.length;
  
      // Build the heap
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(arr, n, i);
      }
  
      // Extract elements from the heap
      for (let i = n - 1; i > 0; i--) {
        // Swap the root (largest element) with the last element
        [arr[0], arr[i]] = [arr[i], arr[0]];
        setArray([...arr]);
        // Play the swap sound for the root swap
        swapSound.play();
        await heapify(arr, i, 0);
      }
    };
  
    await heapSortAlgorithm();
    setComparing([]);
    setSorting(false);
  };
  

  const shellSort = async () => {
    setSorting(true);
    setCurrentAlgorithm('Shell Sort');
    const arr = [...array];
    const n = arr.length;
  
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      for (let i = gap; i < n; i++) {
        let temp = arr[i];
        let j;
  
        for (j = i; j >= gap; j -= gap) {
          setComparing([j - gap, j]);
          await delay(animationSpeed);
  
          if (arr[j - gap] > temp) {
            arr[j] = arr[j - gap];
            setArray([...arr]);
            // Play the swap sound after shifting elements
            swapSound.play();
          } else {
            break;
          }
        }
        arr[j] = temp;
        setArray([...arr]);
      }
    }
    setComparing([]);
    setSorting(false);
  };
  

  useEffect(() => {
    generateArray();
  }, []);

  const restartGame = () => {
    setShouldSort(false);  // Stop any ongoing sorting
    clearTimeout(timeoutId);  // Cancel the current timeout
    setSorting(false);     // Set sorting to false to stop animations
    setCurrentAlgorithm(''); // Clear the current algorithm state
    generateArray();       // Generate a new array
    setShouldSort(true);   // Allow sorting to continue after restarting
    setComparing([]);      // Clear the comparing state
    setMergingGroups([]);  // Clear the merging groups state
    setCurrentMin(null);   // Clear the current min state

  };

  const handleSortSelection = (e) => {
    const selectedAlgorithm = sortingAlgorithms.find(
      (algo) => algo.name === e.target.value
    );
    if (selectedAlgorithm) {
      selectedAlgorithm.algorithm();
    }
  };

  const sortingAlgorithms = [
    { name: 'Bubble Sort', algorithm: bubbleSort },
    { name: 'Selection Sort', algorithm: selectionSort },
    { name: 'Insertion Sort', algorithm: insertionSort },
    { name: 'Merge Sort', algorithm: mergeSort },
    { name: 'Quick Sort', algorithm: quickSort },
    { name: 'Heap Sort', algorithm: heapSort },
    { name: 'Shell Sort', algorithm: shellSort }
  ];

  return (
    <div className='text-white flex justify-center bg-[#D9D9D9]'>
      <NavButtons onRestart={restartGame} />
      <div className='z-10 bg-[url(/images/sorting-bg.png)] fixed h-screen w-screen bg-contain blur-[3px]'/>
      <div className="z-20 h-screen mx-auto p-4 mt-14">
        <h1 className="text-2xl font-bold font-minecraftRegular mb-4 text-center">Sorting Visualizer</h1>
        
        <div className="flex flex-wrap justify-center items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="arrayLength" className="mr-2">Array Length:</label>
            <input 
              type="number" 
              id="arrayLength"
              min="5" 
              max="18" 
              value={arrayLength} 
              onChange={handleArrayLengthChange}
              disabled={sorting}
              className="bg-transparent text-white font-minecraftRegular w-20 p-1"
            />
            <input 
              type="range" 
              min="5" 
              max="18" 
              value={arrayLength} 
              onChange={handleArrayLengthChange}
              disabled={sorting}
              className="w-40"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <label htmlFor="animationSpeed" className="mr-2 font-minecraftRegular">Animation Speed (ms):</label>
            <input 
              type="number" 
              id="animationSpeed"
              min="50" 
              max="2000" 
              value={animationSpeed} 
              onChange={handleAnimationSpeedChange}
              disabled={sorting}
              className="w-20 p-1 bg-transparent font-minecraftRegular text-white"
            />
            <input 
              type="range" 
              min="50" 
              max="2000" 
              value={animationSpeed} 
              onChange={handleAnimationSpeedChange}
              disabled={sorting}
              className="w-40"
            />
          </div>
          
          <button 
            onClick={() => generateArray(arrayLength)} 
            disabled={sorting}
            className="bg-[#D9D9D9] text-black border-2 font-minecraftRegular opacity-70 border-black hover:bg-slate-400 p-2 rounded"
          >
            Generate New Array
          </button>
        </div>

        <div className="flex justify-center space-x-2 mb-4">
        <select
          onChange={handleSortSelection}
          disabled={sorting}
          className="pixel-corners border-2 border-black font-minecraftRegular bg-[#D9D9D9] p-3 text-black hover:bg-slate-300 m-1 rounded opacity-70 hover:opacity-100"
        >
          <option value="">Select Sorting Algorithm</option>
          {sortingAlgorithms.map(({ name }) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

        <div className="relative h-64 mx-auto" style={{ width: `${array.length * 64}px` }}>
          <AnimatePresence mode="popLayout">
            {array.map((value, index) => {
              const isInMergingGroup = mergingGroups.some(
                group => index >= group.start && index <= group.end
              );
              
              return (
                <motion.div
                  key={`${index}-${value}`}
                  layout
                  initial={{ 
                    scale: 0.8,
                    opacity: 0,
                  }}
                  animate={{ 
                    scale: 1,
                    opacity: 1,
                    height: `${value * 2}px`,
                    backgroundColor: 
                      comparing.includes(index) ? '#7CA4CD' : 
                      isInMergingGroup ? '#BB76D5' :
                      (currentMin === index ? '#E17A5A' : '#D9D9D9'),
                    border: comparing.includes(index) ? '2px solid black' : '2px solid black',
                    opacity: sorting ? 0.7 : 0.7,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      mass: 0.8,
                    }
                  }}
                  exit={{ 
                    scale: 0.8,
                    opacity: 0
                  }}
                  style={{
                    position: 'absolute',
                    left: `${index * 64}px`,
                    bottom: 0,
                    width: '48px',
                  }}
                  className="rounded-lg flex items-center justify-center text-black font-bold"
                >
                  {value}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {currentAlgorithm && (
          <div className="mt-4 text-center">
            <p className="text-lg font-minecraftRegular">Current Algorithm: {currentAlgorithm}</p>
          </div>
        )}
      </div>


    </div>
  );
};

export default SortingVisualizer;