import { NextResponse } from 'next/server';
import { fetchWeatherApi } from "openmeteo";

export async function GET() {
    const today=new Date();
    const tomorrow = new Date(today);
    const end = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    end.setDate(today.getDate() + 7);
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    try {
        const params = {
            latitude: 52.52,
            longitude: 13.41,
            models: "icon_seamless",
            daily: ["sunrise", "sunset","temperature_2m_max", "precipitation_probability_max"],
            current: ["temperature_2m", "rain", "is_day", "relative_humidity_2m", "apparent_temperature", "wind_speed_10m", "precipitation","visibility"],
            timezone: "auto",
            start_date: formatDate(tomorrow),
            end_date: formatDate(end),
        };

        const url = "https://api.open-meteo.com/v1/forecast";
        const responses = await fetchWeatherApi(url, params);
        const response = responses[0];

        const utcOffsetSeconds = response.utcOffsetSeconds();
        const current = response.current()!;
        const daily = response.daily()!;

        const sunrise = daily.variables(0)!;
        const sunset = daily.variables(1)!;

        const weatherData = {
            location: {
                lat: response.latitude(),
                lon: response.longitude(),
                elevation: response.elevation(),
            },
            current: {
                time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
                temperature_2m: current.variables(0)!.value(),
                rain: current.variables(1)!.value(),
                is_day: current.variables(2)!.value(),
                relative_humidity_2m: current.variables(3)!.value(),
                apparent_temperature: current.variables(4)!.value(),
                wind_speed_10m: current.variables(5)!.value(),
                precipitation: current.variables(6)!.value(),
                visibility: current.variables(7)!.value(),
            },
            daily: {
                time: Array.from(
                    { length: (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval() },
                    (_ , i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
                ),
                sunrise: [...Array(sunrise.valuesInt64Length())].map(
                    (_ , i) => new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000)
                ),
                sunset: [...Array(sunset.valuesInt64Length())].map(
                    (_ , i) => new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000)
                ),
                temperature_2m_max: daily.variables(2)!.valuesArray(),
                precipitation_probability_max: daily.variables(3)!.valuesArray(),
            },
        };

        return NextResponse.json(weatherData);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Nu am putut prelua datele meteo" }, { status: 500 });
    }
}