// Operation LocalStorage
export const setLocalStorage = (key, vaule) => {
  return localStorage.setItem(key, JSON.stringify(vaule));
};

export const getLocalStorage = key => {
  return JSON.parse(localStorage.getItem(key));
};

export const getTime = (time) => {
  const newDate = new Date();
  newDate.setTime(time * 1000);
  return newDate.toLocaleString();
};
