import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCar } from 'react-icons/fa';
import CustomButton from '../components/CustomButton';
import CartEmpty from '/svg/cart-empty.svg';
import InventoryTable from '../components/InventoryTable';
import CartChest from '/svg/cart-chest.svg';
import NavButtons from '../components/NavButtons';

const Stack = () => {
  const [garage, setGarage] = useState([]);
  const [plateNumber, setPlateNumber] = useState('');
  const [arrivals, setArrivals] = useState(0);
  const [departures, setDepartures] = useState(0);
  const [message, setMessage] = useState(null);
  const [notification, setNotification] = useState(null);
  const [departingCar, setDepartingCar] = useState(null);
  const [isDeparting, setIsDeparting] = useState(false); 

  useEffect(() => {
    document.title = "Stack";
  }, []);

    useEffect(() => {
      const audio = new Audio('/audio/stack.mp3');
      audio.volume = 0.3
      audio.loop = true; 
      audio.play();
  
      return () => {
        audio.pause();
      };
    }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 5000);
  };

  const departLastCar = () => {
    if (isDeparting) return; // Prevent spamming
    if (garage.length === 0) {
      showMessage('Garage is empty!');
      return;
    }

    setIsDeparting(true); // Set departure state
    const lastCar = garage[garage.length - 1];
    setDepartingCar(lastCar);

    setTimeout(() => {
      setGarage(garage.slice(0, -1));
      setDepartures(departures + 1);
      setDepartingCar(null);
      setIsDeparting(false); // Reset departure state
      showNotification(`Car ${lastCar} departed!`);
    }, 1000); // Match this timeout to the animation duration
  };

  const handleArrival = () => {
    if (!plateNumber.trim()) {
      setNotification('Plate number cannot be empty!');
      return;
    }
    if (plateNumber.length > 11) {
      setNotification('Plate number must be 11 characters or less!');
      return;
    }
    if (garage.includes(plateNumber)) {
      setNotification('Plate number must be unique!');
      return;
    }
    if (garage.length >= 10) {
      setNotification('Garage is full!');
      return;
    }
    setGarage([...garage, plateNumber]);
    setPlateNumber('');
    setArrivals(arrivals + 1);
    showNotification(`Car ${plateNumber} arrived!`);
  };


  const handleDeparture = () => {
    if (!plateNumber.trim()) {
      showNotification('Plate number cannot be empty!');
      return;
    }
    if (!garage.includes(plateNumber)) {
      showNotification('Car not found in the garage!');
      return;
    }
    if (garage[garage.length - 1] !== plateNumber) {
      showNotification('Car must be at the top of the stack to depart!');
      return;
    }
    departLastCar(); // Use the same logic as departLastCar
    setPlateNumber('');
  };

  const handleClear = () => {
    setGarage([]);
    setArrivals(0);
    setDepartures(0);
    setPlateNumber('');
    setNotification('Garage cleared!');
  }

  return (
    <div className="min-h-screen bg-secondary p-8 text-gray-800 relative
            bg-[url('/images/stack-bg.png')] bg-cover md:bg-[length:150%] lg:bg-[length:150%] bg-center 
          animate-panBackground
    ">
      <NavButtons onRestart={handleClear} />
      <div className='flex justify-center items-center gap-2 mt-9'>
        <div className='pixel-corners bg-[#7f7f7f] p-2 rounded-lg border-4 border-black mb-1'>
          <h1 className="text-3xl font-bold text-center text-white font-minecraftBold">PUP-CEA Parking Garage</h1>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          className="fixed top-4 right-4 bg-minecraft-whiteSecondary text-black font-minecraftItalic border-2 border-black shadow-craftingBoard py-2 px-8 rounded z-50"
        >
          {notification}
        </motion.div>
      )}

      <div className="flex gap-5">
        {/* Form Section */}
        <div className='pixel-corners w-[38%] h-[420px] bg-[#D9D9D9] flex justify-center items-center p-6 rounded-lg border-4 border-black shadow'>
          <div className="w-full h-full bg-minecraft-abyss bg-secondary-light text-black p-4 rounded-lg border border-[#1c1c1c] shadow-craftingBoard">
            <h2 className="text-xl font-bold mb-1 font-minecraftRegular text-center text-[#C28340]">Car Arrival/Departure</h2>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col space-y-2"
            >
              <label className="text-lg font-minecraftRegular text-white text-center">Car Plate Number:</label>
              <input
                type="text"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                placeholder="Enter Plate Number"
                className="p-2 rounded border border-black bg-[#FFF] font-minecraftRegular text-center text-[#C28340]"
              />
              <CustomButton
                variant="arrival"
                icon={() => <FaCar className="text-xl" />}
                onClick={handleArrival}
              >
                Arrival
              </CustomButton>
              <CustomButton
                variant="departure"
                icon={() => <FaCar className="text-xl" />}
                onClick={handleDeparture}
              >
                Departure
              </CustomButton>
              <CustomButton
                variant="departLastCar"
                icon={() => <FaCar className="text-xl" />}
                onClick={departLastCar}
              >
                Depart Last Car
              </CustomButton>
            </form>
            <div className="mt-2">
              <p className="text-md font-minecraftRegular text-white text-center">Total Arrivals: {arrivals}</p>
              <p className="text-md font-minecraftRegular text-white text-center">Total Departures: {departures}</p>
            </div>
            {message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-4 bg-red-100 text-red-700 p-3 rounded border border-red-400"
              >
                {message}
              </motion.div>
            )}
          </div>
        </div>

        {/* Garage Section */}
        <motion.div 
          className="pixel-corners w-[62%] h-[420px] flex py-6 px-5 bg-minecraft-whiteSecondary border-black border-4 rounded-lg shadow-whiteinset"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div className='flex flex-col justify-center items-center h-full w-full'>
            {/* Garage content... */}
            <div className="rounded-lg w-full h-full flex flex-col-reverse items-center overflow-hidden">
              {garage.map((car, index) => {
                const paddedCarData = [...car.split(''), ...Array(12 - car.length).fill('')];
                return (
                  <motion.div
                    key={index}
                    initial={{ y: -50, opacity: 0 }}
                    animate={
                      departingCar === car
                        ? { 
                            x: 300, 
                            opacity: 0,
                            // rotate: 360,
                            scale: 0.5 
                          }
                        : { 
                            y: 0, 
                            opacity: 1,
                            scale: 1
                          }
                    }
                    whileHover={{
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    transition={{ type: "spring", stiffness: 100, duration: 1 }}
                    className="bg-[#D9D9D9] rounded-lg shadow-md"
                  >
                    <InventoryTable
                      data={paddedCarData}
                      className="bg-[#BBB] p-[2px] rounded shadow-md border border-[#8B8B8B]"
                      cellClassName="text-white font-minecraftRegular text-sm w-[50px] h-[1.60rem]"
                    />
                  </motion.div>
                );
              })}
              
              {garage.length === 0 && (
                <motion.div 
                  className="w-full h-full flex items-center justify-center"
                  animate={{ 
                    y: [0, -10, 0],
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                >
                  <div className="flex justify-center flex-col items-center space-y-4">
                    <img src={CartEmpty} alt="Garage Empty" />
                    <motion.p
                      className="text-2xl font-minecraftRegular text-[#C28340]"
                      animate={{
                        opacity: [1, 0.5, 1],
                        transition: {
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      }}
                    >
                      Garage is Empty ...
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Cart Chest Section with animations */}
          <div className="flex flex-col justify-end items-center w-[70px] h-full">
            <div className="w-[97%] bg-[#BBB] rounded-lg shadow-whiteinset">
              <div className="rounded-lg w-full h-full flex flex-col-reverse items-center overflow-hidden">
                {[...Array(10)].map((_, index) => {
                  const cartNumber = index + 1;
                  const isCartChest = garage.length >= cartNumber;

                  return (
                    <motion.div
                      key={index}
                      initial={{ y: -50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      whileHover={isCartChest ? {
                        scale: 1.1,
                        transition: { duration: 0.2 }
                      } : {}}
                      transition={{ type: "spring", stiffness: 100, duration: 1 }}
                      className="bg-[#D9D9D9] rounded-lg shadow-md"
                    >
                      <InventoryTable
                        data={isCartChest ? [
                          <motion.img 
                            src={CartChest} 
                            alt="Cart Chest" 
                            className="w-[28px] h-[28px]"
                            animate={{
                              scale: [1, 1.1, 1],
                              transition: {
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }
                            }}
                          />
                        ] : ['']}
                        className="bg-[#BBB] p-[2px] rounded shadow-md border border-[#8B8B8B]"
                        cellClassName="text-white font-pressStart text-sm w-[50px] h-[1.60rem]"
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Stack;
