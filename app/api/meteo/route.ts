import { NextResponse } from 'next/server';
import { fetchWeatherApi } from "openmeteo";

export async function GET() {
    try {
        const url = "https://api.open-meteo.com/v1/forecast";
        const params = {
            latitude: 47.0105,
            longitude: 28.8638,
            hourly: "temperature_2m",
        };

        const responses = await fetchWeatherApi(url, params);
        const response = responses[0];

        const utcOffsetSeconds = response.utcOffsetSeconds();
        const hourly = response.hourly()!;

        const weatherData = {
            location: {
                lat: response.latitude(),
                lon: response.longitude(),
            },
            hourly: {
                time: Array.from(
                    { length: 5 },
                    (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
                ),
                temperatures: Array.from(hourly.variables(0)!.valuesArray()!).slice(0, 5),
            },
        };

        return NextResponse.json(weatherData);

    } catch (error) {
        return NextResponse.json({ error: "Nu am putut prelua datele meteo" }, { status: 500 });
    }
}