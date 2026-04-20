import { assertEquals } from '@std/assert'
import { type Ascent, ascentSchema, holds, holdsFromGS } from 'schema/ascent.ts'
import {
  type GSAscentRecord,
  transformAscentFromGSToJS,
  transformAscentFromJSToGS,
} from 'helpers/transformers.ts'
import { sampleAscents } from '../backup/samples.ts'

Deno.test('transformAscentFromJSToGS', async (t) => {
  await t.step('boulder', () => {
    const boulderingAscent: Omit<Ascent, 'id'> = {
      style: 'Flash',
      tries: 1,
      climber: 'Edouard Misset',
      crag: 'Fontainebleau',
      climbingDiscipline: 'Boulder',
      topoGrade: '6a',
      area: 'Le Cul de Chien',
      routeName: 'La Marie Rose',
      date: '2024-10-30T15:53:27.118Z',
      rating: 5,
      comments: 'Great climb!',
      profile: 'Overhang',
      holds: 'Sloper',
      personalGrade: '6a',
      region: 'Île-de-France',
    }

    const expectedGSRecord = {
      Climber: 'Edouard Misset',
      '# Tries': '01 Flash',
      Crag: 'Fontainebleau',
      'Route / Boulder': 'Bouldering',
      'Topo Grade': '6a',
      'Area': 'Le Cul de Chien',
      'Route Name': 'La Marie Rose',
      Date: '30/10/2024',
      Rating: '5*',
      'Ascent Comments': 'Great climb!',
      Profile: 'Overhang',
      Holds: 'Sloper',
      'My Grade': '6a',
      Height: '',
      Departement: 'Île-de-France',
      Comments: 'Great climb!',
    } satisfies GSAscentRecord

    assertEquals(
      transformAscentFromJSToGS(boulderingAscent),
      expectedGSRecord,
    )
  })

  await t.step('route', () => {
    const routeAscent: Omit<Ascent, 'id'> = {
      area: 'Secteur 13',
      climber: 'Edouard Misset',
      climbingDiscipline: 'Route',
      crag: 'Balme de Yenne',
      date: '2022-05-10T12:00:00.000Z',
      height: 20,
      holds: 'Pinch',
      personalGrade: '7a',
      profile: 'Overhang',
      region: 'ARA',
      routeName: 'Bonobo',
      style: 'Redpoint',
      topoGrade: '8a',
      tries: 3,
    }

    const expectedGSRecord = {
      '# Tries': '03 go',
      'Area': 'Secteur 13',
      'Ascent Comments': '',
      'Climber': 'Edouard Misset',
      'Comments': '',
      'Crag': 'Balme de Yenne',
      'Date': '10/05/2022',
      'Departement': 'ARA',
      'Height': '20m',
      'Holds': 'Pinch',
      'My Grade': '7a',
      'Profile': 'Overhang',
      'Rating': '',
      'Route / Boulder': 'Route',
      'Route Name': 'Bonobo',
      'Topo Grade': '8a',
    } satisfies GSAscentRecord

    assertEquals(
      transformAscentFromJSToGS(routeAscent),
      expectedGSRecord,
    )
  })

  await t.step('edge case with undefined values', () => {
    const undefinedAscent: Omit<Ascent, 'id'> = {
      area: 'Berlin',
      climber: 'Edouard Misset',
      climbingDiscipline: 'Route',
      crag: 'Ceuse',
      date: '2023-07-15T08:00:00.000Z',
      routeName: 'Biographie',
      style: 'Onsight',
      topoGrade: '7b+',
      tries: 1,
    }

    const expectedGSRecord = {
      '# Tries': '001 Onsight',
      'Area': 'Berlin',
      'Ascent Comments': '',
      'My Grade': '',
      'Route / Boulder': 'Route',
      'Route Name': 'Biographie',
      'Topo Grade': '7b+',
      Climber: 'Edouard Misset',
      Comments: '',
      Crag: 'Ceuse',
      Date: '15/07/2023',
      Departement: '',
      Height: '',
      Holds: '',
      Profile: '',
      Rating: '',
    } satisfies GSAscentRecord

    assertEquals(
      transformAscentFromJSToGS(undefinedAscent),
      expectedGSRecord,
    )
  })
})

Deno.test('transformAscentFromGSToJS', async (t) => {
  await t.step('boulder', () => {
    const boulderingGSRecord: GSAscentRecord = {
      '# Tries': '01 Flash',
      'Area': 'Le Cul de Chien',
      'Ascent Comments': 'Great climb!',
      'My Grade': '6a',
      'Route / Boulder': 'Bouldering',
      'Route Name': 'La Marie Rose',
      'Topo Grade': '6a',
      Climber: 'Edouard Misset',
      Comments: 'Great climb!',
      Crag: 'Fontainebleau',
      Date: '30/10/2024',
      Departement: 'Île-de-France',
      Height: '',
      Holds: 'Sloper',
      Profile: 'Overhang',
      Rating: '5*',
    }

    const expectedAscent = {
      area: 'Le Cul de Chien',
      climber: 'Edouard Misset',
      climbingDiscipline: 'Boulder',
      comments: 'Great climb!',
      crag: 'Fontainebleau',
      date: '2024-10-30T12:00:00.000Z',
      holds: 'Sloper',
      personalGrade: '6a',
      profile: 'Overhang',
      rating: 5,
      region: 'Île-de-France',
      routeName: 'La Marie Rose',
      style: 'Flash',
      topoGrade: '6a',
      tries: 1,
    } as const satisfies Omit<Ascent, 'id'>

    assertEquals(
      transformAscentFromGSToJS(boulderingGSRecord),
      expectedAscent,
    )
  })

  await t.step('route', () => {
    const routeGSRecord: GSAscentRecord = {
      '# Tries': '03 go',
      'Area': 'Secteur 13',
      'Ascent Comments': '',
      'Climber': 'Edouard Misset',
      'Comments': '',
      'Crag': 'Balme de Yenne',
      'Date': '10/05/2022',
      'Departement': 'ARA',
      'Height': '20m',
      'Holds': 'Pinch',
      'My Grade': '7a',
      'Profile': 'Overhang',
      'Rating': '',
      'Route / Boulder': 'Route',
      'Route Name': 'Bonobo',
      'Topo Grade': '8a',
    }

    const expectedAscent = {
      area: 'Secteur 13',
      climber: 'Edouard Misset',
      climbingDiscipline: 'Route',
      crag: 'Balme de Yenne',
      date: '2022-05-10T12:00:00.000Z',
      height: 20,
      holds: 'Pinch',
      personalGrade: '7a',
      profile: 'Overhang',
      region: 'ARA',
      routeName: 'Bonobo',
      style: 'Redpoint',
      topoGrade: '8a',
      tries: 3,
    } as const satisfies Omit<Ascent, 'id'>

    assertEquals(
      transformAscentFromGSToJS(routeGSRecord),
      expectedAscent,
    )
  })

  await t.step('edge case with empty values', () => {
    const emptyGSRecord: GSAscentRecord = {
      '# Tries': '001 Onsight',
      'Area': 'Berlin',
      'Ascent Comments': '',
      'My Grade': '',
      'Route / Boulder': 'Route',
      'Route Name': 'Biographie',
      'Topo Grade': '7b+',
      Climber: 'Edouard Misset',
      Comments: '',
      Crag: 'Ceuse',
      Date: '15/07/2023',
      Departement: '',
      Height: '',
      Holds: '',
      Profile: '',
      Rating: '',
    }

    const bareBoneAscent = {
      area: 'Berlin',
      climber: 'Edouard Misset',
      climbingDiscipline: 'Route',
      crag: 'Ceuse',
      date: '2023-07-15T12:00:00.000Z',
      routeName: 'Biographie',
      style: 'Onsight',
      topoGrade: '7b+',
      tries: 1,
    } as const satisfies Omit<Ascent, 'id'>

    assertEquals(
      transformAscentFromGSToJS(emptyGSRecord),
      bareBoneAscent,
    )
  })
})

Deno.test('transformAscentFromJSToGS and transformAscentFromGSToJS are reversible', () => {
  // Some information loss is expected when transforming from GS to JS and back
  // like certain `hold` type are voluntarily not supported in the JS model.

  const holdsSet = new Set(holds)
  const holdsFromGSSet = new Set(holdsFromGS)
  const holdsInGSOnly = holdsFromGSSet.difference(holdsSet)

  const ascents = sampleAscents.filter((ascent) => {
    return (ascent.holds === undefined || !holdsInGSOnly.has(ascent.holds))
  })

  for (const ascent of ascents) {
    const convertedAscent = ascentSchema.omit({ id: true }).parse(
      transformAscentFromGSToJS(
        transformAscentFromJSToGS(ascent),
      ),
    )
    console.log('🚀 ~ Deno.test ~ convertedAscent:', convertedAscent)
    assertEquals(
      { ...convertedAscent, id: ascent.id },
      ascent,
    )
  }
})
