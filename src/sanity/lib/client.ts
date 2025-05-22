import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId:projectId,
  dataset:dataset,
  apiVersion:apiVersion,
  token:"skH1EL9ovqwHafUCXPsliJr84WCJr6O0XbusecUNNUvPOV0vgiV4ALLiwQOwmOgDpoG5caeQC4hM7q4QZAPVwHdXUDMH8MvzTJtESTLV5lYsBFCiNHP61zBSmSJ7iqKPH5YvFVHXc5zIDM7AHpuSVrF2iaPfJdN6NmrK0rQloXGYWlGoI1Sb",
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
})
