import Moment from 'moment';

export const setLocalStorage = (key, vaule) => {
  return localStorage.setItem(key, JSON.stringify(vaule));
};

export const getLocalStorage = key => {
  return JSON.parse(localStorage.getItem(key));
};

export const getTime = (time) => {
  return Moment(time).format('YYYY-MM-DD HH:mm');
};

export const saveAsFile = (data, type, name) => {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";

  let blob = new Blob([data], { type: "application/" + type }),
    url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = name;
  a.click();
  window.URL.revokeObjectURL(url);
};
