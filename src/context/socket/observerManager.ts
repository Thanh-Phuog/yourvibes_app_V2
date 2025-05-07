//observerManager.ts
type Observer = (data: any) => void;
const observers : Observer[] = [];

const addObserver = (observer: Observer) => {
  observers.push(observer);
};

const removeObserver = (observer: Observer) => {
  const index = observers.indexOf(observer);
  if (index !== -1) {
    observers.splice(index, 1);
  }
};

const notifyObservers = (data: any) => {
  observers.forEach((observer) => observer(data));
};

export { addObserver, removeObserver, notifyObservers };