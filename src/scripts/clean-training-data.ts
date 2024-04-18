import { readAll } from "https://deno.land/std@0.223.0/io/read_all.ts?s=readAll"

function removeUndefinedValues(obj: any): any {
  return Object.entries(obj).reduce((acc: any, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value
    }
    return acc
  }, {})
}

Deno.open('./src/data/training-data-2.json', { read: true })
  .then(async (file) => {
    const decoder = new TextDecoder('utf-8')
    const data = await readAll(file)
    const jsonData = JSON.parse(decoder.decode(data))



    const cleanedData = jsonData.data.map((item: any) => ({
      anatomicalRegion: item['Anatomical Region'] || undefined,
      comments: item['Comments'] || undefined,
      date: item['Date'] || undefined,
      energySystem: item['Energy System'] || undefined,
      gymCrag: item['Gym / Crag'] || undefined,
      intensity: Number(item['Intensity']) || undefined,
      load: Number(item['LOAD']) || undefined,
      routeOrBouldering: item['Route / Bouldering'] || undefined,
      sessionType: item['Type of Session'] || undefined,
      volume: Number(item['Volume']) || undefined,
    })).map((item: any) => removeUndefinedValues(item))

    // console.log(cleanedData)

    Deno.writeTextFile('./src/data/training-data-3.json', JSON.stringify({ data: cleanedData }))
  })
  .catch((err) => {
    console.error(err)
  })