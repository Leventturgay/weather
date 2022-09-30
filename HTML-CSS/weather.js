const form = document.querySelector(`.top-banner form`);
const input = document.querySelector(`.container input`);
const msg = document.querySelector(`span.msg`);
const list = document.querySelector(`.ajax-section ul.cities`);
localStorage.setItem(
  `tokenKey`,
  `Gojkk5iDf3ciB9FxbRq9pPwkyHgu4xChzVyhG4JjIQk7+P1r6L5wZWDSxuTdIHmb`
);
// localStorage.setItem(
//   `tokenKeyEncrypted`,
//   EncryptStringAES(`d7938bfaa9a0fc0e16466a45a23f82ac`)
// );
form.addEventListener(`submit`, (event) => {
  event.preventDefault();
  getWeatherDataFromApi();
});
const getWeatherDataFromApi = async () => {
  const tokenKey = DecryptStringAES(localStorage.getItem(`tokenKey`));
  const inputvalue = input.value;
  const units = `metric`;
  const lang = `tr`;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputvalue}&appid=${tokenKey}&units=${units}&lang=${lang}`;
  const response = await fetch(url).then((response) => response.json());
  console.log(response);
  const { main, sys, weather, name } = response;
  const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  const iconUrlAWS = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`;

  const cityNameSpans = list.querySelectorAll(`.city span`);
  const cityNameSpanArray = Array.from(cityNameSpans);
  if (cityNameSpanArray.length > 0) {
    const filteredArray = cityNameSpanArray.filter(
      (span) => span.innerText == name
    );
    if (filteredArray.length > 0) {
      msg.innerText = `You already know the weather for${name}, Please search another city`;
      setTimeout(() => {
        msg.innerText = ``;
      }, 5000);
      form.reset();
      return;
    }
  }
  const createdLi = document.createElement(`li`);
  createdLi.classList.add("city");
  createdLi.innerHTML = `<h2 class="city-name" data-name="${name}, ${
    sys.country
  }">
<span>${name}</span>
<sup>${sys.country}</sup>
</h2>
<div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
<figure>
<img class="city-icon" src="${iconUrl}">
<figcaption>${weather[0].description}</figcaption>
</figure>`;
  list.prepend(createdLi);
  form.reset();
};
