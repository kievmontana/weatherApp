import '../styles/index.scss';

// Weather API key
const key = 'OEl5iVG56QLegnJt3YTqNgmfVrl1LBLI';

const cityForm = document.querySelector('form');
const card = document.querySelector('.card');
const details = document.querySelector('.details');
const time = document.querySelector('.time');
const icon = document.querySelector('.icon img');


const updateUi = (data) => {

    console.log(data);

  const {cityDetails, weather} = data;

  // update Details
  details.innerHTML = `
    <h5 class="my-3">${cityDetails.EnglishName}</h5>
    <div class="my-3">${weather.WeatherText}</div>
       <div class="display-4 my-4">
         <span>${weather.Temperature.Metric.Value}</span>
         <span>&deg;C</span>
       </div>`;

  // update icons
    let iconSrc = `src/img/icons/${weather.WeatherIcon}.svg`;

    icon.setAttribute('src', iconSrc);

  // update images
    let timeSrc = weather.IsDayTime ? 'src/img/day.svg' : 'src/img/night.svg';

    time.setAttribute('src', timeSrc);


    if(card.classList.contains('d-none')) {
        card.classList.remove('d-none');
    }

};


//
// Weather API
//

// Get City info
const getCity = async (city) => {

    const base = 'http://dataservice.accuweather.com/locations/v1/cities/search';
    const query = `?apikey=${key}&q=${city}`;

    const response = await fetch(base + query);
    const data = await response.json();

    return data[0]; // first city from the list

};


// Get Weather info
const getWeather = async (id) => {

    const base = 'http://dataservice.accuweather.com/currentconditions/v1/';
    const query = `${id}?apikey=${key}`;

    const response = await fetch(base + query);
    const data = await response.json();

    return data[0];

};


//
// End Weather API
//



const updateCity = async (city) => {

    const cityDetails = await getCity(city);
    const weather = await getWeather(cityDetails.Key);

    // return {
    //     cityDetails: cityDetails,
    //     weather: weather
    // };

    // Shorthand thanks to ES6
    return {cityDetails, weather};

};


cityForm.addEventListener('submit', e => {
    e.preventDefault();

    const city = cityForm.city.value.trim();
    cityForm.reset();

    updateCity(city)
        .then(data => updateUi(data))
        .catch(err => console.log(err));

    // set localStorage

    localStorage.setItem('city', city);
});

if(localStorage.getItem('city')) {

    updateCity(localStorage.getItem('city'))
        .then(data => updateUi(data))
        .catch(err => console.log(err));

}
