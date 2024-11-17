import { assertEquals } from '@std/assert'
import {
  transformAscentFromGSToJS,
  transformAscentFromJSToGS,
} from 'services/ascents.ts'
import { type Ascent, holds, holdsFromGS } from 'schema/ascent.ts'
import type { GSAscentRecord } from 'helpers/transformers.ts'
import sampleAscents from 'backup/ascent-data-sample-2024-10-30.json' with {
  type: 'json',
}
import { setDifference } from '@edouardmisset/array/sets.ts'

Deno.test('transformAscentFromJSToGS', async (t) => {
  await t.step('boulder', () => {
    const boulderingAscent: Ascent = {
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
    } satisfies GSAscentRecord

    assertEquals(
      transformAscentFromJSToGS(boulderingAscent),
      expectedGSRecord,
    )
  })

  await t.step('route', () => {
    const routeAscent: Ascent = {
      style: 'Redpoint',
      tries: 3,
      climber: 'Edouard Misset',
      crag: 'Balme de Yenne',
      climbingDiscipline: 'Route',
      topoGrade: '8a',
      area: 'Secteur 13',
      routeName: 'Bonobo',
      date: '2022-05-10T12:00:00.000Z',
      profile: 'Overhang',
      holds: 'Pinch',
      personalGrade: '7a',
      region: 'ARA',
      height: 20,
    }

    const expectedGSRecord = {
      '# Tries': '03 go',
      'Area': 'Secteur 13',
      'Ascent Comments': '',
      'Climber': 'Edouard Misset',
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
    const undefinedAscent: Ascent = {
      style: 'Onsight',
      tries: 1,
      climber: 'Edouard Misset',
      crag: 'Ceuse',
      climbingDiscipline: 'Route',
      topoGrade: '7b+',
      area: 'Berlin',
      routeName: 'Biographie',
      date: '2023-07-15T08:00:00.000Z',
      profile: undefined,
      holds: undefined,
      personalGrade: undefined,
      region: undefined,
      height: undefined,
      rating: undefined,
      comments: undefined,
    }

    const expectedGSRecord = {
      Climber: 'Edouard Misset',
      '# Tries': '001 Onsight',
      Crag: 'Ceuse',
      'Route / Boulder': 'Route',
      'Topo Grade': '7b+',
      'Area': 'Berlin',
      'Route Name': 'Biographie',
      Date: '15/07/2023',
      Rating: '',
      'Ascent Comments': '',
      Profile: '',
      Holds: '',
      'My Grade': '',
      Height: '',
      Departement: '',
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
    }

    const expectedAscent: Ascent = {
      style: 'Flash',
      tries: 1,
      climber: 'Edouard Misset',
      crag: 'Fontainebleau',
      climbingDiscipline: 'Boulder',
      topoGrade: '6a',
      area: 'Le Cul de Chien',
      routeName: 'La Marie Rose',
      date: '2024-10-30T12:00:00.000Z',
      rating: 5,
      comments: 'Great climb!',
      profile: 'Overhang',
      holds: 'Sloper',
      personalGrade: '6a',
      region: 'Île-de-France',
    }

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

    const expectedAscent: Ascent = {
      style: 'Redpoint',
      tries: 3,
      climber: 'Edouard Misset',
      crag: 'Balme de Yenne',
      climbingDiscipline: 'Route',
      topoGrade: '8a',
      area: 'Secteur 13',
      routeName: 'Bonobo',
      date: '2022-05-10T12:00:00.000Z',
      profile: 'Overhang',
      holds: 'Pinch',
      personalGrade: '7a',
      region: 'ARA',
      height: 20,
    }

    assertEquals(
      transformAscentFromGSToJS(routeGSRecord),
      expectedAscent,
    )
  })

  await t.step('edge case with empty values', () => {
    const emptyGSRecord: GSAscentRecord = {
      Climber: 'Edouard Misset',
      '# Tries': '001 Onsight',
      Crag: 'Ceuse',
      'Route / Boulder': 'Route',
      'Topo Grade': '7b+',
      'Area': 'Berlin',
      'Route Name': 'Biographie',
      Date: '15/07/2023',
      Rating: '',
      'Ascent Comments': '',
      Profile: '',
      Holds: '',
      'My Grade': '',
      Height: '',
      Departement: '',
    }

    const bareBoneAscent: Ascent = {
      style: 'Onsight',
      tries: 1,
      climber: 'Edouard Misset',
      crag: 'Ceuse',
      climbingDiscipline: 'Route',
      topoGrade: '7b+',
      area: 'Berlin',
      routeName: 'Biographie',
      date: '2023-07-15T12:00:00.000Z',
    }

    assertEquals(
      transformAscentFromGSToJS(emptyGSRecord),
      bareBoneAscent,
    )
  })
})

Deno.test('transformAscentFromJSToGS and transformAscentFromGSToJS are reversible', () => {
  // Some information loss is expected when transforming from GS to JS and back
  // like certain `hold` type are voluntarily not supported in the JS model.

  const ascents = (sampleAscents as Ascent[]).filter((ascent) =>
    ascent.holds === undefined ||
    setDifference([...holds], [...holdsFromGS]).includes(ascent.holds)
  )

  for (const ascent of ascents) {
    assertEquals(
      transformAscentFromGSToJS(transformAscentFromJSToGS(ascent)),
      ascent,
    )
  }
})
