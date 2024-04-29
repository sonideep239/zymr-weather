const API_KEY_OPEN = "b4ae628889dcf9600ed8f9854e8240bc"
const API_KEY = '4034b7a1eada4230b60144321242804';

export const getPositionbtCity = async (CITY_NAME: string) => {
    try {
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${CITY_NAME}&limit=5&appid=${API_KEY_OPEN}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Network response was not ok.');
        }
    } catch (error) {
        console.error("Error", error);
    }
}

export const getWeather = async (lat: string, long: string, type: string) => {
    const location = `${lat},${long}`
    let apiUrl = ""
    if (type === "current") {
        apiUrl = `http://api.weatherapi.com/v1/${type}.json?key=${API_KEY}&q=${location}`;
    }
    if (type === "forecast") {
        apiUrl = `http://api.weatherapi.com/v1/${type}.json?key=${API_KEY}&q=${location}&days=14`;
    }
    if (type === "history") {
        const currentDate = new Date();
        const twoDaysAgo = new Date(currentDate);
        twoDaysAgo.setDate(currentDate.getDate() - 14);
        const fromDate = twoDaysAgo.toISOString().slice(0, 10);

        const DaysAgo = new Date(currentDate);
        const toDate = DaysAgo.toISOString().slice(0, 10);
        apiUrl = `http://api.weatherapi.com/v1/${type}.json?key=${API_KEY}&q=${location}&dt=${fromDate}&end_dt=${toDate}`;
    }
    try {
        const response = await fetch(`${apiUrl}`);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Network response was not ok .');
        }
    } catch (error) {
        console.error("Error", error);
    }
}
